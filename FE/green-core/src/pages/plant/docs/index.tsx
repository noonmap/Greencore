import React, { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import { getPlantList, getPlantListByIndex, getPlant } from '@/core/plant/plantAPI';
import { SearchPlantType, SearchPlantDetailType } from '@/core/plant/plantType';
import Pagination from 'react-js-pagination';
import styles from './plantDocs.module.scss';

export default function plantDocs() {
  const [inputData, setInputData] = useState<string>(''); // 인풋데이터

  // 리스트 조회
  const [page, setPage] = useState<number>(1);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [size, setSize] = useState<number>(5);
  const [plantDocsList, setPlantDocsList] = useState<Array<SearchPlantType>>([]);

  // 디테일 조회
  const [plantDocsDetailList, setPlantDocsDetailList] = useState<Array<SearchPlantDetailType>>([]);
  const [isDetailSearched, setIsDetailSearched] = useState<boolean>(false);

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
      console.log(error);
    }
  }

  // 검색
  async function handleKeyUp(event) {
    if (event.key === 'Enter') {
      setInputData(event.target.value);

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
      console.log(error);
    }
  };
  // ----------------------------------------------------------------

  return (
    <AppLayout>
      <>
        <div className={`grid grid-cols-2 gap-2`}>
          <div className={`overflow-auto`} style={{ height: '700px' }}>
            <h1>식물도감</h1>
            {/* 검색 */}
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
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={totalItemCount}
                    pageRangeDisplayed={5}
                    prevPageText={'‹'}
                    nextPageText={'›'}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
          <div className={`overflow-auto`} style={{ height: '700px' }}>
            <h1>상세조회</h1>

            {!isDetailSearched ? (
              <div className={`bg-green-300 p-5 my-2`}>검색전입니다 요기는 인기식물이 들어갈 자리에오</div>
            ) : plantDocsList.length === 0 ? (
              <div className={`p-5`}>조회된게 없어요</div>
            ) : (
              <>
                {plantDocsDetailList.map((plantDocsDetail) => (
                  <div key={plantDocsDetail.plantName} className={`bg-green-300 p-5 my-2`}>
                    <div>
                      <img className='mb-3' src={plantDocsDetail.imagePath} alt='image' width='300' height='300'></img>
                    </div>
                    <div>{plantDocsDetail.plantName}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    </AppLayout>
  );
}
