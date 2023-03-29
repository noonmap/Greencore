import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { PlantType } from '../core/plant/plantType';
import styles from '@/components/SearchPlantListItem.module.scss';

export default function SearchPlantListItem(props: { searchPlant: PlantType }) {
  const searchPlant = props.searchPlant;

  return (
    <div key={searchPlant.plantId} className={`${styles.container} p-5 flex`}>
      {/* <div>{searchPlant.plantId || <Skeleton />} </div> */}
      <div className='rounded-xl overflow-hidden mr-5'>
        {searchPlant.imagePath ? <img src={searchPlant.imagePath} width={150} height={150} alt='' /> : <Skeleton width={150} height={150} />}
      </div>
      <div className='flex flex-col'>
        <div>{searchPlant.plantName || <Skeleton />} </div>
        <div>추가정보</div>
      </div>
    </div>
  );
}
