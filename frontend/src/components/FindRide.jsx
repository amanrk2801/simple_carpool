import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ridesAPI, bookingsAPI } from '@/lib/api';
import { Search, MapPin, Clock, Users, IndianRupee } from 'lucide-react';

const FindRide = () => {
  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    date: '',
  });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joinLoading, setJoinLoading] = useState({});

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const params = {
        source: searchData.source,
        destination: searchData.destination,
      };
      
      if (searchData.date) {
        params.date = new Date(searchData.date).toISOString();
      }

      const response = await ridesAPI.search(params);
      setRides(response.data);
    } catch {
      setError('Failed to search rides. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRide = async (rideId) => {
    setJoinLoading({ ...joinLoading, [rideId]: true });

    try {
      const response = await bookingsAPI.join(rideId);
      if (response.data.success) {
        // Remove the ride from the list or update available seats
        setRides(rides.map(ride => 
          ride.id === rideId 
            ? { ...ride, availableSeats: ride.availableSeats - 1 }
            : ride
        ));
        alert('Successfully joined the ride!');
      } else {
        alert(response.data.message);
      }
    } catch {
      alert('Failed to join ride. Please try again.');
    } finally {
      setJoinLoading({ ...joinLoading, [rideId]: false });
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Search className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Find a Ride</CardTitle>
            <CardDescription>Search for available rides in your area</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSearch} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">From</Label>
                  <Input
                    id="source"
                    name="source"
                    type="text"
                    required
                    value={searchData.source}
                    onChange={handleChange}
                    placeholder="Starting location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">To</Label>
                  <Input
                    id="destination"
                    name="destination"
                    type="text"
                    required
                    value={searchData.destination}
                    onChange={handleChange}
                    placeholder="Destination"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date (Optional)</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={searchData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Searching...' : 'Search Rides'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {rides.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Rides</h2>
            {rides.map((ride) => (
              <Card key={ride.id}>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">{ride.source}</span>
                          <span className="text-gray-500">→</span>
                          <span className="font-medium">{ride.destination}</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDateTime(ride.rideDateTime)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{ride.availableSeats} seats available</span>
                        </div>
                        {ride.pricePerSeat && (
                                                      <div className="flex items-center text-gray-600 mb-2">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              <span>₹{ride.pricePerSeat}</span>
                            </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Driver: <span className="font-medium">{ride.driver?.name || 'Unknown'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button
                        onClick={() => handleJoinRide(ride.id)}
                        disabled={ride.availableSeats === 0 || joinLoading[ride.id]}
                        className="min-w-[100px]"
                      >
                        {joinLoading[ride.id] ? 'Joining...' : 
                         ride.availableSeats === 0 ? 'Full' : 'Join Ride'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {rides.length === 0 && !loading && searchData.source && searchData.destination && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No rides found matching your criteria.</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search parameters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindRide;

