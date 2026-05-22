import os
import sys
import asyncio
from telegram import Bot
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load env from bot/.env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bot', '.env'))
load_dotenv(env_path)

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS")

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = FIREBASE_CREDENTIALS
    if cred_path.startswith(".."):
        cred_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bot', FIREBASE_CREDENTIALS))
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

async def upload_document(bot, file_path):
    print(f"Uploading {os.path.basename(file_path)} to Telegram...")
    with open(file_path, 'rb') as f:
        message = await bot.send_document(chat_id=ADMIN_CHAT_ID, document=f)
    return message.document.file_id

def sanitize_id(name):
    # Converts "Section A" to "section-a", or "Quantitative Aptitude" to "quantitative-aptitude"
    return name.strip().lower().replace(" ", "-")

async def main():
    print("=== CCAT Portal SUPER Bulk Uploader ===")
    print("This script will scan your directory and automatically figure out Sections and Subjects based on the folder names.")
    print("Expected structure:")
    print("E:\\CCAT_PDFs\\")
    print("   ├── Section A\\")
    print("   │   ├── English\\")
    print("   │   │   └── notes.pdf")
    print("   │   └── Quant\\")
    print("   │       └── formulas.pdf")
    
    directory = input("\nEnter the full path to your root PDFs folder (e.g. E:\\CCAT_PDFs): ").strip()
    directory = directory.strip('"').strip("'")
    
    if not os.path.isdir(directory):
        print(f"Directory not found: {directory}")
        return

    default_section = input("Enter a Section Name to group these subjects under (e.g. 'Section A' or 'All Subjects'): ").strip()
    if not default_section:
        default_section = "Main Section"

    print("\nConnecting to Telegram...")
    bot = Bot(token=BOT_TOKEN)
    
    success_count = 0
    total_files = 0
    
    # First pass: count files
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.lower().endswith('.pdf'):
                total_files += 1
                
    if total_files == 0:
        print("No PDFs found in the directory tree.")
        return
        
    print(f"Found {total_files} PDFs. Starting recursive bulk upload...")
    
    for root, dirs, files in os.walk(directory):
        # Calculate the relative path from the root
        rel_path = os.path.relpath(root, directory)
        if rel_path == '.':
            continue # Skip files in the root folder, they don't have a section/subject
            
        parts = rel_path.split(os.sep)
        
        if len(parts) >= 2:
            section_name = parts[0]
            subject_name = parts[1]
        elif len(parts) == 1:
            # They only have 1 folder level (e.g. E:\CCAT_PDFs\English\file.pdf)
            section_name = default_section
            subject_name = parts[0]
        else:
            continue
            
        section_id = sanitize_id(section_name)
        subject_id = sanitize_id(subject_name)
        
        for filename in files:
            if filename.lower().endswith('.pdf'):
                file_path = os.path.join(root, filename)
                pdf_name = os.path.splitext(filename)[0]
                doc_id = sanitize_id(pdf_name)
                
                try:
                    # 1. Upload to Telegram
                    file_id = await upload_document(bot, file_path)
                    
                    # 2. Save to Firestore
                    db.collection('sections').document(section_id).set({"name": section_name}, merge=True)
                    db.collection('sections').document(section_id).collection('subjects').document(subject_id).set({"name": subject_name}, merge=True)
                    
                    pdf_ref = db.collection('sections').document(section_id).collection('subjects').document(subject_id).collection('pdfs').document(doc_id)
                    
                    pdf_ref.set({
                        "name": pdf_name,
                        "telegram_file_id": file_id,
                        "downloads": 0,
                        "uploaded_at": firestore.SERVER_TIMESTAMP
                    })
                    print(f"✅ Saved: [{section_name} > {subject_name}] {pdf_name}")
                    success_count += 1
                    
                    await asyncio.sleep(1.5)
                    
                except Exception as e:
                    print(f"❌ Failed to process {filename}: {e}")

    print(f"\n🎉 Finished! Successfully uploaded {success_count} out of {total_files} files.")

if __name__ == '__main__':
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
