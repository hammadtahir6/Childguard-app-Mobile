import React from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { Layout } from '../../constants/Layout';

export const GlassCard = ({ children, style, glowColor, ...props }: ViewProps & { glowColor?: string }) => {
  const { colors, mode } = useThemeStore();
  
  // Simulate glassmorphism with semi-transparent background and border
  const bgColor = mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.8)';

  return (
    <View 
      style={[
        { 
          borderRadius: Layout.radius.xl, 
          overflow: 'hidden', 
          borderWidth: 1, 
          borderColor: colors.BORDER,
          backgroundColor: bgColor,
          padding: Layout.spacing.md
        }, 
        glowColor ? { 
          shadowColor: glowColor, 
          shadowOffset: { width: 0, height: 4 }, 
          shadowOpacity: 0.3, 
          shadowRadius: 8,
          elevation: 4, // Adds shadow on Android
        } : {},
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};