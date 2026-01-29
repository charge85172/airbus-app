import {Routes, Route, Link} from 'react-router';
import Home from './pages/Home';
import Create from './pages/Create';
import Detail from './pages/Detail';
import Edit from './pages/Edit'
import NotFound from './pages/NotFound';

function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-blue-900 text-white p-4 shadow-lg sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link to="/" className="font-bold text-xl flex items-center gap-2">
                        ✈️ Airbus Manager
                    </Link>
                    {/* De knop om naar de Create pagina te gaan */}
                    <Link to="/create"
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded font-bold transition">
                        + Nieuw Vliegtuig
                    </Link>
                </div>
            </nav>

            <div className="py-8">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/create" element={<Create/>}/>
                    <Route path="/aircraft/:id" element={<Detail/>}/>
                    <Route path="/edit/:id" element={<Edit/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default App;