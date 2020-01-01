package com.joey.bill.configuration;

import com.joey.bill.database.entity.BcUser;
import com.joey.bill.manager.UserSessionManager;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

@Configuration
public class UserIdAuditorAware implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        BcUser user = UserSessionManager.getInstance().getUser();
        if (user != null) {
            return Optional.of(user.getId());
        } else {
            return Optional.empty();
        }
    }
}
