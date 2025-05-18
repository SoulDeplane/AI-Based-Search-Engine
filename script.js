// Theme Toggle
const toggleBtn = document.getElementById('themeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Form Submission & Spinner
document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("loader").style.display = "block";
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    alert("Search simulated!");
  }, 2000); // Simulate delay
});

// Search Simulation
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const btnText = document.querySelector(".btn-text");
  const spinner = document.querySelector(".spinner");
  const results = document.getElementById("results");

  btnText.style.display = "none";
  spinner.style.display = "inline-block";

  setTimeout(() => {
    btnText.style.display = "inline-block";
    spinner.style.display = "none";
    
    results.style.display = "block";
    results.innerHTML = `
      <div class="result-card">
        <h3>Result Title</h3>
        <p>This is a simulated AI search result. You can enhance this later with real data.</p>
      </div>
    `;
  }, 2000);
});

// Suggestions List
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
