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

export default function Homepage() {
  const [showPrediction, setShowPrediction] = useState(false);
  const [image, setImage] = useState(null);
  const [tfModel, setTfModel] = useState(null);
  const [labels, setLabels] = useState<any>({});
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

    let predicted_class = tf.argMax(prediction);
    let class_idxs = Array.from(predicted_class.dataSync());

    const diseases = [];

    for (const class_idx of class_idxs as Array<number>) {
      const predictedDisease = labels[class_idx];
      let [name, disease] = predictedDisease.split('___');
      name = name.replaceAll('_', ' ');
      disease = disease.replaceAll('_', ' ');
      diseases.push({
        name,
        disease,
        // image: `https://coverimages.blob.core.windows.net/disease-cover-images/${predictedDisease}.JPG`,
        // cureURL: encodeURI(`https://www.google.com/search?q=How to cure ${disease} in ${name}`),
      });
    }

    return diseases;
  };

  return (
    <AppLayout>
      <div className='p-6 h-full'>
        <div className={`${styles.title}`}>병충해 분석</div>

        {showPrediction ? (
          <ResultPage image={image} getDiseases={predictDisease} onClose={resultPageCloseHandler} />
        ) : (
          <UploadPopup onClose={tryNowCloseHandler} onCapture={imageSelectHandler} />
        )}
      </div>
    </AppLayout>
  );
}
