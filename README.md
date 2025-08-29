# PollApp - Modern Polling Application

A modern polling application built with Next.js, TypeScript, and Shadcn UI components. Create polls, vote on them, and see real-time results.

## Features

- **User Authentication**: Sign up and sign in functionality
- **Create Polls**: Design custom polls with multiple options
- **Vote on Polls**: Participate in polls with secure voting
- **Real-time Results**: See live voting results with charts
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Built with Shadcn UI components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State Management**: React Hooks

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── polls/             # Poll-related pages
│   │   ├── page.tsx       # Polls listing
│   │   └── create/        # Create poll page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── layout/            # Layout components
│   │   └── navigation.tsx
│   ├── polls/             # Poll-related components
│   │   ├── poll-card.tsx
│   │   └── create-poll-form.tsx
│   └── ui/                # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/                   # Utility functions
│   └── utils.ts           # Shadcn utility functions
└── types/                 # TypeScript type definitions
    ├── auth.ts            # Authentication types
    └── poll.ts            # Poll-related types
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- User registration with email and password
- User login with form validation
- Secure authentication flow (to be implemented)

### Poll Management
- Create polls with custom titles and descriptions
- Add multiple voting options
- Dynamic option management (add/remove options)
- Form validation and error handling

### Voting System
- Interactive voting interface
- Real-time vote counting
- Visual progress bars for results
- Prevention of duplicate votes (to be implemented)

### User Interface
- Responsive design for all screen sizes
- Modern, clean UI with Shadcn components
- Intuitive navigation
- Loading states and feedback

## TODO: Upcoming Features

- [ ] Backend API integration
- [ ] Database setup (PostgreSQL/MongoDB)
- [ ] User authentication with JWT
- [ ] Real-time updates with WebSockets
- [ ] Poll sharing functionality
- [ ] User profiles and poll history
- [ ] Advanced poll types (multiple choice, ranked voting)
- [ ] Poll analytics and insights
- [ ] Email notifications
- [ ] Dark mode toggle

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
