package com.carpool.service;

import com.carpool.dto.RideDto;
import com.carpool.entity.Booking;
import com.carpool.entity.Ride;
import com.carpool.entity.User;
import com.carpool.repository.BookingRepository;
import com.carpool.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserService userService;

    public Map<String, Object> offerRide(RideDto rideDto, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        User driver = userService.findByEmail(userEmail);
        if (driver == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        Ride ride = new Ride();
        ride.setSource(rideDto.getSource());
        ride.setDestination(rideDto.getDestination());
        ride.setRideDateTime(rideDto.getRideDateTime());
        ride.setAvailableSeats(rideDto.getAvailableSeats());
        ride.setPricePerSeat(rideDto.getPricePerSeat());
        ride.setDriver(driver);

        Ride savedRide = rideRepository.save(ride);
        
        response.put("success", true);
        response.put("message", "Ride offered successfully");
        response.put("ride", getRideInfo(savedRide));
        
        return response;
    }

    public List<Ride> findRides(String source, String destination, LocalDateTime date) {
        if (date != null) {
            return rideRepository.findAvailableRidesWithDate(source, destination, date);
        } else {
            return rideRepository.findAvailableRides(source, destination);
        }
    }

    public List<Map<String, Object>> getMyOfferedRides(String userEmail) {
        User driver = userService.findByEmail(userEmail);
        List<Ride> rides = rideRepository.findByDriver(driver);
        
        return rides.stream().map(ride -> {
            // Get all bookings for this ride
            List<Booking> allBookings = bookingRepository.findByRide(ride);
            List<Booking> confirmedBookings = allBookings.stream()
                    .filter(booking -> booking.getStatus() == Booking.BookingStatus.CONFIRMED)
                    .collect(Collectors.toList());

            // Calculate statistics
            int totalSeats = ride.getAvailableSeats() + confirmedBookings.size();
            int bookedSeats = confirmedBookings.size();
            double totalRevenue = bookedSeats * (ride.getPricePerSeat() != null ? ride.getPricePerSeat() : 0.0);

            // Build ride info with passenger details
            Map<String, Object> rideInfo = new HashMap<>();
            rideInfo.put("id", ride.getId());
            rideInfo.put("source", ride.getSource());
            rideInfo.put("destination", ride.getDestination());
            rideInfo.put("rideDateTime", ride.getRideDateTime());
            rideInfo.put("availableSeats", ride.getAvailableSeats());
            rideInfo.put("totalSeats", totalSeats);
            rideInfo.put("bookedSeats", bookedSeats);
            rideInfo.put("pricePerSeat", ride.getPricePerSeat() != null ? ride.getPricePerSeat() : 0.0);
            rideInfo.put("totalRevenue", totalRevenue);
            rideInfo.put("driverName", ride.getDriver().getName());
            rideInfo.put("driverEmail", ride.getDriver().getEmail());
            rideInfo.put("createdAt", ride.getCreatedAt());

            // Add passenger details
            List<Map<String, Object>> passengers = allBookings.stream()
                    .map(booking -> {
                        Map<String, Object> passengerInfo = new HashMap<>();
                        User passenger = booking.getPassenger();
                        passengerInfo.put("bookingId", booking.getId());
                        passengerInfo.put("passengerId", passenger.getId());
                        passengerInfo.put("passengerName", passenger.getName() != null ? passenger.getName() : "Anonymous User");
                        passengerInfo.put("passengerEmail", passenger.getEmail());
                        passengerInfo.put("passengerPhone", passenger.getPhoneNumber());
                        passengerInfo.put("bookingDate", booking.getBookingDate());
                        passengerInfo.put("status", booking.getStatus());
                        return passengerInfo;
                    })
                    .collect(Collectors.toList());

            rideInfo.put("passengers", passengers);
            return rideInfo;
        }).collect(Collectors.toList());
    }

    public Ride findById(Long id) {
        return rideRepository.findById(id).orElse(null);
    }

    private Map<String, Object> getRideInfo(Ride ride) {
        Map<String, Object> rideInfo = new HashMap<>();
        rideInfo.put("id", ride.getId());
        rideInfo.put("source", ride.getSource());
        rideInfo.put("destination", ride.getDestination());
        rideInfo.put("rideDateTime", ride.getRideDateTime());
        rideInfo.put("availableSeats", ride.getAvailableSeats());
        rideInfo.put("pricePerSeat", ride.getPricePerSeat());
        rideInfo.put("driverName", ride.getDriver().getName());
        rideInfo.put("driverEmail", ride.getDriver().getEmail());
        return rideInfo;
    }

    public Map<String, Object> getRideDetails(Long rideId, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        User user = userService.findByEmail(userEmail);
        if (user == null) {
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

        // Check if the user is the driver of this ride
        if (!ride.getDriver().getId().equals(user.getId())) {
            response.put("success", false);
            response.put("message", "You can only view details of your own rides");
            return response;
        }

        // Get all bookings for this ride (for debugging)
        List<Booking> allBookings = bookingRepository.findByRide(ride);
        List<Booking> confirmedBookings = allBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.CONFIRMED)
                .collect(Collectors.toList());

        // Calculate statistics
        int totalSeats = ride.getAvailableSeats() + confirmedBookings.size();
        int bookedSeats = confirmedBookings.size();
        double totalRevenue = bookedSeats * (ride.getPricePerSeat() != null ? ride.getPricePerSeat() : 0.0);

        // Build response
        response.put("success", true);
        response.put("id", ride.getId());
        response.put("source", ride.getSource());
        response.put("destination", ride.getDestination());
        response.put("rideDateTime", ride.getRideDateTime());
        response.put("availableSeats", ride.getAvailableSeats());
        response.put("totalSeats", totalSeats);
        response.put("bookedSeats", bookedSeats);
        response.put("pricePerSeat", ride.getPricePerSeat() != null ? ride.getPricePerSeat() : 0.0);
        response.put("totalRevenue", totalRevenue);
        response.put("driverName", ride.getDriver().getName());
        response.put("driverEmail", ride.getDriver().getEmail());
        response.put("createdAt", ride.getCreatedAt());

        // Add all passenger details (including non-confirmed for debugging)
        List<Map<String, Object>> passengers = allBookings.stream()
                .map(booking -> {
                    Map<String, Object> passengerInfo = new HashMap<>();
                    User passenger = booking.getPassenger();
                    passengerInfo.put("bookingId", booking.getId());
                    passengerInfo.put("passengerId", passenger.getId());
                    passengerInfo.put("passengerName", passenger.getName() != null ? passenger.getName() : "Anonymous User");
                    passengerInfo.put("passengerEmail", passenger.getEmail());
                    passengerInfo.put("passengerPhone", passenger.getPhoneNumber());
                    passengerInfo.put("bookingDate", booking.getBookingDate() != null ? booking.getBookingDate() : null);
                    passengerInfo.put("status", booking.getStatus());
                    return passengerInfo;
                })
                .collect(Collectors.toList());

        response.put("passengers", passengers);
        response.put("totalBookings", allBookings.size()); // For debugging
        
        return response;
    }

    public Map<String, Object> updateRide(Long rideId, RideDto rideDto, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        User driver = userService.findByEmail(userEmail);
        if (driver == null) {
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

        // Check if the user is the driver of this ride
        if (!ride.getDriver().getId().equals(driver.getId())) {
            response.put("success", false);
            response.put("message", "You can only update your own rides");
            return response;
        }

        // Update ride details
        ride.setSource(rideDto.getSource());
        ride.setDestination(rideDto.getDestination());
        ride.setRideDateTime(rideDto.getRideDateTime());
        ride.setAvailableSeats(rideDto.getAvailableSeats());
        ride.setPricePerSeat(rideDto.getPricePerSeat());

        Ride updatedRide = rideRepository.save(ride);
        
        response.put("success", true);
        response.put("message", "Ride updated successfully");
        response.put("ride", getRideInfo(updatedRide));
        
        return response;
    }

    public Map<String, Object> cancelRide(Long rideId, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        User driver = userService.findByEmail(userEmail);
        if (driver == null) {
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

        // Check if the user is the driver of this ride
        if (!ride.getDriver().getId().equals(driver.getId())) {
            response.put("success", false);
            response.put("message", "You can only cancel your own rides");
            return response;
        }

        // Delete the ride (this will cascade delete bookings if configured)
        rideRepository.delete(ride);
        
        response.put("success", true);
        response.put("message", "Ride cancelled successfully");
        
        return response;
    }

    public List<Map<String, Object>> getRidePassengers(Long rideId, String userEmail) {
        User driver = userService.findByEmail(userEmail);
        Ride ride = rideRepository.findById(rideId).orElse(null);
        
        if (ride == null || !ride.getDriver().getId().equals(driver.getId())) {
            return new ArrayList<>();
        }

        // Use booking repository to get bookings for this ride
        List<Booking> confirmedBookings = bookingRepository.findByRideAndStatus(ride, Booking.BookingStatus.CONFIRMED);

        return confirmedBookings.stream()
                .map(booking -> {
                    Map<String, Object> passengerInfo = new HashMap<>();
                    User passenger = booking.getPassenger();
                    passengerInfo.put("bookingId", booking.getId());
                    passengerInfo.put("passengerId", passenger.getId());
                    passengerInfo.put("passengerName", passenger.getName());
                    passengerInfo.put("passengerEmail", passenger.getEmail());
                    passengerInfo.put("passengerPhone", passenger.getPhoneNumber());
                    passengerInfo.put("bookingDate", booking.getBookingDate());
                    passengerInfo.put("status", booking.getStatus());
                    return passengerInfo;
                })
                .collect(Collectors.toList());
    }
}

