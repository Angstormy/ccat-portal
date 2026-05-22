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

def main():
    print("=== CCAT Portal PDF Deleter ===")
    section_id = input("Enter the Section ID (e.g., ccat-notes-&-practice): ").strip()
    subject_id = input("Enter the Subject ID (e.g., data-structures): ").strip()
    
    print(f"\nFetching PDFs in [{section_id} -> {subject_id}]...")
    
    try:
        pdfs_ref = db.collection('sections').document(section_id).collection('subjects').document(subject_id).collection('pdfs')
        docs = pdfs_ref.stream()
        
        pdf_list = []
        for doc in docs:
            pdf_list.append(doc)
            
        if not pdf_list:
            print("No PDFs found in that subject! Check your IDs and try again.")
            return
            
        print("\nAvailable PDFs to delete:")
        for i, doc in enumerate(pdf_list):
            name = doc.to_dict().get('name', 'Unknown')
            print(f"[{i}] {name}")
            
        choice = input("\nEnter the number of the PDF you want to delete (or type 'q' to quit): ").strip()
        if choice.lower() == 'q':
            return
            
        idx = int(choice)
        if 0 <= idx < len(pdf_list):
            doc_to_delete = pdf_list[idx]
            
            # Confirm deletion
            confirm = input(f"Are you sure you want to permanently delete '{doc_to_delete.to_dict().get('name')}'? (y/n): ")
            if confirm.lower() == 'y':
                doc_to_delete.reference.delete()
                print("✅ Successfully deleted from your database!")
            else:
                print("Deletion cancelled.")
        else:
            print("Invalid number selected.")
            
    except ValueError:
        print("Please enter a valid number.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    while True:
        main()
        again = input("\nDo you want to delete another PDF? (y/n): ")
        if again.lower() != 'y':
            break
