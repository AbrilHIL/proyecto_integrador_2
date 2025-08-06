import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Clock, Users, Star } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import React from 'react';
import { useRouter } from 'expo-router';

interface Route {
  id: string;
  number: string;
  name: string;
  from: string;
  to: string;
  stops: number;
  frequency: string;
  rating: number;
  occupancy: 'low' | 'medium' | 'high';
  price: string;
  loc: string;
}

export default function RoutesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const router = useRouter(); // <-- Agrega esta línea

  const routes: Route[] = [
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

  const filters = [
    { id: 'all', label: 'Todas' },
    { id: 'centro', label: 'Centro' },
    { id: 'norte', label: 'Norte' },
    { id: 'sur', label: 'Sur' },
    { id: 'este', label: 'Este' },
  ];

  const getOccupancyColor = (occupancy: string) => {
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
  };

  const getOccupancyText = (occupancy: string) => {
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
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch =
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.to.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' || route.loc === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consultar Rutas</Text>
        <Text style={styles.headerSubtitle}>Encuentra tu ruta ideal</Text>
      </View>

      {/* Search Bar */}
      <Animated.View entering={FadeInUp.delay(100)} style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por número, zona o destino..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      {/* Filters */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#1E40AF" size={16} />
            <Text style={styles.filterButtonText}>Filtros</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Routes List */}
      <ScrollView style={styles.routesList} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(300)} style={styles.routesContainer}>
          {filteredRoutes.map((route, index) => (
            <Animated.View
              key={route.id}
              entering={FadeInUp.delay(300 + index * 100)}
              style={styles.routeCard}
            >
              <TouchableOpacity>
                <View style={styles.routeHeader}>
                  <View style={styles.routeNumber}>
                    <Text style={styles.routeNumberText}>{route.number}</Text>
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeName}>{route.name}</Text>
                    <View style={styles.routePath}>
                      <MapPin color="#6B7280" size={14} />
                      <Text style={styles.routePathText}>
                        {route.from} → {route.to}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.routePrice}>
                    <Text style={styles.routePriceText}>{route.price}</Text>
                  </View>
                </View>

                <View style={styles.routeDetails}>
                  <View style={styles.routeDetailItem}>
                    <View style={styles.routeDetailIcon}>
                      <MapPin color="#6B7280" size={16} />
                    </View>
                    <Text style={styles.routeDetailText}>{route.stops} paradas</Text>
                  </View>

                  <View style={styles.routeDetailItem}>
                    <View style={styles.routeDetailIcon}>
                      <Clock color="#6B7280" size={16} />
                    </View>
                    <Text style={styles.routeDetailText}>Cada {route.frequency}</Text>
                  </View>

                  <View style={styles.routeDetailItem}>
                    <View style={styles.routeDetailIcon}>
                      <Users color={getOccupancyColor(route.occupancy)} size={16} />
                    </View>
                    <Text style={[styles.routeDetailText, { color: getOccupancyColor(route.occupancy) }]}>
                      Ocupación {getOccupancyText(route.occupancy)}
                    </Text>
                  </View>

                  <View style={styles.routeDetailItem}>
                    <View style={styles.routeDetailIcon}>
                      <Star color="#F59E0B" size={16} fill="#F59E0B" />
                    </View>
                    <Text style={styles.routeDetailText}>{route.rating}/5</Text>
                  </View>
                </View>

                <View style={styles.routeActions}>
                  <TouchableOpacity
                    style={styles.routeActionButton}
                    onPress={() => router.push({ pathname: '/route-info/[id]', params: { id: route.id } })}
                  >
                    <Text style={styles.routeActionButtonText}>Ver Detalles</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: '#1E40AF',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  routesList: {
    flex: 1,
  },
  routesContainer: {
    padding: 24,
    gap: 16,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  routeNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  routePath: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routePathText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  routePrice: {
    alignItems: 'flex-end',
  },
  routePriceText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  routeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  routeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeDetailIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  routeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  routeActionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  routeActionButtonPrimary: {
    backgroundColor: '#1E40AF',
  },
  routeActionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  routeActionButtonTextPrimary: {
    color: '#FFFFFF',
  },
});