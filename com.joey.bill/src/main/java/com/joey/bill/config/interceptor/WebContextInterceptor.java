package com.joey.bill.config.interceptor;

import com.joey.bill.utils.UserSessionManager;
import com.joey.bill.utils.WebContext;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class WebContextInterceptor implements HandlerInterceptor{
    @Override
    public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3) throws Exception {
        UserSessionManager.getInstance().removeUser();
    }

    @Override
    public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) throws Exception {

    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
        WebContext.setRequest(request);
        WebContext.setResponse(response);
        return true;
    }
}
