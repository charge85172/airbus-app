import {useState, useEffect} from "react";
import {useSearchParams, Link} from "react-router";

function Home() {
    const [aircrafts, setAircrafts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Haal params uit URL (standaard pagina 1)
    const currentPage = parseInt(searchParams.get("page")) || 1;

    // FETCH DATA
    async function fetchAircraft() {
        setLoading(true);
        try {
            // We halen 5 vliegtuigen per keer op
            const response = await fetch(`http://localhost:8000/aircraft?page=${currentPage}&limit=5`, {
                headers: {'Accept': 'application/json'}
            });

            const data = await response.json();
            setAircrafts(data.items);
            setPagination(data.pagination);
        } catch (err) {
            setError("Kan de vloot niet laden. Is de backend wakker?");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAircraft();
    }, [currentPage]);

    // KNOPPEN FUNCTIES
    const handleNext = () => {
        if (currentPage < pagination.totalPages) {
            setSearchParams({page: currentPage + 1});
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setSearchParams({page: currentPage - 1});
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">✈️ Airbus Hangar</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            {loading ? (
                <p className="animate-pulse text-blue-500">Motoren opwarmen... 🛫</p>
            ) : (
                <div className="space-y-4">
                    {aircrafts.map((plane) => (
                        <div key={plane.id}
                             className="bg-white p-4 rounded-xl shadow border border-blue-100 flex justify-between items-center hover:shadow-md transition">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{plane.model}</h2>
                                <p className="text-slate-500">
                                    {plane.registration} - <span
                                    className="font-bold text-blue-600">{plane.airline}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Status Badge met kleurtjes! */}
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                    plane.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        plane.status === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-600'
                                }`}>
                                    {plane.status}
                                </span>

                                {/* De Details Knop (Werkt nog niet, maar ziet er leuk uit!) */}
                                <Link to={`/aircraft/${plane.id}`} className="text-blue-500 font-bold hover:underline">
                                    Bekijk Details 👉
                                </Link>
                            </div>
                        </div>
                    ))}

                    {aircrafts.length === 0 && <p className="text-gray-500">Geen vliegtuigen gevonden.</p>}
                </div>
            )}

            {/* ✨ PAGINATION CONTROLS ✨ */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="bg-white border border-gray-300 px-4 py-2 rounded text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                    ⬅️ Vorige
                </button>

                <span className="font-bold text-blue-900">
                    Pagina {currentPage} van {pagination.totalPages || 1}
                </span>

                <button
                    onClick={handleNext}
                    disabled={currentPage >= pagination.totalPages}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition"
                >
                    Volgende ➡️
                </button>
            </div>
        </div>
    );
}

export default Home;