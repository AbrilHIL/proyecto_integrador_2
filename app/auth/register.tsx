import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, CheckCircle2, XCircle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState<null | boolean>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validación local de formato de email
  const checkEmail = (value: string) => {
    setEmail(value);
    // Expresión regular básica para validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(value));
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (!emailValid) {
      Alert.alert('Error', 'El correo electrónico no es válido');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.success) {
        // Guarda el usuario en AsyncStorage para sesión iniciada
        await AsyncStorage.setItem('user', JSON.stringify({
          name,
          email,
          password_hash: password // Si el backend responde el usuario, usa data.user
        }));
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.error || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.form}>
          <Text style={styles.title}>¡Únete a nosotros!</Text>
          <Text style={styles.subtitle}>Crea tu cuenta para comenzar</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Mail color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={checkEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {email.length > 0 && emailValid === true ? (
                <CheckCircle2 color="#10B981" size={20} style={{ marginLeft: 8 }} />
              ) : email.length > 0 && emailValid === false ? (
                <XCircle color="#DC2626" size={20} style={{ marginLeft: 8 }} />
              ) : null}
            </View>

            <View style={styles.inputWrapper}>
              <Lock color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff color="#9CA3AF" size={20} />
                ) : (
                  <Eye color="#9CA3AF" size={20} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Lock color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff color="#9CA3AF" size={20} />
                ) : (
                  <Eye color="#9CA3AF" size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.passwordHint}>
            La contraseña debe tener al menos 6 caracteres
          </Text>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.footerLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  form: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 32,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  eyeIcon: {
    padding: 4,
  },
  passwordHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 32,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
});