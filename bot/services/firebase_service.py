import firebase_admin
from firebase_admin import credentials, firestore
from config import FIREBASE_CREDENTIALS

db = None

def init_firebase():
    global db
    if db is not None:
        return db
    try:
        cred = credentials.Certificate(FIREBASE_CREDENTIALS)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Firebase initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize Firebase: {e}")
    return db

def get_db():
    global db
    if db is None:
        return init_firebase()
    return db
