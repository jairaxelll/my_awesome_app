import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface LineChartCardProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

export const LineChartCard: React.FC<LineChartCardProps> = ({ title, data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={data}
        width={screenWidth - 56}
        height={220}
        chartConfig={{
          backgroundColor: '#ec4899',
          backgroundGradientFrom: '#ec4899',
          backgroundGradientTo: '#db2777',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#fff',
          },
        }}
        bezier
        style={styles.chart}
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
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#ec4899',
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


