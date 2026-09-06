# Family Management Application

A modern, secure, and scalable family financial management application built with Next.js, TypeScript, Supabase, and shadcn/ui.

## Features

### ✅ Authentication
- User registration with email verification
- Login/logout functionality
- Password reset/recovery
- Session persistence

### ✅ Family Management
- Create families
- Invite family members
- Role-based access control (owner/admin/member)
- Manage member roles
- Remove members from family
- User profiles with personal information

### 🚀 Coming Soon
- Financial tracking (income/expenses)
- Asset management
- Debt/receivable tracking
- Savings goals
- Calendar & events
- Document storage
- Notifications system
- Activity logging

## Tech Stack

- **Frontend:** Next.js 14+, React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Validation:** Zod, React Hook Form
- **Testing:** Jest, React Testing Library
- **Icons:** Lucide React
- **Toast Notifications:** Sonner

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd family-management
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and update with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

1. Create a Supabase project
2. Run the migration in `supabase/migrations/001_initial_schema.sql` in Supabase SQL editor
3. Verify all tables and RLS policies are created

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
family-management/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                  # UI components (Button, Input, Label, etc.)
│   ├── forms/               # Form components
│   └── layout/              # Layout components (DashboardNav)
├── lib/
│   ├── auth/                # Auth context and utilities
│   ├── supabase/            # Supabase client setup
│   ├── validations/         # Zod schemas
│   ├── permissions/         # Permission checks
│   └── utils/               # Utility functions
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── supabase/
│   └── migrations/          # Database migrations
├── jest.config.js           # Jest configuration
└── middleware.ts            # Next.js middleware
```

## Authentication Flow

1. **Login/Register** → `/auth/login` or `/auth/register`
2. **Dashboard** → `/dashboard` (protected route)
3. **Family Management** → `/families`
4. **Profile** → `/profile`

### Route Protection
- Middleware automatically redirects unauthenticated users to `/auth/login`
- Authenticated users accessing auth pages are redirected to `/dashboard`

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile

### Families
- `GET /api/families` - List user's families
- `POST /api/families` - Create new family
- `GET /api/families/[id]` - Get family details
- `PATCH /api/families/[id]` - Update family
- `DELETE /api/families/[id]` - Delete family

### Family Members
- `GET /api/families/[id]/members` - List family members
- `POST /api/families/[id]/members` - Add member to family
- `PATCH /api/families/[id]/members/[memberId]` - Update member role
- `DELETE /api/families/[id]/members/[memberId]` - Remove member

All API routes include:
- ✅ Authorization checks
- ✅ Input validation (Zod)
- ✅ IDOR prevention
- ✅ Error handling

## Security

### Row Level Security (RLS)
All sensitive data is protected by Supabase RLS policies:
- Users can only view their own profile
- Users can only view families they're members of
- Users can only view data within their families
- Only family owners can manage members

### Validation
- All inputs validated with Zod on client and server
- Financial data stored as NUMERIC/DECIMAL (not float)
- Type safety with TypeScript strict mode

### IDOR Prevention
- Family membership validated before all operations
- Server-side authorization on every API endpoint
- Cannot bypass RLS from client

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check

# Run tests
npm test
```

## Database Schema

### Core Tables
- `profiles` - User profiles with personal info
- `families` - Family information
- `family_members` - Family membership with roles

### Feature Tables (Ready)
- `categories` - Transaction categories
- `transactions` - Income/expense transactions
- `assets` - Asset tracking
- `debts` - Debt/receivable management
- `goals` - Savings goals
- `events` - Calendar events
- `documents` - File storage metadata
- `notifications` - User notifications
- `activity_logs` - Audit trail

All tables include:
- ✅ UUID primary keys
- ✅ Timestamps (created_at, updated_at)
- ✅ RLS policies
- ✅ Indexes for performance

## Permissions

### Owner
Full access to all features including:
- Family management (edit, delete)
- Member management (add, remove, change roles)
- All data operations

### Admin
Most access except family management:
- Create/edit/delete data
- Manage categories
- Cannot manage family or members

### Member
Limited access:
- View family data
- Create their own records
- Limited edit capabilities

## Phases

### ✅ Phase 1: Foundation (Complete)
- Next.js + TypeScript setup
- Authentication system
- Database schema & RLS
- Permission system
- API routes foundation

### ✅ Phase 2: Family Management (Complete)
- Create families
- Manage members
- Role-based access
- Member invitations
- User profiles

### 🚀 Phase 3: Dashboard (In Progress)
- Financial summary cards
- Asset overview
- Debt alerts
- Goal progress

### 📋 Phase 4+: Features
- Finance module (transactions, categories)
- Assets & Debts
- Goals
- Calendar & Events
- Document storage
- Notifications
- Activity logging
- Polishing & optimization

## Contributing

When adding new features:
1. Create feature branch: `git checkout -b feature/feature-name`
2. Write tests first (TDD approach)
3. Follow existing code patterns
4. Add proper error handling
5. Update this README if needed
6. Submit pull request

## Error Handling

All API routes include proper error handling:
- Validation errors (400)
- Unauthorized (401)
- Forbidden (403)
- Not found (404)
- Server errors (500)

User-friendly error messages are shown in UI with Sonner toasts.

## Performance

- ✅ Pagination on all list endpoints
- ✅ Database indexes on common queries
- ✅ Server-side filtering
- ✅ Lazy loading components
- ✅ Optimized bundle size

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
