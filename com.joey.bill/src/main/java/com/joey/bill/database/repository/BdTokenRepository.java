package com.joey.bill.database.repository;

import com.joey.bill.database.entity.BdToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BdTokenRepository extends JpaRepository<BdToken, String> {

}