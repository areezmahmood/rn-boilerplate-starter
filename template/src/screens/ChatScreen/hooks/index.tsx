import { toast } from '@backpackapp-io/react-native-toast';
import { errorCodes, isErrorWithCode } from '@react-native-documents/viewer';
import { useCallback } from 'react';
import { Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

export function useHandleError() {
  return useCallback((err: unknown) => {
    if (isErrorWithCode(err)) {
      switch (err.code) {
        case errorCodes.IN_PROGRESS:
          console.warn(
            'User attempted to present a picker, but a previous one was already presented',
          );
          break;
        case errorCodes.UNABLE_TO_OPEN_FILE_TYPE:
          toast.error('Unable to open this file type');
          break;
        case errorCodes.OPERATION_CANCELED:
          // ignore
          break;
        default:
          toast.error(String(err));
          console.error(err);
      }
    } else {
      toast.error(String(err));
    }
  }, []);
}
