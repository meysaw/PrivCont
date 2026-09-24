## Setup

### 1. Clone the repository

git clone https://github.com/YOUR_USERNAME/PrivCont.git
cd PrivCont

### 2. Install dependencies

npm install

### 3. Create environment variables

cp .env.example .env

Update .env with your own MongoDB connection string and JWT secret.

### 4. Seed the problem database

node seed/problems.js

### 5. Start the server

npm run dev
