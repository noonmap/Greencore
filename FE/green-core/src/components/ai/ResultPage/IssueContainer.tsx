import React from 'react';
import styles from '@/styles/Plant.module.scss';

const IssueContainer = ({ diseases }) => {
  const sortedArr = [];
  for (const disease in diseases) {
    sortedArr.push([disease, diseases[disease]]);
  }
  // 내림차순 정렬
  sortedArr.sort((a, b) => {
    return b[1] - a[1];
  });

  return (
    <div className={`mt-4`}>
      <div className={`${styles.issueCounter}`}>
        {/* {diseases[0].disease !== '건강함'} */}
        {!('건강함' in diseases) ? (
          <div className='flex items-center'>
            <span className='material-symbols-outlined' style={{ color: 'var(--danger-color)' }}>
              priority_high
            </span>
            {Object.keys(diseases).length}개의 병충해 발견
          </div>
        ) : (
          <div className='flex items-center'>
            <span className='material-symbols-outlined' style={{ color: 'var(--main-color)' }}>
              psychiatry
            </span>
            <div>병충해가 없습니다.</div>
          </div>
        )}
      </div>

      {!('건강함' in diseases) ? (
        <div className={`${styles.issueBox}`}>
          {sortedArr?.map((disease: string, index: number) => {
            const percent = Number(disease[1]).toFixed(2);
            return (
              <div className={`${styles.issue}`} key={index}>
                <div className={`${styles.issueName}`}>{disease[0]}</div>
                <div className={`${styles.progressBar} flex-1`}>
                  <div className={`${styles.pregress}`} style={{ width: `${percent}%` }} />
                </div>
                <div className={`${styles.issuePercent}`}>{percent}%</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default IssueContainer;
