import {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router";

function Detail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [plane, setPlane] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlane();
    }, [id]);

    async function fetchPlane() {
        try {
            const response = await fetch(`http://145.23.237.24:8000/aircraft/${id}`, {
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

    async function handleDelete() {
        if (!confirm("Weet je zeker dat je dit vliegtuig wilt slopen? 🏗️")) return;
        try {
            await fetch(`http://145.23.237.24:8000/aircraft/${id}`, {
                method: 'DELETE',
                headers: {'Accept': 'application/json'}
            });
            navigate('/');
        } catch (e) {
            alert("Verwijderen mislukt!");
        }
    }

    if (loading) return <p className="text-center mt-10 text-blue-500 animate-pulse">Checking flight data... 📡</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10">
            <Link to="/" className="text-gray-500 hover:text-blue-600 mb-4 inline-block">
                &larr; Terug naar Hangar
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
                <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{plane.model}</h1>
                    <span className="bg-white text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
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

                    {/* ✨ HIER ZIJN DE KNOPPEN ✨ */}
                    <div className="flex gap-4 mt-8 pt-4 border-t">
                        {/* 1. Edit Knop */}
                        <Link
                            to={`/edit/${plane.id}`}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center font-bold py-2 rounded transition"
                        >
                            ✏️ Bewerken
                        </Link>

                        {/* 2. Delete Knop */}
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