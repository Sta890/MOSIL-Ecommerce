package com.mosilshop.repository;

import com.mosilshop.entity.Cart;
import com.mosilshop.entity.CartItem;
import com.mosilshop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProductAndSelectedSizeAndSelectedColor(Cart cart, Product product, String size, String color);
}
