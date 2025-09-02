import type { IPlayer } from '~/data/players';

export const PlayerSelector = ({ players, player, setPlayer, label }: PlayerSelectorProps) => {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <select
        value={player || ''}
        onChange={(e) => setPlayer(e.target.value)}
        className="border rounded p-2"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {players.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
};

interface PlayerSelectorProps {
  players: IPlayer[];
  player: string | null;
  setPlayer: (name: string) => void;
  label: string;
}
