import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Car, Users, MapPin, Clock } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">
              Share Your Journey
            </h1>
            <p className="text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
              Connect with fellow travelers and make your commute more affordable and eco-friendly
            </p>
            <div className="flex gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/offer-ride">
                    <Button size="lg">Offer a Ride</Button>
                  </Link>
                  <Link to="/find-ride">
                    <Button variant="outline" size="lg">Find a Ride</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">Sign In</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose CarpoolApp?
          </h2>
          <p className="text-lg text-gray-600">
            Simple, safe, and sustainable transportation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader className="text-center pb-4">
              <Car className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <CardTitle>Easy to Use</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center">
                Simple interface to offer or find rides
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-4">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center">
                Connect with verified local members
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-4">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <CardTitle>Flexible Routes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center">
                Find rides that match your route
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-4">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <CardTitle>Save Money</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center">
                Reduce travel costs and help environment
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Carpooling?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join users who are saving money and reducing their carbon footprint
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg">Sign Up Now</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

