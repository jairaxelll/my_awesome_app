import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { calendarStyles } from '../../styles/calendar';
import { Task } from '../../types';
import { formatDate, getTaskStatusIcon } from '../../utils/helpers';

interface CalendarTabProps {
  tasks: Task[];
  selectedDate: string;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  tasks,
  selectedDate,
}) => {

  const todaysTasks = tasks.filter(task => 
    new Date(task.dueDate).toDateString() === new Date(selectedDate).toDateString() &&
    task.status !== 'completed'
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={calendarStyles.calendarHeader}>
        <Text style={calendarStyles.calendarTitle}>📅 Calendar View</Text>
        <Text style={calendarStyles.calendarDate}>{formatDate(selectedDate)}</Text>
      </View>
      <ScrollView style={calendarStyles.calendarContent}>
        <View style={calendarStyles.calendarSection}>
          <Text style={calendarStyles.calendarSectionTitle}>Due Today</Text>
          {todaysTasks.map(task => (
            <View key={task.id} style={calendarStyles.calendarItem}>
              <Text style={calendarStyles.calendarItemIcon}>{getTaskStatusIcon(task.status)}</Text>
              <View style={calendarStyles.calendarItemContent}>
                <Text style={calendarStyles.calendarItemTitle}>{task.title}</Text>
                <Text style={calendarStyles.calendarItemSubtitle}>Priority: {task.priority}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
