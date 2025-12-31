export const fetchArticles = async () => {
  const res = await fetch("http://localhost:3000/articles");
  const data = await res.json();
  console.log("FETCH DATA 👉", data);
  return data;
};
