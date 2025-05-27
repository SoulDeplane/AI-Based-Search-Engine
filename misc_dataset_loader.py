import os
import pandas as pd

def df_to_text(df, filename):
    text_data = []
    for col in df.columns:
        text_data.extend([f"From {filename} – {col}: {val}" for val in df[col].dropna().astype(str).tolist()])
    return text_data

def load_all_datasets(dataset_dir):
    all_entries = []

    for file in os.listdir(dataset_dir):
        path = os.path.join(dataset_dir, file)
        ext = os.path.splitext(file)[-1].lower()

        try:
            if ext in [".csv"]:
                df = pd.read_csv(path)
                all_entries.extend(df_to_text(df, file))

            elif ext in [".xlsx"]:
                df = pd.read_excel(path)
                all_entries.extend(df_to_text(df, file))

            elif ext in [".data", ".test"]:
                with open(path, 'r') as f:
                    lines = [line.strip() for line in f if line.strip()]
                    for line in lines:
                        all_entries.append(f"From {file} → {line}")

            elif ext in [".names", ".documentation"]:
                with open(path, 'r') as f:
                    text = f.read().strip().replace('\n', ' ')
                    all_entries.append(f"Metadata from {file}: {text[:300]}...")

            else:
                print(f"Skipped unsupported file type: {file}")

        except Exception as e:
            print(f"Error processing {file}: {e}")

    return all_entries
if __name__ == "__main__":
    dataset_path = r"E:\tarun\Elective_project\dataset\small_datasets\extracted_small\extracted_small"
    all_entries = load_all_datasets(dataset_path)

    import pickle
    titles = [entry[:60] + "..." for entry in all_entries]

    with open("documents.pkl", "wb") as f:
        pickle.dump(all_entries, f)
    with open("titles.pkl", "wb") as f:
        pickle.dump(titles, f)

    print(f"✅ Saved {len(all_entries)} entries to documents.pkl and titles.pkl")
