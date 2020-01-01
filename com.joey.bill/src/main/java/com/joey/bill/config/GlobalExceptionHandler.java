package com.joey.bill.config;

import com.joey.bill.model.ResponseResult;
import com.joey.bill.utils.ResponseUtil;
import com.joey.bill.utils.WebContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpStatusCodeException;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {
    private static Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(HttpStatusCodeException.class)
    public ResponseResult clientErrorExceptionHandler(HttpStatusCodeException ex) {
        WebContext.getResponse().setStatus(ex.getRawStatusCode());
        return resultFormat(ex, null);
    }

    @ExceptionHandler({StackOverflowError.class})
    public ResponseResult requestStackOverflow(StackOverflowError ex) {
        return resultFormat(ex, "栈溢出");
    }

    @ExceptionHandler(HttpClientErrorException.Forbidden.class)
    public ResponseResult clientForbiddenExceptionHandler(HttpClientErrorException.Forbidden ex) {
        WebContext.getResponse().setStatus(ex.getRawStatusCode());
        return resultFormat(ex, "没有权限");
    }

    //其他错误
    @ExceptionHandler({Throwable.class})
    public ResponseResult exception(Throwable ex) {
        return resultFormat(ex, null);
    }

    private <T extends Throwable> ResponseResult resultFormat(T ex, String message) {
        ex.printStackTrace();
        log.error(message, ex);
        if (message != null) {
            return ResponseUtil.failResult(ex.getMessage() + "\n" + message);
        } else {
            return ResponseUtil.failResult(ex.getMessage());
        }
    }
}
