import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Clock, ArrowRight, Users, Repeat } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Location from 'expo-location';
import SelectLocationModal from '../../components/SelectLocationModal';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface RouteOption {
  id: string;
  totalTime: string;
  walkingTime: string;
  transfers: number;
  routes: Array<{
    number: string;
    name: string;
    from: string;
    to: string;
    color: string;
  }>;
  cost: string;
}

export default function PlannerScreen() {
  const params = useLocalSearchParams();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState(params.destination ? String(params.destination) : '');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [editingField, setEditingField] = useState<'origin' | 'destination' | null>(null);
  const router = useRouter();

  const routeOptions: RouteOption[] = [
    {
      id: '1',
      totalTime: '35 min',
      walkingTime: '8 min',
      transfers: 1,
      routes: [
        {
          number: 'A1',
          name: 'Expreso Kennedy',
          from: 'Centro de los Héroes',
          to: 'Av. Kennedy',
          color: '#1E40AF',
        },
        {
          number: 'C7',
          name: 'Corredor Sur',
          from: 'Av. Kennedy',
          to: 'Los Alcarrizos',
          color: '#DC2626',
        },
      ],
      cost: 'RD$ 60',
    },
    {
      id: '2',
      totalTime: '42 min',
      walkingTime: '12 min',
      transfers: 0,
      routes: [
        {
          number: 'B3',
          name: 'Metro Norte',
          from: 'Plaza de la Cultura',
          to: 'Villa Mella',
          color: '#10B981',
        },
      ],
      cost: 'RD$ 30',
    },
    {
      id: '3',
      totalTime: '28 min',
      walkingTime: '5 min',
      transfers: 2,
      routes: [
        {
          number: 'E5',
          name: 'Circuito Centro',
          from: 'Catedral',
          to: 'Malecón',
          color: '#F59E0B',
        },
        {
          number: 'A1',
          name: 'Expreso Kennedy',
          from: 'Malecón',
          to: 'Av. Kennedy',
          color: '#1E40AF',
        },
        {
          number: 'D2',
          name: 'Ruta Este',
          from: 'Av. Kennedy',
          to: 'Boca Chica',
          color: '#8B5CF6',
        },
      ],
      cost: 'RD$ 85',
    },
  ];

  const handleSearch = () => {
    if (!origin || !destination) {
      Alert.alert('Error', 'Por favor completa el origen y destino');
      return;
    }

    if (origin === destination) {
      Alert.alert('Error', 'El origen y destino no pueden ser iguales');
      return;
    }

    setLoading(true);
    // Simulate search
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);
  };

  // Nueva función para obtener la ubicación
  const handleUseMyLocation = async () => {
    setGettingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setGettingLocation(false);
      Alert.alert('Permiso denegado', 'No se pudo acceder a la ubicación.');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setOrigin(`Mi ubicación (${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)})`);
    setGettingLocation(false);
  };

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleOpenMap = (field: 'origin' | 'destination') => {
    setEditingField(field);
    setShowMapModal(true);
  };

  const handleSelectLocation = (coords: { latitude: number; longitude: number }) => {
    const value = `(${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`;
    if (editingField === 'origin') setOrigin(value);
    if (editingField === 'destination') setDestination(value);
    setShowMapModal(false);
    setEditingField(null);
  };

  useEffect(() => {
    handleUseMyLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {destination ? `Planificar viaje a ${destination}` : 'Planificar Viaje'}
        </Text>
        <Text style={styles.headerSubtitle}>¿Cómo llegar a tu destino?</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Form */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.searchForm}>
          <View style={styles.locationInputs}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.locationInput}
                placeholder="¿Desde dónde sales?"
                placeholderTextColor="#9CA3AF"
                value={origin}
                onChangeText={setOrigin}
              />
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={handleUseMyLocation}
                disabled={gettingLocation}
              >
                <Navigation color={gettingLocation ? "#9CA3AF" : "#1E40AF"} size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => handleOpenMap('origin')}
              >
                <MapPin color="#1E40AF" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.swapContainer}>
              <View style={styles.connectionLine} />
              <TouchableOpacity 
                style={styles.swapButton}
                onPress={handleSwapLocations}
              >
                <Repeat color="#6B7280" size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.locationInput}
                placeholder="¿A dónde vas?"
                placeholderTextColor="#9CA3AF"
                value={destination}
                onChangeText={setDestination}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => handleOpenMap('destination')}
              >
                <MapPin color="#DC2626" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'Buscando rutas...' : 'Buscar Rutas'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Results */}
        {showResults && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Opciones de Viaje</Text>
              <Text style={styles.resultsSubtitle}>
                De "{origin}" a "{destination}"
              </Text>
            </View>
            <View style={styles.routeOptions}>
              {getRouteOptions(origin, destination).map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInUp.delay(300 + index * 100)}
                  style={styles.routeOption}
                >
                  <TouchableOpacity style={styles.routeOptionContent}>
                    <View style={styles.routeOptionHeader}>
                      <View style={styles.routeTime}>
                        <Text style={styles.routeTimeText}>{option.totalTime}</Text>
                        <Text style={styles.routeCostText}>{option.cost}</Text>
                      </View>
                      <View style={styles.routeInfo}>
                        <View style={styles.routeInfoItem}>
                          <Clock color="#6B7280" size={16} />
                          <Text style={styles.routeInfoText}>
                            {option.walkingTime} caminando
                          </Text>
                        </View>
                        <View style={styles.routeInfoItem}>
                          <Users color="#6B7280" size={16} />
                          <Text style={styles.routeInfoText}>
                            {option.transfers} transbordo{option.transfers !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.routePath}>
                      {option.routes.map((route, routeIndex) => (
                        <View key={routeIndex} style={styles.routeSegment}>
                          <View style={[styles.routeBadge, { backgroundColor: route.color }]}>
                            <Text style={styles.routeBadgeText}>{route.number}</Text>
                          </View>
                          <View style={styles.routeSegmentInfo}>
                            <Text style={styles.routeSegmentName}>{route.name}</Text>
                            <Text style={styles.routeSegmentPath}>
                              {route.from} → {route.to}
                            </Text>
                          </View>
                          {routeIndex < option.routes.length - 1 && (
                            <ArrowRight color="#D1D5DB" size={16} />
                          )}
                        </View>
                      ))}
                    </View>

                    <View style={styles.routeActions}>
                      <TouchableOpacity style={styles.routeActionButton}>
                        <Text style={styles.routeActionButtonText}>Ver Detalles</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.routeActionButton, styles.routeActionButtonPrimary]}
                        onPress={() => router.push({ pathname: '/seguir-ruta/[id]', params: { id: option.id } })}
                      >
                        <Text style={[styles.routeActionButtonText, styles.routeActionButtonTextPrimary]}>
                          Usar Esta Ruta
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Quick Destinations */}
        {!showResults && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.quickDestinations}>
            <Text style={styles.quickDestinationsTitle}>Destinos Populares</Text>
            <View style={styles.quickDestinationsList}>
              {[
                'Aeropuerto Las Américas',
                'Universidad UASD',
                'Hospital Salvador B. Gautier',
                'Centro Comercial Agora Mall',
                'Malecón de Santo Domingo',
                'Zona Colonial',
              ].map((destination, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickDestination}
                  onPress={() => setDestination(destination)}
                >
                  <MapPin color="#1E40AF" size={16} />
                  <Text style={styles.quickDestinationText}>{destination}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <SelectLocationModal
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelect={handleSelectLocation}
      />
    </SafeAreaView>
  );
}

function getDistanceKm(from: string, to: string): number {
  // Espera formato "(lat, lng)"
  const parse = (str: string) => {
    const match = str.match(/-?\d+\.\d+/g);
    return match ? { lat: parseFloat(match[0]), lng: parseFloat(match[1]) } : null;
  };
  const a = parse(from);
  const b = parse(to);
  if (!a || !b) return 0;
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x = dLat / 2;
  const y = dLng / 2;
  const aVal =
    Math.sin(x) * Math.sin(x) +
    Math.sin(y) * Math.sin(y) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return Math.round(R * c * 10) / 10;
}

function getRouteOptions(origin: string, destination: string): RouteOption[] {
  const distance = getDistanceKm(origin, destination);

  // Lógica simple: cuanto más lejos, más tiempo, más paradas, más costo
  let baseTime = 20;
  let baseWalking = 5;
  let baseTransfers = 0;
  let baseStops = 8;
  let baseCost = 30;

  if (distance > 0) {
    baseTime += Math.round(distance * 2.5);
    baseWalking += Math.round(distance * 0.5);
    baseTransfers = distance > 10 ? 2 : distance > 5 ? 1 : 0;
    baseStops += Math.round(distance * 1.5);
    baseCost += Math.round(distance * 2.5);
  }

  return [
    {
      id: '1',
      totalTime: `${baseTime} min`,
      walkingTime: `${baseWalking} min`,
      transfers: baseTransfers,
      routes: [
        {
          number: 'A1',
          name: 'Expreso Kennedy',
          from: origin,
          to: destination,
          color: '#1E40AF',
        },
      ],
      cost: `RD$ ${baseCost}`,
    },
    {
      id: '2',
      totalTime: `${baseTime + 10} min`,
      walkingTime: `${baseWalking + 3} min`,
      transfers: baseTransfers + 1,
      routes: [
        {
          number: 'B3',
          name: 'Metro Norte',
          from: origin,
          to: destination,
          color: '#10B981',
        },
      ],
      cost: `RD$ ${baseCost + 10}`,
    },
  ];
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
  content: {
    flex: 1,
  },
  searchForm: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  locationInputs: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: '#DC2626',
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  locationButton: {
    padding: 4,
  },
  swapContainer: {
    alignItems: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  connectionLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  swapButton: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  searchButton: {
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
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  searchButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  resultsSection: {
    paddingHorizontal: 24,
  },
  resultsHeader: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  resultsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  routeOptions: {
    gap: 16,
  },
  routeOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routeOptionContent: {
    padding: 20,
  },
  routeOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeTime: {
    alignItems: 'flex-start',
  },
  routeTimeText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E40AF',
  },
  routeCostText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginTop: 2,
  },
  routeInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  routePath: {
    marginBottom: 16,
  },
  routeSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  routeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  routeSegmentInfo: {
    flex: 1,
  },
  routeSegmentName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  routeSegmentPath: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
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
  quickDestinations: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  quickDestinationsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  quickDestinationsList: {
    gap: 12,
  },
  quickDestination: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickDestinationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
});