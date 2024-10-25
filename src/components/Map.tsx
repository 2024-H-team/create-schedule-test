'use client';
import Style from '@styles/mapStyles.module.scss';
import { useMemo, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const libraries: 'places'[] = ['places'];

const MapWithSearch: React.FC = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
        language: 'ja',
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.LatLng | null>(null);

    const center = useMemo(() => ({ lat: 35.6762, lng: 139.6503 }), []); // Tokyo tọa độ

    const handlePlaceSelect = () => {
        if (autoCompleteRef.current) {
            const place = autoCompleteRef.current.getPlace();

            if (place && place.geometry && place.geometry.location) {
                const location = place.geometry.location;
                setSelectedPlace(location);
                mapRef.current?.panTo({ lat: location.lat(), lng: location.lng() });
            }
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className={Style.mapContainer}>
            <Autocomplete
                onLoad={(autocomplete) => (autoCompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceSelect}
                className={Style.searchBox}
            >
                <input type="text" placeholder="Search for a place" />
            </Autocomplete>

            <GoogleMap
                center={selectedPlace || center}
                zoom={10}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                mapContainerClassName={Style.mapContainer}
            >
                {selectedPlace && <Marker position={selectedPlace} />}
            </GoogleMap>
        </div>
    );
};

export default MapWithSearch;
