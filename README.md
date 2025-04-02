# FLARE

This is a full-stack e-commerce PWA (Progressive Web App) built with Next.js 15, MongoDB, and Stripe. The application provides a seamless shopping experience, including product browsing, cart management, and secure checkout with Stripe.


## Features

### Product Browsing:
View detailed product pages with descriptions, images, and pricing.

### Real-Time Cart Updates: 
Add and modify products in your cart, with automatic updates.

### Stripe Payment Integration: 
Secure checkout with Stripe for payments.

### Admin Panel: 
Admins can manage products, orders, and inventory.

### Complementary Product Suggestions: 
Display products related to the one being viewed based on category matching.

### User Authentication: 
Integrated login and authentication with NextAuth.js.

### Order Management: 
Manage customer orders and track their status.

## Technologies Used

### Frontend: 
Next.js, Tailwind CSS

### Backend: 
Node.js, Prisma ORM

### Database: 
MongoDB (via Prisma)

### Payment Gateway: 
PayU (via CheckOut )

### Authentication: 
NextAuth.js

### Testing: 
Jest, React Testing Library

# Getting Started

Install dependencies:

```bash
npm install
# or
yarn install
```


Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

For testing the stripe checkOut run on a secure http

```bash
node server.js
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.


Set up the environment variables by creating a .env file at the root of the project:  (.env.local  and   .env.production )

```bash
GOOGLE_ID=your-googleID
GOOGLE_SECRET=yourGoogle-Secret
NODE_ENV=
COOKIE_SECRET=your-cookie-secret
DATABASE_URL="your-mongodb-connection-string"
NEXTAUTH_SECRET=your-nextAuth-secret
NEXT_PUBLIC_APP_URL=https://localhost:3000 
STRIPE_SECRET_KEY=uour-stripe-scret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-public-stripe-key
NEXT_PUBLIC_BASE_URL=https://localhost:3000  # or your production base URL
BASE_URL=http://localhost:3000
```


## Testing

```bash
npm test
```

Or test individual server action as follows

```bash
npx jest test/actions/addProduct.test.ts
```


## Acknowledgements

Next.js
Prisma
Stripe
NextAuth.js


