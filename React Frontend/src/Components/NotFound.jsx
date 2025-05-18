// src/components/NotFound.jsx
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="text-center mt-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                404 - Page Not Found
            </h1>
            <p className="text-gray-600 mb-8">
                The page you're looking for doesn't exist.
            </p>
            <Link
                to="/tickets"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md"
            >
                Return to Tickets
            </Link>
        </div>
    );
}

export default NotFound;