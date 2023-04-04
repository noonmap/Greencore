import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useAppDispatch } from '@/core/hooks';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { createPost } from '@/core/post/postAPI';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { checkInputFormToast } from '@/lib/utils';
import styles from '@/styles/Diary.module.scss';
import AppButton from '@/components/button/AppButton';

export default function post() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [preview, setPreview] = useState<any>('');
  const [tagList, setTagList] = useState<Array<string>>([]);

  // react-hook-form 설정
  type StateType = {
    content: string;
    image: any;
    tagItem: string;
  };
  const initialState: StateType = {
    content: '',
    image: null,
    tagItem: '',
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [content, image, tagItem] = getValues(['content', 'image', 'tagItem']);

  // searchState 변경
  function changeSearchState() {
    dispatch(SET_IS_SEARCH_STATE('default'));
  }

  useEffect(() => {
    watch();
    changeSearchState();
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

  // 생성 가능한지 체크
  const CheckPossible = () => {
    if (content == '') {
      checkInputFormToast();
      return false;
    }
    return true;
  };

  // 포스트 생성
  const handleCreatePost = async (e: any) => {
    e.preventDefault();
    if (CheckPossible()) {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', image[0]);
      formData.append('tags', String(tagList));
      const requestData = { router, payload: formData };
      try {
        dispatch(createPost(requestData));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <AppLayout>
      <div className={`overflow-auto flex-1 mx-auto py-6 px-10 h-full`}>
        <div className={`${styles.title}`}>
          <span className={`material-symbols-outlined ${styles.backIcon} cursor-pointer`} onClick={handleGoBack}>
            arrow_back_ios
          </span>
          <div>게시글 생성</div>
        </div>
        <div className='flex justify-center mb-4'>
          {/* 사진 */}
          <div className='w-1/2'>
            <label htmlFor='image'>
              {preview ? (
                <img src={preview} alt='이미지를 등록해주세요' className={`${styles.inputImage}`} />
              ) : (
                <div className={`${styles.inputImage}`}>
                  <span style={{ color: 'var(--title-light-color', fontSize: '1.5rem' }}>이곳을 클릭하여</span>
                  <span style={{ color: 'var(--title-light-color', fontSize: '1.5rem' }}>게시글의 사진을 추가해주세요!</span>
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
                  setValue('image', event.target.files);
                  handlePreview(event);
                },
              })}
              id='image'
              style={{ display: 'none' }}
            />
          </div>
        </div>
        {/* 게시글 내용 */}
        <div className='mb-4'>
          <div className={`${styles.label}`}>게시글 내용 입력</div>
          <textarea required className={`${styles.textareaBox}`} {...register('content')} placeholder='게시글의 내용을 입력해주세요' />
        </div>

        {/* 태그 */}
        <div className={`w-full`}>
          <div className={`${styles.label}`}>태그 입력</div>
          <div className={`${styles.tagBox}`}>
            {tagList.map((tagItem, index) => {
              return (
                <div key={index} className={`${styles.tagComponent} flex`}>
                  <div className={`w-fit ${styles.tagName}`}>{tagItem}</div>
                  <button onClick={handleDeleteTagItem} className={`material-symbols-outlined w-fit ${styles.tagDelete}`}>
                    close
                  </button>
                </div>
              );
            })}
          </div>
          <input
            type='text'
            {...register('tagItem')}
            placeholder='태그 입력'
            className={`${styles.inputBox} ${styles.tagInput} w-full`}
            onKeyUp={(event) => {
              handleOnChangeTagItem(event);
            }}
          />
        </div>

        {/* 버튼 */}
        <div className='flex mt-16'>
          <AppButton text='취소' bgColor='thin' handleClick={handleGoBack} className={`flex-1 mr-8 ${styles.btn}`} />
          <AppButton text='게시글 생성' handleClick={handleCreatePost} className={`flex-1 ${styles.btn}`} />
        </div>
      </div>
    </AppLayout>
  );
}
