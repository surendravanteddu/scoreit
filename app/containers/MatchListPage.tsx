import { useNavigate, useParams } from 'react-router';
import React from 'react';

export default function MatchListPage() {
  const { seriesName = 'Ashes' } = useParams<{ seriesName: string }>();
  const [playersCount, setPlayersCount] = React.useState('');
  const navigate = useNavigate();

  const handleStartMatch = () => {
    navigate(`/series/${seriesName}/matches/1?playersCount=${playersCount}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div style={{ marginBottom: 10 }}>
        <b>Enter number of players per team </b>
      </div>
      <input
        type="number"
        value={playersCount}
        onChange={(e) => setPlayersCount(e.target.value)}
        style={styles.input}
      />
      <button
        onClick={handleStartMatch}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg md:text-xl hover:bg-blue-700 transition"
      >
        Start Match
      </button>
    </div>
  );
}
const styles: { [key: string]: React.CSSProperties } = {
  input: {
    width: '20%',
    maxWidth: 300,
    padding: 12,
    fontSize: 18,
    marginBottom: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    padding: 12,
    fontSize: 18,
    width: '100%',
    maxWidth: 300,
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};
