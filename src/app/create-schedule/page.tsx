'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Map = dynamic(() => import('@/components/create-schedule/Map'), { ssr: false });

import Styles from '@styles/appStyles/createSchedule.module.scss';
import SpotInfo from '@/components/create-schedule/SpotInfo';
import { PlaceDetails } from '@/types/PlaceDetails';

export default function CreateSchedule() {
    const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

    return (
        <div className={Styles.page}>
            <div className={Styles.mapContainer}>
                <h1>スケジュール作成</h1>
                <Map onPlaceSelect={setSelectedPlace} />
            </div>
            <SpotInfo place={selectedPlace} />
        </div>
    );
}
