package com.joey.bill.configuration.interceptor;

import com.joey.bill.database.entity.BcUser;
import com.joey.bill.manager.UserSessionManager;
import com.joey.bill.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class TokenInterceptor implements HandlerInterceptor{
    @Autowired
    private TokenService mTokenService;

    @Override
    public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3) throws Exception {
        UserSessionManager.getInstance().removeUser();
    }

    @Override
    public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) throws Exception {

    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
        try {
            String token = request.getParameter("_token");
            mTokenService.verifyToken(token);
            BcUser user = mTokenService.getUserByToken(token);
            UserSessionManager.getInstance().setUser(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
