declare module 'expo-router' {
  import { ComponentType } from 'react';

  export const Stack: {
    Screen: ComponentType<any>;
  };

  export type Stack = {
    push: (route: string) => void;
    replace: (route: string) => void;
    back: () => void;
  };

  export function useRouter(): Stack;

  export function usePathname(): string;
  
  export function useSegments(): string[];

  export function useLocalSearchParams<T = Record<string, string>>(): T;

  export function Link(props: any): JSX.Element;

  export function Redirect(props: { href: string }): JSX.Element;
} 