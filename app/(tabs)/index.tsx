import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Clock, Bus, TrendingUp, Star, TrendingDown, Minus } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<{ name: string } | null>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const quickActions = [
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

  const popularRoutes = [
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

  const liveData = {
    trafficStatus: 'good',
    activeRoutes: 8,
    punctuality: 95,
    avgMinutes: 12,
  };

  const handleQuickAction = (id: string) => {
    switch (id) {
      case '1':
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
            <Text style={styles.greeting}>
              {`¡Hola ${user?.name || ''}!`}
            </Text>
            <Text style={styles.subtitle}>¿A dónde quieres ir hoy?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push('/user-details')}
          >
            <Text style={styles.profileInitial}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </TouchableOpacity>
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

function getRandomColor() {
  const colors = [
    '#6366F1', '#1E40AF', '#10B981', '#F59E0B', '#DC2626', '#F472B6', '#6B7280', '#22D3EE'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
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
    backgroundColor: getRandomColor(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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