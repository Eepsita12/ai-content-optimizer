import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArticles } from "../api";

function Home() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles().then((data) => {
      // Sort by date descending
      const sorted = [...data].sort(
        (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
      );
      setArticles(sorted);
    });
  }, []);

  return (
    <div className="container">
      <h1>BeyondChats Articles</h1>

      <div className="articles-grid">
        {articles.map((article) => (
          <div
            key={article._id}
            className="article-card"
            onClick={() => navigate(`/article/${article._id}`)}
          >
            <div>
              <h2 className="article-title">{article.title}</h2>
              <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.4' }}>
                {/* Show a small snippet of the original content as preview */}
                {article.originalContent.substring(0, 100)}...
              </p>
            </div>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="article-date">
                {new Date(article.publishedDate).toLocaleDateString()}
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                Read &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;