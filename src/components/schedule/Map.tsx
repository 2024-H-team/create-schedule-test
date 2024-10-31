'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { PlaceDetails } from '@/types/PlaceDetails';
import Styles from '@styles/componentStyles/mapStyles.module.scss';
import { getGoogleMapLibraries } from '@/utils/googleMapConfig';

const ScheduleMap: React.FC = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: getGoogleMapLibraries(['directions', 'geometry']).slice() as unknown as Library[],
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const [places, setPlaces] = useState<PlaceDetails[]>([]);

    useEffect(() => {
        const storedPlaces = sessionStorage.getItem('ScheduleSpot');
        if (storedPlaces) {
            const parsedPlaces: PlaceDetails[] = JSON.parse(storedPlaces);
            setPlaces(parsedPlaces);
            sessionStorage.removeItem('ScheduleSpot');
        }
    }, []);

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
                {places.map((place, index) => (
                    <Marker key={index} position={place.location} title={place.name} />
                ))}
                {places.length > 1 && (
                    <Polyline
                        path={places.map((place) => place.location)}
                        options={{
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default ScheduleMap;
