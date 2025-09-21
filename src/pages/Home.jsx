import React, { useRef } from 'react';
import { motion } from 'framer-motion'
import SoundCreator from './SoundCreator';
import HeroSection from './HeroSection';
import About_us from './About_us';
import Latest_release from './Latest_release';
import Learning from './Learning';
import Shop from './Shop';
import Contact_us from './Contact_us';

const Home = ({ refs }) => {

  const {
    soundCreatorRef,
    heroRef,
    aboutUsRef,
    latestReleaseRef,
    learningRef,
    shopRef,
    contactUsRef
  } = refs;

  return (
    <>
      <div ref={soundCreatorRef}>
        <SoundCreator />
      </div>
      <div ref={heroRef}>
        <HeroSection />
      </div>
      <div ref={aboutUsRef}>
        <About_us />
      </div>
      <div ref={latestReleaseRef}>
        <Latest_release />
      </div>
      <div ref={learningRef}>
        <Learning />
      </div>
      <div ref={shopRef}>
        <Shop />
      </div>
      <div ref={contactUsRef}>
        <Contact_us />
      </div>
    </>
  )
}

export default Home;