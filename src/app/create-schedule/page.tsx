'use client';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';

const Map = dynamic(() => import('@/components/create-schedule/Map'), { ssr: false });

import Styles from '@styles/appStyles/createSchedule.module.scss';
import SpotInfo from '@/components/create-schedule/SpotInfo';
import { PlaceDetails } from '@/types/PlaceDetails';
import SelectedSpotsContainer from '@/components/create-schedule/SelectedSpotsContainer';

export default function CreateSchedule() {
    const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
    const [selectedSpots, setSelectedSpots] = useState<PlaceDetails[]>([]);

    const handleAddSpot = useCallback((spot: PlaceDetails) => {
        setSelectedSpots((prevSpots) => [...prevSpots, spot]);
    }, []);
    const handleDeleteSpot = useCallback((index: number) => {
        setSelectedSpots((prevSpots) => prevSpots.filter((_, i) => i !== index));
    }, []);

    return (
        <div className={Styles.page}>
            <div className={Styles.mapContainer}>
                <h1>スケジュール作成</h1>
                <Map onPlaceSelect={setSelectedPlace} />
            </div>
            <SpotInfo place={selectedPlace} onAddSpot={handleAddSpot} />
            <SelectedSpotsContainer selectedSpots={selectedSpots} onDeleteSpot={handleDeleteSpot} />
        </div>
    );
}
