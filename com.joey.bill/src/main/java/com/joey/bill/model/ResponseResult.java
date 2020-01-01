package com.joey.bill.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ResponseResult {
    public static ResponseResult successResult(Object data) {
        return successResult(data, "");
    }

    public static ResponseResult successResult(Object data, String message) {
        ResponseResult result = new ResponseResult();
        result.setStatus("1");
        result.setData(convertData(data));
        result.setMessage(message == null ? "" : message);
        return result;
    }

    public static ResponseResult failResult(Exception ex){
        ResponseResult result = new ResponseResult();
        result.setStatus("0");
        result.setData(Collections.EMPTY_LIST);
        result.setMessage(ex.getMessage());
        return result;
    }

    private static List<Object> convertData(Object data) {
        if (data == null) {
            return Collections.EMPTY_LIST;
        }
        if (data instanceof Object[]) {
            Object[] array = (Object[]) data;
            return Arrays.asList(array);
        }
        if (data instanceof List) {
            return (List<Object>) data;
        }
        return Arrays.asList(data);
    }

    private String status;
    private String message;
    private List<Object> data;

    public void setStatus(String status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setData(List<Object> data) {
        this.data = data;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public List<Object> getData() {
        return data;
    }
}
