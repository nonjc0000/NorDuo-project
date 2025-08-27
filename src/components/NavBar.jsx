import React from 'react'

const NavBar = () => {
  return (
    <div className='nav_wrap'>
      <p className='logo'>NørDuo.studio</p>

      <ul className='nav_list'>
        <li className='nav_item'><a href="#">About</a></li>
        <li className='nav_item'><a href="#">Works</a></li>
        <li className='nav_item'><a href="#">Learning</a></li>
        <li className='nav_item'><a href="#">Shop</a></li>
        <li className='nav_item'><a href="#">Contact</a></li>
      </ul>
    </div>
  )
}

export default NavBar