import os
import asyncio
from telegram import Bot
from dotenv import load_dotenv

load_dotenv("../bot/.env")

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")

async def upload_pdf(file_path):
    bot = Bot(token=BOT_TOKEN)
    print(f"Uploading {file_path}...")
    with open(file_path, 'rb') as f:
        message = await bot.send_document(chat_id=ADMIN_CHAT_ID, document=f)
    file_id = message.document.file_id
    print(f"Uploaded! File ID: {file_id}")
    return file_id

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        asyncio.run(upload_pdf(sys.argv[1]))
    else:
        print("Please provide a file path.")
