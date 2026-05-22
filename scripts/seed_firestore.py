import os
import sys

# Add bot directory to path to import firebase_service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bot')))
from services.firebase_service import get_db
from firebase_admin import firestore

def seed_db():
    db = get_db()
    if not db:
        print("Could not connect to Firebase.")
        return

    # Sample Seed Data
    sections = [
        {
            "id": "section-a",
            "name": "Section A",
            "description": "English, Quant, Reasoning",
            "subjects": [
                {
                    "id": "english",
                    "name": "English",
                    "pdfs": [
                        {
                            "id": "synonyms-1",
                            "name": "Synonyms Notes",
                            "telegram_file_id": "PLACEHOLDER_FILE_ID",
                            "downloads": 0
                        }
                    ]
                }
            ]
        }
    ]

    for section in sections:
        sec_ref = db.collection('sections').document(section['id'])
        sec_ref.set({
            "name": section['name'],
            "description": section['description']
        })
        
        for subject in section['subjects']:
            sub_ref = sec_ref.collection('subjects').document(subject['id'])
            sub_ref.set({
                "name": subject['name']
            })
            
            for pdf in subject['pdfs']:
                pdf_ref = sub_ref.collection('pdfs').document(pdf['id'])
                pdf_ref.set({
                    "name": pdf['name'],
                    "telegram_file_id": pdf['telegram_file_id'],
                    "downloads": pdf['downloads'],
                    "uploaded_at": firestore.SERVER_TIMESTAMP
                })
                print(f"Added PDF: {pdf['name']}")

if __name__ == '__main__':
    seed_db()
