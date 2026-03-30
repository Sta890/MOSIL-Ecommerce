# MOSIL-SHOP — Spring Boot Backend

## 🚀 Démarrage

### Prérequis
- Java 17+
- MySQL 8+
- Maven

### Configuration
Dans `src/main/resources/application.properties`, modifiez :
```properties
spring.datasource.username=root
spring.datasource.password=VotreMotDePasse
```

### Lancer le projet
```bash
# Depuis le dossier mosil-backend/
mvn spring-boot:run
```

Le serveur démarre sur **http://localhost:8080**  
La base de données `mosilshop` est créée automatiquement.

---

## 📡 API Endpoints

### 🔐 Auth
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/auth/register` | Créer un compte | ❌ |
| POST | `/api/auth/login` | Se connecter | ❌ |

**Register body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Login body:**
```json
{ "email": "john@example.com", "password": "password123" }
```

**Réponse (token JWT):**
```json
{
  "token": "eyJhbGci...",
  "email": "john@example.com",
  "firstName": "John",
  "role": "USER"
}
```

---

### 🛍️ Produits
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | `/api/products` | Tous les produits | ❌ |
| GET | `/api/products?category=men` | Par catégorie | ❌ |
| GET | `/api/products?search=jacket` | Recherche | ❌ |
| GET | `/api/products/{id}` | Un produit | ❌ |
| GET | `/api/products/new-arrivals` | Nouveautés | ❌ |
| GET | `/api/products/sale` | Promotions | ❌ |
| GET | `/api/products/top-rated` | Mieux notés | ❌ |
| POST | `/api/products` | Créer produit | ADMIN |
| PUT | `/api/products/{id}` | Modifier produit | ADMIN |
| DELETE | `/api/products/{id}` | Supprimer produit | ADMIN |

---

### 🛒 Panier
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | `/api/cart` | Mon panier | ✅ |
| POST | `/api/cart/add` | Ajouter article | ✅ |
| PUT | `/api/cart/items/{id}` | Modifier quantité | ✅ |
| DELETE | `/api/cart/items/{id}` | Supprimer article | ✅ |
| DELETE | `/api/cart/clear` | Vider panier | ✅ |

**Add to cart body:**
```json
{
  "productId": 1,
  "size": "M",
  "color": "Black",
  "quantity": 2
}
```

---

### 📦 Commandes
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | `/api/orders` | Mes commandes | ✅ |
| GET | `/api/orders/{id}` | Une commande | ✅ |
| POST | `/api/orders/checkout` | Passer commande | ✅ |
| PUT | `/api/orders/{id}/status?status=SHIPPED` | Modifier statut | ADMIN |

**Checkout body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "address": "123 Main St",
  "city": "New York",
  "zip": "10001",
  "country": "US",
  "promoCode": "SAVE10"
}
```

---

### 👤 Utilisateurs
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | `/api/users/me` | Mon profil | ✅ |
| PUT | `/api/users/me` | Modifier profil | ✅ |
| PUT | `/api/users/me/password` | Changer mot de passe | ✅ |
| GET | `/api/users` | Tous les users | ADMIN |
| DELETE | `/api/users/{id}` | Supprimer user | ADMIN |

---

## 🔑 Utiliser le JWT

Ajoutez le token dans le header de chaque requête protégée :
```
Authorization: Bearer eyJhbGci...
```

## 🎯 Codes Promo
- `SAVE10` → -10%
- `WELCOME20` → -20%
