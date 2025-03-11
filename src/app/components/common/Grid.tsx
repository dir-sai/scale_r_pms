import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, useWindowDimensions, DimensionValue } from 'react-native';
import { theme } from '../../theme/theme';

type ColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Breakpoint = keyof typeof theme.breakpoints;

interface ResponsiveColumnSize {
  xs?: ColumnSize;
  sm?: ColumnSize;
  md?: ColumnSize;
  lg?: ColumnSize;
  xl?: ColumnSize;
}

interface RowProps {
  children: React.ReactNode;
  spacing?: keyof typeof theme.spacing;
  style?: StyleProp<ViewStyle>;
}

interface ColProps {
  children: React.ReactNode;
  size?: ColumnSize | ResponsiveColumnSize;
  offset?: ColumnSize;
  style?: StyleProp<ViewStyle>;
}

export const Row: React.FC<RowProps> = ({
  children,
  spacing = 4,
  style,
}) => {
  return (
    <View style={[
      styles.row,
      { margin: -theme.spacing[spacing] / 2 },
      style,
    ]}>
      {children}
    </View>
  );
};

export const Col: React.FC<ColProps> = ({
  children,
  size = 12,
  offset = 0,
  style,
}) => {
  const windowDimensions = useWindowDimensions();
  const currentBreakpoint = Object.entries(theme.breakpoints)
    .reverse()
    .find(([_, breakpointWidth]) => windowDimensions.width >= breakpointWidth)?.[0] as Breakpoint || 'xs';

  const getColumnSize = () => {
    if (typeof size === 'number') {
      return size;
    }

    const breakpointOrder: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
    const breakpointIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    for (let i = breakpointIndex; i < breakpointOrder.length; i++) {
      const breakpoint = breakpointOrder[i];
      if (size[breakpoint]) {
        return size[breakpoint];
      }
    }

    return 12;
  };

  const columnSize = getColumnSize();
  const columnWidth = columnSize / 12;
  const columnOffset = offset > 0 ? offset / 12 : 0;

  return (
    <View style={[
      styles.col,
      {
        width: columnWidth * 100 + '%' as DimensionValue,
        marginLeft: columnOffset > 0 ? (columnOffset * 100 + '%' as DimensionValue) : 0,
      },
      style,
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  col: {
    padding: theme.spacing[4] / 2,
  },
}); 