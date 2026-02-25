package com.bikerental.rent.models;

import java.time.LocalDateTime;
import java.util.UUID;

import com.bikerental.bikes.models.Bike;
import com.bikerental.user.models.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Rent {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID rent_id;

    private User user_id;
    private Bike bike_id;
    private LocalDateTime rentAt;
    private LocalDateTime doneAt;
    private boolean payment;
    private LocalDateTime payAt;
    

}
