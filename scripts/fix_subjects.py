import os
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
section_ref = db.collection('sections').document('ccat-notes-&-practice')

def delete_collection(coll_ref):
    docs = coll_ref.stream()
    for doc in docs:
        doc.reference.delete()

def main():
    print("=== CCAT Portal Database Fixer ===")
    
    # 1. Delete "data-structures"
    print("\n1. Deleting the incorrect 'DATA STRUCTURES' folder...")
    old_ds_ref = section_ref.collection('subjects').document('data-structures')
    
    # Delete all PDFs inside it first
    delete_collection(old_ds_ref.collection('pdfs'))
    # Then delete the subject itself
    old_ds_ref.delete()
    print("[SUCCESS] Deleted Data Structures folder entirely.")

    # 2. Rename "C LANGUAGE" to "C Programming & Data Structure"
    print("\n2. Renaming 'C LANGUAGE' to 'C Programming & Data Structure'...")
    old_c_ref = section_ref.collection('subjects').document('c-language')
    new_c_ref = section_ref.collection('subjects').document('c-programming-&-data-structure')
    
    # Check if old C language exists
    if not old_c_ref.get().exists:
        print("[WARNING] 'C LANGUAGE' folder was not found! Make sure you didn't already delete it.")
    else:
        # Create the new beautifully named document
        new_c_ref.set({"name": "C Programming & Data Structure"})
        
        # Copy all the PDFs over to the new folder
        pdfs = old_c_ref.collection('pdfs').stream()
        count = 0
        for pdf in pdfs:
            new_c_ref.collection('pdfs').document(pdf.id).set(pdf.to_dict())
        print(f"[SUCCESS] Securely copied {count} PDFs over to the new combined subject.")
        
        # Delete the old C Language PDFs and folder
        print("Cleaning up the old 'C LANGUAGE' data...")
        delete_collection(old_c_ref.collection('pdfs'))
        old_c_ref.delete()
    
    print("\n[SUCCESS] All fixes applied successfully!")

if __name__ == '__main__':
    main()
