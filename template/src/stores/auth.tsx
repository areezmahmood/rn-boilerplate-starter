import { makeAutoObservable } from 'mobx';
import { hydrateStore, makePersistable } from 'mobx-persist-store';

export class AuthStore implements IStore {
  token: string = '';
  expiresAt: string = '';
  deviceToken: string = '';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: AuthStore.name,
      properties: ['token', 'expiresAt', 'deviceToken'],
    });
  }

  logout = (): void => {
    this.setMany({
      token: '',
      expiresAt: '',
      deviceToken: '',
    });
  };

  set<T extends keyof AuthStore>(what: T, value: AuthStore[T]): void {
    (this as AuthStore)[what] = value;
  }

  setMany<T extends StoreKeysOf<AuthStore>>(
    obj: Record<T, AuthStore[T]>,
  ): void {
    for (const [k, v] of Object.entries(obj)) {
      this.set(k as T, v as AuthStore[T]);
    }
  }

  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
