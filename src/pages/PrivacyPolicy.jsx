import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO
        title="Privacy Policy"
        description="AutoVaultParts Privacy Policy. Learn how we collect, use and protect your personal information when you shop with us."
        url="/privacy-policy"
      />

      {/* Header */}
      <div className="bg-[#0A1628] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Privacy <span className="text-[#E8590A]">Policy</span>
          </h1>
          <p className="text-gray-400 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-8">

          {/* Intro */}
          <div>
            <p className="text-gray-600 text-sm leading-relaxed">
              AutoVaultParts ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it. By using our website at autovaultparts.com, you agree to the terms of this policy.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">When you place an order or create an account, we collect the following information:</p>
            <ul className="space-y-2">
              {[
                'Full name and email address',
                'Shipping address, including city, state, zip code, and country',
                'Phone number, if provided',
                'Payment method type (we do not store full card numbers)',
                'Order history and items purchased',
                'Messages sent through our contact form',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="space-y-2">
              {[
                'Process and fulfill your orders',
                'Send order confirmations and shipping updates',
                'Respond to your enquiries and support requests',
                'Improve our website and product listings',
                'Comply with legal obligations',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              We do not sell, rent, or trade your personal information to any third party for marketing purposes.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">3. How We Store Your Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Your data is stored securely on Supabase, a trusted cloud database provider based in the United States. All data is encrypted in transit using SSL, and at rest using industry standard encryption. We retain your order data for up to 7 years for legal and accounting purposes.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              We take reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">4. Cookies and Tracking</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              AutoVaultParts uses minimal cookies necessary for the site to function, including session cookies that keep you logged in. We may use Google Analytics to understand how visitors use our site. This data is anonymized and does not identify you personally. You can disable cookies in your browser settings at any time.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">5. Sharing Your Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              We only share your information with third parties when necessary to fulfill your order, or to comply with the law. This includes:
            </p>
            <ul className="space-y-2">
              {[
                'Shipping carriers who need your address to deliver your order',
                'Payment processors who handle your payment securely',
                'Legal authorities, if required by law',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">6. Your Rights</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">Depending on where you are located, you have the right to:</p>
            <ul className="space-y-2">
              {[
                'Access the personal information we hold about you',
                'Request correction of inaccurate information',
                'Request deletion of your personal data',
                'Withdraw consent for marketing communications at any time',
                'Lodge a complaint with your local data protection authority',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              To exercise any of these rights, please contact us at support@autovaultparts.com, and we will respond within 30 days.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">7. Children's Privacy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              AutoVaultParts is not directed at children under the age of 18. We do not knowingly collect personal information from anyone under 18. If you believe a child has provided us with personal information, please contact us and we will delete it immediately.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">8. Changes to This Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date at the top of this page. We encourage you to review this policy periodically, to stay informed about how we protect your information.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">9. Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, or how we handle your personal information, please contact us at:
            </p>
            <div className="mt-3 bg-gray-50 rounded-lg p-4">
              <p className="text-[#0A1628] font-bold text-sm">AutoVaultParts</p>
              <p className="text-gray-600 text-sm">Email: support@autovaultparts.com</p>
              <p className="text-gray-600 text-sm">Website: www.autovaultparts.com</p>
            </div>
          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/refund-policy" className="text-[#E8590A] text-sm font-medium hover:underline">Refund Policy →</Link>
          <Link to="/terms-of-service" className="text-[#E8590A] text-sm font-medium hover:underline">Terms of Service →</Link>
        </div>
      </div>
    </div>
  )
}