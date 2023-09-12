import * as posenet from '@tensorflow-models/posenet';
// Sample_Image.js

// 异步函数用于从图像元素中估算姿态
async function estimateImagePose(imageElement) {
  const net = await posenet.load();
  const pose = await net.estimateSinglePose(imageElement);
  return pose;
}

// 函数用于将关键点绘制到 div 容器上
function drawKeypointsToDiv(points, container, image) {
// 清空容器
  //container.innerHTML = "";
  const keypoints = container.querySelectorAll('.keypoint');
  keypoints.forEach(el => el.remove());
//  const containerWidth = container.offsetWidth;
//  const containerHeight = container.offsetHeight;
  const rect = container.getBoundingClientRect();
  const containerWidth = rect.width;
  const containerHeight = rect.height;
  const imageOriginalWidth = image.naturalWidth;
  const imageOriginalHeight = image.naturalHeight;

  const scaleFactorX = containerWidth / imageOriginalWidth;
  const scaleFactorY = containerHeight / imageOriginalHeight;

  console.log("drawKeypointsToDiv scaleFactor",scaleFactorX,scaleFactorY);
  console.log("drawKeypointsToDiv Expected container dimensions: 480x302");
  console.log("drawKeypointsToDiv Actual container dimensions:", containerWidth, "x", containerHeight);

  points.forEach(point => {
    var p = document.createElement('div');
    p.classList.add('point', 'keypoint');
    p.classList = 'point';
    p.style.left = point.position.x * scaleFactorX + 'px';
    p.style.top = point.position.y * scaleFactorY + 'px';
    container.appendChild(p);
  });

  console.log("container",container);
}

// 函数用于绘制骨架线条
function drawSkeletonToDiv(keypoints, adjacentKeyPoints, container,image) {
// 清空容器
  //container.innerHTML = "";
  const segments = container.querySelectorAll('.segment');
  segments.forEach(el => el.remove());

  const rect = container.getBoundingClientRect();
  const containerWidth = rect.width;
  const containerHeight = rect.height;

  const imageOriginalWidth = image.naturalWidth;
  const imageOriginalHeight = image.naturalHeight;

  const scaleFactorX = containerWidth / imageOriginalWidth;
  const scaleFactorY = containerHeight / imageOriginalHeight;
  console.log("drawSkeletonToDivscaleFactor",scaleFactorX,scaleFactorY);
  console.log("drawSkeletonToDiv Expected container dimensions: 480x302");
  console.log("drawSkeletonToDiv Actual container dimensions:", containerWidth, "x", containerHeight);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      keypoints[0].position,
      keypoints[1].position,
      container,
      scaleFactorX,
      scaleFactorY
    );
  });
  console.log("container",container);
}

// 函数用于绘制单个线段
function drawSegment(start, end, container,scaleFactorX, scaleFactorY) {
   const line = document.createElement('div');
   line.classList.add('line', 'segment');
//  const distance = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
//  const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
   const adjustedStartX = start.x * scaleFactorX;
   const adjustedStartY = start.y * scaleFactorY;
   const adjustedEndX = end.x * scaleFactorX;
   const adjustedEndY = end.y * scaleFactorY;

   const distance = Math.sqrt((adjustedEndX - adjustedStartX) ** 2 + (adjustedEndY - adjustedStartY) ** 2);
   const angle = Math.atan2(adjustedEndY - adjustedStartY, adjustedEndX - adjustedStartX) * 180 / Math.PI;

//   line.style.width = distance + "px";
//   line.style.left = start.x + "px";
//   line.style.top = start.y + "px";
//   line.style.transform = "rotate(" + angle + "deg)";
//   line.classList = 'line';
   line.style.width = distance + "px";
   line.style.left = adjustedStartX + "px";
   line.style.top = adjustedStartY + "px";
   line.style.transform = "rotate(" + angle + "deg)";
   line.classList = 'line';
   container.appendChild(line);
}

// 导出函数以供外部使用
export { estimateImagePose, drawKeypointsToDiv, drawSkeletonToDiv };
