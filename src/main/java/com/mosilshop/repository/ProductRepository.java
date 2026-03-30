package com.mosilshop.repository;

import com.mosilshop.entity.Product;
import com.mosilshop.enums.Category;
import com.mosilshop.enums.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {


    List<Product> findByType(ProductType productType);

    List<Product> findByCategory(Category category);
    List<Product> findByCategoryAndType(Category category, ProductType type);
    List<Product> findByIsNewTrue();
    List<Product> findByIsSaleTrue();
    List<Product> findByBrand(String brand);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.tags) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Product> searchProducts(String search);

    @Query("SELECT p FROM Product p ORDER BY p.rating DESC")
    List<Product> findTopRated();


}


