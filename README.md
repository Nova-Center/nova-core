# Nova Core

<div align="center">
  <img src="docs/nova-core-logo.png" alt="Nova Core Logo" width="200"/>
</div>

A modern, full-featured backend application built with AdonisJS, featuring authentication, file storage, and database management.

## 🚀 Features

- **Authentication System**: Built-in user authentication and authorization
- **File Storage**: S3-compatible storage using MinIO
- **Database**: PostgreSQL database with Adminer UI for management
- **API Documentation**: Auto-generated Swagger documentation
- **TypeScript Support**: Full TypeScript implementation
- **Docker Support**: Containerized development environment
- **Testing**: Built-in testing framework with Japa
- **Code Quality**: ESLint and Prettier for code formatting and linting

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- Docker and Docker Compose
- pnpm (Package manager)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nova-core
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=password
S3_BUCKET=your-bucket-name
```

4. Start the development environment:

```bash
docker-compose up -d
```

5. Run database migrations:

```bash
node ace migration:run
```

6. (Optional) Seed the database with initial data:

```bash
node ace db:seed
```

## 🚀 Development

Start the development server:

```bash
pnpm dev
```

For Hot Module Replacement (HMR):

```bash
pnpm dev:hmr
```

## 📝 Available Scripts

- `pnpm start` - Start the production server
- `pnpm build` - Build the application
- `pnpm dev` - Start development server
- `pnpm dev:hmr` - Start development server with HMR
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking

## 🗄️ Infrastructure

The application uses Docker Compose to manage the following services:

- **PostgreSQL**: Database server (port 5432)
- **Adminer**: Database management UI (port 8080)
- **MinIO**: S3-compatible object storage
  - API endpoint: port 9000
  - Console UI: port 9001

## 📚 API Documentation

API documentation is automatically generated using Swagger. Access it at:

```
http://localhost:3333/docs
```

![API Documentation](docs/nova-core-screen.jpeg)

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

## 📦 Project Structure

```
nova-core/
├── app/              # Application code
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── middleware/   # Custom middleware
│   └── services/     # Business logic
├── config/           # Configuration files
├── database/         # Database migrations and seeds
├── start/            # Application startup files
└── tests/            # Test files
```

## 🔒 Security

- Environment variables are used for sensitive configuration
- Authentication is handled through @adonisjs/auth
- CORS is configured through @adonisjs/cors
- Input validation using VineJS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and unlicensed.

## 👥 Authors

- [@Sagbyy](https://github.com/Sagbyy)
- [@madoxSio](https://github.com/madoxSio)

## 🙏 Acknowledgments

- AdonisJS team for the amazing framework
- All contributors who have helped shape this project
