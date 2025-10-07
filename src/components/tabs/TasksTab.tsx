import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { cardStyles } from '../../styles/cards';
import { Task } from '../../types';
import { getPriorityColor, getTaskStatusIcon, formatDate, isOverdue } from '../../utils/helpers';

interface TasksTabProps {
  tasks: Task[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTaskComplete: (taskId: string) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  searchQuery,
  onSearchChange,
  onTaskComplete,
}) => {
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={cardStyles.searchContainer}>
        <TextInput
          style={cardStyles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            cardStyles.taskCard,
            isOverdue(item.dueDate) && item.status !== 'completed' && cardStyles.overdueCard
          ]}>
            <View style={cardStyles.taskHeader}>
              <View style={cardStyles.taskTitleRow}>
                <Text style={cardStyles.taskStatusIcon}>{getTaskStatusIcon(item.status)}</Text>
                <Text style={cardStyles.taskTitle}>{item.title}</Text>
              </View>
              <View style={[cardStyles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                <Text style={cardStyles.priorityText}>{item.priority}</Text>
              </View>
            </View>
            <Text style={cardStyles.taskDescription}>{item.description}</Text>
            <View style={cardStyles.taskFooter}>
              <Text style={cardStyles.taskAssignee}>👤 {item.assignedTo}</Text>
              <Text style={[
                cardStyles.taskDueDate,
                isOverdue(item.dueDate) && item.status !== 'completed' && cardStyles.overdueText
              ]}>
                📅 {formatDate(item.dueDate)}
              </Text>
            </View>
            {item.status !== 'completed' && (
              <TouchableOpacity
                style={cardStyles.completeButton}
                onPress={() => onTaskComplete(item.id)}
              >
                <Text style={cardStyles.completeButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
