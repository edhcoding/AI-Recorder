import { useCallback, useRef, useState } from 'react';
import { Camera } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

export default function useCamera(onTakePhoto: (imageDataUrl: string) => void) {
  const cameraRef = useRef<Camera | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const openCamera = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    console.log('permission', permission);

    if (permission === 'granted') {
      console.log('카메라 권한 획득 성공');
      setIsCameraOpen(true);
    } else {
      console.log('카메라 권한 획득 실패');
      setIsCameraOpen(false);
    }
  }, []);

  const closeCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      const file = await cameraRef.current?.takePhoto({
        flash: 'off',
      });

      if (file != null) {
        const base64Image = await RNFS.readFile(file.path, 'base64');
        const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
        onTakePhoto(imageDataUrl);
      }
    } catch (error) {
      console.error('사진 촬영 실패', error);
    }
  }, [onTakePhoto]);

  return {
    cameraRef,
    isCameraOpen,
    openCamera,
    closeCamera,
    takePhoto,
  };
}
