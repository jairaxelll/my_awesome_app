import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });
  const { login } = useAuth();

  const handleLogin = async () => {
    // Clear previous messages
    setMessage({ text: '', type: null });

    if (!username.trim() || !password.trim()) {
      setMessage({ text: 'Please enter both username and password', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(username.trim(), password);
      
      if (result.success) {
        setMessage({ text: 'Login successful! Welcome back!', type: 'success' });
        // Clear form after successful login
        setUsername('');
        setPassword('');
        // The useAuth hook should handle the navigation automatically
      } else {
        setMessage({ text: result.error || 'Invalid username or password', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../../Logo.jpg')} style={styles.logoImage} />
              <Text style={styles.title}>Todo para uñas</Text>
            </View>
            <Text style={styles.subtitle}>Inicia sesión para gestionar tu negocio de uñas</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username or Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username or email"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Message Display */}
            {message.text && (
              <View style={[
                styles.messageContainer,
                message.type === 'success' ? styles.successMessage : styles.errorMessage
              ]}>
                <Text style={[
                  styles.messageText,
                  message.type === 'success' ? styles.successText : styles.errorText
                ]}>
                  {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoCredentials}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Admin: admin / admin123</Text>
            <Text style={styles.demoText}>Employee: employee1 / emp123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5fb',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 52,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#ec4899',
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: 'rgba(236, 72, 153, 0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 17,
    color: '#64748b',
    fontWeight: '600',
  },
  form: {
    marginBottom: 36,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ffd6ef',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
    elevation: 2,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  messageContainer: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 2,
    elevation: 2,
  },
  successMessage: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  messageText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  successText: {
    color: '#166534',
  },
  errorText: {
    color: '#dc2626',
  },
  loginButton: {
    backgroundColor: '#ec4899',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    elevation: 8,
    shadowColor: '#db2777',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
    elevation: 2,
    shadowOpacity: 0.2,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  demoCredentials: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#ffd6ef',
    elevation: 4,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  demoText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  logoImage: {
    width: 44,
    height: 44,
    marginRight: 12,
    borderRadius: 12,
    resizeMode: 'contain',
  },
});
