package com.joey.bill.controller;

import com.joey.bill.model.ResponseResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @RequestMapping("/login")
    public ResponseResult login() throws Exception{
        return null;
    }
}
