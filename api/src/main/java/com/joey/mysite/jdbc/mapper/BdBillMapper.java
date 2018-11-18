package com.joey.mysite.jdbc.mapper;

import com.joey.mysite.jdbc.bean.BdBill;

public interface BdBillMapper {
    int insert(BdBill record);

    int insertSelective(BdBill record);
}