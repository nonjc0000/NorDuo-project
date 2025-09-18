import React from 'react'

const NavBar = ({ onNavigate }) => {
  
  const handleNavClick = (e, sectionName) => {
    e.preventDefault(); // 防止默認的鏈接行為
    if (onNavigate) {
      onNavigate(sectionName);
    }
  };

  return (
    <div className='nav_wrap'>
      <p className='logo'>NørDuo.studio</p>

      <ul className='nav_list'>
        <li className='nav_item'>
          <a href="#" onClick={(e) => handleNavClick(e, 'about')}>About</a>
        </li>
        <li className='nav_item'>
          <a href="#" onClick={(e) => handleNavClick(e, 'works')}>Works</a>
        </li>
        <li className='nav_item'>
          <a href="#" onClick={(e) => handleNavClick(e, 'learning')}>Learning</a>
        </li>
        <li className='nav_item'>
          <a href="#" onClick={(e) => handleNavClick(e, 'shop')}>Shop</a>
        </li>
        <li className='nav_item'>
          <a href="#" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        </li>
      </ul>
    </div>
  )
}

export default NavBar