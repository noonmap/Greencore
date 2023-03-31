import AppButton from '@/components/button/AppButton';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './UploadPopup.module.scss';

const UploadPopup = ({ onClose, onCapture }) => {
  const [preview, setPreview] = useState<string>(null);

  // react-hook-form 설정
  type StateType = {
    image: Object;
  };
  const initialState: StateType = {
    image: null,
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const image = getValues('image');

  useEffect(() => {
    watch();
    return () => {};
  }, []);

  // 이미지 미리보기
  const handlePreview = (e: any) => {
    const fileReader = new FileReader();
    if (e.target.files.length) {
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.onload = () => {
        setPreview(fileReader.result);
      };
    } else {
      setPreview(null);
    }
  };

  return (
    <>
      <div className='py-4'>
        {/* <FontAwesomeIcon icon='images' /> */}
        <div className='flex justify-center mb-4'>
          {/* 사진 */}
          <div className='w-2/3'>
            <label htmlFor='image'>
              {preview ? (
                <img src={preview} alt='이미지를 등록해주세요' className={`${styles.inputImage}`} />
              ) : (
                <div className={`${styles.inputImage}`}>
                  <span style={{ color: 'var(--title-light-color', fontSize: '1.5rem' }}>이곳을 클릭하여</span>
                  <span style={{ color: 'var(--title-light-color', fontSize: '1.5rem' }}>식물의 사진을 추가해주세요!</span>
                </div>
              )}
            </label>
            <input
              required
              type='file'
              accept='image/*'
              {...(register('image'),
              {
                onChange(event) {
                  setValue('image', event.target.files[0]);
                  handlePreview(event);
                },
              })}
              id='image'
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className='flex justify-center'>
          <div className='w-2/3 flex justify-between'>
            <AppButton text='뒤로' handleClick={onClose} bgColor='thin' className='flex-1 mr-4' />
            {image ? (
              <AppButton text='분석' handleClick={() => onCapture(image)} className='flex-1' />
            ) : (
              <AppButton text='분석' bgColor='thin' handleClick={() => {}} className='flex-1' />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPopup;
