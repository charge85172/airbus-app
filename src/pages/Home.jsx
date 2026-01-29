import {useState, useEffect} from "react";
import {useSearchParams, Link} from "react-router";
import {API_BASE_URL} from "../config";

function Home() {
    const [aircrafts, setAircrafts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    // Haal params uit URL (standaard pagina 1)
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const currentSearch = searchParams.get("search") || "";

    // FETCH DATA
    async function fetchAircraft() {
        setLoading(true);
        setError(null);
        try {
            // Bouw de query string
            let query = `?page=${currentPage}&limit=5`;
            if (currentSearch) {
                query += `&search=${currentSearch}`;
            }

            const response = await fetch(`${API_BASE_URL}/aircraft${query}`, {
                headers: {'Accept': 'application/json'}
            });

            if (!response.ok) {
                throw new Error("Fout bij ophalen data");
            }

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
    }, [currentPage, currentSearch]);

    // Zoek functie
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({page: 1, search: searchTerm});
    };

    // Delete functie
    const handleDelete = async (id) => {
        if (window.confirm("Weet je zeker dat je dit vliegtuig wilt verwijderen?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchAircraft(); // Ververs de lijst
                } else {
                    alert("Kon vliegtuig niet verwijderen.");
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert("Er ging iets mis bij het verwijderen.");
            }
        }
    };

    // KNOPPEN FUNCTIES
    const handleNext = () => {
        if (currentPage < pagination.totalPages) {
            const params = {page: currentPage + 1};
            if (currentSearch) params.search = currentSearch;
            setSearchParams(params);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            const params = {page: currentPage - 1};
            if (currentSearch) params.search = currentSearch;
            setSearchParams(params);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-900">✈️ Airbus Hangar</h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Zoek vliegtuig..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Zoek
                    </button>
                </form>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            {loading ? (
                <p className="animate-pulse text-blue-500 text-center py-10">Motoren opwarmen... 🛫</p>
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
                                {/* Status Badge */}
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                    plane.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        plane.status === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-600'
                                }`}>
                                    {plane.status}
                                </span>

                                <Link to={`/aircraft/${plane.id}`} className="text-blue-500 font-bold hover:underline">
                                    Details
                                </Link>
                                <Link to={`/edit/${plane.id}`} className="text-yellow-600 font-bold hover:underline">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(plane.id)}
                                        className="text-red-500 font-bold hover:underline">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {aircrafts.length === 0 &&
                        <p className="text-gray-500 text-center py-10">Geen vliegtuigen gevonden.</p>}
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