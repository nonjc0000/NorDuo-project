import React from 'react'

const HeroSection = () => {
  return (
    <div className='hero_section_wrap'>
      <div className='hero_vid'>
        <video src="./videos/band_performance.mp4" autoPlay loop muted playsInline />
        
        <div className="deco_top">
          <div className="deco_arrow">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 20L20 30L40 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="deco_rec">
            <div className='rec_dot'></div>
            <span className='rec_text'>REC</span>
          </div>
        </div>
        
        <div className="deco_bottom">
          <div className="deco_slogan">
            <h1 className='slogan_line'>We play.</h1>
            <h1 className='slogan_line'>We create.</h1>
            <div className='slogan_decoration'>
              <div className='decoration_lines'>
                <span className='deco_line'></span>
                <span className='deco_line'></span>
                <span className='deco_line'></span>
                <span className='deco_line'></span>
                <span className='deco_line'></span>
              </div>
            </div>
          </div>
          <div className="deco_battery">
            <p className='battery_label'>Battery</p>
            <div className='battery_indicator'>
              <span className='battery_bar active'></span>
              <span className='battery_bar active'></span>
              <span className='battery_bar active'></span>
              <span className='battery_bar'></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection