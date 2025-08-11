import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDetailsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; password_hash: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <ArrowLeft color="#374151" size={24} />
        <Text style={styles.backButtonText}></Text>
      </TouchableOpacity>
      <Text style={styles.title}>Detalles del Usuario</Text>

      {/* Tabla de datos del usuario */}
      {user && (
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Nombre:</Text>
            <Text style={styles.tableValue}>{user.name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Correo:</Text>
            <Text style={styles.tableValue}>{user.email}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Contraseña:</Text>
            <View style={styles.passwordCell}>
              <Text style={styles.tableValue}>
                {showPassword ? user.password_hash : '••••••••'}
              </Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff color="#374151" size={20} style={{ marginLeft: 8 }} />
                ) : (
                  <Eye color="#374151" size={20} style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.push('/auth/welcome')}
      >
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: { color: '#374151', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, marginTop: 80 },
  table: {
    width: '85%',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 16,
    marginBottom: 32,
    marginTop: 8,
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  tableLabel: {
    fontWeight: 'bold',
    color: '#374151',
    width: 100,
    fontSize: 16,
  },
  tableValue: {
    color: '#374151',
    fontSize: 16,
    flex: 1,
  },
  passwordCell: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#d82f09ff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

