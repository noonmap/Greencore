import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { SearchPlantType } from '../core/plant/plantType';
import styles from '@/styles/feed.module.scss';

export default function SearchPlantListItem(props: { searchPlant: SearchPlantType }) {
  const searchPlant = props.searchPlant;

  return (
    <div key={searchPlant.plantId} className={`${styles.feedContainer} bg-green-300`}>
      <div>{searchPlant.plantId || <Skeleton />} </div>
      <div>{searchPlant.plantName || <Skeleton />} </div>
      <div>
        <Link href={`/profile/${searchPlant.plantId}`}>
          {searchPlant.imagePath ? <img src={searchPlant.imagePath} width={150} height={150} alt='' /> : <Skeleton width={150} height={150} />}
        </Link>
      </div>
    </div>
  );
}
