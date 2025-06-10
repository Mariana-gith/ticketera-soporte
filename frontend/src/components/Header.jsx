import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = ({ auth, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Ticketera</h1>
      
      {/* Botón del menú hamburguesa */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Menú de navegación */}
      <nav className={`absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:flex md:items-center ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col md:flex-row gap-4">
          <li><Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link></li>
          {auth.isAuthenticated && <li><Link to="/tickets" className="hover:text-gray-400">Tickets</Link></li>}
          <li>
            <button onClick={onLogout} className="hover:text-red-500">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;


