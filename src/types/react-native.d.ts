declare module '@react-native/types' {
  import { ViewProps, View as RNView, ScrollViewProps, ScrollView as RNScrollView } from 'react-native'
  
  export const View: React.FC<ViewProps>
  export const ScrollView: React.FC<ScrollViewProps>
  export { StyleSheet } from 'react-native'
}

declare module '@react-native-material/core' {
  import { TextProps } from 'react-native'
  
  export interface CardProps {
    children?: React.ReactNode
    style?: any
  }
  
  export interface CardContentProps {
    children?: React.ReactNode
  }
  
  export interface TextVariantProps extends TextProps {
    variant?: 'headlineLarge' | 'headlineSmall' | 'titleMedium' | string
  }
  
  export const Card: React.FC<CardProps> & {
    Content: React.FC<CardContentProps>
  }
  
  export const Text: React.FC<TextVariantProps>
} 