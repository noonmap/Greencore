import { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import Header from './components/Header';
import UploadPopup from './components/UploadPopup';
import ResultPage from './components/ResultPage';
import * as tf from '@tensorflow/tfjs';
import class_indices from './class_indices.json';

function Homepage() {
  const [showTryNow, setShowTryNow] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [image, setImage] = useState(null);
  const [tfModel, setTfModel] = useState(null);
  const [labels, setLabels] = useState({});

  useEffect(() => {
    async function loadModel() {
      const modelUrl = '/models/plant_disease_tfjs/model.json';

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
  }, []);

  const tryNowClickHandler = () => {
    setShowTryNow(true);
  };

  const tryNowCloseHandler = () => {
    setShowTryNow(false);
  };

  const resultPageCloseHandler = () => {
    setShowPrediction(false);
    setImage(null);
  };

  const tryAnotherClickHandler = () => {
    setShowPrediction(false);
    setImage(null);
    setShowTryNow(true);
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

    setShowTryNow(false);
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
    let img = document.getElementById('plant-photo');

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