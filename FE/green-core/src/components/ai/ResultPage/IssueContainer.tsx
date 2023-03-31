import React from 'react';

const IssueContainer = ({ diseases }) => {
  return (
    <div className='issue-container mt-4'>
      <div className='issue-counter'>
        <h2>
          {diseases.length && diseases[0].disease !== 'healthy' ? (
            <div className='flex items-center'>
              <span className='material-symbols-outlined' style={{ color: 'var(--danger-color)' }}>
                priority_high
              </span>
              {diseases.length}개의 병충해 발견
            </div>
          ) : (
            <div className='flex items-center'>
              <span className='material-symbols-outlined' style={{ color: 'var(--main-color)' }}>
                psychiatry
              </span>
              <div>병충해가 없습니다.</div>
            </div>
          )}
        </h2>
      </div>

      {diseases?.map((disease: any, index: number) => (
        <div className='issue' key={index}>
          {/* <img src={`${disease.image}`} alt={issueTitle} /> */}
          <div className='issue-text'>
            <h3>Issue : {disease.disease}</h3>
            <p>Species : {disease.name}</p>
          </div>
          {/* <a className='cure-button' href={disease.cureURL} target='_blank' rel='noreferrer'>
              <FontAwesomeIcon icon="plus-square" className="cure-button-icon" />
              <h4>
                CURE <br /> NOW
              </h4>
            </a> */}
        </div>
      ))}
    </div>
  );
};

export default IssueContainer;
