package com.mosilshop.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendLoginNotification(String to, String firstName, String ip, String device, String time) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("🔐 Nouvelle connexion détectée - " + time);
            helper.setText(buildHtml(firstName, to, ip, device, time), true);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Erreur envoi email: " + e.getMessage());
        }
    }

    private String buildHtml(String firstName, String email, String ip, String device, String time) {
        return """
            <h2>🔐 Nouvelle connexion détectée</h2>
            <p>Bonjour <strong>%s</strong>,</p>
            <p>Une connexion à votre compte a été effectuée :</p>
            <table style="border-collapse:collapse;width:100%%">
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>📧 Email</strong></td><td style="padding:8px;border:1px solid #ddd">%s</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>🕐 Heure</strong></td><td style="padding:8px;border:1px solid #ddd">%s</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>🌐 IP</strong></td><td style="padding:8px;border:1px solid #ddd">%s</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>💻 Appareil</strong></td><td style="padding:8px;border:1px solid #ddd">%s</td></tr>
            </table>
            <p style="color:#888;font-size:12px">Si ce n'était pas vous, changez votre mot de passe immédiatement.</p>
        """.formatted(firstName, email, time, ip, device);
    }


    @Async // ✅ Ajoute cette annotation
    public void sendOrderConfirmation(String to, String firstName, String orderNumber, BigDecimal total) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("✅ Confirmation de commande - " + orderNumber);
            helper.setText(buildOrderHtml(firstName, orderNumber, total), true);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Erreur envoi email commande: " + e.getMessage());
        }
    }
    private String buildOrderHtml(String firstName, String orderNumber, BigDecimal total) {
        return """
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <div style="background:#111;padding:20px;text-align:center">
            <h1 style="color:#d4af37;margin:0">MOSIL-SHOP</h1>
          </div>
          <div style="padding:30px;background:#fff">
            <h2>✅ Commande confirmée !</h2>
            <p>Bonjour <strong>%s</strong>,</p>
            <p>Votre commande a bien été reçue et est en cours de traitement.</p>
            <table style="border-collapse:collapse;width:100%%;margin:20px 0">
              <tr style="background:#f5f5f5">
                <td style="padding:12px;border:1px solid #ddd"><strong>📦 Numéro de commande</strong></td>
                <td style="padding:12px;border:1px solid #ddd">%s</td>
              </tr>
              <tr>
                <td style="padding:12px;border:1px solid #ddd"><strong>💰 Total</strong></td>
                <td style="padding:12px;border:1px solid #ddd">$%.2f</td>
              </tr>
            </table>
            <p>Vous recevrez une notification dès que votre commande sera expédiée.</p>
            <div style="text-align:center;margin-top:30px">
              <a href="http://localhost:4300/profile"
                 style="background:#d4af37;color:#111;padding:12px 30px;text-decoration:none;font-weight:bold">
                VOIR MA COMMANDE
              </a>
            </div>
          </div>
          <div style="background:#111;padding:15px;text-align:center">
            <p style="color:#888;font-size:12px;margin:0">© 2025 MOSIL-SHOP — Powered by SkySoft Technology</p>
          </div>
        </div>
    """.formatted(firstName, orderNumber, total);
    }
}
