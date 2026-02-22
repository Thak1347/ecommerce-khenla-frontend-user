# KHENLA E-commerce Frontend

## Overview
KHENLA is a modern e-commerce platform specializing in computer products. This frontend application provides a seamless shopping experience with multi-language support (English, Khmer, Lao), secure authentication, and integrated payment processing.

## Features

### 🌟 Core Features
- **Product Catalog** - Browse products with advanced filtering and sorting
- **Shopping Cart** - Manage items, update quantities, calculate totals
- **Secure Authentication** - JWT-based login/register system
- **Multi-language Support** - English, Khmer, and Lao translations
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### 🛍️ Shopping Experience
- **Product Details** - Comprehensive product information with images
- **Category Navigation** - Browse by categories and brands
- **Search & Filters** - Find products by price, category, brand, and keywords
- **Sorting Options** - Sort by price (low/high) and name (A-Z/Z-A)

### 💳 Payment & Orders
- **Multiple Payment Methods** - KHQR (Cambodia) and BCEL One (Laos)
- **Payment Proof Upload** - Upload screenshots after QR payment
- **Order History** - Track all orders with status updates
- **Digital Receipts** - Download PDF receipts after payment confirmation
- **Order Details** - View complete order information

### 🔒 Security
- **Protected Routes** - Authenticated access to checkout and orders
- **Token Management** - Automatic token refresh and logout on expiration
- **Secure API Calls** - Axios interceptors for consistent authentication

## Technology Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation and routing
- **Tailwind CSS** - Styling and responsive design
- **Context API** - State management (Auth, Cart)

### Libraries & Tools
- **i18next** - Multi-language internationalization
- **Axios** - HTTP client with interceptors
- **jsPDF + autoTable** - PDF receipt generation
- **React Hot Toast** - Notification system
- **React Hooks** - Custom hooks (useDebounce)

## Project Structure

```
khenla-frontend-user/
├── public/                 # Static files
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ProductCard.js
│   │   ├── CartItem.js
│   │   ├── OrderSummary.js
│   │   ├── LanguageSelector.js
│   │   ├── PrivateRoute.js
│   │   ├── ReceiptTemplate.js
│   │   └── LoadingSpinner.js
│   ├── pages/             # Page components
│   │   ├── HomePage.js
│   │   ├── ProductCatalog.js
│   │   ├── ProductDetail.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── OrderHistoryPage.js
│   │   ├── OrderDetailPage.js
│   │   ├── ReceiptPage.js
│   │   ├── LoginPage.js
│   │   └── RegisterPage.js
│   ├── context/           # Context providers
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── services/          # API integration
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   └── receipt.js
│   ├── hooks/             # Custom React hooks
│   │   └── useDebounce.js
│   ├── utils/             # Utility functions
│   │   ├── constants.js
│   │   └── receiptGenerator.js
│   ├── i18n/              # Internationalization
│   │   ├── i18n.js
│   │   └── locales/
│   │       ├── en.json
│   │       ├── km.json
│   │       └── lo.json
│   ├── App.js             # Main app component
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── .env                    # Environment variables
├── package.json            # Dependencies
├── postcss.config.js       # PostCSS config
├── tailwind.config.js      # Tailwind config
└── README.md               # Documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API server running (see backend documentation)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd khenla-frontend-user
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8000
```

4. **Start development server**
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm build` | Build for production |
| `npm test` | Run tests |
| `npm eject` | Eject from Create React App |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000` |

## Key Features Implementation

### Authentication Flow
1. User registers/logs in via `/login` or `/register`
2. JWT token stored in localStorage
3. Axios interceptor adds token to all requests
4. Protected routes redirect to login if not authenticated
5. Automatic logout on token expiration

### Shopping Cart
- Cart state managed via Context API
- Persistent storage in localStorage
- Add/remove/update quantity operations
- Real-time total calculation

### Multi-language Support
- Language selection via dropdown
- Translations stored in JSON files
- Language persists across sessions
- Product names and descriptions in selected language

### Checkout Process
1. Review cart items
2. Enter customer information
3. Select payment method (KHQR/BCEL One)
4. Upload payment proof screenshot
5. Place order
6. Redirect to order history

### Receipt Generation
- PDF receipts generated client-side
- Includes order details, items, and totals
- Download button on paid orders
- Print-friendly HTML view

## API Integration

The frontend communicates with the backend REST API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/me` | GET | Current user info |
| `/products/` | GET | List products |
| `/products/{id}` | GET | Product details |
| `/categories/` | GET | List categories |
| `/brands/` | GET | List brands |
| `/orders/` | POST | Create order |
| `/orders/my` | GET | User orders |
| `/payments/methods` | GET | Payment methods |
| `/payments/orders/{id}/proof` | POST | Upload payment proof |
| `/receipts/orders/{id}` | GET | Download receipt |

## Styling with Tailwind CSS

The project uses Tailwind CSS for styling with a custom configuration:

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#4b5563',
      }
    },
  },
  plugins: [],
}
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Tailwind CSS not working**
```bash
npm run build:css
# or reinstall Tailwind:
npm install -D tailwindcss@3 postcss@8 autoprefixer@10
npx tailwindcss init -p
```

**API connection errors**
- Verify backend server is running
- Check `REACT_APP_API_URL` in `.env`
- Check CORS configuration on backend

**Build errors**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential.

## Contact

- **Developer**: [Your Name]
- **Email**: your.email@example.com
- **Project Link**: [Repository URL]

## Acknowledgments

- React team for amazing framework
- Tailwind CSS for utility-first styling
- i18next for internationalization
- All contributors and testers

---

**Note**: This frontend is designed to work with the KHENLA backend API. Ensure the backend server is running and properly configured before starting the frontend application.