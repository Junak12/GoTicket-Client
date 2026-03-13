import React from 'react'
import Hero from '../../components/Hero/Hero'
import Partners from '../../components/Partners/Partners'
import PopularRoutes from '../../components/PopularRoutes/PopularRoutes';
import WhyChoose from '../../components/WhyChoose/WhyChoose';

const Home = () => {
  return (
    <div className="mt-18">
      <Hero />
      <div className="mt-8">
        <Partners />
      </div>
      <div className='mt-5'>
        <PopularRoutes />
      </div>
      <div>
        <WhyChoose/>
      </div>
    </div>
  );
}

export default Home
