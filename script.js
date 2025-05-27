const suggestions = [
  "Artificial Intelligence",
  "AI in Healthcare",
  "Machine Learning",
  "Neural Networks",
  "AI-powered Tools",
  "Smart Search",
  "ChatGPT plugins",
  "Data Science with AI",
  "AI for Education",
  "AI Trends 2025"
];

const inputField = document.getElementById("searchInput");

inputField.addEventListener("input", () => {
  // Optional: autocomplete logic
});

  function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    document.getElementById("results-container").innerHTML = "";
    document.getElementById("results-section").style.display = "none";

    fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
    .then((response) => response.json())
    .then((data) => {
      const results = data.search_results || [];
      const resultContainer = document.getElementById("results-container");

      if (results.length > 0) {
        results.forEach(item => {
          const div = document.createElement("div");
          div.className = "result-card";

          // Render meaningful fields
          if (typeof item === 'object') {
            div.innerHTML = `
              <h3>${item.title || item.source || "Result"}</h3>
              ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ""}
              ${item.source ? `<p><strong>Source:</strong> ${item.source}</p>` : ""}
              ${item.text ? `<p><strong>Text:</strong> ${item.text}</p>` : ""}
            `;
          } else {
            div.textContent = item;
          }

          resultContainer.appendChild(div);
        });
      } else {
        resultContainer.innerHTML = "<p>No results found.</p>";
      }

      document.getElementById("results-section").style.display = "block";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while searching.");
    });
  }