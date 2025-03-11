import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../theme/theme';

export type IconName = keyof typeof MaterialIcons.glyphMap;
export type IconSize = keyof typeof theme.icons.size;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const featureIcons: Record<string, IconName> = {
  properties: 'apartment',
  tenants: 'people',
  maintenance: 'build',
  payments: 'payments',
  reports: 'assessment',
  settings: 'settings',
  documents: 'description',
  calendar: 'event',
  notifications: 'notifications',
  chat: 'chat',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = theme.colors.text.primary,
  style,
}) => {
  return (
    <MaterialIcons
      name={name}
      size={theme.icons.size[size]}
      color={color}
      style={style}
    />
  );
};

export const getFeatureIcon = (feature: keyof typeof featureIcons) => {
  return featureIcons[feature] || 'help-outline';
}; 