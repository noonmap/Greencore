import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { useAppDispatch, useInput } from '@/core/hooks';
import { createDiary } from '@/core/diary/diaryAPI';
import { useRouter } from 'next/router';

export default function creatediary() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [diarySetId, onChangeDiarySetId] = useInput(0);
  const [content, onChangeContent] = useInput('');
  const [opservationDate, onChangeOpservationDate] = useInput(new Date().toISOString().substring(0, 10));
  const [image, onChangeImage] = useState('');
  const [preview, onChangePreview] = useState('');

  // 사진 저장
  const saveImage = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0]);
    }
    fileReader.onload = () => {
      onChangeImage(e.target.files[0]);
      onChangePreview(fileReader.result);
    };
  };

  // 일지 생성
  const handlecreateDiary = async (e) => {
    e.preventDefault();
    try {
      const hashtags = content.match(/#[^\s#]+/g);
      const formData = new FormData();
      formData.append('diarySetId', diarySetId);
      formData.append('content', content);
      formData.append('tags', hashtags ? hashtags : []);
      formData.append('opservationDate', opservationDate);
      formData.append('image', image);
      const data = await dispatch(createDiary(formData));

      if (data.payload.result === 'SUCCESS') {
        router.push('/diary');
        Toastify({
          text: message.CheckNicknameFail, // 바꿔야됨
          duration: 1000,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: message.CheckNicknameFail, // 바꿔야됨
          duration: 1000,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.fail,
        }).showToast();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppLayout>
      <div>
        <div>
          <select onChange={onChangeDiarySetId} defaultValue={diarySetId}>
            <option value={0}>내키식 종류들</option>
            <option value={1}>선인장</option>
          </select>
        </div>
        <div>
          <label htmlFor='image'>
            <img src={preview} alt='이미지를 등록해주세요' />
          </label>
          <input type='file' accept='image/*' id='image' onChange={saveImage} style={{ display: 'none' }} />
        </div>
        <div>
          <input type='date' defaultValue={opservationDate} onChange={onChangeOpservationDate} />
        </div>
        <div>
          <textarea cols={50} rows={10} onChange={onChangeContent} />
        </div>
        <button onClick={handlecreateDiary}>일지 생성</button>
      </div>
    </AppLayout>
  );
}
