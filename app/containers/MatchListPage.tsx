import { useNavigate, useParams } from "react-router";

export default function MatchListPage() {
    const { seriesName } = useParams<{ seriesName: string }>();
    const navigate = useNavigate();

    const handleStartMatch = () => {
        navigate(`/series/${seriesName}/matches/1`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Matches for {seriesName}
            </h1>

            <button
                onClick={handleStartMatch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg md:text-xl hover:bg-blue-700 transition"
            >
                Start Match
            </button>
        </div>
    );
}
