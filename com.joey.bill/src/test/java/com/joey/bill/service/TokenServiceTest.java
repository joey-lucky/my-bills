package com.joey.bill.service;

import com.joey.bill.database.entity.BcUser;
import com.joey.bill.database.repository.BcUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.Assert;

import javax.annotation.Resource;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
class TokenServiceTest {

    @Autowired
    private TokenService mService;
    @Resource
    private BcUserRepository mUserRepository;

    @Test
    void generateToken() throws Exception {
        List<BcUser> userList = mUserRepository.findAll();
        String userId = userList.get(0).getId();
        String token = mService.generateToken(userId);
        Assert.hasText(token, "token生成失败");
        BcUser user = mService.getUserByToken(token);
        Assert.isTrue(userId.equals(user.getId()),"token解析成功");
    }
}