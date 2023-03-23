import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/layout/AppLayout';
import { getPlantList, getPlantListByIndex, getPlant, getTopPlantList } from '@/core/plant/plantAPI';
import { getTopDiarySet } from '@/core/diarySet/diarySetAPI';
import { getSamePlantUserList } from '@/core/user/userAPI';

import { PlantType, SearchPlantDetailType } from '@/core/plant/plantType';
import { SearchDiarySetType } from '@/core/diarySet/diarySetType';
import { SearchUserType } from '@/core/user/userType';
import Pagination from 'react-js-pagination';
import styles from './plantDocs.module.scss';

export default function plantDocs() {
  // 인기식물, 인기 관찰일지, 나와 같은 식물을 키우는 사람들
  const [topPlantList, setTopPlantList] = useState<Array<PlantType>>([]);
  const [topDiarySetList, setTopDiarySetList] = useState<Array<SearchDiarySetType>>([]);
  const [samePlantUserList, setSamePlantUserList] = useState<Array<SearchUserType>>([]);

  // 식물도감 리스트 인덱스 검색
  const indexList = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [pageAtindex, setPageAtindex] = useState<number>(1);
  const [sizeAtindex, setSizeAtindex] = useState<number>(5);

  // 식물도감 이름 리스트 검색
  const [inputData, setInputData] = useState<string>(''); // 인풋데이터
  const [page, setPage] = useState<number>(1);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [size, setSize] = useState<number>(5);
  const [plantDocsList, setPlantDocsList] = useState<Array<PlantType>>([]);

  // 식물도감 디테일 조회
  const [plantDocsDetailList, setPlantDocsDetailList] = useState<Array<SearchPlantDetailType>>([]);
  const [isDetailSearched, setIsDetailSearched] = useState<boolean>(false);

  // ----------------------------------- 초기 데이터 -----------------------------------

  // init 훅
  useEffect(() => {
    fetchTopPlantList();
    fetchTopDiarySetList();
    fetchSamePlantUserList();
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
      fetchPlantListByIndex(1);
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
    } catch (error) {
      console.error(error);
    }
  }

  // 페이지네이션 클릭
  const handlePageAtindexChange = (pageAtindex) => {
    setPageAtindex(pageAtindex);
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
      setInputData(event.target.value);
      setSelectedIndex(null);
      fetchPlantList();
    }
  }

  // 페이지네이션 클릭
  const handlePageChange = (page) => {
    setPage(page);
  };

  // 식물도감 클릭
  const getDetail = async (plantId) => {
    setIsDetailSearched(true);
    try {
      const { data } = await getPlant(plantId);
      // console.log(data);
      setPlantDocsDetailList(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------------- 레이아웃 -----------------------------------

  return (
    <AppLayout>
      <>
        <div className={`grid grid-cols-2 gap-2`}>
          <div className={`overflow-auto`} style={{ height: '700px' }}>
            <h1>식물도감</h1>
            {/* index 검색 */}
            <div className={`flex flex-wrap`}>
              {indexList.map((index) => (
                <div key={index}>
                  <button
                    className={`rounded-full px-3 mr-1 my-1 ${indexList[selectedIndex] === index ? 'bg-green-700 text-white' : 'bg-green-300'}`}
                    onClick={handleIndexBtnCLick}>
                    {index}
                  </button>
                </div>
              ))}
            </div>
            {/* 식물도감 검색 */}
            <div className={`${styles.search} w-full flex`}>
              <input type='text' placeholder={'검색어를 입력하세요'} onKeyUp={handleKeyUp} />
              <img src='https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png' />
            </div>
            {/* 검색결과 */}
            {plantDocsList.length === 0 ? (
              <div className={`p-5`}>조회된 식물이 없습니다</div>
            ) : (
              <>
                {plantDocsList.map((plantDocs) => (
                  <div key={plantDocs.plantId} className={`bg-green-300 p-5 my-2`}>
                    <div onClick={() => getDetail(plantDocs.plantId)}>{plantDocs.plantName}</div>
                  </div>
                ))}
                <div className={`${styles.pagination}`}>
                  <Pagination
                    activePage={selectedIndex === null ? page : pageAtindex}
                    itemsCountPerPage={selectedIndex === null ? size : sizeAtindex}
                    totalItemsCount={totalItemCount}
                    pageRangeDisplayed={5}
                    activeClass={styles.active}
                    prevPageText={'‹'}
                    nextPageText={'›'}
                    onChange={selectedIndex === null ? handlePageChange : handlePageAtindexChange}
                  />
                </div>
              </>
            )}
          </div>
          <div className={`overflow-auto`} style={{ height: '700px' }}>
            {!isDetailSearched ? (
              <div className={`bg-green-300 p-5 my-2`}>
                {/* 인기 식물 */}
                <span className={`text-xl font-bold`}>인기 식물 </span>
                <span>이번 주 가장 많이 검색된 식물</span>
                <br />
                <div className={`flex`}></div>
                {topPlantList.map((topPlant) => (
                  <div key={topPlant.plantId} className={` pr-5  inline-block`}>
                    <img src={topPlant.imagePath} width={150} height={150} />
                  </div>
                ))}
                <br />
                <br />
                <br />
                {/* 인기 관찰일지 */}
                <span className={`text-xl font-bold`}>인기 관찰일지 </span>
                <span>이번 주 가장 많이 검색된 관찰일지</span>
                <br />
                <div className={`flex`}></div>
                {topDiarySetList.map((topDiarySet) => (
                  <div key={topDiarySet.diarySetId} className={`pr-5  inline-block`}>
                    <Link href={`/diarySet/${topDiarySet.diarySetId}`}>
                      <img src={topDiarySet.imagePath} width={200} height={200} style={{ width: '100%', height: '100%' }} />
                    </Link>
                    <span>{topDiarySet.title}</span>
                    <br />
                    <span>시작일 : {topDiarySet.startDate}</span>
                  </div>
                ))}
                <br />
                <br />
                <br />
                {/* 나와 같은 식물을 키우는 유저 */}
                <span className={`text-xl font-bold`}>나와 같은 식물을 키우는 사람들 </span> <br />
                <br />
                {samePlantUserList.map((samPlantUser) => (
                  <div key={samPlantUser.nickname} className={`pr-5  inline-block`}>
                    <Link href={`/user/feed/${samPlantUser.nickname}`}>
                      <img src={samPlantUser.profileImagePath} width={150} height={150} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : plantDocsList.length === 0 ? (
              <div className={`p-5`}>조회된게 없어요</div>
            ) : (
              // 식물 도감 상세 검색
              <div className={`bg-green-300 p-5 my-2`}>
                <span className={`text-xl font-bold`}>식물도감 상세조회</span>
                {plantDocsDetailList.map((plantDocsDetail) => (
                  <div key={plantDocsDetail.plantName} className={`bg-green-300`}>
                    <div>
                      <img className='mb-3' src={plantDocsDetail.imagePath} alt='image' width='300' height='300'></img>
                    </div>
                    <div>{plantDocsDetail.plantName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    </AppLayout>
  );
}
