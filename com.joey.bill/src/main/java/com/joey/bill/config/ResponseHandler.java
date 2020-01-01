package com.joey.bill.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.joey.bill.model.ResponseResult;
import com.joey.bill.model.entity.BaseEntity;
import com.joey.bill.utils.ResponseUtil;
import com.joey.bill.utils.WebContext;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.io.PrintWriter;
import java.util.Collections;
import java.util.List;

@ControllerAdvice
public class ResponseHandler implements ResponseBodyAdvice<Object> {
    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    public static void outNoPermission(Exception e) {
        ResponseResult result = new ResponseResult();
        result.setStatus("0");
        result.setData(Collections.EMPTY_LIST);
        result.setMessage(e.getMessage());
        WebContext.getResponse().setStatus(302);
        outHttpResult(result);
    }

    private static void outHttpResult(ResponseResult result){
        try {
            PrintWriter writer = WebContext.getResponse().getWriter();
            String json = new Gson().toJson(result);
            writer.write(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        ResponseResult result = (ResponseResult) body;
        deleteUselessEntityData(result.getData());
        return ResponseUtil.toJson(result);
    }

    private void deleteUselessEntityData(List<Object> list){
        for (Object item : list) {
            if (item instanceof List) {
                deleteUselessEntityData((List<Object>) item);
            } else if (item instanceof BaseEntity) {
                BaseEntity entity = (BaseEntity) item;
                entity.setCreateBy(null);
                entity.setCreateTime(null);
                entity.setUpdateBy(null);
                entity.setUpdateTime(null);
            }
        }
    }
}