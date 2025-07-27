package com.carpool.controller;

import com.carpool.dto.RideDto;
import com.carpool.entity.Ride;
import com.carpool.service.RideService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class RideController {

    @Autowired
    private RideService rideService;

    @PostMapping("/offer")
    public ResponseEntity<Map<String, Object>> offerRide(@Valid @RequestBody RideDto rideDto, Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> response = rideService.offerRide(rideDto, userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Ride>> findRides(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<Ride> rides = rideService.findRides(source, destination, date);
        return ResponseEntity.ok(rides);
    }

    @GetMapping("/my-rides")
    public ResponseEntity<List<Map<String, Object>>> getMyRides(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Map<String, Object>> rides = rideService.getMyOfferedRides(userEmail);
        return ResponseEntity.ok(rides);
    }

    @GetMapping("/{rideId}")
    public ResponseEntity<Map<String, Object>> getRideDetails(@PathVariable Long rideId, Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> response = rideService.getRideDetails(rideId, userEmail);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{rideId}")
    public ResponseEntity<Map<String, Object>> updateRide(@PathVariable Long rideId, @Valid @RequestBody RideDto rideDto, Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> response = rideService.updateRide(rideId, rideDto, userEmail);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{rideId}")
    public ResponseEntity<Map<String, Object>> cancelRide(@PathVariable Long rideId, Authentication authentication) {
        String userEmail = authentication.getName();
        Map<String, Object> response = rideService.cancelRide(rideId, userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{rideId}/passengers")
    public ResponseEntity<List<Map<String, Object>>> getRidePassengers(@PathVariable Long rideId, Authentication authentication) {
        String userEmail = authentication.getName();
        List<Map<String, Object>> passengers = rideService.getRidePassengers(rideId, userEmail);
        return ResponseEntity.ok(passengers);
    }
}

