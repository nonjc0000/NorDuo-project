import React from 'react';
import SoundCreator from './SoundCreator';
import HeroSection from './HeroSection';
import About_us from './About_us';
import Latest_release from './Latest_release';
import Learning from './Learning';

const Home = () => {
  return (
    <>
      <SoundCreator />
      <HeroSection />
      <About_us />
      <Latest_release />
      <Learning />
    </>
  )
}

export default Home