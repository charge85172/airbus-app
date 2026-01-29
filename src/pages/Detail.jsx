import {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router";
import {API_BASE_URL} from "../config";

function Detail() {
    const {id} = useParams();
    const navigate = useNavigate();
    // State for the queen herself
    const [plane, setPlane] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetching the tea when the ID changes
    useEffect(() => {
        fetchPlane();
    }, [id]);

    // Manifesting the plane details
    async function fetchPlane() {
        try {
            const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
                headers: {'Accept': 'application/json'}
            });
            if (!response.ok) throw new Error("Vliegtuig niet gevonden!");
            const data = await response.json();
            setPlane(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Yeeting the plane out of existence
    async function handleDelete() {
        if (window.confirm("Weet je zeker dat je dit vliegtuig wilt slopen? 🏗️")) {
            try {
                const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
                    method: 'DELETE',
                    headers: {'Accept': 'application/json'}
                });

                if (response.ok) {
                    navigate('/');
                } else {
                    alert("Verwijderen mislukt!");
                }
            } catch (e) {
                console.error("Delete error:", e);
                alert("Er ging iets mis bij het verwijderen.");
            }
        }
    }

    // Loading state - hold up, let her cook
    if (loading) return <p className="text-center mt-10 text-blue-500 animate-pulse">Checking flight data... 📡</p>;

    // Error state - flop era
    if (error) return (
        <div className="text-center mt-10">
            <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
            <Link to="/" className="text-blue-600 hover:underline">Terug naar Hangar</Link>
        </div>
    );

    // FIX: Using _id as fallback because the backend be playing games
    const planeId = plane.id || plane._id;

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10">
            <Link to="/" className="text-gray-500 hover:text-blue-600 mb-4 inline-block">
                &larr; Terug naar Hangar
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
                <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{plane.model}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        plane.status === 'Active' ? 'bg-green-100 text-green-800' :
                            plane.status === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                    }`}>
                        {plane.status}
                    </span>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-gray-500 text-sm">Registratie</p><p
                            className="font-bold text-lg">{plane.registration}</p></div>
                        <div><p className="text-gray-500 text-sm">Airline</p><p
                            className="font-bold text-lg">{plane.airline}</p></div>
                    </div>

                    {/* ACTION BUTTONS - Time to choose */}
                    <div className="flex gap-4 mt-8 pt-4 border-t">
                        {/* 1. Edit Button - Glow up time */}
                        <Link
                            to={`/edit/${planeId}`}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center font-bold py-2 rounded transition"
                        >
                            ✏️ Bewerken
                        </Link>

                        {/* 2. Delete Button - Bye Felicia */}
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition"
                        >
                            🗑️ Verwijderen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;