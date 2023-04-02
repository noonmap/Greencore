import { useState, useEffect } from 'react';
import AppLayout from '@/layout/AppLayout';
import UploadPopup from '@/components/ai/Popup/UploadPopup';
import ResultPage from '@/components/ai/ResultPage/ResultPage';
import * as tf from '@tensorflow/tfjs';
import class_indices from '@/../public/models/plant_disease_tfjs/class_indices.json';
import styles from '@/styles/Plant.module.scss';
import { useAppDispatch } from '@/core/hooks';
import { SET_IS_SEARCH_STATE } from '@/core/common/commonSlice';
import { useRouter } from 'next/router';
import UploadGuideModal from '@/components/modal/UploadGuideModal';

export default function Homepage() {
  const [showPrediction, setShowPrediction] = useState(false);
  const [image, setImage] = useState(null);
  const [tfModel, setTfModel] = useState(null);
  const [labels, setLabels] = useState<any>({});
  const [isOpenGuideModal, setIsOpenGuideModal] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // searchState 변경
  function changeSearchState() {
    dispatch(SET_IS_SEARCH_STATE('default'));
  }

  useEffect(() => {
    async function loadModel() {
      // 모델 url
      const modelUrl = '/models/plant_disease_tfjs/model.json';

      // 모델 가중치 url
      const weightPaths = [
        '/models/plant_disease_tfjs/group1-shard1of4.bin',
        '/models/plant_disease_tfjs/group1-shard2of4.bin',
        '/models/plant_disease_tfjs/group1-shard3of4.bin',
        '/models/plant_disease_tfjs/group1-shard4of4.bin',
      ];

      const files = await Promise.all([
        fetch(modelUrl).then((response) => response.blob()),
        ...weightPaths.map((path) => fetch(path).then((response) => response.blob())),
      ]);

      const fileNames = ['model.json', ...weightPaths.map((path) => path.split('/').pop())];

      const fileLastModified = new Date().getTime();

      const filesWithMetadata = files.map((file, i) => new File([file], fileNames[i], { lastModified: fileLastModified }));

      const tfModel = await tf.loadLayersModel(tf.io.browserFiles(filesWithMetadata));

      return tfModel;
    }

    async function init() {
      const labels = class_indices;
      const tfModel = await loadModel();
      setLabels(labels);
      setTfModel(tfModel);
    }

    init();

    changeSearchState();
  }, []);

  const tryNowCloseHandler = () => {
    router.back();
  };

  const resultPageCloseHandler = () => {
    setShowPrediction(false);
    setImage(null);
  };

  const imageSelectHandler = async (image) => {
    const base64 = await new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(image);

      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });

    setShowPrediction(true);
    setImage(base64);
  };

  const predictDisease = async () => {
    while (!tfModel) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
    }
    let img = document.getElementById('plant-photo') as HTMLImageElement;

    await new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(true);
      };
    });

    let offset = tf.scalar(255);
    let tensorImg = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    let tensorImg_scaled = tensorImg.div(offset);
    let prediction = await tfModel.predict(tensorImg_scaled).data();

    const diseases: { [x: string]: number } = {};

    for (let i = 0; i < prediction.length; i++) {
      if (prediction[i] * 100 >= 10) {
        const predictedDisease = labels[i];
        let disease = predictedDisease.split('___')[1];
        disease = disease.replaceAll('_', ' ');
        if (!(disease in diseases)) {
          diseases[disease] = 0;
        }
        diseases[disease] += prediction[i] * 100;
      }
    }
    if ('건강함' in diseases && diseases['건강함'] < 50) {
      delete diseases['건강함'];
    }

    return diseases;
  };

  return (
    <AppLayout>
      {isOpenGuideModal && (
        <UploadGuideModal isOpen={isOpenGuideModal} modalTitle='이미지 업로드 가이드' handleModalClose={() => setIsOpenGuideModal(false)} />
      )}
      <div className='p-6 h-full'>
        <div className={`${styles.title}`}>병충해 분석</div>
        <div className='flex justify-center'>
          <div className='w-2/3 flex justify-end'>
            <span className={`${styles.guide}`} onClick={() => setIsOpenGuideModal(true)}>
              이미지 업로드 가이드
            </span>
          </div>
        </div>
        {showPrediction ? (
          <ResultPage image={image} getDiseases={predictDisease} onClose={resultPageCloseHandler} />
        ) : (
          <UploadPopup onClose={tryNowCloseHandler} onCapture={imageSelectHandler} />
        )}
      </div>
    </AppLayout>
  );
}
