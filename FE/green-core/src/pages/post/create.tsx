import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch } from '@/core/hooks';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { createPost } from '@/core/post/postAPI';

export default function post() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [preview, setPreview] = useState<any>('');
  const [tagList, setTagList] = useState<Array<string>>([]);

  // react-hook-form 설정
  type StateType = {
    content: string;
    image: Object;
    tagItem: string;
  };
  const initialState: StateType = {
    content: '',
    image: null,
    tagItem: '',
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [content, image, tagItem] = getValues(['content', 'image', 'tagItem']);

  useEffect(() => {
    watch();
    return () => {};
  }, []);

  // 태그 입력
  const handleOnChangeTagItem = (e: any) => {
    e.preventDefault();
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

  // 포스트 작성 취소
  const handleGoBack = () => {
    router.back();
  };

  // 포스트 생성
  const handleCreatePost = async (e: any) => {
    e.preventDefault();
    const payload = { content, image, tags: tagList };
    const requestData = { router, payload };
    try {
      dispatch(createPost(requestData));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppLayout>
      <div>
        <div>
          <label htmlFor='image'>
            <img src={preview} alt='이미지를 등록해주세요' style={{ cursor: 'pointer' }} />
          </label>
          <input
            type='file'
            accept='image/*'
            {...(register('image'),
            {
              onChange(event: any) {
                setValue('image', event.target.files);
                handlePreview(event);
              },
            })}
            id='image'
            style={{ display: 'none' }}
          />
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
          <textarea rows={10} cols={50} {...register('content')} />
        </div>
        <button onClick={handleCreatePost}>작성</button>
        <button onClick={handleGoBack}>취소</button>
      </div>
    </AppLayout>
  );
}
