import {useState, useEffect} from "react";
import {useSearchParams, Link} from "react-router";
import {API_BASE_URL} from "../config";

function Home() {
    // State for the tea (data)
    const [aircrafts, setAircrafts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();

    // It's giving loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Local state for the search input, keeping it low key
    const [searchTerm, setSearchTerm] = useState(searchParams.get("brand") || "");

    // Snatching params from the URL
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const currentBrand = searchParams.get("brand") || "";
    const currentStatus = searchParams.get("status") || "";

    // FETCH DATA - Manifesting the fleet
    async function fetchAircraft() {
        setLoading(true);
        setError(null);
        try {
            // Constructing the query string, serving logic
            // Backend expects 'brand' for the model name, no cap
            let query = `?page=${currentPage}&limit=5`;

            if (currentBrand) {
                query += `&brand=${currentBrand}`;
            }

            if (currentStatus) {
                query += `&status=${currentStatus}`;
            }

            // Fetching the tea from the backend
            const response = await fetch(`${API_BASE_URL}/aircraft${query}`, {
                headers: {'Accept': 'application/json'}
            });

            if (!response.ok) {
                throw new Error("Fout bij ophalen data");
            }

            // Spilling the JSON tea
            const data = await response.json();
            setAircrafts(data.items);
            setPagination(data.pagination);
        } catch (err) {
            // Big yikes, something went wrong
            setError("Kan de vloot niet laden. Is de backend wakker?");
        } finally {
            // Done manifesting
            setLoading(false);
        }
    }

    // Effect hook to trigger the fetch when params change, slay
    useEffect(() => {
        fetchAircraft();
    }, [currentPage, currentBrand, currentStatus]);

    // Search handler - serving search results
    const handleSearch = (e) => {
        e.preventDefault();
        // Resetting to page 1 because we are starting a new era
        const params = {page: 1};
        if (searchTerm) params.brand = searchTerm;
        if (currentStatus) params.status = currentStatus; // Keeping the status vibe
        setSearchParams(params);
    };

    // Filter handler - gatekeeping the list by status
    const handleFilter = (status) => {
        const params = {page: 1}; // New page, new me
        if (currentBrand) params.brand = currentBrand; // Don't lose the search tea
        if (status) params.status = status;
        setSearchParams(params);
    };

    // Delete handler - Yeeting the plane into the void
    const handleDelete = async (id) => {
        if (window.confirm("Weet je zeker dat je dit vliegtuig wilt verwijderen?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchAircraft(); // Refreshing the squad
                } else {
                    alert("Kon vliegtuig niet verwijderen.");
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert("Er ging iets mis bij het verwijderen.");
            }
        }
    };

    // Pagination handlers - moving through the eras
    const handleNext = () => {
        if (currentPage < pagination.totalPages) {
            const params = {page: currentPage + 1};
            if (currentBrand) params.brand = currentBrand;
            if (currentStatus) params.status = currentStatus;
            setSearchParams(params);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            const params = {page: currentPage - 1};
            if (currentBrand) params.brand = currentBrand;
            if (currentStatus) params.status = currentStatus;
            setSearchParams(params);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-blue-900">✈️ Airbus Hangar</h1>

                {/* Search Bar - looking for the tea */}
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Zoek op model (bijv. A320)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <button type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Zoek
                    </button>
                </form>
            </div>

            {/* FILTER BUTTONS - Choosing the vibe */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => handleFilter("")}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                        !currentStatus
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                >
                    Alles
                </button>
                <button
                    onClick={() => handleFilter("Active")}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                        currentStatus === "Active"
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                >
                    Active 🟢
                </button>
                <button
                    onClick={() => handleFilter("Maintenance")}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                        currentStatus === "Maintenance"
                            ? "bg-orange-500 text-white shadow-md"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    }`}
                >
                    Maintenance 🔧
                </button>
                <button
                    onClick={() => handleFilter("Retired")}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                        currentStatus === "Retired"
                            ? "bg-gray-600 text-white shadow-md"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                >
                    Retired 🛑
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            {loading ? (
                <p className="animate-pulse text-blue-500 text-center py-10">Motoren opwarmen... 🛫</p>
            ) : (
                <div className="space-y-4">
                    {aircrafts.map((plane) => {
                        // Handling the ID situation, keeping it flexible
                        const planeId = plane.id || plane._id;
                        return (
                            <div key={planeId}
                             className="bg-white p-4 rounded-xl shadow border border-blue-100 flex justify-between items-center hover:shadow-md transition">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{plane.model}</h2>
                                <p className="text-slate-500">
                                    {plane.registration} - <span
                                    className="font-bold text-blue-600">{plane.airline}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                    plane.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        plane.status === 'Maintenance' ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-600'
                                }`}>
                                    {plane.status}
                                </span>

                                <Link to={`/aircraft/${planeId}`} className="text-blue-500 font-bold hover:underline">
                                    Details
                                </Link>
                                <Link to={`/edit/${planeId}`} className="text-yellow-600 font-bold hover:underline">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(planeId)}
                                        className="text-red-500 font-bold hover:underline">
                                    Delete
                                </button>
                            </div>
                        </div>
                        )
                    })}

                    {aircrafts.length === 0 &&
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">Geen vliegtuigen gevonden.</p>
                            <button onClick={() => setSearchParams({})} className="text-blue-500 underline mt-2">
                                Reset filters
                            </button>
                        </div>
                    }
                </div>
            )}

            {/* PAGINATION CONTROLS - Navigating the timeline */}
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
                    disabled={currentPage >= (pagination.totalPages || 1)}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition"
                >
                    Volgende ➡️
                </button>
            </div>
        </div>
    );
}

export default Home;