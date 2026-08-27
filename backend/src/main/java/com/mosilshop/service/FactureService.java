package com.mosilshop.service;

import com.mosilshop.entity.Order;
import com.mosilshop.entity.OrderItem;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class FactureService {

    public byte[] genererFacturePDF(Order order) throws JRException {

        // 1. Charger et compiler le template
        InputStream template = getClass()
                .getResourceAsStream("/reports/facture.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(template);

        // 2. Préparer les paramètres depuis ton entity Order
        Map<String, Object> params = new HashMap<>();
        params.put("orderNumber",     order.getOrderNumber());
        params.put("createdAt",       order.getCreatedAt()
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        params.put("status",          order.getStatus().name());

        // Nom complet du client (shipping info)
        params.put("clientFullName",  order.getShippingFirstName() + " " + order.getShippingLastName());
        params.put("clientEmail",     order.getShippingEmail());
        params.put("clientPhone",     order.getShippingPhone() != null ? order.getShippingPhone() : "");

        // Adresse de livraison
        params.put("shippingAddress", order.getShippingAddress());
        params.put("shippingCity",    order.getShippingCity());
        params.put("shippingZip",     order.getShippingZip() != null ? order.getShippingZip() : "");
        params.put("shippingCountry", order.getShippingCountry());

        // Montants
        params.put("subtotal",        order.getSubtotal().toString());
        params.put("shippingCost",    order.getShippingCost().toString());
        params.put("discountAmount",  order.getDiscountAmount() != null
                ? order.getDiscountAmount().toString() : "0");
        params.put("promoCode",       order.getPromoCode() != null ? order.getPromoCode() : "");
        params.put("total",           order.getTotal().toString());

        // 3. Préparer les lignes (OrderItem → Map)
        List<Map<String, Object>> lignes = new ArrayList<>();
        for (OrderItem item : order.getItems()) {
            Map<String, Object> row = new HashMap<>();
            row.put("productName",   item.getProduct().getName()); // adapte si le champ s'appelle autrement
            row.put("selectedSize",  item.getSelectedSize());
            row.put("selectedColor", item.getSelectedColor());
            row.put("quantity",      item.getQuantity());
            row.put("unitPrice",     item.getUnitPrice().toString());
            row.put("totalPrice",    item.getTotalPrice().toString());
            lignes.add(row);
        }

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(lignes);

        // 4. Remplir et exporter en PDF
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, dataSource);
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}