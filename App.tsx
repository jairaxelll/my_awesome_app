import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
  Animated,
  ListRenderItem,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState<string>('');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);

  const loadTasks = async (): Promise<void> => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = (): void => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa una tarea');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: inputText.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputText('');
  };

  const toggleTaskComplete = (taskId: string): void => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId: string): void => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== taskId));
          },
        },
      ]
    );
  };

  const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const [slideAnim] = useState(new Animated.Value(0));

    const handleLongPress = (): void => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const handlePress = (): void => {
      (slideAnim as any)._value = (slideAnim as any)._value || 0;
      
      if ((slideAnim as any)._value < 0) {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        toggleTaskComplete(task.id);
      }
    };

    return (
      <View style={styles.taskItemContainer}>
        <Animated.View
          style={[
            styles.taskItem,
            task.completed && styles.taskItemCompleted,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <TouchableOpacity
            style={styles.taskContent}
            onPress={handlePress}
            onLongPress={handleLongPress}
            activeOpacity={0.7}
          >
            <View style={styles.taskTextContainer}>
              <Text
                style={[
                  styles.taskText,
                  task.completed && styles.taskTextCompleted
                ]}
              >
                {task.title}
              </Text>
              <Text style={styles.taskStatus}>
                {task.completed ? '✅ Completada' : '⏳ Pendiente'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(task.id)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getStats = (): Stats => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const renderTask: ListRenderItem<Task> = ({ item }) => (
    <TaskItem task={item} />
  );

  const stats = getStats();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Lista de Tareas</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Total: {stats.total} | Completadas: {stats.completed} | Pendientes: {stats.pending}
          </Text>
        </View>
      </View>

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe una nueva tarea..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, inputText.trim() === '' && styles.addButtonDisabled]}
          onPress={addTask}
          disabled={inputText.trim() === ''}
        >
          <Text style={styles.addButtonText}>➕ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>🎯</Text>
          <Text style={styles.emptyStateTitle}>¡No hay tareas aún!</Text>
          <Text style={styles.emptyStateSubtitle}>Agrega tu primera tarea para comenzar</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          style={styles.tasksList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>💡 Instrucciones:</Text>
        <Text style={styles.instructionsText}>
          • Toca una tarea para marcarla como completada{'\n'}
          • Mantén presionada una tarea para deslizar y eliminar{'\n'}
          • Las tareas se guardan automáticamente
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 15,
  },
  statsText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  addTaskContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  taskItemContainer: {
    marginVertical: 5,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  taskItemCompleted: {
    backgroundColor: '#e8f5e8',
    opacity: 0.8,
  },
  taskContent: {
    padding: 20,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#4CAF50',
  },
  taskStatus: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionsContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default App;