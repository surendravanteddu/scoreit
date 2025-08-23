import SeriesNamePage from '../containers/SeriesNamePage';

export interface Series {
  name: string;
}

export interface Match {
  name: string;
}

export default function App() {
  return (
      <SeriesNamePage />
  );
}
