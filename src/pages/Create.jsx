import {useState} from 'react';
import {useNavigate} from 'react-router';
import {API_BASE_URL} from "../config";

function Create() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        model: '',
        registration: '',
        airline: '',
        status: 'Active'
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: name === 'status' ? value : value.toUpperCase()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Extra client-side validatie (voor de zekerheid)
        if (!formData.model || !formData.registration || !formData.airline) {
            setError("Vul alle velden in!");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/aircraft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Er ging iets mis!');
            }

            navigate('/');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">✈️ Nieuw Vliegtuig Toevoegen</h2>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">Model</label>
                    <input
                        type="text" name="model" value={formData.model} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Bijv. A380" required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Registratie</label>
                    <input
                        type="text" name="registration" value={formData.registration} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Bijv. PH-SLAY" required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Luchtvaartmaatschappij</label>
                    <input
                        type="text" name="airline" value={formData.airline} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Bijv. KLM" required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700">Status</label>
                    <select
                        name="status" value={formData.status} onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Active">Active 🟢</option>
                        <option value="Maintenance">Maintenance 🔧</option>
                        <option value="Retired">Retired 🛑</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isSubmitting ? 'Bezig met toevoegen...' : 'Toevoegen aan Hangar 🚀'}
                </button>
            </form>
        </div>
    );
}

export default Create;