package com.joey.bill.repository;

import com.joey.bill.model.entity.BcUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BcUserRepository extends JpaRepository<BcUserEntity, String> {
    BcUserEntity findByName(String userName);
}