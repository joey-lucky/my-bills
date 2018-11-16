package com.joey.mysite.controller;

import com.google.gson.Gson;
import com.joey.mysite.jdbc.bean.BcUser;
import com.joey.mysite.jdbc.mapper.BcUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/user")
public class UserController  {
    @Autowired
    BcUserMapper bcUserMapper;

    @RequestMapping("/test")
    public String test(){
        List<BcUser> rows = bcUserMapper.select();
        return new Gson().toJson(rows);
    }
}





