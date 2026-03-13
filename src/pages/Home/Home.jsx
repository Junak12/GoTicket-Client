import React from 'react'
import Hero from '../../components/Hero/Hero'
import Partners from '../../components/Partners/Partners'

const Home = () => {
  return (
    <div className="mt-18">
      <Hero />
      <div className='mt-8'>
        <Partners />
      </div>
    </div>
  );
}

export default Home
