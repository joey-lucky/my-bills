package com.joey.mysite.controller;

import com.google.gson.Gson;
import com.joey.mysite.jdbc.MyBatisUtils;
import com.joey.mysite.jdbc.bean.BcUser;
import com.joey.mysite.jdbc.sql.BillSQL;
import org.apache.ibatis.session.SqlSession;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/bill")
public class BillController {

    @RequestMapping("/user-list")
    public String test(){
        SqlSession sqlSession = MyBatisUtils.getSessionFactory().openSession();
        BillSQL mapper = sqlSession.getMapper(BillSQL.class);
        mapper.getUserList();
        return "";
    }

}
