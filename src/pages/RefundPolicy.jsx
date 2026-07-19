import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <SEO
        title="Refund and Returns Policy"
        description="AutoVaultParts Refund and Returns Policy. Learn about our return process, eligibility conditions, and how to request a refund."
        url="/refund-policy"
      />

      {/* Header */}
      <div className="bg-[#0A1628] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Refund and <span className="text-[#E8590A]">Returns Policy</span>
          </h1>
          <p className="text-gray-400 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-8">

          {/* Intro */}
          <div>
            <p className="text-gray-600 text-sm leading-relaxed">
              At AutoVaultParts, we stand behind the quality of every part we sell. If you are not satisfied with your purchase, we are here to help. Please read this policy carefully before placing your order.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">1. Return Eligibility</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">We accept returns under the following conditions:</p>
            <ul className="space-y-2">
              {[
                'The return request is made within 30 days of the delivery date',
                'The part is in its original condition, and has not been installed or used',
                'The part is in its original packaging, where applicable',
                'You have proof of purchase, such as your order number',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">2. Non-Returnable Items</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">The following items cannot be returned:</p>
            <ul className="space-y-2">
              {[
                'Parts that have been installed or used',
                'Parts that have been damaged after delivery, due to improper handling',
                'Electrical components that have been connected or tested',
                'Custom ordered parts that were sourced specifically for your vehicle',
                'Parts sold as used or pull condition, where the condition was clearly disclosed at the time of purchase',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">3. Damaged or Incorrect Parts</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              If you receive a part that is damaged in transit, or is not the part you ordered, we will resolve this at no cost to you. Please:
            </p>
            <ul className="space-y-2">
              {[
                'Take clear photos of the damaged or incorrect part before doing anything else',
                'Contact us at support@autovaultparts.com within 7 days of delivery',
                'Include your order number and photos in your message',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              We will either send you a replacement part, or issue a full refund, depending on your preference and stock availability.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">4. How to Start a Return</h2>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Contact Us', desc: 'Email support@autovaultparts.com with your order number and reason for return. We will respond within 24 hours.' },
                { step: '02', title: 'Get Return Approval', desc: 'We will review your request and send you a Return Merchandise Authorization (RMA) number, and return instructions.' },
                { step: '03', title: 'Ship the Part Back', desc: 'Package the part securely, and ship it to the address we provide. Include your RMA number on the outside of the package.' },
                { step: '04', title: 'Receive Your Refund', desc: 'Once we receive and inspect the returned part, we will process your refund within 5 to 10 business days.' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="w-8 h-8 rounded-full bg-[#E8590A] text-white flex items-center justify-center flex-shrink-0 text-xs font-black">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-[#0A1628] font-bold text-sm mb-1">{item.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">5. Return Shipping Costs</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">Return shipping costs are handled as follows:</p>
            <ul className="space-y-2">
              {[
                'If the part is damaged or incorrect, we cover the full return shipping cost',
                'If you are returning for a change of mind, or ordered the wrong part, you are responsible for return shipping costs',
                'Freight items such as engines and transmissions may incur additional return shipping fees, due to their size and weight',
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
            <h2 className="text-[#0A1628] font-black text-lg mb-3">6. Refund Processing</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">Once your return is received and approved:</p>
            <ul className="space-y-2">
              {[
                'Refunds are processed within 5 to 10 business days',
                'Refunds are issued to the original payment method',
                'Card refunds may take an additional 3 to 5 business days to appear on your statement, depending on your bank',
                'Zelle and Cash App refunds are processed manually, and sent directly to you',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8590A] flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">7. Cancellations</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You may cancel your order free of charge within 24 hours of placing it, provided it has not yet been shipped. After 24 hours, or once the order has been handed to a carrier, cancellations are subject to our standard return process. To cancel an order, email support@autovaultparts.com immediately with your order number.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">8. Returns for AVP Installed Parts</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              If your part was installed by an AutoVaultParts mechanic and a problem arises as a result of the installation, the following applies:
            </p>
            <ul className="space-y-2">
              {[
                'Contact us at support@autovaultparts.com with your order number and a description of the issue',
                'Our team will arrange for an inspection of the installed part at no cost to you',
                'If the problem is confirmed to be caused by our installation, we will repair, replace, or refund the part and cover all associated costs',
                'Claims related to AVP installation must be made within 90 days of the installation date',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-[#0A1628] font-black text-lg mb-3">9. Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              If you have any questions about our refund policy, or need help with a return, please reach out to us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-[#0A1628] font-bold text-sm">AutoVaultParts Support</p>
              <p className="text-gray-600 text-sm">Email: support@autovaultparts.com</p>
              <p className="text-gray-600 text-sm">Response time: Within 24 hours</p>
            </div>
          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/privacy-policy" className="text-[#E8590A] text-sm font-medium hover:underline">Privacy Policy →</Link>
          <Link to="/terms-of-service" className="text-[#E8590A] text-sm font-medium hover:underline">Terms of Service →</Link>
        </div>
      </div>
    </div>
  )
}