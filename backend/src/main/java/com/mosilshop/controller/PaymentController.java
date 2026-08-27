package com.mosilshop.controller;

import com.mosilshop.service.NotchPayService;
import com.mosilshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final NotchPayService notchPayService;
    private final OrderService orderService;

    @PostMapping("/initialize")
    public ResponseEntity<Map<String, Object>> initialize(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        String phone = (String) request.get("phone");
        double amount = Double.parseDouble(request.get("amount").toString());
        String orderNumber = (String) request.get("orderNumber");

        Map<String, Object> response = notchPayService.initiatePayment(email, phone, amount, orderNumber);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(
            @RequestParam String reference,
            @RequestParam String status,
            @RequestParam(required = false) String trxref) {

        // ✅ Utilise reference en priorité, trxref en fallback
        String orderRef = (trxref != null && !trxref.isBlank()) ? trxref : reference;

        if ("complete".equals(status)) {
            try {
                orderService.updateStatusByOrderNumber(orderRef, "CONFIRMED");
                // ✅ L'email est maintenant envoyé dans updateStatusByOrderNumber
            } catch (Exception e) {
                System.err.println("❌ Erreur mise à jour commande: " + e.getMessage());
            }
        }

        // Rediriger vers le frontend
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(java.net.URI.create(
                "http://localhost:4300/order-confirmation?status=" + status + "&ref=" + orderRef
        ));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}