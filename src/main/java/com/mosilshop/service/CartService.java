package com.mosilshop.service;

import com.mosilshop.entity.*;
import com.mosilshop.entity.CartItem;
import com.mosilshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Cart newcart = Cart.builder().user(user).build();
            return cartRepository.save(newcart);
        });
        cart.getItems().size();
        return cart;
    }

    @Transactional
    public Cart addItem(Long userId, Long productId, String size, String color, int quantity) {
        Cart cart = getCartByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing = cartItemRepository
                .findByCartAndProductAndSelectedSizeAndSelectedColor(cart, product, size, color);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .selectedSize(size)
                    .selectedColor(color)
                    .build();
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }
    @Transactional
    public Cart updateItem(Long userId, Long itemId, int quantity) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    if (quantity <= 0) cart.getItems().remove(item);
                    else item.setQuantity(quantity);
                });
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItem(Long userId, Long itemId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
