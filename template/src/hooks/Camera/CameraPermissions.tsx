// src/hooks/useCameraPermission.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';

export function useCameraPermission() {
  const [status, setStatus] =
    useState<CameraPermissionStatus>('not-determined');

  const checkPermission =
    useCallback(async (): Promise<CameraPermissionStatus> => {
      const current = await Camera.getCameraPermissionStatus();
      setStatus(current);
      return current;
    }, []);

  const requestPermission =
    useCallback(async (): Promise<CameraPermissionStatus> => {
      const result = await Camera.requestCameraPermission();
      setStatus(result);

      if (result === 'denied') {
        Alert.alert(
          'Camera Permission Required',
          'This feature needs camera access. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }

      return result;
    }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { status, checkPermission, requestPermission };
}
