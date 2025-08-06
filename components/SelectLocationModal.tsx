import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { Navigation, MapPin } from 'lucide-react-native';

type SelectLocationModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (coords: { latitude: number; longitude: number }) => void;
  initialField?: 'origin' | 'destination';
};

export default function SelectLocationModal({
  visible,
  onClose,
  onSelect,
  initialField = 'origin',
}: SelectLocationModalProps) {
  const [selected, setSelected] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Permite seleccionar en el mapa
  const handleMapPress = (e: MapPressEvent) => {
    setSelected(e.nativeEvent.coordinate);
  };

  // Permite usar la ubicación actual
  const handleUseMyLocation = async () => {
    setGettingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setGettingLocation(false);
      Alert.alert('Permiso denegado', 'No se pudo acceder a la ubicación.');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setSelected({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setGettingLocation(false);
  };

  // Confirma la selección
  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      setSelected(null);
      onClose();
    }
  };

  // Limpia selección al cerrar
  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 18.4861,
            longitude: -69.9312,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress}
        >
          {selected && <Marker coordinate={selected} />}
        </MapView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !selected && { backgroundColor: '#ccc' }]}
            onPress={handleConfirm}
            disabled={!selected}
          >
            <Text style={{ color: '#fff' }}>Confirmar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.locationButtons}>
          <TouchableOpacity style={styles.locationButton} onPress={handleUseMyLocation} disabled={gettingLocation}>
            {gettingLocation ? (
              <ActivityIndicator color="#1E40AF" size={20} />
            ) : (
              <Navigation color="#1E40AF" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1E40AF',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  locationButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  locationButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
