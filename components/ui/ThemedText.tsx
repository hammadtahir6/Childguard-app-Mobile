import { Text, TextProps } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

export const ThemedText = (props: TextProps & { font?: 'inter' | 'mono', weight?: 'regular' | 'medium' | 'semibold' | 'bold' }) => {
  const { colors } = useThemeStore();
  const { font = 'inter', weight = 'regular', style, ...rest } = props;
  
  // Map our simple weights to the exact font names loaded in _layout.tsx
  const weightMap: Record<string, string> = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  };
  
  const fontFamily = font === 'mono' ? 'SpaceMono_400Regular' : weightMap[weight];
  
  return <Text {...rest} style={[{ color: colors.TEXT_PRIMARY, fontFamily }, style]} />;
};