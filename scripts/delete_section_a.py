import os
import sys
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load env from bot/.env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bot', '.env'))
load_dotenv(env_path)

FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS")

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = FIREBASE_CREDENTIALS
    if cred_path.startswith(".."):
        cred_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bot', FIREBASE_CREDENTIALS))
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def delete_collection(coll_ref, batch_size):
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0
    
    for doc in docs:
        print(f'Deleting doc {doc.id} => {doc.reference.path}')
        # Delete subcollections recursively if any exist
        # For our structure, we have sections -> subjects -> pdfs
        
        # This is a simple recursive deletion for our known structure
        if "sections" in doc.reference.path and "subjects" not in doc.reference.path:
            subs = doc.reference.collection("subjects")
            delete_collection(subs, batch_size)
        elif "subjects" in doc.reference.path and "pdfs" not in doc.reference.path:
            pdfs = doc.reference.collection("pdfs")
            delete_collection(pdfs, batch_size)
            
        doc.reference.delete()
        deleted += 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)

def main():
    print("Deleting 'section-a' from Firestore...")
    section_ref = db.collection('sections').document('section-a')
    
    # 1. Delete all subjects and their PDFs under section-a
    subjects_ref = section_ref.collection('subjects')
    delete_collection(subjects_ref, 100)
    
    # 2. Delete the section document itself
    section_ref.delete()
    print("Successfully deleted 'section-a' and all its contents!")

if __name__ == '__main__':
    main()
