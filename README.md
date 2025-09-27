My E-Store: A Full-Stack 3-Tier DevOps Project 🖥️

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## 🚀 My Project Journey

I built this full-stack e-commerce web application to put my DevOps skills to the test. It's not just a simple app; it's a complete 3-tier system that I containerized with Docker, automated with a CI/CD pipeline using GitHub Actions, and deployed live on an AWS EC2 instance. This was a deep dive into building, automating, and deploying a real-world application from scratch.

## ✨ Features I Implemented

-   **Secure User Accounts:** I implemented a full authentication system with user registration and login using JWT (JSON Web Tokens) for security. Passwords are, of course, hashed with bcrypt!
-   **Dynamic Product Catalog:** The product list you see isn't just hardcoded; it's pulled directly from my PostgreSQL database.
-   **Persistent Shopping Cart:** When a user adds items to their cart, it's not just a temporary thing. The cart is saved in the database, linked to their account, so it persists across sessions.
-   **Admin Panel & RBAC:** I built an exclusive admin panel in the UI that allows an admin user (like me!) to view all registered users and delete them. This is powered by a Role-Based Access Control system I set up in the backend, protecting sensitive API endpoints.
-   **Security Hardening:** I didn't just build it; I secured it. The backend is hardened with CORS policies locked to the frontend, Helmet for security headers, and a light rate limit on login routes to prevent brute-force attacks.

---

## 🏛️ My 3-Tier Architecture

I designed this application with a classic 3-tier architecture to keep things clean and scalable. The frontend container's Nginx also acts as a reverse proxy, creating a single, secure entry point for all traffic.

```
    A[User's Browser] -->|HTTP/HTTPS Request| B(Frontend - Nginx Container on EC2);
    B -->|Serves Static Files (HTML/CSS/JS)| A;
    B -->|/api Proxy Request| C(Backend - Node.js Container on EC2);
    C -->|Sequelize (SQL Queries)| D(Database - Postgres Container on EC2);
    D -->|Returns Data| C;
    C -->|Returns JSON Response| B;
    B -->|Renders Data in UI| A;
```

---

## 🛠️ The Tech Stack I Used

| Category      | Technology                                    | What I used it for                                                                                   |
| ------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Frontend**  | `HTML5`, `CSS3`, `JavaScript (ES6)`           | I built a clean, static UI for the e-store interface.                                                |
| **Backend**   | `Node.js`, `Express.js`, `Sequelize (ORM)`    | This is the brain of the operation: a RESTful API for business logic, auth, and database interaction.    |
| **Database**  | `PostgreSQL`                                  | My database of choice for storing user, product, and cart data reliably.                             |
| **DevOps**    | `Docker`, `Docker Compose`                    | I containerized every part of the app (frontend, backend, database) so it runs consistently anywhere.  |
|               | `Nginx`                                       | Serves the static frontend and acts as a reverse proxy to the backend API, a crucial piece of my setup.  |
|               | `GitHub Actions`                              | I built a CI/CD pipeline that automatically builds and pushes my Docker images to Docker Hub.            |
| **Cloud**     | `AWS EC2`                                     | The virtual server (t3.micro) where I deployed the entire Dockerized application stack.              |
|               | `AWS Security Groups`                         | The firewall I configured to control traffic, allowing only SSH and HTTP/HTTPS.                      |

---

## 🚀 Getting Started (Running Locally)

Follow these steps to run the entire application stack on your local machine.

### Prerequisites

-   [Git](https://git-scm.com/downloads)
-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

### Local Setup

1.  **Clone my repository:**
    ```bash
    git clone https://github.com/RajputDeepak69/E-STORE.git
    cd E-STORE
    ```

2.  **Create the backend environment file:**
    Navigate to the `backend` directory and create a file named `.env`.
    ```bash
    cd backend
    nano .env
    ```
    Paste the following template into the file. This file contains the necessary environment variables for the backend to run.
    ```env
    # --- .env Template ---
    # Replace the placeholder with a strong, random string for JWT.
    # You can generate one with: openssl rand -hex 32
    JWT_SECRET=a_very_strong_and_random_secret_for_local_dev

    # These credentials are for the Postgres container defined in docker-compose.yml.
    # You can leave these as they are for local development.
    DB_HOST=db
    DB_USER=postgres
    DB_PASS=postgres
    DB_NAME=estore
    DB_DIALECT=postgres

    # This should match the URL where your frontend is running locally.
    FRONTEND_ORIGIN=http://localhost:3000
    ```
    **Important:** Make sure to replace `a_very_strong_and_random_secret_for_local_dev` with your own unique secret.

3.  **Run the application with Docker Compose:**
    Navigate back to the root directory (`E-STORE`) and start all services.
    ```bash
    cd ..
    docker-compose up -d --build
    ```
    This command will build my frontend and backend images and start all three containers.

4.  **Access the application:**
    *   **Frontend (UI):** Open your browser and go to `http://localhost:3000`
    *   **Backend (API):** The API is accessible through the Nginx proxy at `http://localhost:3000/api`

5.  **Create your own users:**
    Once the application is running, the database starts empty. You can register your own admin and user accounts through the UI or via Postman.

---

## 🤖 My CI/CD Pipeline (GitHub Actions)

I automated the build and delivery process using GitHub Actions.

-   **Trigger:** The workflow runs on every `push` to the `main` an.
-   **Workflow File:** `.github/workflows/docker-build-push.yml`

**Here's what my pipeline does automatically:**
1.  **Checkout Code:** Clones the repository.
2.  **Login to Docker Hub:** Authenticates using secrets I've configured.
3.  **Build and Push Frontend Image:** Builds the `frontend` Docker image and pushes it to my Docker Hub repository.
4.  **Build and Push Backend Image:** Builds the `backend` Docker image and pushes it to my Docker Hub repository.

---

## ☁️ My AWS EC2 Deployment

I deployed this application on an AWS EC2 instance. Here's a summary of my deployment process:

1.  **Launch EC2 Instance:** An Ubuntu `t3.micro` instance in the `ap-south-1` (Mumbai) region.
2.  **Configure Security Group:** I set up inbound rules to allow traffic on:
    *   **Port 22 (SSH):** For secure remote access.
    *   **Port 80 (HTTP):** For public web traffic.
    *   **Port 443 (HTTPS):** In preparation for SSL/TLS.
3.  **Install Docker:** I installed Docker and Docker Compose on the instance.
4.  **Clone Repository:** I cloned this project from GitHub.
5.  **Configure Environment:** I created a `backend/.env` file on the server with production secrets.
6.  **Run with Docker Compose:** I launched the application stack with `docker-compose up -d --build`.

---

## 🔮 What I'm Planning Next

-   [ ] **Implement Unit and Integration Tests:** Add a testing suite (e.g., Jest, Supertest) to the backend.
-   [ ] **Add HTTPS with Let's Encrypt:** Configure Nginx for secure SSL/TLS.
-   [ ] **Migrate to AWS ECS/Fargate:** For better scalability and container management.
-   [ ] **Database Seeding:** Create a script to automatically seed the database with initial products.

---

## 👨‍💻 About Me

-   **Deepak Rajput**
-   **LinkedIn:**www.linkedin.com/in/thakur-deepak29
-   **GitHub:** [@RajputDeepak69](https://github.com/RajputDeepak69)
