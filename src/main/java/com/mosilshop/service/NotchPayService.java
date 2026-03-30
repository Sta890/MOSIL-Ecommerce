package com.mosilshop.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotchPayService {

    @Value("${notchpay.public-key}")
    private String publicKey;

    @Value("${notchpay.secret-key}")
    private String secretKey;

    private final RestTemplate restTemplate;

    public Map<String, Object> initiatePayment(String email, String phone, double amount, String orderNumber) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", publicKey);

        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("phone", phone);
        body.put("amount", amount);
        body.put("currency", "XAF");
        body.put("reference", orderNumber);
        body.put("callback", "http://localhost:8080/api/payments/callback");
        body.put("description", "Commande MOSIL-SHOP " + orderNumber);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.notchpay.co/payments/initialize",
                request,
                Map.class
        );

        return response.getBody();
    }

    public boolean verifyPayment(String reference) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", secretKey);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.notchpay.co/payments/" + reference,
                HttpMethod.GET,
                request,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) return false;

        Map<String, Object> transaction = (Map<String, Object>) body.get("transaction");
        if (transaction == null) return false;

        return "complete".equals(transaction.get("status"));
    }
}