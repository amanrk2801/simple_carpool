import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ridesAPI, bookingsAPI } from '@/lib/api';
import { 
  MapPin, 
  Clock, 
  Users, 
  IndianRupee, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Check, 
  X,
  User
} from 'lucide-react';

const RideDetails = ({ ride, onRideUpdate, onRideCancel }) => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    source: ride.source,
    destination: ride.destination,
    rideDateTime: ride.rideDateTime,
    availableSeats: ride.availableSeats,
    pricePerSeat: ride.pricePerSeat,
    description: ride.description || ''
  });

  const fetchPassengers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ridesAPI.getRidePassengers(ride.id);
      console.log('Passenger data received:', response.data);
      setPassengers(response.data);
    } catch (error) {
      console.error('Error fetching passengers:', error);
    } finally {
      setLoading(false);
    }
  }, [ride.id]);

  useEffect(() => {
    fetchPassengers();
  }, [fetchPassengers]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await ridesAPI.updateRide(ride.id, editFormData);
      setEditDialogOpen(false);
      onRideUpdate();
    } catch (error) {
      console.error('Error updating ride:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async () => {
    try {
      setLoading(true);
      await ridesAPI.cancelRide(ride.id);
      setCancelDialogOpen(false);
      onRideCancel(ride.id);
    } catch (error) {
      console.error('Error canceling ride:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      setLoading(true);
      if (action === 'approve') {
        await bookingsAPI.approveBooking(bookingId);
      } else if (action === 'reject') {
        await bookingsAPI.rejectBooking(bookingId);
      }
      fetchPassengers(); // Refresh passenger list
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Date not available';
    
    try {
      return new Date(dateTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getRideStatus = () => {
    if (!ride.rideDateTime) {
      return { label: 'Unknown', color: 'bg-gray-500' };
    }
    
    const now = new Date();
    const rideDate = new Date(ride.rideDateTime);
    
    // Check if date is valid
    if (isNaN(rideDate.getTime())) {
      return { label: 'Invalid Date', color: 'bg-gray-500' };
    }
    
    if (rideDate < now) {
      return { label: 'Completed', color: 'bg-gray-500' };
    } else if (ride.availableSeats === 0) {
      return { label: 'Full', color: 'bg-red-500' };
    } else {
      return { label: 'Active', color: 'bg-green-500' };
    }
  };

  const status = getRideStatus();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {ride.source} → {ride.destination}
            </CardTitle>
            <CardDescription className="mt-1">
              {formatDateTime(ride.rideDateTime)}
            </CardDescription>
          </div>
          <Badge className={status.color}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{(ride.totalSeats && ride.availableSeats) ? (ride.totalSeats - ride.availableSeats) : 0}/{ride.totalSeats || 0} booked</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            <span>₹{ride.pricePerSeat || 0}/seat</span>
          </div>
        </div>

        {ride.description && (
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-gray-600">{ride.description}</p>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-2">Passengers ({passengers.length})</h4>
          
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          
          {!loading && passengers.length === 0 && (
            <p className="text-sm text-gray-500">No passengers yet</p>
          )}
          
          <div className="space-y-2">
            {passengers.map((passenger) => (
              <div key={passenger.id} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {passenger.passengerName || 
                         passenger.user?.name || 
                         passenger.userName || 
                         passenger.name || 
                         'Anonymous User'}
                      </span>
                      <Badge variant={
                        passenger.status === 'CONFIRMED' || passenger.status === 'confirmed' ? 'default' : 
                        passenger.status === 'PENDING' || passenger.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {passenger.status || 'Unknown'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {passenger.passengerEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {passenger.passengerEmail}
                        </div>
                      )}
                    </div>
                  </div>

                  {(passenger.status === 'PENDING' || passenger.status === 'pending') && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookingAction(passenger.bookingId, 'approve')}
                        disabled={loading}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBookingAction(passenger.bookingId, 'reject')}
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Ride</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source">From</Label>
                    <Input
                      id="source"
                      value={editFormData.source}
                      onChange={(e) => setEditFormData({...editFormData, source: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">To</Label>
                    <Input
                      id="destination"
                      value={editFormData.destination}
                      onChange={(e) => setEditFormData({...editFormData, destination: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rideDateTime">Date & Time</Label>
                  <Input
                    id="rideDateTime"
                    type="datetime-local"
                    value={editFormData.rideDateTime?.slice(0, 16)}
                    onChange={(e) => setEditFormData({...editFormData, rideDateTime: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="availableSeats">Available Seats</Label>
                    <Input
                      id="availableSeats"
                      type="number"
                      min="1"
                      max="8"
                      value={editFormData.availableSeats}
                      onChange={(e) => setEditFormData({...editFormData, availableSeats: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerSeat">Price per Seat (₹)</Label>
                    <Input
                      id="pricePerSeat"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFormData.pricePerSeat}
                      onChange={(e) => setEditFormData({...editFormData, pricePerSeat: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Ride</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this ride?
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                  Keep
                </Button>
                <Button variant="destructive" onClick={handleCancelRide} disabled={loading}>
                  {loading ? 'Canceling...' : 'Cancel'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideDetails;
