type PureFunc = () => void;
interface IService {
  init: () => PVoid;
}

type PVoid = Promise<void>;
interface IStore {
  hydrate(): Promise<void>;
}
type StoreKeysOf<T> = keyof T;
type KeyboardType =
  | 'default'
  | 'number-pad'
  | 'decimal-pad'
  | 'numeric'
  | 'email-address'
  | 'phone-pad'
  | 'url';

type PhotoFile = {
  uri: string;
  name: string;
  type: string;
};
