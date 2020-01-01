package com.joey.bill.database.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "bd_token")
public class BdToken extends BaseEntity{
    @Column(name = "user_id")
    private String userId;

    @Column
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
