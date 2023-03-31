import React from 'react';

const NavBar = ({ onTryNowClick }) => {
  return (
    <div className='navbar'>
      <h3 className='logo'>Plant AI</h3>
      <nav>
        <button href='#' className='navbar-link button' onClick={onTryNowClick}>
          Try Plant AI
        </button>
      </nav>
    </div>
  );
};

export default NavBar;
