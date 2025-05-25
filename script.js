// Theme Toggle
const toggleBtn = document.getElementById('themeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Suggestions
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
document.querySelector('form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const query = document.querySelector('input[name="query"]').value;

  const response = await fetch('/search', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query})
  });

  const data = await response.json();

  // Clear previous definitions and results
  document.getElementById('definitions-list').innerHTML = '';
  document.getElementById('results-container').innerHTML = '';

  // Show definitions
  data.definitions.forEach(def => {
    const li = document.createElement('li');
    li.textContent = def;
    document.getElementById('definitions-list').appendChild(li);
  });

  // Show results
  data.results.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('result-card');
    div.innerHTML = `
      <h3>${result.category}</h3>
      <p>${result.text}</p>
    `;
    document.getElementById('results-container').appendChild(div);
  });
});

const inputField = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestionsList");

inputField.addEventListener("input", () => {
  const query = inputField.value.toLowerCase();
  suggestionsList.innerHTML = "";

  if (query.length === 0) {
    suggestionsList.style.display = "none";
    return;
  }

  const filtered = suggestions.filter(item =>
    item.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    suggestionsList.style.display = "none";
    return;
  }

  filtered.forEach(suggestion => {
    const li = document.createElement("li");
    li.textContent = suggestion;
    li.addEventListener("click", () => {
      inputField.value = suggestion;
      suggestionsList.style.display = "none";
    });
    suggestionsList.appendChild(li);
  });

  suggestionsList.style.display = "block";
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    suggestionsList.style.display = "none";
  }
});

// Form Submission
document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const query = document.getElementById('searchInput').value.trim();
  const spinner = document.getElementById('spinner');
  const results = document.getElementById('results');

  if (!query) return;

  spinner.style.display = "inline-block";
  results.innerHTML = "";

  fetch('/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: query })
  })
  .then(response => response.json())
  .then(data => {
    spinner.style.display = "none";

    if (data.results && data.results.length > 0) {
      results.innerHTML = data.results.map(item => `
        <div class="result-card">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `).join('');
    } else {
      results.innerHTML = "<p>No results found.</p>";
    }
  })
  .catch(error => {
    console.error(error);
    spinner.style.display = "none";
    results.innerHTML = "<p>Something went wrong. Try again later.</p>";
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // Clear previous results
    document.getElementById("definitions-list").innerHTML = "";
    document.getElementById("results-container").innerHTML = "";
    document.getElementById("definition-section").style.display = "none";
    document.getElementById("results-section").style.display = "none";

    fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
    .then((res) => res.json())
    .then((data) => {
      const definitions = data.definitions || [];
      const results = data.search_results || [];

      if (definitions.length > 0) {
        const defList = document.getElementById("definitions-list");
        definitions.forEach(def => {
          const div = document.createElement("div");
          div.className = "definition-item";
          div.innerText = def;
          defList.appendChild(div);
        });
        document.getElementById("definition-section").style.display = "block";
      }

      if (results.length > 0) {
        const resultContainer = document.getElementById("results-container");
        results.forEach(item => {
          const div = document.createElement("div");
          div.className = "result-card";
          div.innerHTML = `<strong>${item.category}</strong><p>${item.text}</p>`;
          resultContainer.appendChild(div);
        });
        document.getElementById("results-section").style.display = "block";
      } else {
        document.getElementById("results-container").innerHTML = "<p>No search results found.</p>";
        document.getElementById("results-section").style.display = "block";
      }
    })
    .catch((err) => {
      console.error("Search Error:", err);
      alert("Something went wrong. Please try again.");
    });
  });
});
