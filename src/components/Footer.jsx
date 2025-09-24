import React from 'react'

const Footer = ({ onNavigate }) => {

  // 使用 Lenis 進行滾動到頂部
  function gotoTop() {
    if (window.lenis) {
      // 使用 Lenis 滾動到頂部
      window.lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    } else {
      // Fallback 到原生滾動
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
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