// import React, { useEffect, useRef } from 'react';

// const CameraViewer = () => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     // 获取Wi-Fi摄像头的视频流
//     const getCameraStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error('Error accessing camera:', error);
//       }
//     };

//     // 调用获取视频流的函数
//     getCameraStream();

//     // 清理函数，关闭视频流
//     return () => {
//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject;
//         if (stream) {
//           const tracks = stream.getTracks();
//           tracks.forEach(track => track.stop());
//         }
//       }
//     };
//   }, []);
//   const baseStyle = {
//     width:'100vw'
//   }
//   return (
//     <div>
//       <h2>Wi-Fi Camera Viewer</h2>
//       <video style={baseStyle} ref={videoRef} autoPlay playsInline />
//     </div>
//   );
// };

// export default CameraViewer;
// CameraModal.js
import React from 'react';
import PropTypes from 'prop-types';

const CameraModal = ({ isOpen, close, camera1Ip, camera2Ip }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 999 }}>
      <div style={{ background: 'white', margin: '5% auto', padding: 20, position: 'relative', width: '80%', height: '80%', display: 'flex' }}>
        <div style={{ width: '50%', height: '100%', paddingRight: '10px' }}>
          <iframe
            src={`http://172.20.10.11`}
            title="Camera 1"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          ></iframe>
        </div>
        <div style={{ width: '50%', height: '100%', paddingLeft: '10px' }}>
          <iframe
            src={`http://127.0.0.1:5000`}
            title="Camera 2"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          ></iframe>
        </div>
        <button onClick={close} style={{ position: 'absolute', top: 20, right: 20, zIndex: 1001 }}>Close</button>
      </div>
    </div>
  );
};

CameraModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  camera1Ip: PropTypes.string.isRequired,
  camera2Ip: PropTypes.string.isRequired,
};

export default CameraModal;


