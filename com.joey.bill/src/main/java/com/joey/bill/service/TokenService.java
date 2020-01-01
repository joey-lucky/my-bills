package com.joey.bill.service;

import com.joey.bill.database.entity.BcUser;
import com.joey.bill.database.entity.BdToken;
import com.joey.bill.database.repository.BcUserRepository;
import com.joey.bill.database.repository.BdTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.annotation.Resource;
import java.util.Date;

@Service
public class TokenService {
    // 默认token 有效期
    private static final long DEF_TOKEN_EXPIRES = 30 * 24 * 60 * 60 * 1000L;

    @Resource
    private BdTokenRepository mTokenRepository;
    @Resource
    private BcUserRepository mUserRepository;

    public String generateToken(String userId) {
        return generateToken(userId, new Date(System.currentTimeMillis() + DEF_TOKEN_EXPIRES));
    }

    public String generateToken(String userId, Date expires) {
        BdToken token = new BdToken();
        token.setUserId(userId);
        token.setExpires(expires);
        mTokenRepository.saveAndFlush(token);
        return token.getId();
    }

    public void verifyToken(String token) throws Exception {
        BdToken bdToken = mTokenRepository.findById(token).orElseThrow(() -> new Exception("token不存在"));
        Assert.isTrue(bdToken.getExpires().after(new Date()), "token已过期");
        String userId = bdToken.getUserId();
        Assert.isTrue(mUserRepository.existsById(userId), "用户不存在");
    }

    public BcUser getUserByToken(String token){
        BdToken bdToken = mTokenRepository.getOne(token);
        String userId = bdToken.getUserId();
        return mUserRepository.getOne(userId);
    }
}
