package com.carpool.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rides")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Source is required")
    @Column(nullable = false)
    private String source;

    @NotBlank(message = "Destination is required")
    @Column(nullable = false)
    private String destination;

    @NotNull(message = "Date and time is required")
    @Column(name = "ride_date_time", nullable = false)
    private LocalDateTime rideDateTime;

    @PositiveOrZero(message = "Available seats must be zero or positive")
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "price_per_seat")
    private Double pricePerSeat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Booking> bookings;

    public Ride() {
        this.createdAt = LocalDateTime.now();
    }

    public Ride(String source, String destination, LocalDateTime rideDateTime, Integer availableSeats, User driver) {
        this();
        this.source = source;
        this.destination = destination;
        this.rideDateTime = rideDateTime;
        this.availableSeats = availableSeats;
        this.driver = driver;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDateTime getRideDateTime() {
        return rideDateTime;
    }

    public void setRideDateTime(LocalDateTime rideDateTime) {
        this.rideDateTime = rideDateTime;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Double getPricePerSeat() {
        return pricePerSeat;
    }

    public void setPricePerSeat(Double pricePerSeat) {
        this.pricePerSeat = pricePerSeat;
    }

    public User getDriver() {
        return driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}

