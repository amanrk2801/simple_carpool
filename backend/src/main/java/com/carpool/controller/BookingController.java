package com.carpool.controller;

import com.carpool.entity.Booking;
import com.carpool.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/join/{rideId}")
    public ResponseEntity<Map<String, Object>> joinRide(@PathVariable Long rideId, Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> response = bookingService.joinRide(rideId, userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Booking> bookings = bookingService.getMyBookings(userEmail);
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable Long bookingId, Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> response = bookingService.cancelBooking(bookingId, userEmail);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<Map<String, Object>> approveBooking(@PathVariable Long bookingId, Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> response = bookingService.approveBooking(bookingId, userEmail);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<Map<String, Object>> rejectBooking(@PathVariable Long bookingId, Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> response = bookingService.rejectBooking(bookingId, userEmail);
        return ResponseEntity.ok(response);
    }
}

