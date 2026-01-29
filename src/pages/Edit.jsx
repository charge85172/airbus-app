import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import {API_BASE_URL} from "../config";

function Edit() {
    const {id} = useParams();
    const navigate = useNavigate();

    // State for the form, keeping it 100
    const [formData, setFormData] = useState({
        model: '',
        registration: '',
        airline: '',
        status: 'Active'
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetching the OG data to pre-fill the form
    useEffect(() => {
        async function fetchPlane() {
            try {
                const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
                    headers: {'Accept': 'application/json'}
                });
                if (!response.ok) throw new Error("Niet gevonden");
                
                const data = await response.json();
                setFormData({
                    model: data.model,
                    registration: data.registration,
                    airline: data.airline,
                    status: data.status
                });
            } catch (e) {
                setError("Kon vliegtuiggegevens niet laden.");
            } finally {
                setLoading(false);
            }
        }

        fetchPlane();
    }, [id]);

    // Handling input changes, keeping the vibe check
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: name === 'status' ? value : value.toUpperCase()
        });
    };

    // Submitting the glow up
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Update mislukt!");

            // Back to the detail page, showing off the new look
            navigate(`/aircraft/${id}`);

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="text-center mt-10 animate-pulse text-blue-500">Gegevens ophalen...</p>;
    if (error && !formData.model) return <div className="text-center mt-10 text-red-500">{error}</div>;

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
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Registratie</label>
                    <input
                        type="text" name="registration" value={formData.registration} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Luchtvaartmaatschappij</label>
                    <input
                        type="text" name="airline" value={formData.airline} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500 outline-none"
                        required
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
                        disabled={submitting}
                        className="flex-1 bg-yellow-500 text-white font-bold py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
                    >
                        {submitting ? 'Opslaan...' : 'Opslaan ✨'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Edit;