import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface BarChartCardProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export const BarChartCard: React.FC<BarChartCardProps> = ({ title, data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={data}
        width={screenWidth - 56}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#10b981',
          backgroundGradientFrom: '#10b981',
          backgroundGradientTo: '#059669',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
          },
        }}
        style={styles.chart}
        showValuesOnTopOfBars
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 18,
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#10b981',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});


