require('dotenv').config()
const axios = require('axios')

const fetchArticle = require('./fetchArticle')
const searchArticles = require("./searchArticles")
const optimizeArticle = require("./optimizedWithLLM")

const BACKEND_URL= process.env.BACKEND_URL

async function saveOptimizedArticle() {

    try {
        //fetch article from mongo
        const article = await fetchArticle()
        if(!article) {
            console.log("No unoptimized articles left")
            return
        }
        console.log("DEBUG article object:", article);

        //search for articles
        const competitors = await searchArticles(article.title)
        if (competitors.length<2) {
            console.log("Not enough articles found")
        }

        const snippets = competitors.map(c=>c.snippet)
        const references = competitors.map(c=>c.url)

        //optimize article using Groq
        const updatedContent = await optimizeArticle(
            article.originalContent,
            snippets
        )

        //save optimized article to Mongo
        await axios.patch(`${BACKEND_URL}/articles/${article._id.toString()}`, {
            updatedContent,
            references
        })

        console.log("Article optimized and saved: ",article.title)

    } catch(error) {
        console.error("Phase 2 failed",error.message)
    }    
}

saveOptimizedArticle()