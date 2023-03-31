import React from 'react';
import NavBar from './NavBar';
import CTA from './CTA';

const Header = ({ onTryNowClick }) => {
  return (
    <div className='header'>
      <NavBar onTryNowClick={onTryNowClick} />
      {/* <CTA icon='cloud-upload-alt' text='Try Now' onClick={onTryNowClick} /> */}
    </div>
  );
};

export default Header;
