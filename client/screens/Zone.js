import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';

export default function Zone() {

    const lat = 48.848242
    const long = 2.395661
    const rayon = 10000

    const [location, setLocation] = useState(null)
    const [onZone, setOnZone] = useState(false)

    function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    useEffect(() => {
        getLocationAsync()
    }, [])

    useEffect(() => {
        if (location !== null) {
            const distance = getDistanceFromLatLonInMeters(location.latitude, location.longitude, lat, long);
            if (distance <= rayon) {
                setOnZone(true)
            } else {
                setOnZone(false)
            }
        }

    }, [location])

    const getLocationAsync = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status === 'granted') {
            const currentLocation = await Location.getCurrentPositionAsync({})
            setLocation(currentLocation.coords)
        } else {
            console.log('Permissions de localisation refusées');
        }
    }

    return (
        <View style={styles.container}>
            {onZone && (
                <>
                    <Text>Vous êtes dans la zone</Text>
                </>
            )}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})