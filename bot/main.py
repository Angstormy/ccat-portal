import logging
import os
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters
from config import BOT_TOKEN
from handlers.start import start_command
from handlers.download import process_token, verify_callback_handler

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

def start_health_check_server():
    port = int(os.environ.get("PORT", 8080))
    class HealthCheckHandler(SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path in ('/health', '/'):
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b"Bot is alive and running!")
            else:
                self.send_response(404)
                self.end_headers()

        def log_message(self, format, *args):
            # Suppress HTTP request logs to keep terminal output clean
            pass

    try:
        server = HTTPServer(('0.0.0.0', port), HealthCheckHandler)
        server_thread = threading.Thread(target=server.serve_forever, daemon=True)
        server_thread.start()
        logging.info(f"Health check server successfully started on port {port}")
    except Exception as e:
        logging.error(f"Failed to start health check server: {e}")

async def post_init(application: Application) -> None:
    try:
        # This text appears in the "What can this bot do?" section before starting the chat
        await application.bot.set_my_description(
            "Welcome to the Last Moment Tuitions CDAC File Provider Bot! 🎓\n\n"
            "Everything you need for your CDAC-CCAT preparation in one place:\n"
            "• Complete Study Materials (Concepts & Solved Examples)\n"
            "• Formulas & Tricks for quick revision\n"
            "• Practice Problems with detailed solutions\n"
            "• Previous Year Question Papers (PYQs)\n"
            "• C-CAT Syllabus\n\n"
            "👉 Please visit our website, select the subject you want, and click 'Download' to retrieve your file instantly here!"
        )
        print("Bot description set successfully.")
    except Exception as e:
        print(f"Failed to set bot description: {e}")

def main():
    if not BOT_TOKEN:
        print("BOT_TOKEN is missing. Please set it in your .env file.")
        return

    # Start the HTTP health check server for Render
    start_health_check_server()

    application = Application.builder().token(BOT_TOKEN).post_init(post_init).build()

    application.add_handler(CommandHandler("start", start_command))
    # We can process tokens sent directly as messages
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, process_token))
    # Callback query handler for CAPTCHA buttons
    application.add_handler(CallbackQueryHandler(verify_callback_handler))

    print("Bot is starting...")
    application.run_polling()

if __name__ == '__main__':
    main()
