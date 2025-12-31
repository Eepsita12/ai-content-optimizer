import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { fetchArticles } from "../api";

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticles().then((data) => {
      const found = data.find((a) => a._id === id);
      setArticle(found);
    });
  }, [id]);

  if (!article) return <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>Loading content...</div>;

  // --- Styles ---
  const headerStyle = (bgColor, borderColor) => ({
    position: "sticky",
    top: 0,
    background: bgColor, // Matches the column background
    backdropFilter: "blur(8px)",
    borderBottom: `1px solid ${borderColor}`,
    padding: "16px 24px",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  });

  const badgeStyle = {
    fontSize: "0.7rem",
    padding: "4px 12px",
    borderRadius: "20px",
    fontWeight: "700",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const dividerStyle = {
    marginTop: "40px",
    paddingTop: "24px",
    borderTop: "1px dashed rgba(0,0,0,0.1)"
  };

  const sectionHeaderStyle = {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: "15px",
    letterSpacing: "0.05em"
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* --- Top Navbar (Glassy) --- */}
      <div style={{
        height: "64px",
        padding: "0 30px",
        background: "rgba(255,255,255,0.8)", // Semi-transparent
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 20
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#475569",
            fontWeight: "600",
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.color = "#1e293b"}
          onMouseOut={(e) => e.target.style.color = "#475569"}
        >
          <span>&larr;</span> Back
        </button>

        <h1 style={{ fontSize: "1rem", margin: 0, fontWeight: "700", color: "#1e293b" }}>
          {article.title}
        </h1>
        <div style={{ width: "80px" }}></div>
      </div>

      {/* --- Split View --- */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* --- LEFT: Original (Cool Gray Theme) --- */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          borderRight: "1px solid rgba(0,0,0,0.05)", 
          background: "#f1f5f9" /* Slate 100 - Not White */
        }}>
          <div style={headerStyle("rgba(241, 245, 249, 0.9)", "rgba(0,0,0,0.05)")}>
            <span style={{ ...badgeStyle, background: "#e2e8f0", color: "#475569" }}>Raw</span>
            <span style={{ fontWeight: 700, color: "#334155" }}>Original Source</span>
          </div>

          <div style={{ padding: "40px 50px", maxWidth: "700px", margin: "0 auto", color: "#334155", lineHeight: 1.8 }}>
            <div style={{ whiteSpace: "pre-line", fontSize: "1.05rem" }}>
              {article.originalContent}
            </div>

            {/* Links */}
            {article.hyperlinks && article.hyperlinks.length > 0 && (
              <div style={dividerStyle}>
                <h4 style={sectionHeaderStyle}>🔗 Hyperlinks</h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {article.hyperlinks.map((link, idx) => (
                    <li key={idx} style={{ marginBottom: "8px", background: "white", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <a href={link} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", fontSize: "0.9rem", wordBreak: "break-all" }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Images */}
            {article.images && article.images.length > 0 && (
              <div style={dividerStyle}>
                <h4 style={sectionHeaderStyle}>🖼️ Images</h4>
                <div style={{ display: "grid", gap: "15px" }}>
                  {article.images.map((img, idx) => (
                    <img key={idx} src={img} alt=" extracted" style={{ width: "100%", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} onError={(e) => e.target.style.display='none'}/>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: Updated (Soft Mint Theme) --- */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          background: "#ecfdf5" /* Mint 50 - Not White */
        }}>
          <div style={headerStyle("rgba(236, 253, 245, 0.9)", "rgba(0,0,0,0.05)")}>
            <span style={{ ...badgeStyle, background: "#d1fae5", color: "#059669" }}>New</span>
            <span style={{ fontWeight: 700, color: "#065f46" }}>Optimized Content</span>
          </div>

          <div style={{ padding: "40px 50px", maxWidth: "700px", margin: "0 auto", color: "#064e3b", lineHeight: 1.8 }}>
            <div style={{ fontSize: "1.05rem" }}>
              <ReactMarkdown components={{
                h1: ({node, ...props}) => <h1 style={{ color: '#065f46', marginTop: 0 }} {...props} />,
                h2: ({node, ...props}) => <h2 style={{ color: '#059669', borderBottom: '2px solid #a7f3d0', paddingBottom: '6px', marginTop: '30px' }} {...props} />,
                strong: ({node, ...props}) => <strong style={{ color: '#059669' }} {...props} />
              }}>
                {article.updatedContent || "_Waiting for optimization..._"}
              </ReactMarkdown>
            </div>

            {/* References */}
            {article.references && article.references.length > 0 && (
              <div style={{ ...dividerStyle, borderTopColor: "#6ee7b7" }}>
                <h4 style={{ ...sectionHeaderStyle, color: "#059669" }}>📚 References</h4>
                <ul style={{ paddingLeft: "15px", color: "#064e3b" }}>
                  {article.references.map((ref, idx) => (
                    <li key={idx} style={{ marginBottom: "5px" }}>
                       <a href={ref} target="_blank" rel="noreferrer" style={{ color: "#059669", textDecoration: "underline" }}>{ref}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ArticleDetail;