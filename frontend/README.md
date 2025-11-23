# Inventory Allocation System - Frontend

A modern web application for managing inventory allocation, purchase requests, and stock levels across multiple warehouses. Built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.17
- **UI Components**: Custom component library
- **Icons**: @deemlol/next-icons
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **HTTP Client**: Native Fetch API with custom wrapper

## 📋 Features

### 1. **Stock Dashboard**
- Real-time view of inventory levels across all warehouses
- Display Product Name, Warehouse Name, and Current Quantity
- Color-coded quantity indicators (red for zero stock)
- Responsive table with pagination

### 2. **Purchase Request Management**
- **List View**: Display all purchase requests with reference, vendor, quantity, date, and status
- **Create New**: Dynamic form with warehouse and product selection
- **Detail View**: Complete purchase request information with item breakdown
- **Status Update**: DRAFT → PENDING workflow with confirmation dialogs
- **Delete**: Remove draft purchase requests with confirmation

### 3. **Dynamic Form Features**
- Warehouse dropdown selection
- Multiple product rows with add/remove functionality
- Real-time stock availability checking
- Visual warnings when quantity exceeds available stock
- Duplicate product prevention
- Form validation (required fields, positive quantities)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Git

### 1. Clone from GitHub

```bash
# Clone the repository
git clone https://github.com/msidiqh991/inventory-allocation-system.git

# Navigate to project directory
cd inventory-allocation-system-frontend
cd frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and configure the API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=YOUR_BASE_API_URL
```

**Note**: Make sure your backend API is running on the specified URL.

### 4. Run Development Server

```bash
# Using npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔗 API Integration

The frontend connects to the backend API through the following endpoints:

### Products
- `GET /products` - Fetch all products

### Warehouses
- `GET /warehouses` - Fetch all warehouses

### Stocks
- `GET /stocks` - Fetch all stock items with product and warehouse info

### Purchase Requests
- `GET /purchase/request` - Fetch all purchase requests
- `GET /purchase/request/:id` - Fetch purchase request detail
- `POST /purchase/request` - Create new purchase request
- `PUT /purchase/request/:id` - Update purchase request status
- `DELETE /purchase-requests/:id` - Delete purchase request (DRAFT only)


## 🎨 Design Decisions

### 1. **Service Layer Architecture**
- Separated API calls into dedicated service files
- Each service handles one entity (Product, Warehouse, Stock, PurchaseRequest)
- Transforms backend responses to frontend-friendly formats
- Centralized error handling

### 2. **Custom Hooks**
- `useSimpleFetch`: Reusable hook for data fetching with loading/error states
- `refetch` function for manual data refresh after mutations
- Prevents infinite loops with `useCallback` for stable function references

### 3. **Type Safety**
- Comprehensive TypeScript interfaces for all entities
- Separate types for API responses vs. UI data models
- Generic table column types for reusability

### 4. **Component Patterns**
- Server Components for initial data fetching (SEO-friendly)
- Client Components for interactive features
- Composition pattern for table rendering
- Controlled form components with validation

### 5. **Status Flow**
- **DRAFT**: Editable, can be deleted or submitted
- **PENDING**: Submitted for approval, waiting for vendor
- **COMPLETED**: Stock received via webhook

### 6. **Stock Validation**
- Real-time stock checking when warehouse is selected
- Visual warnings (red border + text) when quantity exceeds available stock
- Optional validation (warns but allows submission)
- Can be changed to blocking validation if needed

## 🚧 Known Limitations & Future Improvements

### Current Limitations
1. **Stock Validation**: Currently shows warnings but doesn't block submission
2. **Webhook Updates**: Frontend doesn't receive real-time updates when stock arrives
3. **Edit Functionality**: Purchase request data cannot be edited (only status updates)
4. **Search/Filter**: No search or filter functionality in tables
5. **Export**: No data export feature (CSV/Excel)

### Planned Improvements

#### Short Term
- Search/filter & sorting table
- Date Range Filter
- Add date range filter for purchase requests
- Export table data to CSV/Excel
- Add print view for purchase request details
- Implement optimistic UI updates

#### Medium Term
- WebSocket integration for real-time stock updates
- Notification system for status changes
- Purchase request templates
- Audit log/history view
- Advanced filtering (multiple warehouses, status, date ranges)

#### Long Term
- Role-based access control (RBAC)
- Multi-language support (i18n)
- Analytics Dashboard with Charts
- Mobile app version
- Integration with barcode scanners

### Technical Improvements
- Unit Testing + E2E Tests
- Implement React Query for better cache management
- Optimize bundle size with code splitting
- Add performance monitoring (Web Vitals)
- Implement error boundary components
- Add request retry logic with exponential backoff


<br/>


**Built by Muhammad Sidiq Hardiansyah with ❤️ using Next.js and TypeScript**

