import React, { useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { ThemedText } from '../../components/ui/ThemedText';
import { ThemedView } from '../../components/ui/ThemedView';
import { GlassCard } from '../../components/ui/GlassCard';
import { useThemeStore } from '../../store/themeStore';
import { useChildrenStore } from '../../store/childrenStore';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

const screenWidth = Dimensions.get('window').width;

// Generate realistic mock data with SMART LABELS
const generateMockData = (period: string, baseValue: number, variance: number) => {
  let dataPoints: number[] = [];
  let labels: string[] = [];
  
  const configs: Record<string, { count: number; labelStep: number; labelFormat: (i: number) => string }> = {
    '1H': { count: 12, labelStep: 2, labelFormat: (i) => `${i * 5}m` }, 
    '6H': { count: 12, labelStep: 2, labelFormat: (i) => `${i * 30}m` }, 
    '24H': { count: 24, labelStep: 3, labelFormat: (i) => `${i}h` }, // Shows every 3 hours now
    '7D': { count: 7, labelStep: 1, labelFormat: (i) => `D${i + 1}` }, 
    '30D': { count: 30, labelStep: 5, labelFormat: (i) => `D${i + 1}` }, 
  };
  
  const config = configs[period] || configs['24H'];
  
  for (let i = 0; i < config.count; i++) {
    const variation = (Math.random() - 0.5) * variance * 2;
    dataPoints.push(Math.round((baseValue + variation) * 10) / 10);
    
    if (i % config.labelStep === 0 || i === config.count - 1) {
      labels.push(config.labelFormat(i));
    } else {
      labels.push(""); 
    }
  }
  
  return { dataPoints, labels };
};

export default function HealthScreen() {
  const { colors } = useThemeStore();
  const { activeChildId, children } = useChildrenStore();
  const activeChild = children.find(c => c.id === activeChildId) || children[0];
  const [selectedPeriod, setSelectedPeriod] = useState('24H');
  
  const heartRateData = generateMockData(selectedPeriod, 85, 15);
  const spo2Data = generateMockData(selectedPeriod, 97, 2);
  const tempData = generateMockData(selectedPeriod, 36.5, 0.5);
  
  const periods = ['1H', '6H', '24H', '7D', '30D'];
  
  const baseChartConfig = {
    backgroundColor: colors.BG_SECONDARY,
    backgroundGradientFrom: colors.BG_SECONDARY,
    backgroundGradientTo: colors.BG_SECONDARY,
    decimalCount: 1,
    labelColor: (opacity = 1) => colors.TEXT_SECONDARY,
    style: { borderRadius: 16 },
    propsForBackgroundLines: { stroke: colors.BORDER, strokeDasharray: '4 4' },
    propsForLabels: { fontSize: 10, fontWeight: '600' },
  };

  const getStats = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    return { min, max, avg: Math.round(avg * 10) / 10 };
  };

  const hrStats = getStats(heartRateData.dataPoints);
  const spo2Stats = getStats(spo2Data.dataPoints);
  const tempStats = getStats(tempData.dataPoints);

  // Fixed wide width for scrolling
  const chartWidth = 600; 

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: colors.BG_PRIMARY }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}>
        
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <ThemedText weight="bold" style={{ fontSize: 28, color: colors.TEXT_PRIMARY, marginBottom: 4 }}>
            Health Report
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: colors.TEXT_SECONDARY }}>
            {activeChild.name}'s vitals overview
          </ThemedText>
        </View>

        {/* Time Period Selector */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period ? colors.ACCENT_TEAL : colors.BG_TERTIARY,
                  borderColor: selectedPeriod === period ? colors.ACCENT_TEAL : colors.BORDER,
                }
              ]}
            >
              <ThemedText 
                style={{ 
                  color: selectedPeriod === period ? '#FFF' : colors.TEXT_SECONDARY, 
                  fontSize: 13, 
                  fontWeight: '600' 
                }}
              >
                {period}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Heart Rate Chart */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
          <GlassCard style={{ padding: 20, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.DANGER + '20', justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="heart" size={22} color={colors.DANGER} />
                </View>
                <View>
                  <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Heart Rate</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>BPM over time</ThemedText>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>
                  {activeChild.vitals.heartRate}
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Current BPM</ThemedText>
              </View>
            </View>

            {/* Scrollable Chart Container */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              <LineChart
                data={{ labels: heartRateData.labels, datasets: [{ data: heartRateData.dataPoints }] }}
                width={chartWidth} // Wider than screen to enable scroll
                height={180}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                  ...baseChartConfig,
                  color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                  propsForDots: { r: '3', strokeWidth: '0', stroke: 'transparent' },
                }}
                bezier
                style={{ borderRadius: 16 }}
                fromZero={false}
              />
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.BORDER }}>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Min</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>{hrStats.min}</ThemedText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Avg</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: colors.ACCENT_TEAL }}>{hrStats.avg}</ThemedText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Max</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>{hrStats.max}</ThemedText>
              </View>
            </View>
          </GlassCard>
        </MotiView>

        {/* SpO2 Chart */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
          <GlassCard style={{ padding: 20, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#3B82F6' + '20', justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="pulse" size={22} color="#3B82F6" />
                </View>
                <View>
                  <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Blood Oxygen</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>SpO2 percentage</ThemedText>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>
                  {activeChild.vitals.spo2}%
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Current SpO2</ThemedText>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              <LineChart
                data={{ labels: spo2Data.labels, datasets: [{ data: spo2Data.dataPoints }] }}
                width={chartWidth}
                height={180}
                yAxisLabel=""
                yAxisSuffix="%"
                yAxisInterval={1}
                chartConfig={{
                  ...baseChartConfig,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  propsForDots: { r: '3', strokeWidth: '0', stroke: 'transparent' },
                }}
                bezier
                style={{ borderRadius: 16 }}
                fromZero={false}
              />
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.BORDER }}>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Min</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>{spo2Stats.min}%</ThemedText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Avg</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: '#3B82F6' }}>{spo2Stats.avg}%</ThemedText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Max</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>{spo2Stats.max}%</ThemedText>
              </View>
            </View>
          </GlassCard>
        </MotiView>

        {/* Temperature Chart */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
          <GlassCard style={{ padding: 20, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.WARNING + '20', justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="thermometer" size={22} color={colors.WARNING} />
                </View>
                <View>
                  <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Temperature</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: colors.TEXT_SECONDARY }}>Body temperature °C</ThemedText>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 24, color: colors.TEXT_PRIMARY }}>
                  {activeChild.vitals.temperature}°C
                </ThemedText>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Current Temp</ThemedText>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              <LineChart
                data={{ labels: tempData.labels, datasets: [{ data: tempData.dataPoints }] }}
                width={chartWidth}
                height={180}
                yAxisLabel=""
                yAxisSuffix="°"
                yAxisInterval={1}
                chartConfig={{
                  ...baseChartConfig,
                  color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                  propsForDots: { r: '3', strokeWidth: '0', stroke: 'transparent' },
                }}
                bezier
                style={{ borderRadius: 16 }}
                fromZero={false}
              />
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.BORDER }}>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Min</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>{tempStats.min}°</ThemedText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Avg</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: colors.WARNING }}>{tempStats.avg}°</ThemedText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <ThemedText style={{ fontSize: 11, color: colors.TEXT_SECONDARY }}>Max</ThemedText>
                <ThemedText font="mono" weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>{tempStats.max}°</ThemedText>
              </View>
            </View>
          </GlassCard>
        </MotiView>

        {/* Health Insights */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400 }}>
          <GlassCard style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Ionicons name="bulb" size={24} color={colors.ACCENT_TEAL} />
              <ThemedText weight="bold" style={{ fontSize: 16, color: colors.TEXT_PRIMARY }}>Health Insights</ThemedText>
            </View>
            
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.SUCCESS, marginTop: 6 }} />
                <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, lineHeight: 18, flex: 1 }}>
                  Heart rate is within normal range for {activeChild.name}'s age group.
                </ThemedText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.SUCCESS, marginTop: 6 }} />
                <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, lineHeight: 18, flex: 1 }}>
                  Blood oxygen levels are excellent, indicating good respiratory health.
                </ThemedText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.WARNING, marginTop: 6 }} />
                <ThemedText style={{ fontSize: 13, color: colors.TEXT_SECONDARY, lineHeight: 18, flex: 1 }}>
                  Temperature shows slight variation. Monitor if it continues rising.
                </ThemedText>
              </View>
            </View>
          </GlassCard>
        </MotiView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});