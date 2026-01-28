import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";

function Edit() {
    const {id} = useParams(); // Welk vliegtuig gaan we verbouwen?
    const navigate = useNavigate();

    // We beginnen met een leeg formulier
    const [formData, setFormData] = useState({
        model: '',
        registration: '',
        airline: '',
        status: 'Active'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Haal de HUIDIGE gegevens op als de pagina laadt
    useEffect(() => {
        async function fetchPlane() {
            try {
                const response = await fetch(`http://145.23.237.24:8000/aircraft/${id}`, {
                    headers: {'Accept': 'application/json'}
                });
                const data = await response.json();

                // Vul het formulier met de data uit de database
                setFormData({
                    model: data.model,
                    registration: data.registration,
                    airline: data.airline,
                    status: data.status
                });
                setLoading(false);
            } catch (e) {
                setError("Kon vliegtuiggegevens niet laden.");
                setLoading(false);
            }
        }

        fetchPlane();
    }, [id]);

    // 2. Update de state als je typt (hetzelfde als bij Create)
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. Stuur de WIJZIGINGEN naar de backend (PUT request)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://145.23.237.24:8000/aircraft/${id}`, {
                method: 'PUT', // <--- LET OP: PUT i.p.v. POST
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Update mislukt!");

            // Klaar? Terug naar de detail pagina!
            navigate(`/aircraft/${id}`);

        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="text-center mt-10">Gegevens ophalen...</p>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-600 mb-6">✏️ Vliegtuig Bewerken</h2>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">Model</label>
                    <input
                        type="text" name="model" value={formData.model} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Registratie</label>
                    <input
                        type="text" name="registration" value={formData.registration} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Luchtvaartmaatschappij</label>
                    <input
                        type="text" name="airline" value={formData.airline} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Status</label>
                    <select
                        name="status" value={formData.status} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                        <option value="Active">Active 🟢</option>
                        <option value="Maintenance">Maintenance 🔧</option>
                        <option value="Retired">Retired 🛑</option>
                    </select>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/aircraft/${id}`)}
                        className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded hover:bg-gray-300 transition"
                    >
                        Annuleren
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-yellow-500 text-white font-bold py-2 rounded hover:bg-yellow-600 transition"
                    >
                        Opslaan ✨
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Edit;