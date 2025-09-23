import React from 'react'

const Footer = () => {

  // 捲動到頂
  function gotoTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  return (
    <div className='footer_wrap'>
      <div className='footer_left'>
        <div className='slogan'>
          <p>We play.</p>
          <p>We create.</p>
        </div>
        <div className='footer_down_left'>
          <ul className='socials'>
            <li><a className='icon-fb' href="https://www.facebook.com/" target='_blank'></a></li>
            <li><a className='icon-ig' href="https://www.instagram.com/" target='_blank'></a></li>
            <li><a className='icon-spotify' href="https://open.spotify.com/" target='_blank'></a></li>
            <li><a className='icon-soundcloud' href="https://soundcloud.com/" target='_blank'></a></li>
            <li><a className='icon-yt' href="https://www.youtube.com/" target='_blank'></a></li>
          </ul>
          <small>© 2025 NørDuo.studio. All rights reserved.</small>
        </div>
      </div>
      <div className='footer_right'>
        <figure className='arrow'>
          <img src="./images/Footer/arrow.svg" alt="" onClick={gotoTop} />
        </figure>
      </div>
    </div>
  )
}

export default Footer