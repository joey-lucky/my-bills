package com.joey.bill.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "bc_user")
public class BcUser extends BaseEntity{
    @Column
    private String name;

    @Column(name = "login_name")
    private String loginName;

    @Column(name = "login_password")
    private String loginPassword;

    @Column
    private String pic;
}
