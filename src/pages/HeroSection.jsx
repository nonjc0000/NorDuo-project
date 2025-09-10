import React from 'react'

const HeroSection = () => {
  return (
    <section className='hero_section_wrap'>
      <div className='hero_content'>
        <video src="./videos/band_performance.mp4" autoPlay loop muted playsInline className='hero_vid' />

        <div className="deco_top">
          <figure className="deco_arrow">
            <img src="./images/HeroSection/deco_arrow.svg" alt="" />
          </figure>
          <div className="deco_rec">
            <figure className='rec_dot'>
              <img src="./images/HeroSection/rec_dot.svg" alt="" />
            </figure>

            <span className='rec_text'>REC</span>
          </div>
        </div>

        <div className="deco_bottom">
          <div className="deco_slogan">
            <p className='slogan_line'>We play.</p>
            <p className='slogan_line'>We create.</p>
            <div className='slogan_decoration'>
              <figure className='decoration_lines'>
                <img src="./images/deco/decoration_lines.svg" alt="" />
              </figure>
            </div>
          </div>
          <div className="deco_battery">
            <p className='battery_label'>Battery</p>
            <div className='battery_indicator'>
              <span className='battery_bar'></span>
              <span className='battery_bar'></span>
              <span className='battery_bar'></span>
              <span className='battery_bar'></span>
              <span className='battery_bar'></span>
              <span className='battery_bar'></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection