import { View, Text, ViewProps, TextProps } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

export const ThemedView = (props: ViewProps) => {
  const { colors } = useThemeStore();
  return <View {...props} style={[{ backgroundColor: colors.BG_PRIMARY }, props.style]} />;
};

export const ThemedText = (props: TextProps & { font?: 'inter' | 'mono', weight?: 'regular' | 'medium' | 'semibold' | 'bold' }) => {
  const { colors } = useThemeStore();
  const { font = 'inter', weight = 'regular', style, ...rest } = props;
  const fontFamily = font === 'mono' ? 'SpaceMono_400Regular' : `Inter_${weight.charAt(0).toUpperCase() + weight.slice(1)}`;
  
  return <Text {...rest} style={[{ color: colors.TEXT_PRIMARY, fontFamily }, style]} />;
};