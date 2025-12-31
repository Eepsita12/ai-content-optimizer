const { parse } = require("@postlight/mercury-parser");


// async function scrapeArticle(url) {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 "User-Agent":
//                     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//                 "Accept-Language": "en-US,en;q=0.9"
//             }
//         });

//         const $ = cheerio.load(response.data)

//         let content = ""

//         $("p,h1,h2,h3").each((i, element) => {
//             const text = $(element).text().trim()
//             if (text.length > 50) {
//                 content += text + "\n\n"
//             }
//         })

//         return {
//             url,
//             content
//         }
//     } catch (error) {
//         console.error("Error scraping competitor:", url);
//         return null;
//     }
// }

// (async () => {
//     const testUrl =
//         "https://chatbotsmagazine.com/the-complete-beginner-s-guide-to-chatbots-8280b7b906ca";

//     const scraped = await scrapeArticle(testUrl);

//     if (!scraped || !scraped.content) {
//         console.log("❌ Scraping failed");
//         return;
//     }

//     console.log("✅ Scraped length:", scraped.content.length);
// })();

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