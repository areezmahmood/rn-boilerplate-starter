import { configurePersistable } from 'mobx-persist-store';
import { storage } from '../App';

configurePersistable({
  debugMode: __DEV__,
  storage: {
    setItem: (key, data) => {
      storage.setString(key, data);
      return Promise.resolve();
    },
    getItem: key => {
      const value = storage.getString(key);
      return value ?? null;
    },
    removeItem: key => {
      storage.removeItem(key);
      return Promise.resolve();
    },
  },
});
