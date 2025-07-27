package com.carpool.repository;

import com.carpool.entity.Booking;
import com.carpool.entity.Ride;
import com.carpool.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPassenger(User passenger);
    List<Booking> findByRide(Ride ride);
    List<Booking> findByRideAndStatus(Ride ride, Booking.BookingStatus status);
    boolean existsByRideIdAndPassengerId(Long rideId, Long passengerId);
}

