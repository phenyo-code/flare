<h1 align="center">FLARE</h1>

<p align="center">
  <i>Empower Your Shopping Experience with Seamless Innovation</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-june-2ea44f?style=flat-square" />
  <img src="https://img.shields.io/badge/typescript-85%25-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/languages-4-lightgrey?style=flat-square" />
</p>

---

### 🔧 Built with the tools and technologies:

<p>
  <img src="https://img.shields.io/badge/JSON-black?logo=json&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Markdown-black?logo=markdown&style=for-the-badge" />
  <img src="https://img.shields.io/badge/npm-red?logo=npm&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Autoprefixer-ff69b4?logo=autoprefixer&style=for-the-badge" />
  <img src="https://img.shields.io/badge/PostCSS-dd3a0a?logo=postcss&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Prettier-f7b93e?logo=prettier&style=for-the-badge" />
  <img src="https://img.shields.io/badge/.ENV-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/JavaScript-yellow?logo=javascript&style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Lodash-3492FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Zod-4B32C3?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?logo=stripe&style=for-the-badge" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Swiper-6332F6?logo=swiper&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/date--fns-fc6b58?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Jest-C21325?logo=jest&style=for-the-badge" />
</p>

---

## ✨ Features

- **Product Browsing** – Detailed product pages with images and pricing.
- **Real-Time Cart** – Dynamic cart with live updates.
- **Stripe Checkout** – Secure and responsive payment integration.
- **Admin Panel** – Manage products, orders, and inventory.
- **Smart Suggestions** – Related product recommendations by category.
- **User Authentication** – Powered by NextAuth.js.
- **Order Management** – Track order status and history.

---

## 📦 Technologies Used

| Category        | Technologies                                                                 |
|----------------|-------------------------------------------------------------------------------|
| **Frontend**    | Next.js 15, Tailwind CSS, React, Swiper, Framer Motion                       |
| **Backend**     | Node.js, Prisma ORM                                                          |
| **Database**    | MongoDB (via Prisma)                                                         |
| **Payments**    | Stripe, PayU                                                                 |
| **Auth**        | NextAuth.js                                                                  |
| **Testing**     | Jest, React Testing Library                                                  |
| **Utils**       | Zod, Lodash, Axios, Chart.js, Date-fns                                       |
| **CI/Formatting**| Prettier, ESLint, Autoprefixer, PostCSS                                     |

---

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

## Environment Variables


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

---


## Acknowledgements

Next.js
Prisma
Stripe
NextAuth.js


