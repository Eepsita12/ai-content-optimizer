require('dotenv').config()
const Groq = require("groq-sdk")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

async function optimizeArticle(originalContent, competitorSnippets) {
    const prompt = `
    You are an expert content editor.

    Below is an original blog article.
    Below that are summaries from two competitor articles ranking on Google.

    Task:
    - Improve structure and formatting
    - Make the content clearer and more comprehensive
    - Cover important points mentioned in competitor summaries
    - Do NOT copy sentences
    - Keep meaning accurate
    - Output ONLY the improved article

    Original Article:
    ${originalContent}

    Competitor Summaries:
    1. ${competitorSnippets[0]}
    2. ${competitorSnippets[1]}
    `;

    const response = await groq.chat.completions.create({
        model:"llama-3.3-70b-versatile",
        messages: [
            {role:'user',content:prompt}
        ],
        temperature:0.4
    })
    
    return response.choices[0].message.content
}

module.exports = optimizeArticle