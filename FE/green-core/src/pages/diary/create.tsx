import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { useRouter } from 'next/router';
import http from '@/lib/http';
import { useForm } from 'react-hook-form';

export default function creatediary() {
  const router = useRouter();
  const [preview, onChangePreview] = useState('');
  const [tagList, onChangeTagList] = useState([]);

  type StateType = {
    diarysetId: number;
    content: string;
    opservationDate: string;
    image: Object;
    tagItem: string;
  };

  const initialState: StateType = {
    diarysetId: 0,
    content: '',
    opservationDate: new Date().toISOString().substring(0, 10),
    image: null,
    tagItem: '',
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [diarysetId, content, opservationDate, image, tagItem] = getValues(['diarysetId', 'content', 'opservationDate', 'image', 'tagItem']);

  useEffect(() => {
    watch();
    return () => {};
  }, []);

  // 태그 입력
  const handlerOnChangeTagItem = (e) => {
    if ((tagItem.length !== 0 && e.key === 'Enter') || e.key === ' ') {
      handlerChangeTagList();
    }
  };

  // 태그 생성
  const handlerChangeTagList = () => {
    const updatedTagList = [...tagList];
    let filteredTagList = updatedTagList.filter((item) => item !== tagItem);
    if (tagItem.trim()) {
      filteredTagList.push(tagItem.trim());
    }
    onChangeTagList(filteredTagList);
    setValue('tagItem', '');
  };

  // 태그 삭제
  const handlerDeleteTagItem = (e) => {
    const deleteTagItem = e.target.parentElement.firstChild.innerText;
    const filteredTagList = tagList.filter((item) => item !== deleteTagItem);
    onChangeTagList(filteredTagList);
  };

  // 이미지 미리보기
  const handlerPreview = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      onChangePreview(fileReader.result);
    };
  };

  // 일지 생성
  const handlecreateDiary = async (e) => {
    e.preventDefault();
    const payload = { diarysetId, content, opservationDate, image, tags: tagList };
    try {
      console.log(payload);
      const { data } = await http.post(`/diaryset/${diarysetId}`, payload);
      if (data.result === 'SUCCESS') {
        router.push('/diary');
        Toastify({
          text: '알림 메시지 바꿔야됨!!', // 바꿔야됨
          duration: 1000,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
      } else {
        Toastify({
          text: '알림 메시지 바꿔야됨!!', // 바꿔야됨
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
          <select {...register('diarysetId')} defaultValue={getValues('diarysetId')}>
            <option value={0}>내키식 종류들</option>
            <option value={1}>선인장</option>
          </select>
        </div>
        <div>
          <label htmlFor='image'>
            <img src={preview} alt='이미지를 등록해주세요' />
          </label>
          <input
            required
            type='file'
            accept='image/*'
            {...(register('image'),
            {
              onChange(event) {
                setValue('image', event.target.files);
                handlerPreview(event);
              },
            })}
            id='image'
            style={{ display: 'none' }}
          />
        </div>
        <div>
          <input required type='date' defaultValue={opservationDate} {...register('opservationDate')} />
        </div>
        <div>
          <div style={{ display: 'flex' }}>
            {tagList.map((tagItem, index) => {
              return (
                <div key={index} style={{ display: 'flex' }}>
                  <div style={{}}>{tagItem}</div>
                  <button onClick={handlerDeleteTagItem} style={{ paddingInline: '4px' }}>
                    X
                  </button>
                </div>
              );
            })}
            <input
              type='text'
              {...register('tagItem')}
              placeholder='태그(엔터 눌리면 입력됨)'
              onKeyUp={(event) => {
                handlerOnChangeTagItem(event);
              }}
            />
          </div>
        </div>
        <div>
          <textarea required cols={50} rows={10} {...register('content')} placeholder='내용' />
        </div>
        <button onClick={handlecreateDiary}>일지 생성</button>
      </div>
    </AppLayout>
  );
}
