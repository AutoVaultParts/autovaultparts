import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO
        title="Terms of Service"
        description="AutoVaultParts Terms of Service. Read our terms and conditions before purchasing car spare parts from our platform."
        url="/terms-of-service"
      />

      {/* Header */}
      <div className="bg-[#0A1628] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Terms of <span className="text-[#E8590A]">Service</span>
          </h1>
          <p className="text-gray-400 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-8">

          {/* Intro */}
          <div>
            <p className="text-gray-600 text-sm leading-relaxed">
              These Terms of Service govern your use of the AutoVaultParts website at autovaultparts.com, and any purchases or services you request through our platform. By accessing our website or placing an order, you agree to be bound by these terms. Please read them carefully before using our services.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">1. About AutoVaultParts</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              AutoVaultParts is an online retailer specializing in premium car spare parts, including body parts, engines, transmissions, internal parts, suspension, electrical components, exhaust systems, wheels, rims, and tyres. We source parts from verified suppliers and ship globally to customers in the United States, Canada, Europe, and Australia. In addition to supplying parts, AutoVaultParts offers an optional professional installation service for customers who require it.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">2. Eligibility</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You must be at least 18 years of age to place an order on AutoVaultParts. By placing an order, you confirm that you are 18 or older, and that the information you provide is accurate and truthful. We reserve the right to refuse service to anyone at our discretion.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">3. Product Listings and Accuracy</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              We make every effort to ensure our product listings are accurate, including descriptions, compatibility information, condition labels, and pricing. However:
            </p>
            <ul className="space-y-2">
              {[
                'Product images are for illustrative purposes, and the actual part may vary slightly in appearance',
                'Vehicle compatibility information is provided as a guide, and we recommend verifying fitment before installation',
                'Prices are subject to change without notice, but the price at the time of your order is the price you pay',
                'We reserve the right to cancel any order if a product is listed at an incorrect price due to a typographical error',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">4. Orders and Payment</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">When you place an order on AutoVaultParts:</p>
            <ul className="space-y-2">
              {[
                'You will receive an order confirmation with your unique order number',
                'Payment is due at the time of order. For Zelle and Cash App payments, your order will be held until payment is confirmed by our team',
                'We reserve the right to cancel orders that cannot be fulfilled due to stock availability or payment issues',
                'High value orders over $2,000 may require additional verification before processing',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">5. Shipping and Delivery</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              We ship to the United States, Canada, Europe, and Australia. Estimated delivery times are provided at checkout, but are not guaranteed. Delays may occur due to customs clearance, carrier issues, or events outside our control. AutoVaultParts is not liable for delays caused by third party carriers.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Free shipping thresholds apply to standard items only. Freight items, including engines and transmissions, are always subject to freight shipping charges regardless of order value.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">6. Installation Services</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              AutoVaultParts offers an optional professional installation service for customers who require assistance fitting their purchased parts. When you place an order, our team may contact you to ask whether you would like the part installed by an AutoVaultParts certified mechanic.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              If you choose our installation service, the following applies:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'An installation fee will be charged separately from the part price, and you will be informed of the cost before confirming',
                'Our mechanic will inspect and test the part during installation to verify it is functioning correctly',
                'If the part is found to be defective or non-functional during installation, AutoVaultParts will replace it or issue a refund at no additional cost to you',
                'If damage occurs to the part during installation by an AutoVaultParts mechanic, we will take full responsibility and resolve the issue at no cost to you',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              If you choose to have the part installed by your own mechanic, the following applies:
            </p>
            <ul className="space-y-2">
              {[
                'It is your responsibility to ensure the part is installed by a qualified and experienced mechanic',
                'AutoVaultParts is not liable for any damage, injury, or loss resulting from installation carried out by a mechanic not affiliated with AutoVaultParts',
                'Parts damaged during installation by a third party mechanic are not eligible for a return or refund under our damage policy',
                'We strongly recommend verifying part compatibility with your vehicle before installation',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">7. Warranty</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">Part warranties vary by condition:</p>
            <ul className="space-y-2">
              {[
                'New OEM parts carry the manufacturer warranty where applicable',
                'New Aftermarket parts carry a 90 day warranty against manufacturing defects',
                'Remanufactured parts carry a 90 day warranty against defects',
                'Used and pull parts are sold as-is with no warranty, unless otherwise stated in the listing',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              Warranties do not cover damage caused by improper installation, misuse, accidents, or normal wear and tear. However, if installation was carried out by an AutoVaultParts mechanic, warranty claims resulting from that installation will be fully covered by AutoVaultParts.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              To the maximum extent permitted by law, AutoVaultParts shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products. Our total liability to you for any claim shall not exceed the amount you paid for the product in question. This limitation does not apply to damages caused directly by AutoVaultParts installation services, for which we accept full responsibility as stated in Section 6.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">9. Intellectual Property</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              All content on the AutoVaultParts website, including text, images, logos, product descriptions, and design, is the property of AutoVaultParts or its content suppliers, and is protected by copyright law. You may not reproduce, distribute, or use any content from this site without our express written permission.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">10. Governing Law</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              These Terms of Service shall be governed by, and construed in accordance with, applicable international e-commerce laws. Any disputes arising from these terms, or your use of our platform, shall be resolved through good faith negotiation. If resolution cannot be reached, you agree to submit to binding arbitration.
            </p>
          </div>

          {/* Section 11 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">11. Changes to These Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of our website after changes are posted constitutes your acceptance of the updated terms.
            </p>
          </div>

          {/* Section 12 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">12. Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-[#0A1628] font-bold text-sm">AutoVaultParts</p>
              <p className="text-gray-600 text-sm">Email: support@autovaultparts.com</p>
              <p className="text-gray-600 text-sm">Website: www.autovaultparts.com</p>
            </div>
          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/privacy-policy" className="text-[#E8590A] text-sm font-medium hover:underline">Privacy Policy →</Link>
          <Link to="/refund-policy" className="text-[#E8590A] text-sm font-medium hover:underline">Refund Policy →</Link>
        </div>
      </div>
    </div>
  )
}