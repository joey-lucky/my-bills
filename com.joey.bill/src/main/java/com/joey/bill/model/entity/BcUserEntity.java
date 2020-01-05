package com.joey.bill.model.entity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.Objects;

@Entity
@Table(name = "bc_user", schema = "bill", catalog = "")
public class BcUserEntity extends BaseEntity{
    @Column(name = "name")
    private String name;
    @Column(name = "login_name")
    private String loginName;
    @Column(name = "login_password")
    private String loginPassword;
    @Column(name = "pic")
    private String pic;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getLoginPassword() {
        return loginPassword;
    }

    public void setLoginPassword(String loginPassword) {
        this.loginPassword = loginPassword;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }
}
