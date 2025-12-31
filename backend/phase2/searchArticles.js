const path = require('path')
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const axios = require('axios')


const SERP_API_KEY = process.env.SERP_API_KEY

async function searchArticles(title) {
    const query = `${title}blog`

    const response = await axios.get("https://serpapi.com/search", {
        params: {
            q: query,
            engine: "google",
            api_key: SERP_API_KEY,
            num: 10
        }
    });

    const results = response.data.organic_results || []

    const blockedDomains = [
        "beyondchats.com",   
        "amazon.",
        "flipkart.",
        "goodreads.",
        "books.google.",
        "youtube.",
        "quora.",
        "reddit.",
        "stackoverflow.",
        "facebook.",
        "linkedin.",
        "twitter."
    ]

    const competitorArticles = results
        .filter(r => r.link && r.snippet)
        .filter(r => {
            const link = r.link.toLowerCase()
            return !blockedDomains.some(domain => link.includes(domain))
        })
        .slice(0,2)
        .map(r => ({
            url:r.link,
            snippet:r.snippet
        }))

    return competitorArticles
}

module.exports = searchArticles