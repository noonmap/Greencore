import React from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { PlantType } from '../core/plant/plantType';
import styles from '@/components/FeedListItem.module.scss';

export default function SearchPlantListItem(props: { searchPlant: PlantType }) {
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
