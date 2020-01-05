package com.joey.bill.service;

import com.joey.bill.model.entity.BcUserEntity;
import com.joey.bill.model.entity.BdTokenEntity;
import com.joey.bill.repository.BcUserRepository;
import com.joey.bill.repository.BdTokenRepository;
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
        BdTokenEntity token = new BdTokenEntity();
        token.setUserId(userId);
        token.setExpires(expires);
        mTokenRepository.saveAndFlush(token);
        return token.getId();
    }

    public BcUserEntity verifyTokenAndGetUser(String token) throws Exception{
        Assert.hasText(token,"token为空");
        BdTokenEntity bdTokenEntity = mTokenRepository.findById(token).orElseThrow(() -> new Exception("token不存在"));
        Assert.isTrue(bdTokenEntity.getExpires().after(new Date()), "token已过期");
        String userId = bdTokenEntity.getUserId();
        return mUserRepository.findById(userId).orElseThrow(() -> new Exception("用户不存在"));
    }
}
