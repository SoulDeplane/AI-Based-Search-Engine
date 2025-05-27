from flask import Flask, request, jsonify, render_template
import faiss
import pickle
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from suggestions_list import suggestions  # or define directly in app.py

app = Flask(__name__)

# Load FAISS index and associated documents
index = faiss.read_index("faiss_index.index")  # ensure this file exists locally
with open("faiss_documents.pkl", "rb") as f:
    doc_texts = pickle.load(f)

# Load the same model used to generate embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")

# Semantic Search Function
def semantic_search(query, top_k=6):
    query_vec = model.encode([query])
    D, I = index.search(np.array(query_vec).astype("float32"), top_k)
    return [doc_texts[i] for i in I[0]]

# Routes
@app.route('/')
def index_page():  # ✅ renamed to avoid conflict
    return render_template('index.html')

@app.route("/suggest", methods=["GET"])
def suggest():
    query = request.args.get("q", "").lower()
    if not query:
        return jsonify([])

    matches = [s for s in suggestions if query in s.lower()]
    return jsonify(matches[:5])



@app.route('/search', methods=['POST'])
def handle_search():
    data = request.get_json()
    query = data.get("query", "")
    results = semantic_search(query)
    
    cleaned_results = []
    for r in results:
        # Remove patterns like: "From preprocessed_news_data.csv – text: "
        cleaned = re.sub(r'^From .?– text:\s', '', r).strip()
        cleaned_results.append(cleaned)
    
    return jsonify({
        "definitions": [f"A topic related to: {query}"] if query else [],
        "search_results": cleaned_results
    })
if __name__ == "__main__":
    print("✅ FAISS index and model loaded successfully")
    app.run(debug=True)
