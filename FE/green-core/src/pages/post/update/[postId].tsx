import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import http from '@/lib/http';
import { useAppDispatch } from '@/core/hooks';
import { updatePost } from '@/core/post/postAPI';

const fetcher = (url: string) => http.get(url).then((res) => res.data);

export default function updatepost() {
  const [preview, setPreview] = useState<any>('');
  const [tagList, setTagList] = useState<Array<string>>([]);
  const router = useRouter();
  const postId = Number(router.query.postId);
  const dispatch = useAppDispatch();
  const { data: post, error, isLoading: hasPost } = useSWR(`/post/${postId}`, fetcher);

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
    if (!hasPost) {
      setPreview(post.data.imagePath);
      setTagList(post.data.tags);
      setValue('content', post.data.content);
    }
  }, [hasPost]);

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

  // 포스트 수정
  const handleUpdatePost = async (e: any) => {
    e.preventDefault();
    const payload = { content, image, tags: tagList };
    const requestData = { router, payload, postId };
    dispatch(updatePost(requestData));
  };

  return (
    <AppLayout>
      <div>
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
          <div style={{ display: 'flex' }}>
            {tagList.map((item, index) => {
              return (
                <div key={index} style={{ display: 'flex' }}>
                  <div>{item}</div>
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
        <button onClick={handleUpdatePost}>게시글 수정</button>
        <button onClick={handleGoBack}>취소</button>
      </div>
    </AppLayout>
  );
}
