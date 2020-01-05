package com.joey.bill.repository;

import com.joey.bill.model.entity.BdTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BdTokenRepository extends JpaRepository<BdTokenEntity, String> {

}