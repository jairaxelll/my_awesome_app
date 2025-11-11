import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { cardStyles } from '../../styles/cards';
import { Task } from '../../types';
import { getPriorityColor, getTaskStatusIcon, formatDate, isOverdue } from '../../utils/helpers';

interface TasksTabProps {
  tasks: Task[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTaskComplete: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  searchQuery,
  onSearchChange,
  onTaskComplete,
  onEditTask,
  onDeleteTask,
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="account" size={14} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={cardStyles.taskAssignee}>{item.assignedTo}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="calendar" size={14} color={isOverdue(item.dueDate) && item.status !== 'completed' ? '#dc2626' : '#64748b'} style={{ marginRight: 4 }} />
                <Text style={[
                  cardStyles.taskDueDate,
                  isOverdue(item.dueDate) && item.status !== 'completed' && cardStyles.overdueText
                ]}>
                  {formatDate(item.dueDate)}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
              {item.status !== 'completed' && (
                <TouchableOpacity
                  style={[cardStyles.completeButton, { flex: 1 }]}
                  onPress={() => onTaskComplete(item.id)}
                >
                  <Text style={cardStyles.completeButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              )}
              {onEditTask && (
                <TouchableOpacity
                  style={[cardStyles.completeButton, { backgroundColor: '#3b82f6', flex: 1 }]}
                  onPress={() => onEditTask(item)}
                >
                  <Text style={cardStyles.completeButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
              {onDeleteTask && (
                <TouchableOpacity
                  style={[cardStyles.completeButton, { backgroundColor: '#ef4444', flex: 1 }]}
                  onPress={() => onDeleteTask(item.id)}
                >
                  <Text style={cardStyles.completeButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
