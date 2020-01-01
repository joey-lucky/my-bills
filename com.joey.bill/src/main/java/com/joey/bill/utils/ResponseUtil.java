package com.joey.bill.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.joey.bill.model.ResponseResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ResponseUtil {
    private static final Gson GSON = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
    private static Logger log = LoggerFactory.getLogger(ResponseUtil.class);

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

    public static ResponseResult failResult(Exception ex) {
        return failResult(ex.getMessage());
    }

    public static ResponseResult failResult(String message) {
        ResponseResult result = new ResponseResult();
        result.setStatus("0");
        result.setData(Collections.EMPTY_LIST);
        result.setMessage(message);
        return result;
    }

    public static String toJson(ResponseResult result) {
        return GSON.toJson(result);
    }

    public static void writeIntoResponse(ResponseResult result) {
        try {
            PrintWriter writer = WebContext.getResponse().getWriter();
            String json = toJson(result);
            writer.write(json);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("response写入异常", e);
        }
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
}
