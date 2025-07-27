import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { bookingsAPI } from '@/lib/api';
import { 
  MapPin, 
  Clock, 
  IndianRupee, 
  Phone, 
  Mail, 
  Trash2,
  User
} from 'lucide-react';

const BookingCard = ({ booking, onBookingCancel }) => {
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancelBooking = async () => {
    try {
      setLoading(true);
      await bookingsAPI.cancelBooking(booking.id);
      setCancelDialogOpen(false);
      onBookingCancel(booking.id);
    } catch (error) {
      console.error('Error canceling booking:', error);
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

  const getBookingStatus = () => {
    if (!booking.ride?.rideDateTime) {
      return { label: 'Unknown', color: 'bg-gray-500' };
    }
    
    const now = new Date();
    const rideDate = new Date(booking.ride.rideDateTime);
    
    // Check if date is valid
    if (isNaN(rideDate.getTime())) {
      return { label: 'Invalid Date', color: 'bg-gray-500' };
    }
    
    if (booking.status === 'cancelled') {
      return { label: 'Cancelled', color: 'bg-red-500' };
    } else if (booking.status === 'pending') {
      return { label: 'Pending Approval', color: 'bg-yellow-500' };
    } else if (rideDate < now) {
      return { label: 'Completed', color: 'bg-gray-500' };
    } else {
      return { label: 'Confirmed', color: 'bg-green-500' };
    }
  };

  const status = getBookingStatus();
  const canCancel = booking.status !== 'cancelled' && new Date(booking.ride?.rideDateTime) > new Date();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {booking.ride?.source} → {booking.ride?.destination}
            </CardTitle>
            <CardDescription className="mt-1">
              {formatDateTime(booking.ride?.rideDateTime)}
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
            <IndianRupee className="h-4 w-4" />
            <span>₹{booking.ride?.pricePerSeat || 0}</span>
          </div>
          <div className="text-gray-500">
            Booked: {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>

        {booking.ride?.driver && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Driver Information</h4>
            <div className="text-sm">
              <div className="font-medium">{booking.ride.driver.name}</div>
              {booking.ride.driver.email && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Mail className="h-3 w-3" />
                  {booking.ride.driver.email}
                </div>
              )}
            </div>
          </div>
        )}

        {booking.ride?.description && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-gray-600">{booking.ride.description}</p>
          </div>
        )}

        {canCancel && (
          <div className="pt-4 border-t">
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Booking</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this booking?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                    Keep
                  </Button>
                  <Button variant="destructive" onClick={handleCancelBooking} disabled={loading}>
                    {loading ? 'Canceling...' : 'Cancel'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {booking.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded text-sm">
            Pending driver approval
          </div>
        )}

        {booking.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
            Booking cancelled
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
