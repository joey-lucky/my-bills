package com.joey.mysite.jdbc.mapper;

import com.joey.mysite.jdbc.bean.BcUser;

public interface BcUserMapper {
    int insert(BcUser record);

    int insertSelective(BcUser record);
}