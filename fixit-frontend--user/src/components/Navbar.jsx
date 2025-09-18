import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md'; // Icons for toggle
import manIcon from '/man-icon-illustration-vector.jpg';
import Currpgcontext from '../context/currpgcontext';
import { useAuth } from '../context/Logincontextprovider';

const Navbar = ({ userName }) => {
    const { logout } = useAuth();
    const { setcurrpg } = useContext(Currpgcontext);
    const location = useLocation();
    const navigate = useNavigate();

    const [isSmall, setIsSmall] = useState(false); 

    const toggleSidebar = () => {
        setIsSmall(prev => !prev);
    };

    const buttonMappings = [
        { id: 'b3', text: 'Home', icon: <i className="fas fa-home" />, path: '/' },
        { id: 'b1', text: 'Request', icon: <i className="fas fa-file-alt" />, path: '/request' },
        { id: 'b5', text: 'Track Request', icon: <i className="fas fa-map-marker-alt" />, path: '/track-request' },
        { id: 'b4', text: 'History', icon: <i className="fas fa-history" />, path: '/history' },
        { id: 'b2', text: 'Feedback', icon: <i className="fas fa-comment-dots" />, path: '/feedback' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div
            className={`${isSmall ? 'w-16' : 'w-64'
                } transition-all duration-300 bg-gradient-to-b from-indigo-500 to-purple-500 min-h-screen text-white p-4 flex flex-col shadow-lg`}
        >
            <div className="flex flex-row justify-end mb-6">
                <button onClick={toggleSidebar} className="text-white text-3xl">
                    {isSmall ? <MdMenu /> : <MdClose />}
                </button>
            </div>

            <div className="flex flex-col items-center mb-6">
                <img
                    src={manIcon}
                    alt="User"
                    className={`${isSmall ? 'w-8 h-8 ' : 'w-20 h-20'}  rounded-full mb-2  border-blue-400`}
                />
                {!isSmall && <p className="text-white font-semibold text-lg">{userName}</p>}
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-2 flex-1">
                {buttonMappings.map(({ id, text, icon, path }) => (
                    <Link
                        key={id}
                        to={path}
                        id={id}
                        onClick={() => setcurrpg(text)}
                        className={`${isSmall?'px-1.5':'px-4'} flex flex-row  items-center space-x-10 py-2 rounded-lg transition hover:bg-purple-500 overflow-hidden ${location.pathname === path ? 'bg-purple-700' : ''
                            }`}
                    >
                        <span className="text-lg">{icon}</span>
                        {!isSmall && <span className="whitespace-nowrap">{text}</span>}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <button
                id="logout"
                onClick={handleLogout}
                className={`${isSmall?'px-1.5':'px-4'} flex flex-row items-center py-2 space-x-10 rounded-lg bg-red-500 hover:bg-red-600 transition`}
            >
                <i className="fas fa-sign-out-alt " />
                {!isSmall && (<span className="whitespace-nowrap">Logout </span>)}
            </button>
        </div>
    );
};

export default Navbar;
