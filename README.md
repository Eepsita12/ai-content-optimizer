<a name="readme-top"></a>

<div align="center">

  <h3 align="center">AI Content Optimizer – Blog Article Enhancement System</h3>

  <p align="center">
    A full-stack application that scrapes blog articles, optimizes content using AI,
    and displays original vs optimized versions side-by-side.
  </p>

</div>

---

## About The Project

This project is a **full-stack AI-powered content optimization system** built as part of a technical assignment.

The system automates the entire article improvement lifecycle while following
real-world backend and AI engineering practices.

### Core lifecycle:

1. Scraping blog articles from a source website  
2. Storing structured content in MongoDB  
3. Optimizing content using an LLM with competitor context  
4. Preserving original content while saving optimized versions  
5. Displaying original vs optimized content in a React frontend  

The core focus of the project is **backend architecture**, **scraping pipelines**, **safe AI integration**, and **clean frontend consumption of APIs**, while handling real-world constraints such as scraping limitations, API reliability, and cost control.

---

## GitHub Link

https://github.com/Eepsita12/ai-content-optimizer

---

## Live Deployment

### Frontend (Vercel)

https://ai-content-optimizer-ui.vercel.app

### Backend API (Render)

https://ai-content-optimizer-backend-wi9e.onrender.com


> Note: Backend is hosted on Render free tier and may cold-start after inactivity.

---

## Built With

### Backend
* [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

* [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

* [![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

* [![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)

* [![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

* [![Cheerio](https://img.shields.io/badge/Cheerio-FFD43B?style=for-the-badge&logo=javascript&logoColor=black)](https://cheerio.js.org/)

* [![Mercury Parser](https://img.shields.io/badge/Mercury%20Parser-333333?style=for-the-badge&logo=readthedocs&logoColor=white)](https://github.com/postlight/mercury-parser)

* [![SerpAPI](https://img.shields.io/badge/SerpAPI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://serpapi.com/)

* [![Groq SDK](https://img.shields.io/badge/Groq%20SDK-FF4F00?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)

* [![LLaMA 3.3](https://img.shields.io/badge/LLaMA%203.3%2070B-6B46C1?style=for-the-badge&logo=meta&logoColor=white)](https://ai.meta.com/llama/)

* [![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)](https://www.npmjs.com/package/dotenv)


### Frontend
* [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)

* [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

* [![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

* [![CSS3](https://img.shields.io/badge/Custom%20CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)


---

## Project Architecture

```

Batch Jobs (Manual / Admin-triggered)
|
v
Scraper & AI Optimization Scripts
|
v
Backend APIs (Express – Render)
|
v
MongoDB Atlas
^
|
Frontend (React – Vercel)

```

### Architectural Principle

- Backend APIs are always-on
- Scraping and AI optimization are controlled batch jobs
- Frontend only consumes stored data
- No AI calls or scraping happen on user requests

This prevents:
- Duplicate scraping
- Accidental re-optimization
- Excessive API / LLM usage
- Data inconsistency

This mirrors real production systems where expensive jobs run via cron, queues, or admin triggers.

---

## Usage Flow

### 1. Article Scraping (Batch Job)

Articles are scraped using Axios and Cheerio.

Extracted data includes:
- Title
- Author
- Published date
- Full article content
- Images
- Hyperlinks
- Source URL

Scraped articles are stored permanently in MongoDB with:
```

isOptimized = false

````

> Scraping is intentionally run manually via terminal to maintain control.

---

### 2. Backend API Operations

The backend exposes REST APIs to:

- Store scraped articles
- Fetch all articles
- Fetch individual articles
- Update optimized content
- Track optimization status

All system-controlled fields (`isOptimized`, timestamps) are handled server-side.

---

### 3. AI Content Optimization (Batch Job)

Unoptimized articles are processed through an AI pipeline:

- Fetches one article where `isOptimized = false`
- Fetches competitor context using **SerpAPI**
- Sends original content + competitor snippets to **Groq LLM**
- Generates optimized content
- Saves optimized content separately
- Marks article as optimized

Original content is **never overwritten**.

---

### 4. Frontend Dashboard

The React frontend provides:

- Article listing page
- Individual article detail view
- Side-by-side comparison:
  - Original content
  - Optimized content
- Clean card-based UI with responsive layout

Frontend communicates only with deployed backend APIs.

---

## Implementation Approach & Core Logic

### 1. Backend Implementation

**a. Data Modeling**
- Articles are treated as evolving entities
- Original and optimized content stored separately
- Lifecycle tracking via `isOptimized` and timestamps

**b. API Design**
- RESTful APIs using Express
- Validation for ObjectIds and required fields
- Proper HTTP status codes and error handling

**c. AI Pipeline**
- Controlled single-article optimization
- No duplicate or accidental reprocessing
- Safe handling of external APIs (SerpAPI + Groq)

**d. Error Handling**
- Centralized error responses
- Graceful handling of scraping and AI failures
- No partial database writes

---

### 2. Frontend Implementation

**a. API Integration**
- Axios instance with environment-based base URL
- Loading and error states handled gracefully

**b. Routing**
- React Router for navigation
- Home → Article detail page

**c. UI & State Management**
- React hooks (`useState`, `useEffect`)
- Automatic re-render on data fetch
- Clean typography and spacing

---

## Scraping Strategy & Engineering Tradeoff 

In `scrapeArticle.expt.js`, **Postlight Mercury Parser** was initially tested to extract full competitor article content.

However, many modern sites (Medium, Cloudflare-protected blogs) block Mercury Parser and direct HTML scraping.

### Final Decision: SerpAPI

SerpAPI was adopted because it:
- Reliably fetches Google-ranked competitor articles
- Avoids scraping blocks
- Provides stable, indexed content snippets
- Mirrors real-world SEO tooling behavior

Mercury Parser experimentation is retained **for reference only**.

---

## Database Schema (Article)

Each article document includes:

- `title`
- `author`
- `publishedDate`
- `sourceUrl`
- `originalContent`
- `updatedContent`
- `images`
- `hyperlinks`
- `references`
- `isOptimized`
- `createdAt`
- `updatedAt`

Original content is immutable.

---

## API Endpoints

| Endpoint           | Method | Description                      |
|-------------------|--------|----------------------------------|
| `/articles`       | GET    | Fetch all articles               |
| `/articles/:id`   | GET    | Fetch single article             |
| `/articles`       | POST   | Save scraped article             |
| `/articles/:id`   | PATCH  | Save optimized content           |
| `/articles/:id`   | DELETE | Delete article                   |

---

## Development Setup Guide

### Backend Setup
```bash
cd backend
npm install
npm run dev
````

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Batch Jobs (Run Manually)
These scripts must be run manually to populate and optimize articles
before viewing results in the frontend.

```bash
# Scrape articles
node backend/beyondchats-scraper/scrape.js

# Optimize articles using AI
node backend/phase2/saveOptimizedArticle.js
```
Note: Ensure the backend server and MongoDB connection are running
before executing these scripts.

---

## Environment Configuration

### Backend (.env)

```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
SERPAPI_KEY=your_serpapi_key
PORT=3000
```

### Frontend (Vercel)

```env
VITE_API_BASE_URL=https://ai-content-optimizer-backend-wi9e.onrender.com
```

---

## Project Status

| Feature                  | Status     |
| ------------------------ | ---------- |
| Article Scraping         | ✅ Complete |
| Backend APIs             | ✅ Complete |
| AI Optimization Pipeline | ✅ Complete |
| Frontend UI              | ✅ Complete |
| Deployment               | ✅ Complete |

---


## Thank You



