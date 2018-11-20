package com.joey.mysite.jdbc.sql;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface BillSQL {

    @Select("select * from bc_user")
    List<Map> getUserList();
}
