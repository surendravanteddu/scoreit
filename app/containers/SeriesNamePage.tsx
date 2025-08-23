import { useState } from 'react';
import {useNavigate} from "react-router";

interface SeriesNamePageProps {
  onNext: (seriesName: string) => void;
}

export default function SeriesNamePage() {
  const [seriesName, setSeriesName] = useState<string>('');
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/series/${seriesName}/matches`);
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.title}>Start A New Series</h1>
        <input
            type="text"
            placeholder="Enter series name"
            value={seriesName}
            onChange={(e) => setSeriesName(e.target.value)}
            style={styles.input}
        />
        <button onClick={handleNext} style={styles.button}>Next</button>
      </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    height: '100vh', padding: 20, boxSizing: 'border-box'
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%', maxWidth: 300,
    padding: 12, fontSize: 18, marginBottom: 10,
    borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box'
  },
  button: {
    padding: 12, fontSize: 18, width: '100%', maxWidth: 300,
    borderRadius: 8, border: 'none',
    backgroundColor: '#007bff', color: 'white', cursor: 'pointer'
  }
};
