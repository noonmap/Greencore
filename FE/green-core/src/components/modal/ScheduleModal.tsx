import { useAppSelector } from '@/core/hooks';
import { createSchedule, updateRegularSchedule, updateSchedule } from '@/core/schedule/scheduleAPI';
import http from '@/lib/http';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import DayButton from '../DayButton';
import AppButton from '@/components/button/AppButton';
import { checkInputFormToast } from '@/lib/utils';

type PropsType = {
  isOpen: boolean;
  modalTitle: string;
  scheduleId?: number;
  schedule?: any;
  regularId?: number;
  create?: boolean;
  update?: boolean;
  regular?: boolean;
  handleReload?: () => void;
  handleModalClose: () => void;
};

type StateType = {
  userPlantId: number;
  scheduleDate: string;
  scheduleCode: string;
  content: string;
  regularScheduleCode: string;
  day: number | string;
};

export default function ScheduleModal({
  isOpen,
  modalTitle,
  create,
  update,
  regular,
  scheduleId,
  schedule,
  regularId,
  handleReload,
  handleModalClose,
}: PropsType) {
  const initialState: StateType = {
    userPlantId: schedule ? schedule.plant.userPlantId : 0,
    scheduleDate: schedule ? schedule.scheduleDate : '',
    scheduleCode: schedule ? schedule.scheduleCode : 'WATER',
    content: schedule ? schedule.content : '',
    regularScheduleCode: schedule ? (schedule.regularScheduleCode ? schedule.regularScheduleCode : '0') : '0',
    day: null,
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const { register, setValue, getValues, watch } = useForm({ defaultValues: initialState, mode: 'onChange' });
  const [isPossible, setIsPossible] = useState(false);
  const [userPlantId, scheduleDate, scheduleCode, content, regularScheduleCode, day] = getValues([
    'userPlantId',
    'scheduleDate',
    'scheduleCode',
    'content',
    'regularScheduleCode',
    'day',
  ]);
  const myNickname = useAppSelector((state) => state.common.userInfo?.nickname);

  // 할일 종류
  const scheduleCodeList = [
    ['물갈이', 'WATER'],
    ['분갈이', 'REPOT'],
    ['가지치기', 'PRUNING'],
    ['영양제', 'NUTRITION'],
    ['환기', 'VENTILATION'],
    ['분무', 'SPRAY'],
    ['기타', 'ETC'],
  ];
  const [userPlantList, setUserPlantList] = useState([]);

  // 요일 리스트
  const dayList = [
    ['월', 1],
    ['화', 2],
    ['수', 3],
    ['목', 4],
    ['금', 5],
    ['토', 6],
    ['일', 7],
  ];
  const [isSelectedList, setIsSelectedList] = useState(Array(dayList.length).fill(false));

  // 매주 - 요일 클릭
  const handleClick = (idx: number) => {
    setValue('day', dayList[idx][1]);
    const newArr = Array(dayList.length).fill(false);
    newArr[idx] = true;
    setIsSelectedList(newArr);
  };

  // 모달 바깥 클릭 시
  function handleModalOutsideClick(e: any) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  // 스케줄 생성
  const handleScheduleCreate = async (e: any) => {
    console.log('스케줄 생성');
    e.preventDefault();
    if (isPossible) {
      const payload = { userPlantId, scheduleDate, scheduleCode, content, regularScheduleCode, day: Number(day) };
      try {
        console.log(payload);
        const data = await createSchedule(payload);
        if (data.result === 'SUCCESS') {
          handleReload();
          handleModalClose();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      checkInputFormToast();
      return;
    }
  };

  // 스케줄 수정
  const handleScheduleUpdate = async (e: any) => {
    console.log('스케줄 수정');
    e.preventDefault();
    if (isPossible) {
      const payload = { userPlantId, scheduleDate, scheduleCode, content };
      const requestData = {
        scheduleId,
        payload,
      };
      try {
        const data = await updateSchedule(requestData);
        if (data.result === 'SUCCESS') {
          handleReload();
          handleModalClose();
        }
      } catch (err) {}
    } else {
      checkInputFormToast();
      return;
    }
  };

  // 정기스케줄 수정
  const handleRegularScheduleUpdate = async (e: any) => {
    console.log('정기스케줄 수정');
    e.preventDefault();
    if (isPossible) {
      const payload = { scheduleCode, userPlantId, content, regularScheduleCode, day };
      const requestData = {
        regularId,
        payload,
      };
      try {
        const data = await updateRegularSchedule(requestData);
        if (data.result === 'SUCCESS') {
          handleReload();
          handleModalClose();
        }
      } catch (err) {}
    } else {
      checkInputFormToast();
      return;
    }
  };

  useEffect(() => {
    watch();
    // 유저가 키우는 식물 리스트 가져오기
    http.get(`/user/plant/${myNickname}?page=0&size=100`).then((res) => setUserPlantList(res.data.data));

    document.addEventListener('mousedown', handleModalOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  // 생성 가능한지 확인하는 함수
  const checkIsPossible = () => {
    if (userPlantId >= 0 && (scheduleDate !== '' || day !== '') && scheduleCode !== '' && content !== '' && regularScheduleCode) {
      setIsPossible(true);
    } else {
      setIsPossible(false);
    }
  };

  useEffect(() => {
    checkIsPossible();
  }, [userPlantId, scheduleDate, day, scheduleCode, content, regularScheduleCode]);

  return (
    <>
      {isOpen ? (
        <div className='modalContainer'>
          <div className='modalWrap' ref={modalRef}>
            {/* 모달 내부 */}
            <div onClick={() => handleModalClose()}>X</div>

            {/* 모달 컨텐츠 */}
            <div className='modalContent'>
              <div>{modalTitle}</div>
              <label id='plant'>스케줄링 식물 선택</label>
              <select {...register('userPlantId')} id='plant'>
                {userPlantList?.map((plant) => {
                  return <option key={plant.userPlantId}>{plant.plantNickname}</option>;
                })}
              </select>
              <label id='toDo'>할 일</label>
              <select id='toDo' {...register('scheduleCode')}>
                {scheduleCodeList.map((code) => (
                  <option key={code[1]} value={code[1]}>
                    {code[0]}
                  </option>
                ))}
              </select>
              <label id='content'>내용</label>
              <input type='text' id='content' {...register('content')} placeholder='내용을 입력해주세요!' />
              {(create || regular) && (
                <>
                  <label id='period'>주기 선택</label>
                  <div style={{ display: 'flex' }}>
                    <select
                      {...(register('regularScheduleCode'),
                      {
                        onChange(event) {
                          setValue('regularScheduleCode', event.target.value);
                          setValue('scheduleDate', '');
                          setIsSelectedList(Array(dayList.length).fill(false));
                          setValue('day', null);
                        },
                      })}>
                      <option value='0'>매월</option>
                      <option value='1'>매주</option>
                      <option value='2'>하루</option>
                    </select>

                    {/* 매월 */}
                    {regularScheduleCode == '0' && (
                      <div>
                        <input type='number' min={1} max={31} {...register('day')} id='period' placeholder='ex) 1' /> 일
                      </div>
                    )}

                    {/* 매주 */}
                    <div style={{ display: 'flex' }}>
                      {regularScheduleCode == '1' &&
                        dayList.map((day, index) => (
                          <DayButton key={index} isSelected={isSelectedList[index]} handleClick={handleClick} elementIndex={index} content={day[0]} />
                        ))}
                    </div>

                    {/* 개별 */}
                    {regularScheduleCode === '2' && <input type='date' {...register('scheduleDate')} id='period' />}
                  </div>
                </>
              )}
              {update && (
                <>
                  <label id='scheduleDate'>날짜</label>
                  <input type='date' {...register('scheduleDate')} id='scheduleDate' />
                </>
              )}
              {regular ? (
                <div className='flex'>
                  <AppButton text='확인' bgColor={isPossible ? 'main' : 'thin'} handleClick={handleRegularScheduleUpdate} />
                </div>
              ) : (
                <div className='flex'>
                  {create ? (
                    <AppButton text='확인' bgColor={isPossible ? 'main' : 'thin'} handleClick={handleScheduleCreate} />
                  ) : (
                    <AppButton text='확인' bgColor={isPossible ? 'main' : 'thin'} handleClick={handleScheduleUpdate} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
