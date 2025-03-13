require('dotenv').config();
const puppeteer = require('puppeteer');
const mysql = require('mysql2/promise');

async function scrapeNaukriJobs(keyword = "Software Engineer") {
    try {
        // Connect to MySQL
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const browser = await puppeteer.launch({ headless: false }); // Debug mode
        const page = await browser.newPage();

        const naukriURL = `https://www.naukri.com/${keyword.replace(/ /g, "-")}-jobs`;
        console.log(`Navigating to: ${naukriURL}`);
        await page.goto(naukriURL, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait to ensure all jobs are loaded
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Check if job listings exist
        const jobExists = await page.$('.srp-jobtuple-wrapper');
        if (!jobExists) {
            console.log("❌ No jobs found. Exiting.");
            await browser.close();
            return [];
        }

        // Extract job details
        const jobs = await page.evaluate(() => {
            let jobListings = [];
            let jobElements = document.querySelectorAll(".srp-jobtuple-wrapper");

            jobElements.forEach(job => {
                const title = job.querySelector(".cust-job-tuple h2 a.title")?.innerText.trim();
                const company = job.querySelector(".comp-name")?.innerText.trim();
                const location = job.querySelector(".loc-wrap span")?.innerText.trim();
                const experience = job.querySelector(".exp-wrap span")?.innerText.trim();
                const applyLink = job.querySelector(".cust-job-tuple h2 a.title")?.href;
                const description = job.querySelector(".job-desc")?.innerText.trim();
                const postedDate = job.querySelector(".job-post-day")?.innerText.trim();

                if (title && company && location && applyLink) {
                    jobListings.push({ title, company, location, experience, applyLink, description, postedDate });
                }
            });

            return jobListings;
        });

        console.log("Extracted Jobs:", jobs);

        // Insert into MySQL
        for (let job of jobs) {
            const [existing] = await db.execute(
                "SELECT id FROM jobs WHERE title = ? AND company = ? AND location = ?",
                [job.title, job.company, job.location]
            );

            if (existing.length === 0) {
                await db.execute(
                    "INSERT INTO jobs (title, company, location, experience, apply_link, description, posted_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [job.title, job.company, job.location, job.experience, job.applyLink, job.description, job.postedDate]
                );
                console.log(`✅ Job Inserted: ${job.title} at ${job.company}`);
            } else {
                console.log(`⚠️ Job Already Exists: ${job.title} at ${job.company}`);
            }
        }

        await db.end();
        await browser.close();
        return jobs;
    } catch (error) {
        console.error("❌ Scraping failed:", error);
        return [];
    }
}

// Run the scraper
scrapeNaukriJobs();
