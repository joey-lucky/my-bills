package com.joey.bill.utils;

public class ResponseManager {
    private static ResponseManager instance;

    public static ResponseManager getInstance() {
        if (instance == null) {
            synchronized (ResponseManager.class) {
                if (instance == null) {
                    instance = new ResponseManager();
                    return instance;
                }
            }
        }
        return instance;
    }


}
