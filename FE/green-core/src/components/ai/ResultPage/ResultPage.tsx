import React, { useEffect, useState } from 'react';
import IssueContainer from './IssueContainer';
import AppButton from '@/components/button/AppButton';
import styles from '../Popup/UploadPopup.module.scss';
import Skeleton from 'react-loading-skeleton';

const ResultPage = ({ image, getDiseases, onClose }) => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setDiseases(await getDiseases());
      setLoading(false);
    };
    fetchData();
  }, [getDiseases]);

  return (
    <>
      <div className='flex justify-center mb-4'>
        <div className='w-2/3'>
          <img src={image} alt='Plant' id='plant-photo' className={`${styles.inputImage}`} />

          {loading ? (
            <Skeleton height={200} className='mt-4' />
          ) : (
            <>
              <IssueContainer diseases={diseases} />
            </>
          )}
          <AppButton text='닫기' handleClick={onClose} className='mt-4' />
        </div>
      </div>
    </>
  );
};

export default ResultPage;
