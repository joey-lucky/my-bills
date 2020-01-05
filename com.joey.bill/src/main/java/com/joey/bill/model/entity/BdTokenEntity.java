package com.joey.bill.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "bd_token", schema = "bill")
public class BdTokenEntity extends BaseEntity{
    @Column(name = "user_id")
    private String userId;
    @Column(name = "expires")
    private Date expires;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Date getExpires() {
        return expires;
    }

    public void setExpires(Date expires) {
        this.expires = expires;
    }
}
