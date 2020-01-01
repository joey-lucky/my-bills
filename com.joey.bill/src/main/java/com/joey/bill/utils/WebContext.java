package com.joey.bill.utils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class WebContext {

    private static ThreadLocal<HttpServletRequest> threadRequest = new ThreadLocal<HttpServletRequest>();

    private static ThreadLocal<HttpServletResponse> threadResponse = new ThreadLocal<HttpServletResponse>();

    public static void setRequest(HttpServletRequest httpServletRequest) {
        threadRequest.set(httpServletRequest);
    }

    public static HttpServletRequest getRequest() {
        HttpServletRequest request = threadRequest.get();
        return request;
    }

    public static void setResponse(HttpServletResponse httpServletResponse) {
        httpServletResponse.setContentType("text/html;charset=UTF-8");
        threadResponse.set(httpServletResponse);
    }

    public static HttpServletResponse getResponse() {
        HttpServletResponse response = threadResponse.get();
        return response;
    }

    public static HttpSession getSession() {
        HttpServletRequest request = threadRequest.get();
        HttpSession session = request.getSession();
        return session;
    }

    public static String getWebInitParameter(String key) {
        String value = getRequest().getSession().getServletContext().getInitParameter(key);
        return value;
    }

    public static String getSessionId() {
        String sessionId = getRequest().getSession().getId();
        return sessionId;
    }

    /**
     * 获取webapp服务器物理路径
     */
    public static String getServerPath() {
        String path = getRequest().getSession().getServletContext().getRealPath("");
        return path;
    }
}
