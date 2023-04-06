import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/layout/AppLayout';
import Skeleton from 'react-loading-skeleton';
import { getPlantList, getPlantListByIndex, getPlant, getTopPlantList } from '@/core/plant/plantAPI';
import { getTopDiarySet } from '@/core/diarySet/diarySetAPI';
import { getSamePlantUserList } from '@/core/user/userAPI';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { PlantType, SearchPlantDetailType } from '@/core/plant/plantType';
import { SearchDiarySetType } from '@/core/diarySet/diarySetType';
import { SearchUserType } from '@/core/user/userType';
import Pagination from 'react-js-pagination';
import styles from './plantDocs.module.scss';

export default function plantDocs() {
  const dispatch = useAppDispatch();
  const storage = getStorage();

  const [userProfileList, setUserProfileList] = useState(['temp', 'temp', 'temp']);

  const nickname = useAppSelector((state) => state.common?.userInfo?.nickname);

  // 인기식물, 인기 관찰일지, 나와 같은 식물을 키우는 사람들
  const [topPlantList, setTopPlantList] = useState<Array<PlantType>>([]);
  const [topDiarySetList, setTopDiarySetList] = useState<Array<SearchDiarySetType>>([]);
  const [samePlantUserList, setSamePlantUserList] = useState<Array<SearchUserType>>([]);

  // 식물도감 리스트 인덱스 검색
  const indexList = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [pageAtindex, setPageAtindex] = useState<number>(0);
  const [sizeAtindex, setSizeAtindex] = useState<number>(10);

  // 식물도감 이름 리스트 검색
  const [inputData, setInputData] = useState<string>(''); // 인풋데이터
  const [page, setPage] = useState<number>(0);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [plantDocsList, setPlantDocsList] = useState<Array<PlantType>>([]);

  // 식물도감 디테일 조회
  const [plantDocsDetail, setPlantDocsDetail] = useState<SearchPlantDetailType>();
  const [isDetailSearched, setIsDetailSearched] = useState<boolean>(false);

  // 이미지 스켈레톤 ----------------------------------------------------------------------------------------------------
  const [isLoadingErrorAtTopPlant, setIsLoadingErrorAtTopPlant] = useState<Array<boolean>>([false, false, false, false, false]);
  const [isLoadingErrorAtTopDiarySet, setIsLoadingErrorAtTopDiarySet] = useState<Array<boolean>>([false, false, false, false, false]);
  const [isLoadingErrorAtSamePlantUser, setIsLoadingErrorAtSamPlantUser] = useState<Array<boolean>>([false, false, false, false, false]);
  const [isLoadingErrorAtPlantDetail, setIsLoadingErrorAtPlantDetail] = useState<boolean>(false);

  // 인기 식물
  const handleImageLoadAtTopPlant = (index) => {
    setIsLoadingErrorAtTopPlant((prev) => {
      const nextState = [...prev];
      nextState[index] = false;
      return nextState;
    });
  };
  const handleImageErrorAtTopPlant = (index) => {
    setIsLoadingErrorAtTopPlant((prev) => {
      const nextState = [...prev];
      nextState[index] = true;
      return nextState;
    });
  };

  // 인기 관찰일지
  const handleImageLoadAtTopDiarySet = (index) => {
    setIsLoadingErrorAtTopDiarySet((prev) => {
      const nextState = [...prev];
      nextState[index] = false;
      return nextState;
    });
  };
  const handleImageErrorAtTopDiarySet = (index) => {
    setIsLoadingErrorAtTopDiarySet((prev) => {
      const nextState = [...prev];
      nextState[index] = true;
      return nextState;
    });
  };

  // 나같식키 유저

  useEffect(() => {
    if (samePlantUserList?.length != 0) {
      getUserProfile(samePlantUserList);
    }
  }, [samePlantUserList]);

  function getUserProfile(samePlantUserList: Array<SearchUserType>) {
    const newUserProfileList = [...userProfileList];
    samePlantUserList.map((samePlantUser, index) => {
      const profileRef = ref(storage, `${samePlantUser.nickname}/profileImage`);

      getDownloadURL(profileRef)
        .then((downloadURL) => {
          newUserProfileList[index] = downloadURL;
          setUserProfileList(newUserProfileList);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  const handleImageLoadAtSamePlantUser = (index) => {
    setIsLoadingErrorAtSamPlantUser((prev) => {
      const nextState = [...prev];
      nextState[index] = false;
      return nextState;
    });
  };
  const handleImageErrorAtSamePlantUser = (index) => {
    setIsLoadingErrorAtSamPlantUser((prev) => {
      const nextState = [...prev];
      nextState[index] = true;
      return nextState;
    });
  };

  // 디테일 조회
  const handleImageLoadAtPlantDetail = () => {
    setIsLoadingErrorAtPlantDetail(false);
  };

  const handleImageErrorAtPlantDetail = () => {
    setIsLoadingErrorAtPlantDetail(true);
  };

  // ----------------------------------- 초기 데이터 -----------------------------------

  // init 훅
  useEffect(() => {
    fetchTopPlantList();
    fetchTopDiarySetList();
    fetchSamePlantUserList();
  }, []);

  // 우측바 상태 변경
  useEffect(() => {
    dispatch(SET_IS_SEARCH_STATE('null'));
  }, []);

  // 인기 식물 조회
  async function fetchTopPlantList() {
    try {
      const { data } = await getTopPlantList();
      setTopPlantList(data);
    } catch (error) {
      console.error(error);
    }
  }
  // 인기 관찰일지 조회
  async function fetchTopDiarySetList() {
    try {
      const { data } = await getTopDiarySet();
      setTopDiarySetList(data);
    } catch (error) {
      console.error(error);
    }
  }
  // 나와 같은 식물을 키우는 사람들 조회
  async function fetchSamePlantUserList() {
    try {
      const { data } = await getSamePlantUserList();
      setSamePlantUserList(data);
    } catch (error) {
      console.error(error);
    }
  }

  // ----------------------------------- index 데이터 -----------------------------------

  // 웹 훅
  useEffect(() => {
    if (selectedIndex !== null) {
      fetchPlantListByIndex(0);
    }
  }, [selectedIndex]);

  // 웹 훅
  useEffect(() => {
    if (selectedIndex !== null) {
      fetchPlantListByIndex(pageAtindex);
    }
  }, [pageAtindex]);

  // 식물도감 리스트 index 버튼 클릭
  function handleIndexBtnCLick(e) {
    setPageAtindex(0);
    setInputData('');
    const search = e.target.innerText;
    const data = indexList.findIndex((index) => {
      return index === search;
    });
    setSelectedIndex(data);
  }

  // 식물도감 리스트 index 검색
  async function fetchPlantListByIndex(page: number) {
    try {
      const params = {
        index: indexList[selectedIndex],
        page: page,
        size: sizeAtindex,
      };
      const { data } = await getPlantListByIndex(params);
      setPlantDocsList(data.content);
      setTotalItemCount(data.totalElements);
      console.log('totalElements', data.totalElements);
    } catch (error) {
      console.error(error);
    }
  }

  // 페이지네이션 클릭
  const handlePageAtindexChange = (pageAtindex) => {
    setPageAtindex(pageAtindex - 1);
  };
  // ----------------------------------- 검색 데이터 -----------------------------------

  // 웹 훅
  useEffect(() => {
    if (inputData !== '') {
      fetchPlantList();
    }
  }, [page]);

  async function fetchPlantList() {
    const params = {
      search: inputData,
      page: page,
      size: size,
    };

    try {
      const { data } = await getPlantList(params);
      setPlantDocsList(data.content);
      setTotalItemCount(data.totalElements);
    } catch (error) {
      console.error(error);
    }
  }

  // 검색창 Enter 입력
  async function handleKeyUp(event) {
    if (event.key === 'Enter') {
      setPage(0);
      handleSearch();
    }
  }

  // 검색 요청
  function handleSearch() {
    setSelectedIndex(null);
    fetchPlantList();
  }

  // 페이지네이션 클릭
  const handlePageChange = (page) => {
    setPage(page - 1);
  };

  // 식물도감 클릭
  const getDetail = async (plantId) => {
    setIsDetailSearched(true);
    try {
      const { data } = await getPlant(plantId);
      console.log(data);
      setPlantDocsDetail(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 디테일 검색 초기화
  function goInit() {
    setIsDetailSearched(false);
  }

  // ----------------------------------- 레이아웃 -----------------------------------

  return (
    <AppLayout>
      <>
        <div className={`flex h-full`}>
          {/* 메인 */}
          <div className={`${styles.mainContainer} flex-col flex h-screen h-full w-3/5`}>
            <div className={`${styles.title} flex-none p-5`}>식물 도감</div>

            <div className={`${styles.search} flex-none w-full flex p-5 pb-1`}>
              <input
                className={`p-2 rounded-xl border-0 w-full`}
                style={{ backgroundColor: 'var(--thin-color)' }}
                type='text'
                placeholder={'검색'}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onKeyUp={handleKeyUp}
              />
              <div className={`absolute p-5`} style={{ right: '10px', top: '10px', color: 'var(--main-color)' }}>
                <span className='material-symbols-outlined'>search</span>
              </div>
            </div>

            {/* index 검색 */}
            <div className={`flex-none flex flex-wrap px-5`}>
              {indexList?.map((index) => (
                <div key={index}>
                  <button
                    className={`${styles.indexBtn} rounded-full px-3 mr-1 my-1 ${indexList[selectedIndex] === index ? 'text-white' : 'text-black'}`}
                    style={{ backgroundColor: indexList[selectedIndex] === index ? 'var(--main-color)' : '' }}
                    onClick={handleIndexBtnCLick}>
                    {index}
                  </button>
                </div>
              ))}
            </div>

            {/* 검색결과 */}
            {plantDocsList?.length === 0 ? (
              <div className={`p-5`}>조회된 식물이 없습니다</div>
            ) : (
              <div className={`grow flex flex-col p-5`}>
                {/* 데이터 */}
                {plantDocsList?.map((plantDocs) => (
                  <div key={plantDocs.plantId} className={` p-5 ${styles.item}`} onClick={() => getDetail(plantDocs.plantId)}>
                    <span>{plantDocs.plantName || <Skeleton />}</span>
                  </div>
                ))}
              </div>
            )}
            {/* 페이지네이션 */}
            <div className={`${styles.pagination} pb-10`}>
              <Pagination
                activePage={selectedIndex === null ? page + 1 : pageAtindex + 1}
                itemsCountPerPage={selectedIndex === null ? size : sizeAtindex}
                totalItemsCount={totalItemCount}
                pageRangeDisplayed={5}
                activeClass={styles.active}
                itemClass={styles.paginationItem}
                prevPageText={'<'}
                nextPageText={'>'}
                firstPageText={'≪'}
                lastPageText={'≫'}
                onChange={selectedIndex === null ? handlePageChange : handlePageAtindexChange}
              />
            </div>
          </div>

          {/* 사이드바 */}

          <div className={`${styles.sideContainer} lg:block hidden overflow-auto grow`}>
            {!isDetailSearched ? (
              // 디폴트 정보
              <div className={`flex flex-col`} style={{ paddingTop: '76px', marginRight: '20%' }}>
                {/* 인기 식물 */}
                <div className='pb-5'>
                  <div className='p-5'>
                    <span className={`text-xl font-bold pr-3`}>인기 식물</span>
                    <span>이번 주에 가장 많이 검색된 식물입니다</span>
                  </div>
                  <div className={`flex px-5 justify-between `}>
                    {topPlantList?.map((topPlant, index) => (
                      <div
                        key={topPlant.plantId}
                        className={`overflow-hidden relative ${styles.topPlantImage}`}
                        onClick={() => getDetail(topPlant.plantId)}>
                        <div>
                          {isLoadingErrorAtTopPlant[index] && <Skeleton width={100} height={100} />}
                          <img
                            className={`${styles.img}`}
                            src={`${topPlant.imagePath}`}
                            width={100}
                            height={100}
                            onLoad={() => handleImageLoadAtTopPlant(index)}
                            onError={() => handleImageErrorAtTopPlant(index)}
                            style={{ display: isLoadingErrorAtTopPlant[index] ? 'none' : 'block', width: '100px', height: '100px' }}
                          />
                        </div>

                        <div className={`${styles.gradation} flex items-end pl-3 pb-2 text-white`}>
                          <span>{topPlant.plantName || <Skeleton />} </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 인기 관찰일지 */}
                {nickname ? (
                  <div className='pb-5'>
                    <div className='p-5'>
                      <span className={`text-xl font-bold pr-3`}>인기 관찰일지</span>
                      <span>사용자에게 인기 있는 관찰일지입니다</span>
                    </div>
                    <div className={`flex px-5 justify-around `}>
                      {topDiarySetList?.map((topDiarySet, index) => (
                        <div key={topDiarySet.diarySetId} className={`overflow-hidden relative ${styles.topDiarySetImage}`}>
                          <Link href={`/diaryset/list/${topDiarySet.diarySetId}`}>
                            <div>
                              <div>
                                {isLoadingErrorAtTopDiarySet[index] && <Skeleton width={150} height={150} />}
                                <img
                                  className={`${styles.img}`}
                                  src={`${topDiarySet.imagePath}`}
                                  width={150}
                                  height={150}
                                  onLoad={() => handleImageLoadAtTopDiarySet(index)}
                                  onError={() => handleImageErrorAtTopDiarySet(index)}
                                  style={{ display: isLoadingErrorAtTopDiarySet[index] ? 'none' : 'block', width: '150px', height: '150px' }}
                                />
                              </div>
                            </div>
                            <div className={`${styles.gradation} flex items-end pl-5 pb-4 text-white`}>
                              <span>{topDiarySet.title || <Skeleton width={150} />}</span>
                            </div>
                          </Link>
                          <br />
                          {/* <span>시작일 : {topDiarySet.startDate || <Skeleton width={150} />}</span> */}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {/* 나와 같은 식물을 키우는 유저 */}
                {nickname ? (
                  <div>
                    <div className={`p-5`}>
                      <span className={`text-xl font-bold`}>나와 같은 식물을 키우는 사람들 </span> <br />
                    </div>
                    <div className={`flex justify-around`}>
                      {samePlantUserList?.map((samPlantUser, index) => (
                        <div key={samPlantUser.nickname} className={`overflow-hidden`} style={{ borderRadius: '75px' }}>
                          <Link href={`/user/feed/${samPlantUser.nickname}`}>
                            {userProfileList[index] == 'temp' ? (
                              <Skeleton width={150} height={150} />
                            ) : (
                              <img
                                className={`${styles.img}`}
                                src={userProfileList[index]}
                                width={150}
                                height={150}
                                onLoad={() => handleImageLoadAtSamePlantUser(index)}
                                onError={() => handleImageErrorAtSamePlantUser(index)}
                                style={{ display: isLoadingErrorAtSamePlantUser[index] ? 'none' : 'block', width: '150px', height: '150px' }}
                              />
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : plantDocsList?.length === 0 ? (
              <div className={`p-5`}>조회된게 없어요</div>
            ) : (
              // 식물 도감 상세 검색
              <div className={`flex flex-col `}>
                {/* 헤더 */}
                <div className='p-5 '>
                  <div className='flex items-center text-2xl font-bold'>
                    <span className='material-symbols-outlined' style={{ cursor: 'pointer' }} onClick={goInit}>
                      arrow_back_ios
                    </span>
                    <span>식물 상세 정보</span>
                  </div>
                </div>
                {/* 컨텐츠 */}
                <div className='p-5'>
                  <div key={plantDocsDetail?.plantId} className={`flex flex-col`}>
                    {/* 사진 */}
                    <div className={`flex mb-10 overflow-hidden`}>
                      {isLoadingErrorAtPlantDetail && <Skeleton width={300} height={300} />}
                      <img
                        src={plantDocsDetail?.imagePath}
                        width={300}
                        height={300}
                        onLoad={() => handleImageLoadAtPlantDetail()}
                        onError={() => handleImageErrorAtPlantDetail()}
                        style={{ display: isLoadingErrorAtPlantDetail ? 'none' : 'block' }}
                      />
                    </div>
                    {/* 정보 */}
                    <div className='flex flex-col'>
                      <div className='text-sm'>
                        <span>이름</span>
                      </div>
                      <div className='pb-2'>
                        <span>{plantDocsDetail?.plantName || <Skeleton width={300} />}</span>
                      </div>
                      <div className='text-sm'>
                        <span>학명</span>
                      </div>
                      <div className='pb-10'>
                        <span>{plantDocsDetail?.specificName || <Skeleton width={300} />}</span>
                      </div>
                    </div>
                    {/* 가이드 */}
                    <div>
                      <div className='flex items-center text-xl'>
                        <span style={{ color: 'var(--main-color)' }}>가이드 </span>
                        <span className='px-3'>💡</span>
                      </div>
                      <div className='flex flex-col'>
                        {plantDocsDetail?.water ? (
                          <div
                            className='my-5 p-3 text-white'
                            style={{ borderRadius: '30px', backgroundColor: 'var(--main-color)', display: 'inline-block', width: 'fit-content' }}>
                            <span>{plantDocsDetail?.water}</span>
                          </div>
                        ) : (
                          <Skeleton width={300} />
                        )}
                        {plantDocsDetail?.light ? (
                          <div
                            className='my-5 p-3 text-white'
                            style={{ borderRadius: '30px', backgroundColor: 'var(--main-color)', display: 'inline-block', width: 'fit-content' }}>
                            <span>{plantDocsDetail?.light}</span>
                          </div>
                        ) : (
                          <Skeleton width={300} />
                        )}
                        {plantDocsDetail?.temperature ? (
                          <div
                            className='my-5 p-3 text-white'
                            style={{ borderRadius: '30px', backgroundColor: 'var(--main-color)', display: 'inline-block', width: 'fit-content' }}>
                            <span>{plantDocsDetail?.temperature}</span>
                          </div>
                        ) : (
                          <Skeleton width={300} />
                        )}
                        {plantDocsDetail?.humidity ? (
                          <div
                            className='my-5 p-3 text-white'
                            style={{ borderRadius: '30px', backgroundColor: 'var(--main-color)', display: 'inline-block', width: 'fit-content' }}>
                            <span>{plantDocsDetail?.humidity}</span>
                          </div>
                        ) : (
                          <Skeleton width={300} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </AppLayout>
  );
}
