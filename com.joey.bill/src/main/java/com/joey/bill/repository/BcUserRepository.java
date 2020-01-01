package com.joey.bill.repository;

import com.joey.bill.model.entity.BcUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BcUserRepository extends JpaRepository<BcUser, String> {
    BcUser findByName(String userName);
}