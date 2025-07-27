import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Car, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CarpoolApp</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/offer-ride">
                  <Button variant="ghost">
                    Offer Ride
                  </Button>
                </Link>
                <Link to="/find-ride">
                  <Button variant="ghost">
                    Find Ride
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 border-l pl-4 ml-4">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

