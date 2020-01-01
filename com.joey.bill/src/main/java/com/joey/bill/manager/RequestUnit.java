package com.joey.bill.manager;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class RequestUnit {
    public static String getString(String paramName) {
        String result = WebContext.getRequest().getParameter(paramName);
        return result == null ? "" : result;
    }

    public static Double getDouble(String paramName) {
        try {
            return Double.parseDouble(getString(paramName));
        } catch (Exception e) {
            return null;
        }
    }

    public static Map<String, String> getParameterMap() {
        Enumeration<String> names = WebContext.getRequest().getParameterNames();
        HashMap<String, String> params = new HashMap<>();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            String value = getString(name);
            params.put(name, value);
        }
        return params;
    }
}
