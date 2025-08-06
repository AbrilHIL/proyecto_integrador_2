import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function HorariosScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft color="#374151" size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>Horarios de los Buses</Text>
      <View style={styles.barra}>
        <Text style={styles.dia}>Lunes a Viernes</Text>
        <Text style={styles.hora}>5:45 AM - 11:00 PM</Text>
      </View>
      <View style={styles.barra}>
        <Text style={styles.dia}>Sábado</Text>
        <Text style={styles.hora}>6:00 AM - 10:00 PM</Text>
      </View>
      <View style={styles.barra}>
        <Text style={styles.dia}>Domingo</Text>
        <Text style={styles.hora}>6:00 AM - 10:00 PM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 36,
    textAlign: 'center',
    color: '#1E40AF',
    marginTop: 40,
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  dia: {
    fontSize: 17,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  hora: {
    fontSize: 17,
    color: '#374151',
    fontWeight: '600',
  },
});