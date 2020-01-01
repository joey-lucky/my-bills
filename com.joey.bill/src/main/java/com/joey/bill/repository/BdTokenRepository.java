package com.joey.bill.repository;

import com.joey.bill.model.entity.BdToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BdTokenRepository extends JpaRepository<BdToken, String> {

}