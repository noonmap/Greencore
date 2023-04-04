import React, { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import styles from '@/styles/Diary.module.scss';
import { updateDiary } from '@/core/diary/diaryAPI';
import { getDiarySetList } from '@/core/diarySet/diarySetAPI';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { checkInputFormToast } from '@/lib/utils';
import moment from 'moment';
import AppButton from '@/components/button/AppButton';
import { getDiaryDetail } from '@/core/diary/diaryAPI';
import Image from 'next/image';

export default function updatediary() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [preview, setPreview] = useState<any>('');
  const [tagList, setTagList] = useState<Array<string>>([]);
  const [myDiarySetList, setMyDiarySetList] = useState<Array<any>>([]);
  const { diaryId } = router.query;

  type StateType = {
    diarysetId: number;
    content: string;
    observationDate: string;
    image: any;
    tagItem: string;
  };

  const initialState: StateType = {
    diarysetId: 0,
    content: '',
    observationDate: new Date().toISOString().substring(0, 10),
    image: null,
    tagItem: '',
  };

  const { register, setValue, getValues, watch } = useForm<StateType>({ defaultValues: initialState });

  const [diarysetId, content, observationDate, image, tagItem] = getValues(['diarysetId', 'content', 'observationDate', 'image', 'tagItem']);

  const myNickname = useAppSelector((state) => state.common?.userInfo?.nickname);

  // searchState 변경
  function changeSearchState() {
    dispatch(SET_IS_SEARCH_STATE('default'));
  }

  // 초기값 설정
  useEffect(() => {
    watch();
    changeSearchState();
    if (diaryId) {
      getDiarySetList(myNickname, {
        page: 0,
        size: 0,
      }).then((res) => {
        if (res.result === 'SUCCESS') {
          setMyDiarySetList(res.data.content);
          getDiaryDetail(Number(diaryId)).then((res) => {
            if (res.result === 'SUCCESS') {
              setPreview(res.data.imagePath);
              setTagList(res.data.tags);
              setValue('diarysetId', res.data.diarySetId);
              setValue('content', res.data.content);
              setValue('observationDate', res.data.observationDate);
              fetch(res.data.imagePath)
                .then((res) => res.blob())
                .then((blob) => {
                  const arr = res.data.imagePath.split('/');
                  const FileList = [new File([blob], arr[arr.length - 1], { type: `image/${arr[arr.length - 1].split('.')[1]}` })];
                  setValue('image', FileList);
                });
            }
          });
        }
      });
    }
    return () => {};
  }, [diaryId]);

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

  // 올바른 날짜인지 검증
  const isValidDate = (dateString: string) => {
    // 정규표현식으로 yyyy-mm-dd 형식 확인
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }

    // 날짜 값 생성
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // 날짜 값 검증
    if (month < 1 || month > 12) {
      return false;
    }
    if (day < 1 || day > 31) {
      return false;
    }
    if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
      return false;
    }
    if (month == 2) {
      const leap = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
      if (day > 29 || (day == 29 && !leap)) {
        return false;
      }
    }

    return true;
  };

  // 수정 가능한지 체크
  const CheckPossible = () => {
    if (isNaN(diarysetId) || !isValidDate(observationDate) || content == '' || image == null) {
      checkInputFormToast();
      return false;
    }
    return true;
  };

  // 일지 수정
  const handleUpdateDiary = async (e: any) => {
    e.preventDefault();
    if (CheckPossible()) {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('tags', String(tagList));
      formData.append('image', image[0]);
      formData.append('observationDate', observationDate);
      const requestData = { router, payload: formData, diaryId: Number(diaryId) };
      try {
        dispatch(updateDiary(requestData));
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
          <div>일지 수정</div>
        </div>
        <div className='flex mb-4'>
          {/* 사진 */}
          <div className='flex-1 mr-3'>
            <label htmlFor='image'>
              {preview ? (
                <Image src={preview} width={100} height={100} alt='이미지를 등록해주세요' className={`${styles.inputImage}`} />
              ) : (
                <div className={`${styles.inputImage}`}>
                  <span style={{ color: 'var(--title-light-color', fontSize: '1.5rem' }}>이곳을 클릭하여</span>
                  <span style={{ color: 'var(--title-light-color', fontSize: '1.5rem' }}>일지의 사진을 추가해주세요!</span>
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
                  handlerPreview(event);
                },
              })}
              id='image'
              style={{ display: 'none' }}
            />
          </div>

          <div className='flex-1 flex flex-col pt-8 ml-4 justify-evenly'>
            {/* 관찰한 식물 선택 */}
            <div>
              <div className={`${styles.label}`}>관찰한 식물 선택</div>
              <select {...register('diarysetId')} defaultValue={getValues('diarysetId')} className={`w-full text-lg ${styles.inputBox}`}>
                <option value={null}>키우는 식물 선택</option>
                {myDiarySetList.map((diary) => {
                  return (
                    <option key={diary.diarySetId} value={diary.diarySetId}>
                      {diary.title}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 관찰한 날짜 선택 */}
            <div>
              <div className={`${styles.label}`}>관찰한 날짜 선택</div>
              <input
                required
                max={moment(new Date()).format('yyyy-MM-DD')}
                type='date'
                defaultValue={observationDate}
                {...register('observationDate')}
                className={`w-full text-lg ${styles.inputBox}`}
              />
            </div>
          </div>
        </div>

        {/* 일지 내용 */}
        <div className='mb-4'>
          <div className={`${styles.label}`}>일지 내용 입력</div>
          <textarea required className={`${styles.textareaBox}`} {...register('content')} placeholder='관찰 일지의 내용을 입력해주세요' />
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
          <AppButton text='일지 수정' handleClick={handleUpdateDiary} className={`flex-1 ${styles.btn}`} />
        </div>
      </div>
    </AppLayout>
  );
}
