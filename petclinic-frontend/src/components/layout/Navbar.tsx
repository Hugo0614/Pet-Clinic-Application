import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white/90 backdrop-blur-md py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group" onClick={handleLinkClick}>
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Pet<span className="text-primary-500">Clinic</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 lg:gap-8 items-center">
            {!user && (
              <>
                <Link 
                  to="/login" 
                  className={`font-medium hover:text-primary-500 transition-colors ${isActive('/login') ? 'text-primary-500' : 'text-slate-600'}`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Register
                </Link>
              </>
            )}
            {user && user.role === 'OWNER' && (
              <>
                <Link 
                  to="/owner" 
                  className={`font-medium hover:text-primary-500 transition-colors ${isActive('/owner') ? 'text-primary-500' : 'text-slate-600'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/owner/schedule" 
                  className={`font-medium hover:text-primary-500 transition-colors ${isActive('/owner/schedule') ? 'text-primary-500' : 'text-slate-600'}`}
                >
                  Book Appointment
                </Link>
              </>
            )}
            {user && user.role === 'DOCTOR' && (
              <Link 
                to="/doctor" 
                className={`font-medium hover:text-primary-500 transition-colors ${isActive('/doctor') ? 'text-primary-500' : 'text-slate-600'}`}
              >
                Doctor Dashboard
              </Link>
            )}
            {user && (
              <div className="flex items-center gap-4 lg:gap-6 pl-6 border-l border-slate-200">
                <div className="hidden lg:flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="text-slate-500 hover:text-red-500 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-primary-500 transition-colors"
            aria-label="Toggle menu"
          >
            {!mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4 animate-fade-in">
            {!user && (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/login" 
                  onClick={handleLinkClick}
                  className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/login') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={handleLinkClick}
                  className="btn-primary text-center"
                >
                  Register
                </Link>
              </div>
            )}
            {user && (
              <div className="flex flex-col gap-3">
                {user.role === 'OWNER' && (
                  <>
                    <Link 
                      to="/owner" 
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive('/owner') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/owner/schedule" 
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive('/owner/schedule') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Book Appointment
                    </Link>
                  </>
                )}
                {user.role === 'DOCTOR' && (
                  <Link 
                    to="/doctor" 
                    onClick={handleLinkClick}
                    className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive('/doctor') ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Doctor Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-50 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 text-left rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
