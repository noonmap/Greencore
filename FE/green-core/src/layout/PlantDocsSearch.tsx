import React from 'react';
import { useAppDispatch } from '@/core/hooks';

import styles from './PlantDocsSearch.module.scss';

export default function PlantDocsSearch() {
  const dispatch = useAppDispatch();

  // <div className={`overflow-auto`} style={{ height: '700px' }}>
  //   {!isDetailSearched ? (
  //     <div className={`bg-green-300 p-5 my-2`}>
  //       {/* 인기 식물 */}
  //       <span className={`text-xl font-bold`}>인기 식물 </span>
  //       <span>이번 주 가장 많이 검색된 식물</span>
  //       <br />
  //       <div className={`flex`}></div>
  //       {topPlantList.map((topPlant) => (
  //         <div key={topPlant.plantId} className={` pr-5  inline-block`}>
  //           <img src={topPlant.imagePath} width={150} height={150} />
  //         </div>
  //       ))}
  //       <br />
  //       <br />
  //       <br />
  //       {/* 인기 관찰일지 */}
  //       <span className={`text-xl font-bold`}>인기 관찰일지 </span>
  //       <span>이번 주 가장 많이 검색된 관찰일지</span>
  //       <br />
  //       <div className={`flex`}></div>
  //       {topDiarySetList.map((topDiarySet) => (
  //         <div key={topDiarySet.diarySetId} className={`pr-5  inline-block`}>
  //           <Link href={`/diarySet/${topDiarySet.diarySetId}`}>
  //             <img src={topDiarySet.imagePath} width={200} height={200} style={{ width: '100%', height: '100%' }} />
  //           </Link>
  //           <span>{topDiarySet.title}</span>
  //           <br />
  //           <span>시작일 : {topDiarySet.startDate}</span>
  //         </div>
  //       ))}
  //       <br />
  //       <br />
  //       <br />
  //       {/* 나와 같은 식물을 키우는 유저 */}
  //       <span className={`text-xl font-bold`}>나와 같은 식물을 키우는 사람들 </span> <br />
  //       <br />
  //       {samePlantUserList.map((samPlantUser) => (
  //         <div key={samPlantUser.nickname} className={`pr-5  inline-block`}>
  //           <Link href={`/user/feed/${samPlantUser.nickname}`}>
  //             <img src={samPlantUser.profileImagePath} width={150} height={150} />
  //           </Link>
  //         </div>
  //       ))}
  //     </div>
  //   ) : plantDocsList.length === 0 ? (
  //     <div className={`p-5`}>조회된게 없어요</div>
  //   ) : (
  //     // 식물 도감 상세 검색
  //     <div className={`bg-green-300 p-5 my-2`}>
  //       <span className={`text-xl font-bold`}>식물도감 상세조회</span>
  //       {plantDocsDetailList.map((plantDocsDetail) => (
  //         <div key={plantDocsDetail.plantName} className={`bg-green-300`}>
  //           <div>
  //             <img className='mb-3' src={plantDocsDetail.imagePath} alt='image' width='300' height='300'></img>
  //           </div>
  //           <div>{plantDocsDetail.plantName}</div>
  //         </div>
  //       ))}
  //     </div>
  //   )}
  // </div>
  return <></>;
}
