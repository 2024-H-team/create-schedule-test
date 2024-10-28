'use client';

import Styles from '@styles/componentStyles/mapStyles.module.scss';
import { useMemo, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { PlaceDetails } from '@/types/PlaceDetails';
import { libraries } from '@/utils/googleMapConfig';

interface MapWithSearchProps {
    onPlaceSelect: (place: PlaceDetails | null) => void;
}

const MapWithSearch: React.FC<MapWithSearchProps> = ({ onPlaceSelect }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
        language: 'ja',
    });

    const mapRef = useRef<google.maps.Map | null>(null);
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.LatLng | null>(null);

    const center = useMemo(() => ({ lat: 34.6937, lng: 135.5023 }), []);

    useEffect(() => {
        if (!selectedPlace || !mapRef.current) return;

        const initializeMarker = async () => {
            try {
                const { AdvancedMarkerElement } = (await google.maps.importLibrary(
                    'marker',
                )) as typeof google.maps.marker;

                const markerContent = document.createElement('div');
                markerContent.style.backgroundColor = 'red';
                markerContent.style.width = '32px';
                markerContent.style.height = '32px';
                markerContent.style.borderRadius = '50%';

                if (markerRef.current) {
                    markerRef.current.position = selectedPlace;
                    markerRef.current.content = markerContent;
                } else {
                    markerRef.current = new AdvancedMarkerElement({
                        position: selectedPlace,
                        map: mapRef.current,
                        title: 'Selected Place',
                        content: markerContent,
                    });
                }
            } catch (error) {
                console.error('Error initializing AdvancedMarkerElement: ', error);
            }
        };

        initializeMarker();
    }, [selectedPlace]);

    const fetchPlaceDetailsFromLatLng = (latLng: google.maps.LatLng) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                const placeId = results[0].place_id;
                if (placeId) {
                    const service = new google.maps.places.PlacesService(mapRef.current!);
                    service.getDetails({ placeId }, (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                            const placeDetails: PlaceDetails = {
                                name: place.name || '',
                                address: place.formatted_address || '',
                                phoneNumber: place.formatted_phone_number || undefined,
                                website: place.website || undefined,
                                rating: place.rating || undefined,
                                location: { lat: latLng.lat(), lng: latLng.lng() },
                            };
                            setSelectedPlace(latLng);
                            onPlaceSelect(placeDetails);
                        }
                    });
                }
            } else {
                console.error('Geocoding failed: ' + status);
            }
        });
    };

    const handlePlaceSelect = () => {
        if (autoCompleteRef.current) {
            const place = autoCompleteRef.current.getPlace();

            if (place && place.geometry && place.geometry.location) {
                const location = place.geometry.location;
                setSelectedPlace(location);
                mapRef.current?.panTo({ lat: location.lat(), lng: location.lng() });
                mapRef.current?.setZoom(15);

                const placeDetails: PlaceDetails = {
                    name: place.name || '',
                    address: place.formatted_address || '',
                    phoneNumber: place.formatted_phone_number || undefined,
                    website: place.website || undefined,
                    rating: place.rating || undefined,
                    location: { lat: location.lat(), lng: location.lng() },
                };

                onPlaceSelect(placeDetails);
            }
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <>
            <style>
                {`
                .gm-style-iw {
                    display: none!important;
                }
                .gm-style-iw-tc {
                    display: none!important;
                }
            `}
            </style>
            <div className={Styles.mapContainer}>
                <Autocomplete
                    onLoad={(autocomplete) => (autoCompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceSelect}
                    className={Styles.searchBox}
                >
                    <input type="text" placeholder="Search for a place" />
                </Autocomplete>

                <GoogleMap
                    center={selectedPlace || center}
                    zoom={10}
                    mapContainerClassName={Styles.mapContainer}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    onLoad={(map) => {
                        mapRef.current = map;
                        map.setOptions({ mapId: '26a4732fc7efb60' });
                    }}
                    onClick={(e) => {
                        const latLng = e.latLng;
                        if (latLng) fetchPlaceDetailsFromLatLng(latLng);
                    }}
                />
            </div>
        </>
    );
};

export default MapWithSearch;
