# Smart Chatbot - Docker Guide

Panduan lengkap untuk menjalankan Smart Chatbot menggunakan Docker.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### Development Mode (Recommended untuk Development)

Untuk development, jalankan hanya PostgreSQL dan Prisma Studio:

```bash
# Start PostgreSQL dan Prisma Studio
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

Setelah PostgreSQL running:

```bash
# Push schema ke database
pnpm --filter=database prisma:push

# Seed database (optional)
pnpm --filter=database prisma:seed

# Run apps locally
pnpm dev
```

**Services yang tersedia:**
- PostgreSQL: `localhost:5432`
- Prisma Studio: `http://localhost:5555`

---

### Production Mode (Full Stack dengan Docker)

Untuk production atau testing full stack di Docker:

```bash
# Build dan start semua services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web

# Stop services
docker-compose down

# Stop dan hapus volumes
docker-compose down -v
```

**Services yang tersedia:**
- PostgreSQL: `localhost:5432`
- NestJS API: `http://localhost:3001`
- Next.js Web: `http://localhost:3000`
- Prisma Studio: `http://localhost:5555` (dengan profile dev)

---

## 🔧 Docker Compose Configurations

### docker-compose.dev.yml (Development)

Minimal setup untuk development:
- ✅ PostgreSQL database
- ✅ Prisma Studio
- ❌ API dan Web (run locally dengan `pnpm dev`)

**Keuntungan:**
- Fast hot reload
- Easy debugging
- Minimal resource usage

### docker-compose.yml (Production)

Full stack setup:
- ✅ PostgreSQL database
- ✅ NestJS API (containerized)
- ✅ Next.js Web (containerized)
- ✅ Prisma Studio (optional, dengan profile dev)
- ✅ Health checks
- ✅ Networking

---

## 📦 Dockerfile Details

### apps/api/Dockerfile (NestJS)

Multi-stage build:
1. **base** - Setup Node.js dan pnpm
2. **deps** - Install dependencies
3. **builder** - Generate Prisma Client dan build
4. **runner** - Production image (minimal)

### apps/web/Dockerfile (Next.js)

Multi-stage build dengan standalone output:
1. **base** - Setup Node.js dan pnpm
2. **deps** - Install dependencies
3. **builder** - Generate Prisma Client dan build Next.js
4. **runner** - Production image dengan non-root user

---

## 🛠️ Common Commands

### Database Management

```bash
# Run migrations
docker-compose exec api sh -c "cd packages/database && pnpm prisma:migrate"

# Generate Prisma Client
docker-compose exec api sh -c "cd packages/database && pnpm prisma:generate"

# Seed database
docker-compose exec api sh -c "cd packages/database && pnpm prisma:seed"

# Open Prisma Studio (production mode)
docker-compose --profile dev up prisma-studio
```

### Container Management

```bash
# Rebuild specific service
docker-compose up -d --build api

# Restart service
docker-compose restart api

# View container logs
docker-compose logs -f api

# Execute command in container
docker-compose exec api sh

# Remove all containers and volumes
docker-compose down -v
```

### Debugging

```bash
# Check container health
docker-compose ps

# Inspect container
docker inspect smart-chatbot-api

# View container resource usage
docker stats

# Check network
docker network inspect smart-chatbot-network
```

---

## 🔐 Environment Variables

### Development (.env)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_chatbot?schema=public"
NODE_ENV=development
```

### Production (docker-compose.yml)

Environment variables sudah di-set di docker-compose.yml:
- `DATABASE_URL` - Connection ke PostgreSQL container
- `NODE_ENV=production`
- `PORT` - Service ports

Untuk override, buat file `.env.production`:

```env
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=smart_chatbot
```

Lalu update docker-compose.yml:

```yaml
postgres:
  env_file:
    - .env.production
```

---

## 🐛 Troubleshooting

### Container tidak bisa connect ke database

```bash
# Check PostgreSQL health
docker-compose exec postgres pg_isready -U postgres

# Check database logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Build error

```bash
# Clean build cache
docker-compose build --no-cache

# Remove all containers and rebuild
docker-compose down -v
docker-compose up -d --build
```

### Port already in use

```bash
# Check what's using the port
lsof -i :5432
lsof -i :3001
lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

### Prisma Client not generated

```bash
# Rebuild with fresh Prisma generation
docker-compose down
docker-compose build --no-cache api
docker-compose up -d
```

---

## 📊 Performance Tips

### 1. Use BuildKit

```bash
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

docker-compose build
```

### 2. Layer Caching

Dockerfile sudah dioptimasi dengan:
- Dependencies di-copy terpisah
- Multi-stage builds
- Production dependencies only di runner stage

### 3. Volume Mounts (Development)

Untuk faster development, mount source code:

```yaml
api:
  volumes:
    - ./apps/api/src:/app/apps/api/src
```

---

## 🚢 Deployment

### Docker Hub

```bash
# Build dan tag image
docker build -t username/smart-chatbot-api:latest -f apps/api/Dockerfile .
docker build -t username/smart-chatbot-web:latest -f apps/web/Dockerfile .

# Push ke Docker Hub
docker push username/smart-chatbot-api:latest
docker push username/smart-chatbot-web:latest
```

### Production Server

```bash
# Pull images
docker pull username/smart-chatbot-api:latest
docker pull username/smart-chatbot-web:latest

# Run dengan production compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 Summary

**Development Workflow:**
1. `docker-compose -f docker-compose.dev.yml up -d` - Start PostgreSQL
2. `pnpm --filter=database prisma:push` - Setup database
3. `pnpm dev` - Run apps locally

**Production Workflow:**
1. `docker-compose up -d --build` - Build dan start semua services
2. Access apps di `http://localhost:3000`

Selamat coding! 🚀
