package com.joey.mysite.jdbc.mapper;

import com.joey.mysite.jdbc.bean.BcBillType;

public interface BcBillTypeMapper {
    int insert(BcBillType record);

    int insertSelective(BcBillType record);
}