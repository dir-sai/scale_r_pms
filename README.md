# Scale-R PMS (Property Management System)

A modern property management system built with Next.js, React, and TypeScript.

## Features

- 🏠 Property Management
- 👥 Tenant Portal
- 💰 Payment Processing
- 🔧 Maintenance Requests
- 📄 Document Management
- 📊 Analytics Dashboard
- 🌙 Dark Mode Support
- 📱 Responsive Design

## Tech Stack

- **Frontend:** React, Next.js, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Query
- **Authentication:** NextAuth.js
- **Database:** PostgreSQL with Prisma
- **API:** REST with Next.js API Routes
- **Deployment:** Vercel/Netlify

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.17.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [Redis](https://redis.io/) (v6 or higher) - for rate limiting

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/scale-r-pms.git
cd scale-r-pms
```

2. **Use the correct Node.js version**
```bash
# If you use nvm (Node Version Manager)
nvm use
```

3. **Install dependencies**
```bash
# Install all dependencies with exact versions
npm install
```

4. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - UPSTASH_REDIS_URL
# - UPSTASH_REDIS_TOKEN
```

5. **Initialize the database**
```bash
# Generate Prisma Client
npm run postinstall

# Push the database schema
npm run db:push

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

6. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run db:push` - Push database changes
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
project/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   ├── styles/          # Global styles and Tailwind CSS
│   └── types/           # TypeScript type definitions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding script
├── public/              # Static files
└── [Configuration files in root]
```

## Development Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Run type checking: `npm run type-check`
4. Run linting: `npm run lint`
5. Format your code: `npm run format`
6. Commit your changes
7. Push and create a pull request

## Database Management

- View/edit data: `npm run db:studio`
- Update schema: Edit `prisma/schema.prisma`
- After schema changes: `npm run db:migrate`
- Reset database: `npm run db:push --force-reset`

## Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start the production server**
```bash
npm run start
```

## Environment Configuration

The project uses different environment configurations for development, staging, and production:

1. **Development**: `.env.development`
   - Local development environment
   - Uses local services and databases
   - Debug features enabled

2. **Staging**: `.env.staging`
   - Testing environment
   - Uses staging services
   - Mimics production setup

3. **Production**: `.env.production`
   - Production environment
   - Uses production services
   - Optimized for performance

### Required Environment Variables

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME        # Application name
NEXT_PUBLIC_APP_URL        # Application URL
NEXT_PUBLIC_API_URL        # API endpoint URL
NEXT_PUBLIC_CDN_URL        # CDN URL for assets
NEXT_PUBLIC_BASE_URL       # Base URL for the application

# Database Configuration
DATABASE_URL               # PostgreSQL connection string

# Authentication
NEXTAUTH_URL              # NextAuth URL
NEXTAUTH_SECRET           # NextAuth secret key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL  # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anonymous key

# OAuth Providers
NEXT_PUBLIC_GOOGLE_CLIENT_ID  # Google OAuth client ID
GOOGLE_CLIENT_SECRET          # Google OAuth client secret
NEXT_PUBLIC_FACEBOOK_APP_ID   # Facebook App ID
FACEBOOK_APP_SECRET           # Facebook App secret
```

### Setting Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.development
   ```

2. Fill in the required values in the new file

3. For different environments:
   ```bash
   # Development
   cp .env.example .env.development
   
   # Staging
   cp .env.example .env.staging
   
   # Production
   cp .env.example .env.production
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check if PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Dependencies Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Remove node_modules and reinstall
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

3. **TypeScript Errors**
   ```bash
   # Clear TypeScript cache
   rm -rf .next
   rm -rf node_modules/.cache
   npm run type-check
   ```

## Support

For support, please create an issue in the repository or contact support@scale-r-pms.com

