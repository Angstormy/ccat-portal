from datetime import datetime, timezone
from services.firebase_service import get_db

def check_token_validity(token_string):
    """
    Checks if token is valid, hasn't expired, and hasn't been used.
    Does NOT mark it as used.
    """
    db = get_db()
    if not db:
        return None, "Database error"

    token_ref = db.collection('tokens').document(token_string)
    doc = token_ref.get()

    if not doc.exists:
        return None, "Invalid token."

    data = doc.to_dict()
    if data.get('used', False):
        return None, "This token has already been used."

    expires_at = data.get('expires_at')
    # Depending on how it's stored, it might be a DatetimeWithNanoseconds
    if expires_at and datetime.now(timezone.utc) > expires_at:
        return None, "This token has expired."

    return {
        'pdf_id': data.get('pdf_id'),
        'telegram_file_id': data.get('telegram_file_id')
    }, None

def validate_and_consume_token(token_string):
    """
    Checks if token is valid, hasn't expired, and hasn't been used.
    If valid, marks it as used and returns the pdf data.
    """
    db = get_db()
    if not db:
        return None, "Database error"

    token_ref = db.collection('tokens').document(token_string)
    doc = token_ref.get()

    if not doc.exists:
        return None, "Invalid token."

    data = doc.to_dict()
    if data.get('used', False):
        return None, "This token has already been used."

    expires_at = data.get('expires_at')
    # Depending on how it's stored, it might be a DatetimeWithNanoseconds
    if expires_at and datetime.now(timezone.utc) > expires_at:
        return None, "This token has expired."

    # Mark as used
    token_ref.update({'used': True})

    # Fetch PDF info
    pdf_id = data.get('pdf_id')
    return {
        'pdf_id': pdf_id,
        'telegram_file_id': data.get('telegram_file_id')
    }, None
