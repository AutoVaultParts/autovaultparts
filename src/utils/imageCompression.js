// Compresses and resizes image files entirely in the browser (canvas-based)
// before they are uploaded to Supabase Storage. No extra npm dependency —
// uses the native createImageBitmap + canvas APIs already available in
// modern browsers.
//
// Why this exists: uncompressed product photos were driving up Supabase
// "Cached Egress" usage (every visitor loading full-size, uncompressed
// images). Shrinking images at upload time keeps every future upload small
// automatically, on top of any one-time cleanup of existing images.

const MAX_DIMENSION = 1600 // longest side, in px — more than enough for product photos
const OUTPUT_QUALITY = 0.8 // 0–1, good balance of size vs visual quality
const OUTPUT_TYPE = 'image/webp' // WebP is typically 25–35% smaller than JPEG/PNG at similar quality
const SKIP_BELOW_BYTES = 80 * 1024 // don't bother re-encoding already-tiny files

/**
 * Compress + resize a single image File. Falls back to the original file if
 * compression fails, produces a larger file, or the browser doesn't support
 * the required APIs — so a broken upload never blocks the admin from saving
 * a product.
 *
 * @param {File} file - the original image file selected by the user
 * @param {Object} [options]
 * @param {number} [options.maxDimension] - max width/height in px
 * @param {number} [options.quality] - encoder quality, 0–1
 * @param {string} [options.outputType] - output mime type, e.g. 'image/webp'
 * @returns {Promise<File>} the compressed file (or the original as a fallback)
 */
export async function compressImage(file, options = {}) {
  const {
    maxDimension = MAX_DIMENSION,
    quality = OUTPUT_QUALITY,
    outputType = OUTPUT_TYPE,
  } = options

  if (!file || !file.type?.startsWith('image/')) return file
  if (file.size < SKIP_BELOW_BYTES) return file

  try {
    const imageBitmap = await createImageBitmap(file)

    let { width, height } = imageBitmap
    if (width > maxDimension || height > maxDimension) {
      const ratio = Math.min(maxDimension / width, maxDimension / height)
      width = Math.max(1, Math.round(width * ratio))
      height = Math.max(1, Math.round(height * ratio))
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(imageBitmap, 0, 0, width, height)
    imageBitmap.close?.()

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('Canvas toBlob returned null'))),
        outputType,
        quality
      )
    })

    // Safety net: if the "compressed" result is somehow not smaller
    // (rare, e.g. tiny or already highly-optimized images), keep the original.
    if (!blob || blob.size >= file.size) {
      return file
    }

    const extension = outputType === 'image/webp' ? 'webp' : outputType === 'image/png' ? 'png' : 'jpg'
    const baseName = file.name.replace(/\.[^./\\]+$/, '')
    return new File([blob], `${baseName}.${extension}`, {
      type: outputType,
      lastModified: Date.now(),
    })
  } catch (err) {
    console.warn('Image compression skipped, using original file:', err)
    return file
  }
}

/**
 * Compress a batch of files in parallel.
 * @param {File[]} files
 * @param {Object} [options] - same options as compressImage
 * @returns {Promise<File[]>}
 */
export async function compressImages(files, options = {}) {
  return Promise.all(files.map((file) => compressImage(file, options)))
}