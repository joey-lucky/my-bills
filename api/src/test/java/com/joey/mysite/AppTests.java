package com.joey.mysite;

import java.math.BigDecimal;

public class AppTests {
    public static void main(String[] args) {
        BigDecimal money = new BigDecimal(19.56D);
        BigDecimal result = money.multiply(new BigDecimal("100"));
        System.out.println(result);
    }
}
