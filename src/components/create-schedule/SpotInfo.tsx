import Styles from '@styles/componentStyles/spotInfo.module.scss';
import { PlaceDetails } from '@/types/PlaceDetails';

interface SpotInfoProps {
    place: PlaceDetails | null;
}

export default function SpotInfo({ place }: SpotInfoProps) {
    // console.log(place);
    return (
        <div className={Styles.infoContainer}>
            {place ? (
                <>
                    <h2>{place.name}</h2>
                    <p>住所：{place.address}</p>
                    {place.phoneNumber && <p>電話番号: {place.phoneNumber}</p>}
                    {place.website && (
                        <p>
                            ウェブサイト:{' '}
                            <a href={place.website} target="_blank" rel="noopener noreferrer">
                                {place.website}
                            </a>
                        </p>
                    )}
                    {place.rating && <p>評価 : {place.rating}★</p>}
                </>
            ) : (
                <p>選択されていません。地図上で場所を選択してください。</p>
            )}
        </div>
    );
}
