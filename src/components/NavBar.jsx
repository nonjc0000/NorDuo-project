import React, { useState } from 'react'

const NavBar = ({ onNavigate }) => {

  // 控制手機選單開關的state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e, sectionName) => {
    e.preventDefault(); // 防止默認的鏈接行為
    if (onNavigate) {
      onNavigate(sectionName);
    }
    // 點擊導航項目後關閉手機選單
    setIsMobileMenuOpen(false);
  };

  // 切換手機選單的函數
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <div className='nav_wrap'>
      <p className='logo'>NørDuo.studio</p>

      {/* 漢堡選單按鈕 */}
      <button
        className='mobile_menu_btn'
        onClick={toggleMobileMenu}
      >
        <span className={`hamburger_line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`hamburger_line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`hamburger_line ${isMobileMenuOpen ? 'active' : ''}`}></span>
      </button>

      <ul className={`nav_list ${isMobileMenuOpen ? 'mobile_open' : ''}`}>
        {/* 關閉按鈕 - 只在手機版顯示 */}
        <li className='nav_item close_btn_item'>
          <button
            className='nav_close_btn'
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
          </button>
        </li>
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