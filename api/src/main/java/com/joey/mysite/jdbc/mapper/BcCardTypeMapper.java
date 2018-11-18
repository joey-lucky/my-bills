package com.joey.mysite.jdbc.mapper;

import com.joey.mysite.jdbc.bean.BcCardType;

public interface BcCardTypeMapper {
    int insert(BcCardType record);

    int insertSelective(BcCardType record);
}