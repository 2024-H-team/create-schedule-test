import Styles from '@styles/componentStyles/SelectedSpotsContainer.module.scss';
import SelectedSpot from './SelectedSpot';
import { PlaceDetails } from '@/types/PlaceDetails';

interface SelectedSpotsContainerProps {
    selectedSpots: PlaceDetails[];
    onDeleteSpot: (index: number) => void;
}

export default function SelectedSpotsContainer({ selectedSpots, onDeleteSpot }: SelectedSpotsContainerProps) {
    return (
        <div className={Styles.Container}>
            {selectedSpots.map((spot, index) => (
                <SelectedSpot
                    key={index}
                    name={spot.name}
                    address={spot.address}
                    onDelete={() => onDeleteSpot(index)}
                />
            ))}
        </div>
    );
}
