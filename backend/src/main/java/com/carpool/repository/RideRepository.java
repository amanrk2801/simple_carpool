package com.carpool.repository;

import com.carpool.entity.Ride;
import com.carpool.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriver(User driver);
    
    @Query("SELECT r FROM Ride r WHERE r.source LIKE %:source% AND r.destination LIKE %:destination% AND r.availableSeats > 0")
    List<Ride> findAvailableRides(@Param("source") String source, @Param("destination") String destination);
    
    @Query("SELECT r FROM Ride r WHERE r.source LIKE %:source% AND r.destination LIKE %:destination% AND r.rideDateTime >= :date AND r.availableSeats > 0")
    List<Ride> findAvailableRidesWithDate(@Param("source") String source, @Param("destination") String destination, @Param("date") LocalDateTime date);
}

