// Importing the main characters for the routing moment
import {Routes, Route} from 'react-router';
import Home from './pages/Home';
import Create from './pages/Create';
import Detail from './pages/Detail';
import Edit from './pages/Edit';
import NotFound from './pages/NotFound';

function AppRouter() {
    // Serving the navigation realness
    return (
        <Routes>
            {/* The main stage, no cap */}
            <Route path="/" element={<Home/>}/>

            {/* Manifesting a new creation */}
            <Route path="/create" element={<Create/>}/>

            {/* Spilling the details on a specific queen */}
            <Route path="/aircraft/:id" element={<Detail/>}/>

            {/* Time for a glow up */}
            <Route path="/edit/:id" element={<Edit/>}/>

            {/* Flop era, page not found */}
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}

export default AppRouter;