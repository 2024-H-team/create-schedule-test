// ScheduleMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { PlaceDetails } from '@/types/PlaceDetails';
import Styles from '@styles/componentStyles/createScheduleMapStyles.module.scss';
import { useMapContext } from '@/components/MapProvider';

interface ScheduleMapProps {
    travelMode: google.maps.TravelMode;
}

const ScheduleMap: React.FC<ScheduleMapProps> = ({ travelMode }) => {
    const { isLoaded, loadError } = useMapContext();
    const mapRef = useRef<google.maps.Map | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [places, setPlaces] = useState<PlaceDetails[]>([]);

    useEffect(() => {
        const storedPlaces = sessionStorage.getItem('ScheduleSpot');
        if (storedPlaces) {
            const parsedPlaces: PlaceDetails[] = JSON.parse(storedPlaces);
            setPlaces(parsedPlaces);
            sessionStorage.removeItem('ScheduleSpot');
        }
    }, []);

    useEffect(() => {
        if (places.length < 2 || !isLoaded) return;

        const origin = places[0].location;
        const destination = places[0].location;
        const waypoints = places.slice(1).map((place) => ({
            location: place.location,
            stopover: true,
        }));

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin,
                destination,
                waypoints,
                travelMode, // Sử dụng travelMode được truyền từ Schedule
                optimizeWaypoints: false,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    setDirections(result);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            },
        );
    }, [places, isLoaded, travelMode]); // Theo dõi travelMode để cập nhật hành trình khi thay đổi

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) return <div>Loading...</div>;

    const center = places.length > 0 ? places[0].location : { lat: 34.6937, lng: 135.5023 };

    return (
        <div className={Styles.mapContainer}>
            <GoogleMap
                center={center}
                zoom={10}
                mapContainerClassName={Styles.mapContainer}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            >
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </div>
    );
};

export default ScheduleMap;
