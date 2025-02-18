# Pool Compliance SA Website

A modern, Next.js-based website for Pool Compliance SA, offering pool safety inspection services in Adelaide.

## Features

- Modern, responsive design using Tailwind CSS
- Server-side rendering and static site generation with Next.js 14
- Secure payment processing with Stripe
- Shopping cart functionality
- Contact form with form validation
- SEO optimized with metadata and sitemap generation
- Mobile-friendly navigation

## Tech Stack

- Next.js 14.2.3
- React 18
- TypeScript
- Tailwind CSS
- Stripe Payment Integration
- React Hook Form
- Next-Sitemap

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Stripe account for payment processing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/pool-compliance.git
cd pool-compliance
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This will create an optimized production build and generate the sitemap.

## Project Structure

```
pool-compliance/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── about-us/          # About Us page
│   ├── book-compliance/   # Booking page
│   ├── checkout/          # Checkout process
│   ├── contact/           # Contact page
│   └── globals.css        # Global styles
├── components/            # React components
├── context/              # React context providers
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Features in Detail

### Booking System
- Easy-to-use booking interface
- Real-time price calculation
- Optional CPR sign add-on

### Payment Processing
- Secure Stripe integration
- Support for major credit cards
- Automatic receipt generation

### Contact Form
- Form validation
- Auto-response confirmation
- Admin notification system

### SEO Optimization
- Dynamic metadata
- Automatic sitemap generation
- Structured data implementation

## Deployment

The site is configured for deployment on various platforms including Vercel, Netlify, or any Node.js hosting service.

### Deployment Commands

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying of this project's files, via any medium, is strictly prohibited.

## Contact

Pool Compliance SA - info@poolcompliancesa.com.au
