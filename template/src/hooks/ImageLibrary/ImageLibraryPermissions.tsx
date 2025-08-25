import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';

export function useImagePickerPermission() {
  const [status, setStatus] = useState<PermissionStatus>('unavailable');

  const getPermissionType = ():
    | typeof PERMISSIONS.IOS.PHOTO_LIBRARY
    | typeof PERMISSIONS.ANDROID.READ_MEDIA_IMAGES => {
    if (Platform.OS === 'ios') return PERMISSIONS.IOS.PHOTO_LIBRARY;
    return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
  };

  const checkPermission = useCallback(async (): Promise<PermissionStatus> => {
    const result = await check(getPermissionType());
    setStatus(result);
    return result;
  }, []);

  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    const result = await request(getPermissionType());
    setStatus(result);

    if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
      Alert.alert(
        'Photos Permission Required',
        'This feature needs access to your photos. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
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
