package com.mosilshop.repository;

import com.mosilshop.entity.Cart;
import com.mosilshop.entity.Order;
import com.mosilshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
   Optional<Order> findByOrderNumber(String orderNumber);

    @Query("SELECT COUNT(o) FROM Order o")
    Long countAllOrders();

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o")
    BigDecimal getTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING'")
    Long countPendingOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'DELIVERED'")
    Long countDeliveredOrders();

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();

    @Query("SELECT FUNCTION('DATE', o.createdAt), SUM(o.total) FROM Order o GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY FUNCTION('DATE', o.createdAt) DESC")
    List<Object[]> getDailyRevenue();
}
