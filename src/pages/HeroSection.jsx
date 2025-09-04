import React from 'react'

const HeroSection = () => {
  return (
    <div className='hero_section_wrap'>

      <div className='hero_vid' autoPlay loop muted playsInline>
        <video src="./videos/band_performance.mp4" />
        <div className="deco_top">
          <div className="deco_arrow"></div>
          <div className="deco_rec"></div>
        </div>
        <div className="deco_bottom">
          <div className="deco_slogan"></div>
          <div className="deco_battery"></div>
        </div>
      </div>

    </div>
  )
}

export default HeroSection