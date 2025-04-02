
![bandicam 2025-04-03 01-17-04-785](https://github.com/user-attachments/assets/817b3c8b-34e3-43b4-851d-3e09d23323e8)

#  Fullstack Product Management App

This is a fullstack application built with:

- **Frontend**: React
- **Backend**: Node.js (Express)
- **Database**: MySQL
- **Search Engine**: Elasticsearch
- **Containerization**: Docker + Docker Compose

---

##  How to Run the Project (with Docker)

### 1. Prerequisites

- Docker & Docker Compose installed (via Docker Desktop or Rancher)
- Ports `3000`, `5000`, `9201`, and `3306` available

---

### 2. Folder Structure

```
fullstack-product-management-app/
├── backend/              # Express + MySQL + Elasticsearch
├── frontend/             # React app
├── docker-compose.yml    # Compose config
└── README.md             # This file
```

---

### 3. How to Run Everything
Copy `.env.example` to `.env` and fill in your values (FRONTEND AND BACKEND):
cp .env.example .env
Open a terminal in the project root and run:

```bash
docker compose up -d --build
```

Docker will:
- Spin up a MySQL server with a preloaded schema
- Start Elasticsearch
- Build and run the backend API on port `5000`
- Build and run the frontend on port `3000`
- Even though Docker handles dependencies, it’s recommended to run the following once (outside the container) to ensure everything is installed properly:

:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
``` 



### 4. Elasticsearch Test

Once containers are up, check if Elasticsearch is running at:

```
http://localhost:9201
```

You should see version data of Elasticsearch.

---

### 5. API Overview

| Endpoint             | Method | Description                      
|----------------------|--------|----------------------------------|
| `/register`          | POST   | Register new user                | 
| `/login`             | POST   | Login + JWT                      | 
| `/products`          | GET    | Get paginated list of products   | 
| `/products`          | POST   | Add new product                  | 
| `/products/:id`      | PUT    | Update product                   | 
| `/products/:id`      | DELETE | Delete product                   | 
| `/search`            | GET    | Search products via Elasticsearch| 

---

### 6. MySQL DB Access

- **User**: `root`
- **Password**: `password`
- **Databases**: `productdb` `users` 

You can access it via DBeaver or Adminer (or any client).

---

### 7. Stopping the System

```bash
docker compose down
```

---

### 8. Notes

- JWT is stored in `LocalStorage.
- The application includes responsive UI components




