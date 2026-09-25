import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://flquhhmdktohrvzanypo.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const BUCKET = process.env.BUCKET || 'product-images'
const MAX_DIMENSION = parseInt(process.env.MAX_DIMENSION || '1600', 10)
const QUALITY = parseInt(process.env.QUALITY || '80', 10)
const DRY_RUN = process.env.DRY_RUN === 'true'
const SKIP_BELOW_BYTES = 80 * 1024 // don't bother re-processing already-small files

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required env vars. See the setup instructions at the top of this file.')
  console.error('Required: (SUPABASE_URL or VITE_SUPABASE_URL) and (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY)')
  console.error('Tip: run with  node --env-file=.env scripts/compress-existing-images.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function listAllFiles() {
  const allFiles = []
  let offset = 0
  const limit = 100
  for (;;) {
    const { data, error } = await supabase.storage.from(BUCKET).list('', { limit, offset })
    if (error) throw new Error(`Failed to list bucket "${BUCKET}": ${error.message}`)
    if (!data || data.length === 0) break
    // Skip "folders" (Supabase returns pseudo-entries with id === null for these)
    allFiles.push(...data.filter((f) => f.id !== null))
    if (data.length < limit) break
    offset += limit
  }
  return allFiles
}

async function compressBuffer(buffer, extension) {
  const ext = extension.toLowerCase()
  let pipeline = sharp(buffer).resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  })

  if (ext === 'jpg' || ext === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true })
  } else if (ext === 'png') {
    pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 })
  } else if (ext === 'webp') {
    pipeline = pipeline.webp({ quality: QUALITY })
  } else {
    // Unsupported/unknown format — skip re-encoding, just return as-is
    return null
  }

  return pipeline.toBuffer()
}

async function run() {
  console.log(`Scanning bucket "${BUCKET}"...`)
  const files = await listAllFiles()
  console.log(`Found ${files.length} file(s).\n`)

  let totalBefore = 0
  let totalAfter = 0
  let processed = 0
  let skipped = 0
  let failed = 0

  for (const file of files) {
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const originalSize = file.metadata?.size ?? 0

    if (originalSize > 0 && originalSize < SKIP_BELOW_BYTES) {
      console.log(`SKIP  (already small) ${file.name} — ${formatBytes(originalSize)}`)
      skipped++
      continue
    }

    try {
      const { data: downloaded, error: downloadError } = await supabase.storage
        .from(BUCKET)
        .download(file.name)
      if (downloadError) throw downloadError

      const arrayBuffer = await downloaded.arrayBuffer()
      const inputBuffer = Buffer.from(arrayBuffer)
      const beforeSize = inputBuffer.byteLength

      const outputBuffer = await compressBuffer(inputBuffer, ext)
      if (!outputBuffer) {
        console.log(`SKIP  (unsupported format .${ext}) ${file.name}`)
        skipped++
        continue
      }

      const afterSize = outputBuffer.byteLength
      totalBefore += beforeSize
      totalAfter += afterSize

      if (afterSize >= beforeSize) {
        console.log(`SKIP  (already optimized) ${file.name} — ${formatBytes(beforeSize)}`)
        skipped++
        continue
      }

      const savedPct = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(0)
      console.log(
        `${DRY_RUN ? 'WOULD SHRINK' : 'SHRINK      '} ${file.name} — ${formatBytes(beforeSize)} -> ${formatBytes(afterSize)} (-${savedPct}%)`
      )

      if (!DRY_RUN) {
        const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(file.name, outputBuffer, { upsert: true, contentType })
        if (uploadError) throw uploadError
      }

      processed++
    } catch (err) {
      console.error(`FAILED ${file.name}:`, err.message || err)
      failed++
    }
  }

  console.log('\n── Summary ─────────────────────────────')
  console.log(`Processed: ${processed}`)
  console.log(`Skipped:   ${skipped}`)
  console.log(`Failed:    ${failed}`)
  if (totalBefore > 0) {
    console.log(`Total size: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)}`)
    console.log(`Saved:      ${formatBytes(totalBefore - totalAfter)} (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`)
  }
  if (DRY_RUN) {
    console.log('\nThis was a DRY RUN — no files were modified. Re-run without DRY_RUN=true to apply changes.')
  }
}

run().catch((err) => {
  console.error('Script failed:', err)
  process.exit(1)
})
