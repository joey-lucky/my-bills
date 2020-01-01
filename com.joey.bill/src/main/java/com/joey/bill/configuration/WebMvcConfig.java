package com.joey.bill.configuration;

import com.joey.bill.configuration.interceptor.TokenInterceptor;
import com.joey.bill.configuration.interceptor.WebContextInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
    @Autowired
    private TokenInterceptor mTokenInterceptor;
    @Autowired
    private WebContextInterceptor mWebContextInterceptor;

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(mWebContextInterceptor)
                .addPathPatterns("/**");
        registry.addInterceptor(mTokenInterceptor)
                .addPathPatterns("/**")//拦截的访问路径，拦截所有
                .excludePathPatterns("/login");
        super.addInterceptors(registry);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        super.addResourceHandlers(registry);
    }
}