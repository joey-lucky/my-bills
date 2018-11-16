package com.joey.mysite.jdbc.mapper;

import com.joey.mysite.jdbc.bean.BcUser;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BcUserMapper {
    List<BcUser> select();
}