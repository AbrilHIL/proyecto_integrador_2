import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native'; // Asegúrate de tener este import

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

function getOccupancyColor(occupancy: string) {
  switch (occupancy) {
    case 'low':
      return '#10B981';
    case 'medium':
      return '#F59E0B';
    case 'high':
      return '#DC2626';
    default:
      return '#6B7280';
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
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft color="#374151" size={24} />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.routeNumber}>{route.number}</Text>
        <Text style={styles.routeName}>{route.name}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Origen:</Text>
          <Text style={styles.value}>{route.from}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Destino:</Text>
          <Text style={styles.value}>{route.to}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Paradas:</Text>
          <Text style={styles.value}>{route.stops}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Frecuencia:</Text>
          <Text style={styles.value}>{route.frequency}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ocupación:</Text>
          <Text style={[styles.value, { color: getOccupancyColor(route.occupancy), fontWeight: 'bold' }]}>
            {getOccupancyText(route.occupancy)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={[styles.value, { color: '#10B981', fontWeight: 'bold' }]}>{route.price}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Calificación:</Text>
          <Text style={[styles.value, { color: '#F59E0B', fontWeight: 'bold' }]}>{route.rating}/5</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
    padding: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIcon: {
    color: '#1E40AF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    marginTop: 80,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  routeNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  routeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#374151',
  },
});