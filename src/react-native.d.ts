declare module 'react-native' {
  import * as React from 'react';

  export interface StyleProp<T> {
    [key: string]: any;
  }

  export interface ViewStyle {
    [key: string]: any;
  }

  export interface TextStyle {
    [key: string]: any;
  }

  export interface ImageStyle {
    [key: string]: any;
  }

  export interface PressableStateCallbackType {
    readonly pressed: boolean;
  }

  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const TextInput: React.ComponentType<any>;
  export const Image: React.ComponentType<any> & {
    prefetch: (url: string) => Promise<boolean>;
  };
  export const ImageBackground: React.ComponentType<any>;
  export const Pressable: React.ComponentType<any>;
  export const ScrollView: React.ComponentType<any>;
  export const FlatList: React.ComponentType<any>;
  export const SafeAreaView: React.ComponentType<any>;

  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
    flatten: (style: any) => any;
    hairlineWidth: number;
    absoluteFill: any;
    absoluteFillObject: any;
  };

  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    select: <T>(specifics: { [platform: string]: T }) => T;
  };

  export const StatusBar: {
    currentHeight?: number;
    setBarStyle: (style: 'default' | 'light-content' | 'dark-content') => void;
    setBackgroundColor: (color: string) => void;
  } & React.ComponentType<any>;

  export function useWindowDimensions(): {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  };

  export const Easing: any;

  export namespace Animated {
    export type Value = any;
    export type ValueXY = any;
  }

  export const Animated: {
    View: React.ComponentType<any>;
    Text: React.ComponentType<any>;
    Image: React.ComponentType<any>;
    ScrollView: React.ComponentType<any>;
    FlatList: React.ComponentType<any>;
    Value: any;
    timing: (value: any, config: any) => any;
    spring: (value: any, config: any) => any;
    sequence: (animations: any[]) => any;
    parallel: (animations: any[]) => any;
    multiply: (a: any, b: any) => any;
    event: (argMapping: any[], config?: any) => any;
  };

  export const PanResponder: {
    create: (config: any) => {
      panHandlers: any;
    };
  };
}
