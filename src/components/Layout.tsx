import { Outlet, NavLink } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-end py-2">
            <a href="tel:+233500998349" className="flex items-center text-primary">
              <Phone size={20} className="mr-2" />
              <span className="font-medium">+233 500 998 349</span>
            </a>
          </div>
        </div>
        <nav className="container mx-auto px-4 py-4">
          <ul className="flex space-x-8">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-medium ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/properties"
                className={({ isActive }) =>
                  `font-medium ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`
                }
              >
                Properties
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `font-medium ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `font-medium ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2">© 2024 Scale-R PMS. All rights reserved.</p>
            <p className="mb-2">123 Independence Avenue, Accra, Ghana</p>
            <p className="text-sm text-gray-400">
              This website is for informational purposes only. All property information and details are subject to change without notice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}