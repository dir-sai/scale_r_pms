declare module 'expo-secure-store' {
  export interface SecureStoreOptions {
    keychainService?: string;
    keychainAccessible?: string;
  }

  export function setItemAsync(
    key: string,
    value: string,
    options?: SecureStoreOptions
  ): Promise<void>;

  export function getItemAsync(
    key: string,
    options?: SecureStoreOptions
  ): Promise<string | null>;

  export function deleteItemAsync(
    key: string,
    options?: SecureStoreOptions
  ): Promise<void>;

  export function isAvailableAsync(): Promise<boolean>;
}