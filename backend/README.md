# Backend - Inventory Allocation System API

REST API backend untuk sistem manajemen inventori yang dibangun dengan Express.js, PostgreSQL, dan ORM.

## 🚀 Tech Stack

- **Node.js** dengan **Express.js** (v4.21.2)
- **PostgreSQL** - Database relasional
- **Sequelize ORM** (v6.37.7) - ORM dan migrasi database
- **Axios** - HTTP client untuk integrasi vendor
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **CORS** - Cross-Origin Resource Sharing
- **express-async-errors** - Async error handling

## 📋 Prerequisites

- Node.js v18 atau lebih tinggi
- PostgreSQL v12 atau lebih tinggi
- npm atau yarn

## ⚙️ Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Salin file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=your_db_name

# Server Configuration
PORT=3001

# Vendor Configuration
VENDOR="PT FOOM LAB GLOBAL"

# FOOM Hub Integration
HUB_FOOM_URL=https://hub.foomid.id
HUB_FOOM_SECRET_KEY=your_secret_key_here
```

### 3. Setup Database

```bash
# Buat database
createdb foom_inventory

# Atau menggunakan PostgreSQL CLI
psql -U postgres
CREATE DATABASE foom_inventory;
\q
```

### 4. Jalankan Migrasi

```bash
npx sequelize-cli db:migrate
```

### 5. (Opsional) Seed Database

Untuk mengisi database dengan data sample:

```bash
npx sequelize-cli db:seed:all
```

Ini akan membuat:
- 3 warehouse (Jakarta, Surabaya, Bandung)
- 10 produk dengan SKU
- Data stock awal

### 6. Jalankan Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3001`

## 📡 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Warehouses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/warehouses` | Mendapatkan semua warehouse |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Mendapatkan semua produk |

### Stocks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stocks` | Mendapatkan semua stock dengan detail warehouse dan produk |

### Purchase Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/purchase/request` | Mendapatkan semua purchase request |
| GET | `/purchase/request/:id` | Mendapatkan PR berdasarkan ID |
| POST | `/purchase/request` | Membuat PR baru (status: DRAFT) |
| PUT | `/purchase/request/:id` | Update PR (edit items atau submit) |
| DELETE | `/purchase/request/:id` | Hapus PR (hanya DRAFT) |

### Webhook

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook/receive-stock` | Terima update stock dari vendor |

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validasi error)
- `404` - Not Found
- `500` - Internal Server Error

## 🔄 Purchase Request Flow

### 1. Buat Purchase Request (DRAFT)

```bash
POST /api/purchase/request
Content-Type: application/json

{
  "warehouse_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 100
    },
    {
      "product_id": 2,
      "quantity": 50
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Purchase Request created successfully",
  "data": {
    "id": 1,
    "reference": "PR-00001",
    "warehouse_id": 1,
    "status": "DRAFT",
    "createdAt": "2025-11-23T10:00:00.000Z",
    "updatedAt": "2025-11-23T10:00:00.000Z"
  }
}
```

### 2. Submit ke Vendor (DRAFT → PENDING)

```bash
PUT /api/purchase/request/1
Content-Type: application/json

{
  "status": "PENDING"
}
```

Sistem akan Update status PurchaseRequest menjadi `PENDING` dan Mengirim data ke FOOM HUB

**Response:**
```json
{
  "status": "success",
  "message": "Purchase Request updated successfully",
  "data": {
    "id": 1,
    "reference": "PR-00001",
    "warehouse_id": 1,
    "status": "PENDING",
    "createdAt": "2025-11-23T12:26:51.266Z",
    "updatedAt": "2025-11-23T12:27:50.024Z"
  }
}
```

### 3. Terima Stock dari Vendor (PENDING → COMPLETED)

Vendor mengirim webhook:

```bash
POST /api/webhook/receive-stock
Content-Type: application/json
secret-key: FOOM_secret_key


{
  "vendor": "PT FOOM LAB GLOBAL",
  "reference": "PR-00001",
  "details": [
    { "sku_barcode": "CHOCODELIGHT", "qty": 50 }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Stock received successfully",
  "data": {
    "reference": "PR-00004",
    "updated_items": 1
  }
}
```

Sistem akan melakukan:
- Validasi vendor dan reference
- Update stock di warehouse terkait
- Update status PR menjadi COMPLETED
- Implementasi idempotency (tidak akan double update jika webhook dikirim ulang)

## 🧠 Arsitektur & Design Decisions

### Separation of Concerns

- **Routes**: Definisi endpoint dan HTTP routing
- **Controllers**: Handling request/response, validasi input
- **Services**: Business logic dan orchestration
- **Models**: Database schema dan relasi

### Webhook Idempotency

Implementasi idempotency key menggunakan `reference` Purchase Request:

```javascript
if (pr.status === "COMPLETED") {
  return { message: "Already processed (idempotent)" };
}
```

Mencegah:
- Double update stock jika vendor mengirim webhook berulang
- Race condition dengan locking mechanism

### Error Handling

- Custom `ApiError` class untuk error konsisten
- Global error handler middleware
- `express-async-errors` untuk auto-catch async errors
- Proper HTTP status codes

### Reference Generation

Auto-generate reference dengan format `PR-XXXXX`:

```javascript
const count = await PurchaseRequest.count();
const reference = `PR-${pad(count + 1, 5)}`; // PR-00001, PR-00002, ...
```


## 🔧 Commands Sequelize

### Migrations

```bash
# Jalankan semua pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo semua migrations
npx sequelize-cli db:migrate:undo:all

# Create new migration
npx sequelize-cli migration:generate --name migration-name
```

### Seeders

```bash
# Jalankan semua seeders
npx sequelize-cli db:seed:all

# Jalankan specific seeder
npx sequelize-cli db:seed --seed seeder-filename.js

# Undo last seeder
npx sequelize-cli db:seed:undo

# Undo semua seeders
npx sequelize-cli db:seed:undo:all
```

## 🔐 Security

- Helmet middleware untuk security headers
- CORS configuration
- Environment variables untuk sensitive data
- Input validation di controller layer
- SQL injection prevention via Sequelize ORM
- Webhook authentication via secret-key header


## 🚧 Possible Improvements

1. **Authentication & Authorization**
   - JWT authentication
   - Role-based access control
   - API key management

2. **Validation**
   - Request validation library (Joi/Yup)
   - Schema validation middleware

3. **Testing**
   - Unit tests (Jest)
   - Integration tests (Supertest)
   - Test coverage

4. **Performance**
   - Database indexing
   - Query optimization
   - Caching layer (Redis)

5. **Monitoring**
   - Structured logging (Winston)
   - Performance monitoring (APM)

6. **DevOps**
   - Docker containerization
   - CI/CD pipeline
   - Graceful shutdown


## 👥 Author

Developed by Muhammad Sidiq Hardiansyah as part of inventory management system assessment.
