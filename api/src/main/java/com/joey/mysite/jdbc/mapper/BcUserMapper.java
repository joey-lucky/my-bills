package com.joey.mysite.jdbc.mapper;

import com.joey.mysite.jdbc.bean.BcUser;

import java.util.List;

public interface BcUserMapper {
    int insert(BcUser record);

    int insertSelective(BcUser record);

    List<BcUser> select();
}