package com.joey.mysite.jdbc.mapper;

import com.joey.mysite.jdbc.bean.BcCard;

public interface BcCardMapper {
    int insert(BcCard record);

    int insertSelective(BcCard record);
}