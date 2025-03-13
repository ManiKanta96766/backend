# Job Board Scraper Backend

This is the backend for a job board application that scrapes job listings from Naukri.com and stores them in a MySQL database. The backend is built using **Node.js, Express, Puppeteer, and MySQL**.

## Features
- Scrapes job listings from Naukri.com.
- Stores job details in a MySQL database.
- Provides RESTful APIs to fetch job listings.
- Deployed on a cloud platform.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Scraper:** Puppeteer
- **Database:** MySQL
- **Deployment:** Render / Vercel / AWS EC2 (optional)

## Installation & Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/yourusername/job-board-backend.git
cd job-board-backend
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Set up MySQL database
- Create a MySQL database.
- Run the following SQL command to create a table:
```sql
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    experience VARCHAR(50),
    apply_link TEXT,
    description TEXT,
    posted_date VARCHAR(50)
);
```

### 4️⃣ Configure environment variables
Create a `.env` file and add:
```env
DB_HOST=your-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
PORT=5000
```

### 5️⃣ Run the backend server
```sh
node server.js
```
_Server should start on **http://localhost:5000**_

---

## API Endpoints
### 🔍 Fetch All Jobs
```http
GET /api/jobs
```
_Response:_
```json
[
  {
    "id": 1,
    "title": "Software Engineer",
    "company": "Capgemini",
    "location": "Bengaluru",
    "experience": "6-8 Yrs",
    "apply_link": "https://www.naukri.com/job-link",
    "description": "Has more than a year of relevant work experience",
    "posted_date": "1 Day Ago"
  }
]
```

### 🔄 Run Scraper
```http
POST /api/scrape
```
_Response:_
```json
{
  "message": "Scraping started"
}
```

---

## Deployment
### 🚀 Deploying on Render
1. **Push code to GitHub**
2. **Go to [Render](https://render.com/)** and create a Web Service
3. **Set up Environment Variables** (DB credentials)
4. **Deploy & test** with:
   ```sh
   curl https://your-render-url.com/api/jobs
   ```

### 🚀 Deploying on Vercel
```sh
vercel
```
Follow the steps and update the frontend API URL.

### 🚀 Deploying on AWS EC2 / DigitalOcean
1. Set up an EC2 instance.
2. Install **Node.js**, **MySQL**, and **PM2**.
3. Deploy using:
   ```sh
   pm2 start server.js --name job-board
   ```
4. Set up **Nginx reverse proxy**.

---

## Contributing
Feel free to fork this repository and submit pull requests!

---

## License
This project is licensed under the MIT License.

