import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Clock, Users, Star } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

const routes = [
  {
    id: '1',
    number: 'A1',
    name: 'Expreso Kennedy',
    from: 'Centro de los Héroes',
    to: 'Av. Kennedy',
    stops: 15,
    frequency: '10-15 min',
    rating: 4.5,
    occupancy: 'medium',
    price: 'RD$ 25',
    loc: 'centro',
  },
  {
    id: '2',
    number: 'B3',
    name: 'Metro Norte',
    from: 'Plaza de la Cultura',
    to: 'Villa Mella',
    stops: 22,
    frequency: '8-12 min',
    rating: 4.2,
    occupancy: 'high',
    price: 'RD$ 30',
    loc: 'norte',
  },
  {
    id: '3',
    number: 'C7',
    name: 'Corredor Sur',
    from: 'Zona Colonial',
    to: 'Los Alcarrizos',
    stops: 18,
    frequency: '15-20 min',
    rating: 4.0,
    occupancy: 'low',
    price: 'RD$ 35',
    loc: 'sur',
  },
  {
    id: '4',
    number: 'D2',
    name: 'Ruta Este',
    from: 'Piantini',
    to: 'Boca Chica',
    stops: 25,
    frequency: '20-25 min',
    rating: 3.8,
    occupancy: 'medium',
    price: 'RD$ 40',
    loc: 'este',
  },
  {
    id: '5',
    number: 'E5',
    name: 'Circuito Centro',
    from: 'Catedral',
    to: 'Malecón',
    stops: 12,
    frequency: '5-10 min',
    rating: 4.3,
    occupancy: 'high',
    price: 'RD$ 20',
    loc: 'centro',
  },
   {
  id: '6',
  number: 'C6',
  name: 'Los Alcarrizos',
  from: 'Los Alcarrizos',
  to: 'Puerto Haina Oriental',
  stops: 8,  
  frequency: '30 min',
  rating: 4.1,
  occupancy: 'high',
  price: 'RD$ 15',
  loc: 'oeste'
},
{
  id: '7',
  number: 'C2',
  name: '27 de Febrero / Hipódromo',
  from: 'Av. 27 de Febrero (Induveca)',
  to: 'Hipódromo V Centenario',
  stops: 9,
  frequency: '30 min en días laborables',
  rating: 4.0,
  occupancy: 'medium',
  price: 'RD$ 15',
  loc: 'centro-sur'
},
{
  id: '8',
  number: 'C4',
  name: 'Kennedy Km 9½',
  from: 'Aut. Duarte Prox. C/1ra',
  to: 'Carr. Mella Km 9½',
  stops: 16,
  frequency: '30 min',
  rating: 4.0,
  occupancy: 'medium',
  price: 'RD$ 15',
  loc: 'norte'
},
{
  id: '9',
  number: 'C14',
  name: 'Naco',
  from: 'Km 9½ Aut. Duarte',
  to: 'Av. Núñez de Cáceres (Naco)',
  stops: 10,
  frequency: '30 min',
  rating: 3.5,
  occupancy: 'medium',
  price: 'RD$ 15',
  loc: 'norte-centro'
},
{
  id: '10',
  number: 'C33',
  name: 'Bolívar / Independencia',
  from: 'Puerto Haina Oriental',
  to: 'Parque Independencia',
  stops: 72,
  frequency: '30 min',
  rating: 5.0,
  occupancy: 'high',
  price: 'RD$ 15',
  loc: 'centro'
},
{
  id: '11',
  number: 'C11',
  name: 'Independencia / Hipódromo',
  from: 'Puerto Haina Oriental',
  to: 'Hipódromo V Centenario',
  stops: 16,
  frequency: '30 min',
  rating: 4.0,
  occupancy: 'medium',
  price: 'RD$ 15',
  loc: 'centro-sur'
},
{
  id: '12',
  number: 'C1',
  name: 'Las Caobas',
  from: 'Las Caobas',
  to: 'centro de Santo Domingo',
  stops: 12,
  frequency: '30 min',
  rating: 6.0,
  occupancy: 'medium',
  price: 'RD$ 15',
  loc: 'oeste'
}
];

function getOccupancyText(occupancy: string) {
  switch (occupancy) {
    case 'low':
      return 'Baja';
    case 'medium':
      return 'Media';
    case 'high':
      return 'Alta';
    default:
      return 'Desconocida';
  }
}

export default function RouteInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const route = routes.find(r => r.id === id);

  if (!route) {
    return (
      <View style={styles.center}>
        <Text>Ruta no encontrada</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{route.name}</Text>
      <Text style={styles.info}>Número: {route.number}</Text>
      <Text style={styles.info}>Origen: {route.from}</Text>
      <Text style={styles.info}>Destino: {route.to}</Text>
      <Text style={styles.info}>Paradas: {route.stops}</Text>
      <Text style={styles.info}>Frecuencia: {route.frequency}</Text>
      <Text style={styles.info}>Ocupación: {getOccupancyText(route.occupancy)}</Text>
      <Text style={styles.info}>Precio: {route.price}</Text>
      <Text style={styles.info}>Calificación: {route.rating}/5</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: '/route-info/[id]', params: { id: route.id } })}
      >
        <Text style={styles.buttonText}>Ver en el mapa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  backButtonText: { color: '#1E40AF', fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#1E40AF', marginTop: 40 },
  info: { fontSize: 16, marginBottom: 10, color: '#374151' },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1E40AF',
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});