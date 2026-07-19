import HeroBanner from '../components/home/HeroBanner'
import FeaturedCategories from '../components/home/FeaturedCategories'
import BestSellers from '../components/home/BestSellers'
import Reviews from '../components/home/Reviews'
import SEO from '../components/common/SEO'

export default function Home() {
  return (
    <div>
      <SEO
        title="Premium Car Spare Parts"
        description="Buy premium car spare parts online. Body parts, engines, transmissions and internal components for BMW, Toyota, Ford, Mercedes and more. Free shipping to US, Canada, Europe and Australia on qualifying orders."
        url="/"
      />
      <HeroBanner />
      <FeaturedCategories />
      <BestSellers />
      <Reviews />
    </div>
  )
}