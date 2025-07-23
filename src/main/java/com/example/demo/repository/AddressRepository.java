package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Address;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    Optional<Address> findByStreetLineAndCityNameAndStateCodeAndPostalCodeAndCountryName(
    String streetLine, String cityName, String stateCode, String postalCode, String countryName);
    List<Address> findByCustomerUserId(int customerId);
}
               