/**
 * EXPERIMENTAL FILE – NOT USED IN FINAL PIPELINE
 *
 * This file was created to experiment with the Postlight Mercury Parser
 * for extracting full article content from competitor websites.
 *
 * During testing, it was observed that many high-ranking blog platforms
 * (e.g., Medium, Cloudflare-protected sites) actively block Mercury Parser
 * and direct HTML scraping, resulting in unreliable or empty extractions.
 *
 * Due to these real-world scraping limitations, this approach was
 * abandoned in favor of a more reliable solution using SerpAPI
 * (Google Search API) to fetch competitor article snippets instead.
 *
 * SerpAPI-based snippets provide stable, Google-indexed summaries of
 * competitor content and are used in the final AI optimization pipeline.
 *
 * This file is intentionally retained for reference and learning purposes.
 * It is not executed as part of the production workflow.
 */


const { parse } = require("@postlight/mercury-parser");

async function scrapeArticle(url) {
    try{
        const result= await parse(url)
        
        if(!result || !result.content) {
            return null
        }

        return {
            url,
            content:result.content
        }
    } catch(error) {
        console.error("Mercury failed for: ",url)
        return null
    } 
}

// test
(async () => {
  const url =
    "https://medium.com/@appenics/chatbot-the-beginner-guide-for-startups-8b6f3e2ee4f6"

  const scraped = await scrapeArticle(url);

  if (!scraped) {
    console.log("❌ Scraping failed");
    return;
  }

  console.log("✅ Scraped length:", scraped.content.length);
})();