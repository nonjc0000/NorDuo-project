import React from 'react';
import SoundCreator from './SoundCreator';
import HeroSection from './HeroSection';
import About_us from './About_us';
import Latest_release from './Latest_release';

const Home = () => {
  return (
    <>
      <SoundCreator />
      <HeroSection />
      <About_us />
      <Latest_release />
    </>
  )
}

export default Home