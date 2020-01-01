package com.joey.bill.database.repository;

import com.joey.bill.database.entity.BcUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BcUserRepository extends JpaRepository<BcUser, String> {
    BcUser findByName(String userName);
}