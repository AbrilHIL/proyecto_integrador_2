import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Bus, Clock, Users, RefreshCw, Maximize2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface LiveBus {
  id: string;
  routeNumber: string;
  routeName: string;
  currentStop: string;
  nextStop: string;
  estimatedArrival: string;
  occupancy: 'low' | 'medium' | 'high';
  delay: number;
  coordinates: { x: number; y: number };
}

export default function LiveScreen() {
  const [buses, setBuses] = useState<LiveBus[]>([]);
  const [selectedBus, setSelectedBus] = useState<LiveBus | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock live bus data
  const mockBuses: LiveBus[] = [
    {
      id: '1',
      routeNumber: 'A1',
      routeName: 'Expreso Kennedy',
      currentStop: 'Plaza de la Cultura',
      nextStop: 'Centro de los Héroes',
      estimatedArrival: '3 min',
      occupancy: 'medium',
      delay: 0,
      coordinates: { x: 120, y: 150 },
    },
    {
      id: '2',
      routeNumber: 'B3',
      routeName: 'Metro Norte',
      currentStop: 'Malecón',
      nextStop: 'Av. Máximo Gómez',
      estimatedArrival: '7 min',
      occupancy: 'high',
      delay: 2,
      coordinates: { x: 180, y: 220 },
    },
    {
      id: '3',
      routeNumber: 'C7',
      routeName: 'Corredor Sur',
      currentStop: 'Zona Colonial',
      nextStop: 'Parque Independencia',
      estimatedArrival: '5 min',
      occupancy: 'low',
      delay: -1,
      coordinates: { x: 90, y: 280 },
    },
    {
      id: '4',
      routeNumber: 'D2',
      routeName: 'Ruta Este',
      currentStop: 'Piantini',
      nextStop: 'Av. Abraham Lincoln',
      estimatedArrival: '12 min',
      occupancy: 'medium',
      delay: 3,
      coordinates: { x: 250, y: 180 },
    },
    {
      id: '5',
      routeNumber: 'E5',
      routeName: 'Circuito Centro',
      currentStop: 'Catedral',
      nextStop: 'Parque Central',
      estimatedArrival: '2 min',
      occupancy: 'high',
      delay: 0,
      coordinates: { x: 140, y: 320 },
    },
  ];

  useEffect(() => {
    setBuses(mockBuses);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          coordinates: {
            x: Math.max(50, Math.min(width - 80, bus.coordinates.x + (Math.random() - 0.5) * 20)),
            y: Math.max(50, Math.min(350, bus.coordinates.y + (Math.random() - 0.5) * 15)),
          },
          estimatedArrival: `${Math.max(1, parseInt(bus.estimatedArrival) + Math.floor(Math.random() * 3) - 1)} min`,
        }))
      );
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        return 'Baja ocupación';
      case 'medium':
        return 'Media ocupación';
      case 'high':
        return 'Alta ocupación';
      default:
        return 'Desconocida';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  const handleBusPress = (bus: LiveBus) => {
    setSelectedBus(bus);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Rutas en Vivo</Text>
          <Text style={styles.headerSubtitle}>
            Última actualización: {lastUpdate.toLocaleTimeString('es-DO', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <RefreshCw 
            color="#1E40AF" 
            size={20} 
            style={[isRefreshing && { transform: [{ rotate: '180deg' }] }]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live Map */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Mapa en Tiempo Real</Text>
            <TouchableOpacity style={styles.fullscreenButton}>
              <Maximize2 color="#6B7280" size={16} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.map}>
            {/* Map Background */}
            <View style={styles.mapBackground}>
              <Text style={styles.mapPlaceholder}>Santo Domingo</Text>
              
              {/* Street Lines */}
              <View style={[styles.street, { top: 100, left: 0, width: '100%', height: 2 }]} />
              <View style={[styles.street, { top: 200, left: 0, width: '100%', height: 2 }]} />
              <View style={[styles.street, { top: 300, left: 0, width: '100%', height: 2 }]} />
              <View style={[styles.street, { top: 0, left: 100, width: 2, height: '100%' }]} />
              <View style={[styles.street, { top: 0, left: 200, width: 2, height: '100%' }]} />
            </View>

            {/* Live Buses */}
            {buses.map((bus) => (
              <TouchableOpacity
                key={bus.id}
                style={[
                  styles.busMarker,
                  {
                    top: bus.coordinates.y,
                    left: bus.coordinates.x,
                    backgroundColor: selectedBus?.id === bus.id ? '#1E40AF' : '#FFFFFF',
                  }
                ]}
                onPress={() => handleBusPress(bus)}
              >
                <Bus 
                  color={selectedBus?.id === bus.id ? '#FFFFFF' : '#1E40AF'} 
                  size={16} 
                />
                <Text style={[
                  styles.busMarkerText,
                  { color: selectedBus?.id === bus.id ? '#FFFFFF' : '#1E40AF' }
                ]}>
                  {bus.routeNumber}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendText}>Baja</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendText}>Media</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.legendText}>Alta</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Selected Bus Info */}
        {selectedBus && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.selectedBusInfo}>
            <View style={styles.selectedBusHeader}>
              <View style={styles.selectedBusNumber}>
                <Text style={styles.selectedBusNumberText}>{selectedBus.routeNumber}</Text>
              </View>
              <View style={styles.selectedBusDetails}>
                <Text style={styles.selectedBusName}>{selectedBus.routeName}</Text>
                <Text style={styles.selectedBusLocation}>
                  En: {selectedBus.currentStop}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedBus(null)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.selectedBusStats}>
              <View style={styles.selectedBusStatItem}>
                <Clock color="#6B7280" size={16} />
                <Text style={styles.selectedBusStatText}>
                  Llega en {selectedBus.estimatedArrival}
                </Text>
              </View>
              
              <View style={styles.selectedBusStatItem}>
                <Users color={getOccupancyColor(selectedBus.occupancy)} size={16} />
                <Text style={[
                  styles.selectedBusStatText,
                  { color: getOccupancyColor(selectedBus.occupancy) }
                ]}>
                  {getOccupancyText(selectedBus.occupancy)}
                </Text>
              </View>

              <View style={styles.selectedBusStatItem}>
                <MapPin color="#6B7280" size={16} />
                <Text style={styles.selectedBusStatText}>
                  Próxima: {selectedBus.nextStop}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Seguir esta guagua</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Live Bus List */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.busListSection}>
          <Text style={styles.busListTitle}>Guaguas Activas ({buses.length})</Text>
          
          <View style={styles.busList}>
            {buses.map((bus, index) => (
              <Animated.View
                key={bus.id}
                entering={FadeInUp.delay(300 + index * 50)}
                style={styles.busCard}
              >
                <TouchableOpacity 
                  style={styles.busCardContent}
                  onPress={() => handleBusPress(bus)}
                >
                  <View style={styles.busCardHeader}>
                    <View style={styles.busCardNumber}>
                      <Text style={styles.busCardNumberText}>{bus.routeNumber}</Text>
                    </View>
                    <View style={styles.busCardInfo}>
                      <Text style={styles.busCardName}>{bus.routeName}</Text>
                      <Text style={styles.busCardLocation}>
                        {bus.currentStop} → {bus.nextStop}
                      </Text>
                    </View>
                    <View style={styles.busCardMeta}>
                      <Text style={styles.busCardTime}>{bus.estimatedArrival}</Text>
                      <View style={[
                        styles.occupancyIndicator,
                        { backgroundColor: getOccupancyColor(bus.occupancy) }
                      ]} />
                    </View>
                  </View>

                  {bus.delay !== 0 && (
                    <View style={styles.delayIndicator}>
                      <Text style={[
                        styles.delayText,
                        { color: bus.delay > 0 ? '#DC2626' : '#10B981' }
                      ]}>
                        {bus.delay > 0 ? `+${bus.delay} min retraso` : `${Math.abs(bus.delay)} min adelantado`}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EBF4FF',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    backgroundColor: '#FFFFFF',
    margin: 24,
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
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mapTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  fullscreenButton: {
    padding: 4,
  },
  map: {
    height: 300,
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  mapBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholder: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#D1D5DB',
  },
  street: {
    position: 'absolute',
    backgroundColor: '#E5E7EB',
  },
  busMarker: {
    position: 'absolute',
    width: 60,
    height: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  busMarkerText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  legend: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedBusInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
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
  selectedBusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedBusNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedBusNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  selectedBusDetails: {
    flex: 1,
  },
  selectedBusName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  selectedBusLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedBusStats: {
    gap: 12,
    marginBottom: 16,
  },
  selectedBusStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedBusStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  followButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  busListSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  busListTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  busList: {
    gap: 12,
  },
  busCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  busCardContent: {
    padding: 16,
  },
  busCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busCardNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  busCardNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  busCardInfo: {
    flex: 1,
  },
  busCardName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  busCardLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  busCardMeta: {
    alignItems: 'flex-end',
  },
  busCardTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  occupancyIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  delayIndicator: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  delayText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});