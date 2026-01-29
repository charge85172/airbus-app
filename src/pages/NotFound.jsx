import {Link} from 'react-router';

function NotFound() {
    return (
        <div className="max-w-4xl mx-auto p-4 text-center py-20">
            <h1 className="text-6xl font-bold text-blue-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Pagina niet gevonden</h2>
            <p className="text-gray-500 mb-8">
                Oeps! De pagina die je zoekt bestaat niet of is verplaatst.
            </p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                Terug naar Home
            </Link>
        </div>
    );
}

export default NotFound;