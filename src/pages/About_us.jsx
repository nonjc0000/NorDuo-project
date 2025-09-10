import React from 'react'
import { Link } from 'react-router-dom'

const About_us = () => {
  return (
    <section className='About_us_wrap'>
      <div className='slogan_box'>
        <h1>Who are we?</h1>
        <img src="./images/deco/decoration_lines.svg" alt="" />
      </div>
      <div className='about_info_box'>
        <div className='upper_info_box'>
          <div className='artist1_box'>
            <figure className='artist1_deco'>
              <img src="./images/deco/artist1_deco.svg" alt="" />
            </figure>
            <figure className='artist1_img'>
              <img src="./images/About_us/artist1.jpg" alt="" />
            </figure>
            <Link to={'#'}>
              <p>More</p>
              <span><img src="./images/About_us/more_arrow.svg" alt="" /></span>
            </Link>
          </div>
          <p>We are passionate musicians</p>
        </div>

        <div className='bottom_info_box'>
          <div className='artist2_box'>
            <figure className='artist2_deco_top'>
              <img src="./images/deco/artist2_deco_top.svg" alt="" />
            </figure>
             <figure className='artist2_img'>
              <img src="./images/About_us/artist2.jpg" alt="" />
            </figure>
             <figure className='artist2_deco_bottom'>
              <img src="./images/deco/artist2_deco_bottom.svg" alt="" />
            </figure>
            <Link to={'#'}>
              <p>More</p>
              <span><img src="./images/About_us/more_arrow.svg" alt="" /></span>
            </Link>
          </div>
          <p>who are dedicated to creating & teaching</p>
        </div>
      </div>

    </section>
  )
}

export default About_us