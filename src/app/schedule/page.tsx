'use client';

import { useState, useEffect } from 'react';
import ScheduleMap from '../../components/schedule/Map';
import Styles from '@styles/appStyles/scheduleMap.module.scss';
import { useMapContext } from '@/components/MapProvider';

export default function Schedule() {
    const { isLoaded } = useMapContext(); // Lấy trạng thái isLoaded từ MapProvider
    const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(null);

    // Khi API đã sẵn sàng, đặt travelMode thành WALKING
    useEffect(() => {
        if (isLoaded && travelMode === null) {
            setTravelMode(google.maps.TravelMode.WALKING);
        }
    }, [isLoaded, travelMode]);

    const handleTravelModeChange = (mode: google.maps.TravelMode) => {
        setTravelMode(mode);
    };

    if (travelMode === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>hi</h1>
            <ScheduleMap travelMode={travelMode} />
            <div className={Styles.btnBox}>
                <button onClick={() => handleTravelModeChange(google.maps.TravelMode.BICYCLING)}>自転車</button>
                <button onClick={() => handleTravelModeChange(google.maps.TravelMode.WALKING)}>徒歩</button>
                <button onClick={() => handleTravelModeChange(google.maps.TravelMode.DRIVING)}>車</button>
            </div>
        </div>
    );
}
