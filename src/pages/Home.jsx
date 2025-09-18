import React, { useRef } from 'react';
import SoundCreator from './SoundCreator';
import HeroSection from './HeroSection';
import About_us from './About_us';
import Latest_release from './Latest_release';
import Learning from './Learning';
import Shop from './Shop';
import Contact_us from './Contact_us';

const Home = () => {
  
  const heroRef = useRef(null);
  const about_usRef = useRef(null);
  const latest_releaseRef = useRef(null);
  const learningeRef = useRef(null);
  const shopRef = useRef(null);
  const contact_usRef = useRef(null);

  return (
    <>
      <SoundCreator />
      <HeroSection />
      <About_us />
      <Latest_release />
      <Learning />
      <Shop/>
      <Contact_us/>
    </>
  )
}

export default Home