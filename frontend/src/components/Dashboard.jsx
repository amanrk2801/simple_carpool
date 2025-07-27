import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ridesAPI, bookingsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth.jsx';
import RideDetails from './RideDetails';
import BookingCard from './BookingCard';
import { Car, Users, MapPin, Clock, IndianRupee } from 'lucide-react';

const Dashboard = () => {
  const [myRides, setMyRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated, token } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching dashboard data...');
      console.log('Token:', token);
      console.log('User:', user);
      
      const [ridesResponse, bookingsResponse] = await Promise.all([
        ridesAPI.getMyRides(),
        bookingsAPI.getMyBookings(),
      ]);
      
      setMyRides(ridesResponse.data);
      setMyBookings(bookingsResponse.data);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      if (error.response?.status === 403) {
        setError('Access denied. Please log in with valid credentials.');
      } else if (error.response?.status === 401) {
        setError('Authentication required. Please log in.');
      } else {
        setError('Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchData();
    } else {
      setLoading(false);
      setError('Please log in to view your dashboard.');
    }
  }, [isAuthenticated, token, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your rides and bookings</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <Tabs defaultValue="my-rides" className="space-y-8">
          <TabsList>
            <TabsTrigger value="my-rides">My Rides</TabsTrigger>
            <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="my-rides" className="space-y-6">
            <h2 className="text-xl font-semibold">My Offered Rides</h2>

            {myRides.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <Car className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't offered any rides yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {myRides.map((ride) => (
                  <RideDetails
                    key={ride.id}
                    ride={ride}
                    onRideUpdate={fetchData}
                    onRideCancel={(rideId) => {
                      setMyRides(prevRides => prevRides.filter(r => r.id !== rideId));
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-bookings" className="space-y-6">
            <h2 className="text-xl font-semibold">My Bookings</h2>

            {myBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't joined any rides yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {myBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onBookingCancel={(bookingId) => {
                      setMyBookings(prevBookings => prevBookings.filter(b => b.id !== bookingId));
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

