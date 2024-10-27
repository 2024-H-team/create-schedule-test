import Link from 'next/link';

export default function Home() {
    return (
        <div
            style={{
                width: '200px',
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Link
                href="/create-schedule"
                style={{
                    width: 'auto',
                    padding: '8px 20px',
                    backgroundColor: '#d9d9d9',
                    color: 'black',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    textAlign: 'center',
                }}
            >
                スケジュール作成
            </Link>
        </div>
    );
}
