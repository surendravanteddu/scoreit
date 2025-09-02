import MatchListPage from '~/containers/MatchListPage';

export interface Series {
  name: string;
}

export interface Match {
  name: string;
}

export default function App() {
  return <MatchListPage />;
}
