import {Link} from 'react-router';
import AppRouter from './router';

function App() {
    // Serving the main layout look
    return (
        <div className="min-h-screen bg-slate-50">
            {/* The navbar is giving high key navigation energy */}
            <nav className="bg-blue-900 text-white p-4 shadow-lg sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    {/* Main character link */}
                    <Link to="/" className="font-bold text-xl flex items-center gap-2">
                        ✈️ Airbus Manager
                    </Link>

                    {/* Button to manifest a new plane, periodt */}
                    <Link to="/create"
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded font-bold transition">
                        + Nieuw Vliegtuig
                    </Link>
                </div>
            </nav>

            {/* The runway for our content */}
            <div className="py-8">
                <AppRouter/>
            </div>
        </div>
    );
}

export default App;