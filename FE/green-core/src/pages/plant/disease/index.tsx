import React, { Component } from 'react';
import Header from '@/components/ai/Homepage/Header';
import UploadPopup from '@/components/ai/Popup/UploadPopup';
import ResultPage from '@/components/ai/ResultPage/ResultPage';
import * as tf from '@tensorflow/tfjs';
import class_indices from '@/../public/models/plant_disease_tfjs/class_indices.json';
import AppLayout from '@/layout/AppLayout';

class Homepage extends Component {
  state = {
    showTryNow: false,
    showPrediction: false,
    image: null,
    tfModel: null,
    labels: {},
  };

  async componentDidMount() {
    let labels = class_indices;

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

      const fileNames: Array<any> = ['model.json', ...weightPaths.map((path) => path.split('/').pop())];

      const fileLastModified = new Date().getTime();

      const filesWithMetadata = files.map((file, i) => new File([file], fileNames[i], { lastModified: fileLastModified }));

      const tfModel = await tf.loadLayersModel(tf.io.browserFiles(filesWithMetadata));

      return tfModel;
    }

    const tfModel = await loadModel();

    // tfModel.summary();
    this.setState({
      labels,
      tfModel,
    });
  }

  tryNowClickHandler = () => {
    this.setState({
      showTryNow: true,
    });
  };

  tryNowCloseHandler = () => {
    this.setState({
      showTryNow: false,
    });
  };

  resultPageCloseHandler = () => {
    this.setState({
      showPrediction: false,
      image: null,
    });
  };

  tryAnotherClickHandler = () => {
    this.setState({
      showPrediction: false,
      image: null,
      showTryNow: true,
    });
  };

  imageSelectHandler = async (image: any) => {
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

    this.setState({
      showTryNow: false,
      showPrediction: true,
      image: base64,
    });
  };

  predictDisease = async () => {
    while (!this.state.tfModel) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
    }
    let img: any = document.getElementById('plant-photo');

    await new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(true);
      };
    });

    let offset = tf.scalar(255);
    let tensorImg = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    let tensorImg_scaled = tensorImg.div(offset);
    let prediction = await this.state.tfModel.predict(tensorImg_scaled).data();

    let predicted_class = tf.argMax(prediction);
    let class_idxs = Array.from(predicted_class.dataSync());

    const diseases = [];

    for (const class_idx of class_idxs) {
      const predictedDisease = this.state.labels[class_idx];
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

  render() {
    if (this.state.showTryNow) {
      return (
        <AppLayout>
          <UploadPopup onClose={this.tryNowCloseHandler} onCapture={this.imageSelectHandler} />;
        </AppLayout>
      );
    }

    if (this.state.showPrediction) {
      return (
        <AppLayout>
          <ResultPage
            image={this.state.image}
            getDiseases={this.predictDisease}
            onTryAnotherClick={this.tryAnotherClickHandler}
            onClose={this.resultPageCloseHandler}
          />
        </AppLayout>
      );
    }

    return (
      <>
        <AppLayout>
          <Header onTryNowClick={this.tryNowClickHandler} />
        </AppLayout>
      </>
    );
  }
}

export default Homepage;
