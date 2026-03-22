import React, { useEffect } from 'react'
import Hero from '../../components/Hero/Hero'
import Partners from '../../components/Partners/Partners'
import PopularRoutes from '../../components/PopularRoutes/PopularRoutes';
import WhyChoose from '../../components/WhyChoose/WhyChoose';
import AdvertisementSection from '../../components/AdvertisementSection/AdvertisementSection';

const Home = () => {
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mt-18">
      <Hero />

      <div className="mt-8">
        <AdvertisementSection />
      </div>
      <div className="mt-8">
        <Partners />
      </div>

      <div className="mt-5">
        <PopularRoutes />
      </div>
      <div>
        <WhyChoose />
      </div>
    </div>
  );
}

export default Home
