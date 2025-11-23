# Inventory Allocation System

Sistem manajemen inventori full-stack yang dibangun dengan Next.js (frontend) dan Express.js (backend) menggunakan PostgreSQL database. Sistem ini mengelola warehouse, produk, stock level, dan purchase request dengan integrasi vendor eksternal.

## 🏗️ Struktur Proyek

```
inventory-allocation-system/
├── backend/              # Express.js REST API
│   ├── config/          # Database configuration
│   ├── migrations/      # Sequelize migrations
│   ├── models/          # Sequelize models
│   ├── seeders/         # Database seeders
│   └── src/
│       ├── .../ 
└── frontend/            # Next.js 16 App Router
    └── src/
        ├── app/         # App Router pages & layouts
        ├── components/  # React components
        ├── services/    # API service layer
        ├── types/       # TypeScript types
        ├── hooks/       # Custom React hooks
        ├── layout/      # Layout components
        └── utils/       # Utility functions
```

## 🚀 Fitur Utama

### ✅ Core Features
- **Warehouse Management** - CRUD warehouse dengan lokasi
- **Product Management** - Manajemen produk dengan SKU dan barcode
- **Stock Management** - Real-time inventory tracking per warehouse
- **Purchase Request Workflow** - Alur kerja PR: DRAFT → PENDING → COMPLETED
- **Webhook Integration** - Auto-update stock dari vendor eksternal
- **Idempotent Processing** - Mencegah duplikasi update dari webhook yang berulang

### 🎯 Business Logic
- Generate reference otomatis (PR-00001, PR-00002, ...)
- Status transition management (hanya DRAFT yang bisa diedit/dihapus)
- Stock allocation per warehouse
- Transaction-based operations untuk data consistency
- Vendor notification saat PR di-submit

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js v4.21.2
- **Database**: PostgreSQL v12+
- **ORM**: Sequelize v6.37.7
- **HTTP Client**: Axios v1.13.2
- **Security**: Helmet, CORS
- **Logger**: Morgan
- **Error Handling**: express-async-errors

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4.1.17
- **Icons**: @deemlol/next-icons
- **Forms**: Custom form components
- **HTTP Client**: Fetch API dengan utility wrapper

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

- **Node.js** v18 atau lebih tinggi ([Download](https://nodejs.org/))
- **PostgreSQL** v12 atau lebih tinggi ([Download](https://www.postgresql.org/download/))
- **npm** atau **yarn** package manager
- **Git** untuk version control

## 🧠 Design Decisions

### 1. Arsitektur MVC (Model-View-Controller)

**Separation of Concerns:**
- **Routes** → Definisi endpoint HTTP
- **Controllers** → Handle request/response, validasi input
- **Services** → Business logic & orchestration
- **Models** → Database schema & relationships

**Alasan:**
- Kode lebih terorganisir dan mudah di-maintain
- Separation memudahkan testing
- Business logic terpisah dari handling HTTP

### 2. Purchase Request State Machine

**Status Flow:**
```
DRAFT → PENDING → COMPLETED
```

**Rules:**
- **DRAFT**: Bisa diedit & dihapus
- **PENDING**: Sudah disubmit ke vendor, tidak bisa diedit/dihapus
- **COMPLETED**: Stock sudah diterima via webhook

**Alasan:**
- Clear workflow untuk tracking
- Mencegah perubahan setelah submission
- Audit trail yang jelas

### 3. Webhook Idempotency

**Implementation:**
```javascript
if (pr.status === "COMPLETED") {
  return { message: "Already processed (idempotent)" };
}
```

**Alasan:**
- Vendor bisa mengirim webhook berulang kali
- Mencegah double update stock
- Mengembalikan response sukses untuk menghindari retry

### 4. Transaction Management

**Pattern:**
```javascript
await sequelize.transaction(async (t) => {
  // Operation 1
  // Operation 2
  // Operation 3
  // All-or-nothing execution
});
```

**Alasan:**
- Menjamin data consistency
- Rollback otomatis jika ada error
- Critical untuk operasi multi-step (PR creation, stock update)

### 5. Stock Allocation Strategy

- Stock disimpan per warehouse-product combination
- Composite key: `(warehouse_id, product_id)`
- Upsert pattern: update jika exist, create jika tidak

**Alasan:**
- Mendukung multi-warehouse operations
- Fleksibel untuk future stock transfer features
- Clear separation per lokasi

### 6. Reference Auto-Generation

**Format:** `PR-00001`, `PR-00002`, ...

```javascript
const count = await PurchaseRequest.count();
const reference = `PR-${pad(count + 1, 5)}`;
```

**Alasan:**
- Human-readable identifier
- Sequential numbering untuk audit
- Digunakan sebagai idempotency key

### 7. Frontend Architecture (Next.js App Router)

**Pattern:**
- Server Components untuk data fetching
- Client Components untuk interactivity
- Service layer untuk API abstraction
- Type-safe dengan TypeScript

**Alasan:**
- Better performance (RSC)
- Type safety mengurangi bugs
- Separation of concerns di frontend
- SSR support untuk SEO

### 8. Error Handling Strategy

**Backend:**
- Custom `ApiError` class
- Global error handler middleware
- `express-async-errors` untuk auto-catch
- Proper HTTP status codes

**Frontend:**
- Try-catch blocks di API calls
- Error boundaries untuk React errors
- User-friendly error messages

**Alasan:**
- Consistent error response format
- Better debugging experience
- User-friendly error handling

## 📚 Dokumentasi Lengkap

- [Backend README](./backend/README.md) - Dokumentasi backend lengkap
- [Frontend README](./frontend/README.md) - Dokumentasi frontend lengkap



##

**Happy Coding! 🚀**
