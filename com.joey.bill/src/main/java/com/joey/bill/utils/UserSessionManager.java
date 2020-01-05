package com.joey.bill.utils;


import com.joey.bill.model.entity.BcUserEntity;

/**
 * 登录用户session管理器
 *
 * @author gislin
 */
public final class UserSessionManager {
    private static UserSessionManager instance;

    public static UserSessionManager getInstance() {
        if (instance == null) {
            synchronized (UserSessionManager.class) {
                if (instance == null) {
                    instance = new UserSessionManager();
                    return instance;
                }
            }
        }
        return instance;
    }

    public void setUser(BcUserEntity user) {
        WebContext.getSession().setAttribute("userInfo", user);
    }

    public void removeUser() {
        WebContext.getSession().removeAttribute("userInfo");
    }

    public BcUserEntity getUser() {
        try {
            Object user = WebContext.getSession().getAttribute("userInfo");
            if (user instanceof BcUserEntity) {
                return (BcUserEntity) user;
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }

    }
}
