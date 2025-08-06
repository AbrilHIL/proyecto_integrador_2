import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

// Simulación de datos de ejemplo (reemplaza por tus datos reales si los tienes)
const exampleRoutes = [
  {
    id: '1',
    points: [
      { latitude: 18.4716, longitude: -69.9392 },
      { latitude: 18.4801, longitude: -69.9422 },
    ],
    from: 'Centro de los Héroes',
    to: 'Av. Kennedy',
  },
  {
    id: '2',
    points: [
      { latitude: 18.4861, longitude: -69.9312 },
      { latitude: 18.5100, longitude: -69.8567 },
    ],
    from: 'Plaza de la Cultura',
    to: 'Villa Mella',
  },
  // ...agrega más rutas según tus ids...
];

export default function SeguirRutaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showNavigation, setShowNavigation] = useState(false);

  // Busca la ruta seleccionada por id
  const route = exampleRoutes.find(r => r.id === id);

  if (!route) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Ruta no encontrada</Text>
      </View>
    );
  }

  // Pantalla completa al iniciar navegación
  if (showNavigation) {
    return (
      <View style={styles.fullScreenMapContainer}>
        <MapView
          style={styles.fullScreenMap}
          initialRegion={{
            latitude: route.points[0].latitude,
            longitude: route.points[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={route.points[0]} title="Inicio" />
          <Marker coordinate={route.points[1]} title="Destino" />
          <Polyline
            coordinates={route.points}
            strokeColor="#1E40AF"
            strokeWidth={6}
          />
        </MapView>
        <TouchableOpacity style={styles.backButtonAbsolute} onPress={() => setShowNavigation(false)}>
          <ArrowLeft color="#374151" size={28} />
        </TouchableOpacity>
      </View>
    );
  }

  // Vista previa antes de iniciar navegación
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft color="#374151" size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>Seguir Ruta</Text>
      <Text style={styles.subtitle}>{route.from} → {route.to}</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: route.points[0].latitude,
          longitude: route.points[0].longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        <Marker coordinate={route.points[0]} title="Inicio" />
        <Marker coordinate={route.points[1]} title="Destino" />
        <Polyline
          coordinates={route.points}
          strokeColor="#1E40AF"
          strokeWidth={4}
        />
      </MapView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowNavigation(true)}
      >
        <Text style={styles.buttonText}>Iniciar Navegación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    padding: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
    zIndex: 2,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 80, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#374151', marginBottom: 12, textAlign: 'center' },
  map: {
    width: Dimensions.get('window').width,
    height: 350,
    marginTop: 12,
    borderRadius: 16,
    alignSelf: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    padding: 16,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  // Pantalla completa
  fullScreenMapContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenMap: {
    ...StyleSheet.absoluteFillObject,
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 40,
    left: 24,
    padding: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
    zIndex: 10,
  },
});