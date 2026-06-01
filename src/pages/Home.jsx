import HeroBanner from '../components/home/HeroBanner'
import FeaturedCategories from '../components/home/FeaturedCategories'
import BestSellers from '../components/home/BestSellers'

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FeaturedCategories />
      <BestSellers />
    </div>
  )
}