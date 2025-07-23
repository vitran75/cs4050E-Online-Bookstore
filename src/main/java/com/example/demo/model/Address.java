package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private int id;

    @Column
    private String streetLine;

    @Column
    private String cityName;

    @Column
    private String stateCode;

    @Column(name = "postal_code")
    private String postalCode;

    @Column
    private String countryName;

    public Address() {}
    // Constructor with parameters
    public Address(String streetLine, String cityName, String stateCode, String postalCode, String countryName) {
        this.streetLine = streetLine;
        this.cityName = cityName;
        this.stateCode = stateCode;
        this.postalCode = postalCode;
        this.countryName = countryName;
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStreetLine() {
        return streetLine;
    }

    public void setStreetLine(String streetLine) {
        this.streetLine = streetLine;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getStateCode() {
        return stateCode;
    }

    public void setStateCode(String stateCode) {
        this.stateCode = stateCode;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }
}