import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { MapPin, Clock, Users, IndianRupee, Car } from 'lucide-react';
import { ridesAPI } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const OfferRide = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seatsAvailable: '',
    pricePerSeat: '',
    description: '',
    vehicleDetails: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Check if user is authenticated
    if (!token) {
      setError('You must be logged in to offer a ride. Please log in first.');
      setLoading(false);
      return;
    }

    try {
      // Combine date and time for departure
      const departureTime = `${formData.date}T${formData.time}`;
      
      const rideData = {
        from: formData.from,
        to: formData.to,
        departureTime,
        seatsAvailable: parseInt(formData.seatsAvailable),
        pricePerSeat: parseFloat(formData.pricePerSeat),
        description: formData.description,
        vehicleDetails: formData.vehicleDetails
      };

      console.log('Sending ride data:', rideData);
      await ridesAPI.offer(rideData);
      setSuccess('Ride offered successfully!');
      
      // Reset form
      setFormData({
        from: '',
        to: '',
        date: '',
        time: '',
        seatsAvailable: '',
        pricePerSeat: '',
        description: '',
        vehicleDetails: ''
      });

      // Navigate to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating ride:', error);
      console.error('Response:', error.response);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      if (error.response?.status === 403) {
        setError('Authentication required. Please ensure you are logged in and try again.');
      } else if (error.response?.status === 400) {
        const responseData = error.response?.data;
        
        if (responseData?.errors) {
          // Display specific validation errors
          console.error('Validation errors:', responseData.errors);
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
          setError(`Validation errors: ${errorMessages}`);
        } else {
          const errorMessage = responseData?.message || responseData?.error || JSON.stringify(responseData) || 'Invalid request data. Please check all fields and try again.';
          setError(errorMessage);
        }
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setError('Backend server is not running. Please start the backend server and try again.');
      } else {
        setError(error.response?.data?.message || 'Failed to create ride. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Offer a Ride
            </CardTitle>
            <CardDescription>Share your journey with fellow travelers</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    placeholder="Departure location"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    placeholder="Destination"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="seatsAvailable">Available Seats</Label>
                  <Input
                    id="seatsAvailable"
                    name="seatsAvailable"
                    type="number"
                    min="1"
                    max="8"
                    value={formData.seatsAvailable}
                    onChange={handleInputChange}
                    placeholder="Number of seats"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pricePerSeat">Price per Seat (₹)</Label>
                  <Input
                    id="pricePerSeat"
                    name="pricePerSeat"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerSeat}
                    onChange={handleInputChange}
                    placeholder="Price in rupees"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vehicleDetails">Vehicle Details</Label>
                <Input
                  id="vehicleDetails"
                  name="vehicleDetails"
                  value={formData.vehicleDetails}
                  onChange={handleInputChange}
                  placeholder="Car model, color, number plate"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Additional Notes (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Any additional details about the ride..."
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Creating Ride...' : 'Offer This Ride'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferRide;
