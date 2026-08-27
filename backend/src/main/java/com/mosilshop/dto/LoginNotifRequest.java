package com.mosilshop.dto;

import lombok.Data;

@Data
public class LoginNotifRequest {
    private String to;
    private String firstName;
    private String ip;
    private String device;
    private String time;
}