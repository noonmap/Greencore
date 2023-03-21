import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useRouter } from 'next/router';
import http from '@/lib/http';
import { useForm } from 'react-hook-form';
import { createDiary } from '@/core/diary/diaryAPI';
import { useAppDispatch } from '@/core/hooks';

export default function creatediary() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [preview, setPreview] = useState<any>('');
  const [tagList, setTagList] = useState<Array<string>>([]);

  // react-hook-form 설정
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
  const handleOnChangeTagItem = (e: any) => {
    if ((tagItem.length !== 0 && e.key === 'Enter') || e.key === ' ') {
      handleChangeTagList();
    }
  };

  // 태그 생성
  const handleChangeTagList = () => {
    const updatedTagList = [...tagList];
    let filteredTagList = updatedTagList.filter((item) => item !== tagItem);
    if (tagItem.trim()) {
      filteredTagList.push(tagItem.trim());
    }
    setTagList(filteredTagList);
    setValue('tagItem', '');
  };

  // 태그 삭제
  const handleDeleteTagItem = (e: any) => {
    const deleteTagItem = e.target.parentElement.firstChild.innerText;
    const filteredTagList = tagList.filter((item) => item !== deleteTagItem);
    setTagList(filteredTagList);
  };

  // 이미지 미리보기
  const handlerPreview = (e: any) => {
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

  // 뒤로가기
  const handleGoBack = () => {
    router.back();
  };

  // 일지 생성
  const handleCreateDiary = async (e: any) => {
    e.preventDefault();
    const payload = { diarysetId, content, opservationDate, image, tags: tagList };
    const requestData = { router, payload };
    try {
      dispatch(createDiary(requestData));
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
            <img src={preview} alt='이미지를 등록해주세요' style={{ cursor: 'pointer' }} />
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
                  <button onClick={handleDeleteTagItem} style={{ paddingInline: '4px' }}>
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
                handleOnChangeTagItem(event);
              }}
            />
          </div>
        </div>
        <div>
          <textarea required cols={50} rows={10} {...register('content')} placeholder='내용' />
        </div>
        <button onClick={handleCreateDiary}>일지 생성</button>
        <button onClick={handleGoBack}>취소</button>
      </div>
    </AppLayout>
  );
}
