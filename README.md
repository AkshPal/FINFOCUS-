# FINFOCUS Newsletter Microservices Project

## Overview
FINFOCUS is a modular, microservices-based service for delivering personalized financial newsletters to users. It is designed for scalability, security, and easy integration with third-party data sources and authentication providers.

## Architecture
The project is organized into several independent microservices:

- **AuthService**: Handles user authentication (Google OAuth), issues JWT tokens, and manages user sessions.
- **UserDataService**: Manages user profiles, portfolios, and watchlists. All endpoints are protected by JWT authentication.
- **MarketDataService**: Fetches and processes market news and data, and broadcasts relevant updates to users.
- **NewsletterService**: Queues, generates, and sends personalized newsletters to users via email using SMTP (Gmail or custom SMTP server).
- **PersonalizationService**: (Pluggable) For advanced user personalization and recommendations (template provided).

Each service is a standalone Node.js/TypeScript application with its own dependencies and configuration.

## Features
- Google OAuth authentication (secure, JWT-based)
- User profile, portfolio, and watchlist management
- Market news fetching and broadcasting
- Real-time communication via WebSockets
- Newsletter job queue and worker system
- Email delivery via SMTP (Gmail supported)
- Environment-based configuration (no secrets in code)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database
- (Optional) Redis for MarketDataService
- Gmail or SMTP credentials for NewsletterService

### Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/AkshPal/FINFOCUS-.git
   cd FINFOCUS-
   ```
2. **Install dependencies for each service:**
   ```sh
   cd AuthService && npm install
   cd ../UserDataService && npm install
   cd ../MarketDataService && npm install
   cd ../NewsletterService && npm install
   cd ../PersonalizationService && npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in each service folder and fill in your values.
   - Never commit `.env` files to git.

4. **Run the services:**
   - Each service can be started individually with:
     ```sh
     npm run dev
     ```
   - Or use a process manager (like pm2 or Docker Compose) for orchestration.

## API Endpoints

### AuthService
- `/auth/google` — Start Google OAuth
- `/auth/google/callback` — OAuth callback
- Issues JWT token on successful login

### UserDataService
- `/me` — Get user profile (JWT required)
- `/me/portfolio` — Get/add/remove portfolio holdings
- `/me/watchlist` — Get/add/remove watchlist items

### MarketDataService
- Fetches news and broadcasts updates to users

### NewsletterService
- Receives jobs via WebSocket, queues and sends personalized newsletters

## Security
- All secrets and credentials are managed via `.env` files (never committed)
- JWT authentication is enforced on all sensitive endpoints
- GitHub push protection and secret scanning are enabled

## Contributing
1. Fork the repo and create your branch (`git checkout -b feature/fooBar`)
2. Commit your changes (`git commit -am 'Add some fooBar'`)
3. Push to the branch (`git push origin feature/fooBar`)
4. Create a new Pull Request

## License
MIT

## Contact
For questions or support, open an issue on GitHub or contact the maintainer.
