package com.mosilshop.controller;

import com.mosilshop.dto.LoginNotifRequest;
import com.mosilshop.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notify")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<Void> notifyLogin(@RequestBody LoginNotifRequest req) {
        emailService.sendLoginNotification(
                req.getTo(), req.getFirstName(),
                req.getIp(), req.getDevice(), req.getTime()
        );
        return ResponseEntity.ok().build();
    }
}