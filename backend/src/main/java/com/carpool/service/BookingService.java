package com.carpool.service;

import com.carpool.entity.Booking;
import com.carpool.entity.Ride;
import com.carpool.entity.User;
import com.carpool.repository.BookingRepository;
import com.carpool.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public Map<String, Object> joinRide(Long rideId, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        User passenger = userService.findByEmail(userEmail);
        if (passenger == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        Ride ride = rideRepository.findById(rideId).orElse(null);
        if (ride == null) {
            response.put("success", false);
            response.put("message", "Ride not found");
            return response;
        }

        if (ride.getDriver().getId().equals(passenger.getId())) {
            response.put("success", false);
            response.put("message", "You cannot join your own ride");
            return response;
        }

        if (ride.getAvailableSeats() <= 0) {
            response.put("success", false);
            response.put("message", "No available seats");
            return response;
        }

        if (bookingRepository.existsByRideIdAndPassengerId(rideId, passenger.getId())) {
            response.put("success", false);
            response.put("message", "You have already joined this ride");
            return response;
        }

        // Create booking first
        Booking booking = new Booking(ride, passenger);
        bookingRepository.save(booking);

        // Decrease available seats
        ride.setAvailableSeats(ride.getAvailableSeats() - 1);
        rideRepository.save(ride);

        response.put("success", true);
        response.put("message", "Successfully joined the ride");
        
        return response;
    }

    public List<Booking> getMyBookings(String userEmail) {
        User passenger = userService.findByEmail(userEmail);
        return bookingRepository.findByPassenger(passenger);
    }

    public Map<String, Object> cancelBooking(Long bookingId, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        User user = userService.findByEmail(userEmail);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            response.put("success", false);
            response.put("message", "Booking not found");
            return response;
        }

        // Check if the user is the passenger who made this booking
        if (!booking.getPassenger().getId().equals(user.getId())) {
            response.put("success", false);
            response.put("message", "You can only cancel your own bookings");
            return response;
        }

        // Update ride available seats
        Ride ride = booking.getRide();
        ride.setAvailableSeats(ride.getAvailableSeats() + 1);
        rideRepository.save(ride);

        // Delete the booking
        bookingRepository.delete(booking);
        
        response.put("success", true);
        response.put("message", "Booking cancelled successfully");
        
        return response;
    }

    public Map<String, Object> approveBooking(Long bookingId, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        User driver = userService.findByEmail(userEmail);
        if (driver == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            response.put("success", false);
            response.put("message", "Booking not found");
            return response;
        }

        // Check if the user is the driver of this ride
        if (!booking.getRide().getDriver().getId().equals(driver.getId())) {
            response.put("success", false);
            response.put("message", "You can only approve bookings for your own rides");
            return response;
        }

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        
        response.put("success", true);
        response.put("message", "Booking approved successfully");
        
        return response;
    }

    public Map<String, Object> rejectBooking(Long bookingId, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        User driver = userService.findByEmail(userEmail);
        if (driver == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            response.put("success", false);
            response.put("message", "Booking not found");
            return response;
        }

        // Check if the user is the driver of this ride
        if (!booking.getRide().getDriver().getId().equals(driver.getId())) {
            response.put("success", false);
            response.put("message", "You can only reject bookings for your own rides");
            return response;
        }

        // Update ride available seats
        Ride ride = booking.getRide();
        ride.setAvailableSeats(ride.getAvailableSeats() + 1);
        rideRepository.save(ride);

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        response.put("success", true);
        response.put("message", "Booking rejected successfully");
        
        return response;
    }
}

