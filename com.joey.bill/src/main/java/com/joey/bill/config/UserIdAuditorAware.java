package com.joey.bill.config;

import com.joey.bill.model.entity.BcUserEntity;
import com.joey.bill.utils.UserSessionManager;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

@Configuration
public class UserIdAuditorAware implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        BcUserEntity user = UserSessionManager.getInstance().getUser();
        if (user != null) {
            return Optional.of(user.getId());
        } else {
            return Optional.empty();
        }
    }
}
