package com.carpool.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

public class RideDto {
    @NotBlank(message = "Source is required")
    @JsonAlias({"from"})
    private String source;

    @NotBlank(message = "Destination is required")
    @JsonAlias({"to"})
    private String destination;

    @NotNull(message = "Date and time is required")
    @JsonAlias({"departureTime"})
    private LocalDateTime rideDateTime;

    @Positive(message = "Available seats must be positive")
    @JsonAlias({"seatsAvailable"})
    private Integer availableSeats;

    private Double pricePerSeat;

    public RideDto() {}

    public RideDto(String source, String destination, LocalDateTime rideDateTime, Integer availableSeats, Double pricePerSeat) {
        this.source = source;
        this.destination = destination;
        this.rideDateTime = rideDateTime;
        this.availableSeats = availableSeats;
        this.pricePerSeat = pricePerSeat;
    }

    // Getters and Setters
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
}

