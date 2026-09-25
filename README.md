## Setup

### 1. Clone the repository

git clone https://github.com/meysaw/PrivCont.git

cd PrivCont/backend

### 2. Install dependencies

npm install

### 3. Create environment variables

cp .env.example .env

update .env with your own MongoDB connection string and JWT secret.

### 4. Seed the problem database

node seed/problems.js

### 5. Start the server

npm run dev

### 6. Frontend

cd PrivCont/frontend

npm install

npm run dev
