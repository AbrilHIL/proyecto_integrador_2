import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Clock, Bus, TrendingUp, Star, TrendingDown, Minus } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import React from 'react';
import { useRouter } from 'expo-router'; // <-- Add this import

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

interface PopularRoute {
  id: string;
  number: string;
  name: string;
  from: string;
  to: string;
  rating: number;
  time: string;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveData, setLiveData] = useState({
    trafficStatus: 'good',
    activeRoutes: 8,
    punctuality: 95,
    avgMinutes: 12,
  });
  const router = useRouter(); // <-- Add this line

  useEffect(() => {
    const updateLiveData = () => {
      const now = new Date();
      const hour = now.getHours();
      let trafficStatus: 'good' | 'neutral' | 'heavy' = 'good';

      if (hour >= 0 && hour < 4) {
        trafficStatus = 'good';
      } else if (hour >= 5 && hour < 10) {
        trafficStatus = 'heavy';
      } else if (hour >= 10 && hour < 12) {
        trafficStatus = 'neutral';
      } else if (hour >= 12 && hour < 15) {
        trafficStatus = 'heavy';
      } else if (hour >= 15 && hour < 17) {
        trafficStatus = 'neutral';
      } else if (hour >= 17 && hour < 20) {
        trafficStatus = 'heavy';
      } else if (hour >= 20 && hour < 24) {
        trafficStatus = 'good';
      }

      // Lógica para variar los otros datos según el tráfico
      let activeRoutes = 8;
      let punctuality = 95;
      let avgMinutes = 12;

      if (trafficStatus === 'good') {
        activeRoutes = 10;
        punctuality = 97;
        avgMinutes = 10;
      } else if (trafficStatus === 'neutral') {
        activeRoutes = 7;
        punctuality = 90;
        avgMinutes = 15;
      } else if (trafficStatus === 'heavy') {
        activeRoutes = 5;
        punctuality = 80;
        avgMinutes = 22;
      }

      setLiveData({
        trafficStatus,
        activeRoutes,
        punctuality,
        avgMinutes,
      });
    };

    updateLiveData();
    const interval = setInterval(updateLiveData, 60 * 1000); // Actualiza cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (id: string) => {
    switch (id) {
      case '1':
        // Buscar Ruta: navigate to routes tab
        router.push('/routes');
        break;
            case '2':
        router.push('/location');
        break;
      case '3':
        router.push('/horarios');
        break;
      case '4':
        router.push('/live');
        break;
      default:
        break;
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Buscar Ruta',
      icon: <Search color="#FFFFFF" size={24} />,
      color: '#1E40AF',
    },
    {
      id: '2',
      title: 'Mi Ubicación',
      icon: <MapPin color="#FFFFFF" size={24} />,
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Horarios',
      icon: <Clock color="#FFFFFF" size={24} />,
      color: '#F59E0B',
    },
    {
      id: '4',
      title: 'En Vivo',
      icon: <Bus color="#FFFFFF" size={24} />,
      color: '#DC2626',
    },
  ];

  const popularRoutes: PopularRoute[] = [
    {
      id: '1',
      number: 'A1',
      name: 'Expreso Kennedy',
      from: 'Centro de los Héroes',
      to: 'Av. Kennedy',
      rating: 4.5,
      time: '15 min',
    },
    {
      id: '2',
      number: 'B3',
      name: 'Metro Norte',
      from: 'Plaza de la Cultura',
      to: 'Villa Mella',
      rating: 4.2,
      time: '25 min',
    },
    {
      id: '3',
      number: 'C7',
      name: 'Corredor Sur',
      from: 'Zona Colonial',
      to: 'Los Alcarrizos',
      rating: 4.0,
      time: '30 min',
    },
  ];

  const getTrafficIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <TrendingUp color="#10B981" size={24} />;
      case 'neutral':
        return <Minus color="#F59E0B" size={24} />;
      case 'heavy':
        return <TrendingDown color="#DC2626" size={24} />;
      default:
        return <Minus color="#6B7280" size={24} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.subtitle}>¿A dónde quieres ir hoy?</Text>
          </View>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>U</Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color="#9CA3AF" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar ruta, destino o parada..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
      

            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickAction, { backgroundColor: action.color }]}
                onPress={() => handleQuickAction(action.id)}
              >
                {action.icon}
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Popular Routes */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rutas Populares</Text>
          </View>
          
          <View style={styles.routesList}>
            {popularRoutes.map((route) => (
              <TouchableOpacity key={route.id} style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <View style={styles.routeNumber}>
                    <Text style={styles.routeNumberText}>{route.number}</Text>
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeName}>{route.name}</Text>
                    <Text style={styles.routeDestination}>
                      {route.from} → {route.to}
                    </Text>
                  </View>
                  <View style={styles.routeMeta}>
                    <View style={styles.rating}>
                      <Star color="#F59E0B" size={14} fill="#F59E0B" />
                      <Text style={styles.ratingText}>{route.rating}</Text>
                    </View>
                    <Text style={styles.timeText}>{route.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Live Updates */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
          <View style={styles.liveUpdatesCard}>
            <View style={styles.liveHeader}>
              {getTrafficIcon(liveData.trafficStatus)}
              <Text style={styles.liveTitle}>Estado del Tráfico</Text>
            </View>
            <Text style={styles.liveDescription}>
              {liveData.trafficStatus === 'good' && 'Condiciones buenas en la mayoría de las rutas.'}
              {liveData.trafficStatus === 'neutral' && 'Tráfico moderado en varias rutas.'}
              {liveData.trafficStatus === 'heavy' && 'Tráfico pesado en la ciudad.'}
            </Text>
            <View style={styles.liveStats}>
              <View style={styles.liveStat}>
                <Text style={styles.liveStatNumber}>{liveData.activeRoutes}</Text>
                <Text style={styles.liveStatLabel}>Rutas activas</Text>
              </View>
              <View style={styles.liveStat}>
                <Text style={styles.liveStatNumber}>{liveData.punctuality}%</Text>
                <Text style={styles.liveStatLabel}>Puntualidad</Text>
              </View>
              <View style={styles.liveStat}>
                <Text style={styles.liveStatNumber}>{liveData.avgMinutes}</Text>
                <Text style={styles.liveStatLabel}>Min promedio</Text>
              </View>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
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
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  routesList: {
    gap: 12,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  },
  routeNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  routeDestination: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  routeMeta: {
    alignItems: 'flex-end',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  liveUpdatesCard: {
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
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  liveTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  liveDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  liveStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  liveStat: {
    alignItems: 'center',
  },
  liveStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  liveStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
});