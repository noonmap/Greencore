import React from 'react';

const CTA = ({ icon, text, onClick }) => {
  return (
    <div className='cta' onClick={onClick}>
      <span className='material-symbols-outlined'>{icon}</span>
      <p>{text}</p>
    </div>
  );
};

export default CTA;
