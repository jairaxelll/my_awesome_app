import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface PieChartCardProps {
  title: string;
  data: {
    name: string;
    value: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }[];
}

export const PieChartCard: React.FC<PieChartCardProps> = ({ title, data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <PieChart
        data={data}
        width={screenWidth - 56}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
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
});


