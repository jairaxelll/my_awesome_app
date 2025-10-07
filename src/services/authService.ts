import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USERS_KEY = 'crm_users';
const CURRENT_USER_KEY = 'current_user';

// Sample users for demo purposes
const SAMPLE_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@crm.com',
    password: 'admin123', // In real app, this would be hashed
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1-555-0001',
    department: 'Management',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'employee1',
    email: 'employee1@crm.com',
    password: 'emp123', // In real app, this would be hashed
    role: 'employee',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-555-0002',
    department: 'Sales',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'employee2',
    email: 'employee2@crm.com',
    password: 'emp123', // In real app, this would be hashed
    role: 'employee',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1-555-0003',
    department: 'Marketing',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const initializeUsers = async (): Promise<void> => {
  try {
    const existingUsers = await AsyncStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(SAMPLE_USERS));
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
};

export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    if (!usersData) {
      await initializeUsers();
      return null;
    }

    const users: User[] = JSON.parse(usersData);
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password && 
      u.isActive
    );

    if (user) {
      // Update last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }

    return null;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User | null> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    if (!usersData) {
      await initializeUsers();
      return null;
    }

    const users: User[] = JSON.parse(usersData);
    
    // Check if username or email already exists
    const existingUser = users.find(u => 
      u.username === userData.username || u.email === userData.email
    );
    
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    if (!usersData) return null;

    const users: User[] = JSON.parse(usersData);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return null;

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update current user if it's the same user
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};
