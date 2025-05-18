// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/tickets" className="text-xl font-bold text-gray-800">
                        Ticket System
                    </Link>

                    <div className="flex space-x-4">
                        <Link
                            to="/tickets"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                location.pathname === '/tickets'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Tickets
                        </Link>
                        <Link
                            to="/tickets/new"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                location.pathname === '/tickets/new'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            New Ticket
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;