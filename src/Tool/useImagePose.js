import { useState, useEffect, useContext } from 'react';
import * as posenet from '@tensorflow-models/posenet';

// 自定义钩子：用于获取图像的姿态
function useImagePose(showIndex, imageRefs) {
  const [imagePose, setImagePose] = useState(null);
  const [net, setNet] = useState(null);

  // 加载 PoseNet 模型
  useEffect(() => {
    async function loadPoseNetModel() {
      const model = await posenet.load();
      setNet(model);
    }
    loadPoseNetModel();
  }, []);

  // 当 showIndex 或 PoseNet 模型更改时，获取新的图像姿态
  useEffect(() => {
    async function estimatePoseFromImage() {
      const now = new Date();
      let formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace
      (/:/g, '');
      console.log("estimatePoseFromImage Start : ", formattedTime);
      if (net && imageRefs && imageRefs[showIndex]) {
        const imageElement = imageRefs[showIndex].current;
        if (imageElement) {
          const pose = await net.estimateSinglePose(imageElement);
          setImagePose(pose);
          formattedTime = now.toISOString().slice(2, 10).replace(/-/g, '') + now.toTimeString().slice(0, 8).replace(/:/g, '');
          console.log("estimatePose pose : ", formattedTime);
        }
      }
    }
    estimatePoseFromImage();
  }, [showIndex, net, imageRefs]);

  return imagePose;
}

export default useImagePose;
