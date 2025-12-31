
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;

async function fetchArticle () {
    try{
        const response= await axios.get(`${BACKEND_URL}/articles`)
        const articles=response.data

        const articleToOptimize= articles.find(
            (article) => article.isOptimized==false
        );

        if (!articleToOptimize) {
            console.log("All articles are optimized")
            return null;
        }

        console.log("Article selected for optimization: ",articleToOptimize.title )
        return articleToOptimize;
    } catch (error) {
  if (error.response) {
    console.error("Axios response error:");
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);
  } else if (error.request) {
    console.error("No response received from server");
  } else {
    console.error("Axios setup error:", error.message);
  }
}

}

fetchArticle()

module.exports = fetchArticle