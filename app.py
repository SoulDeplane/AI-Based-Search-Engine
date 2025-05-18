from flask import Flask, request, jsonify, render_template # type: ignore
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load and clean data
df = pd.read_csv('preprocessed_news_data.csv')
df = df.dropna(subset=['processed_text'])


# Load Wikipedia .txt file
wiki_articles = []

with open("dataset/wiki_archive/AllCombined.txt", 'r', encoding='utf-8') as file:
    for line in file:
        line = line.strip()
        if len(line) > 50:  # filter out short lines like headings or empty lines
            wiki_articles.append(line)

# Create DataFrame
wiki_df = pd.DataFrame(wiki_articles, columns=['processed_text'])
wiki_df['text'] = wiki_df['processed_text']
wiki_df['category'] = 'Wikipedia'
wiki_df['source'] = 'Wikipedia'

# Load News Dataset
news_df = pd.read_csv('preprocessed_news_data.csv')
news_df = news_df.dropna(subset=['processed_text'])
news_df['source'] = 'News'

# Combine both datasets
df = pd.concat([news_df, wiki_df], ignore_index=True)

# Vectorize
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df['processed_text'])

# Search function
def search(query, top_n=6):
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    top_indices = similarities.argsort()[-top_n:][::-1]
    return df.iloc[top_indices][['text', 'category', 'source']].to_dict(orient='records')


# Routes
@app.route('/')
def index():
    return render_template('index.html')  # assuming your HTML is inside a folder called 'templates'

@app.route('/search', methods=['POST'])
def handle_search():
    data = request.get_json()
    query = data.get('query', '')
    results = search(query)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
