import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ContextTypes

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        "🎓 *Welcome to Last Moment Tuitions - CDAC File Provider Bot* 🎓\n\n"
        "Get everything you need to ace your *CDAC-CCAT Preparation* in one place! "
        "We deliver your premium study resources instantly and securely.\n\n"
        "⚡ *What we offer:*\n"
        "• 📚 *Complete Study Materials* (Concepts & Solved Examples)\n"
        "• 💡 *Formulas & Tricks* for quick revisions\n"
        "• 📝 *Practice Problems* to test your understanding\n"
        "• 📄 *Previous Year Question Papers* (PYQs)\n"
        "• 📋 *C-CAT Syllabus* detailed overview\n\n"
        "📥 *How to download:*\n"
        "1. Open our Mini App or website and choose your subject.\n"
        "2. Click the *Download* button on the file.\n"
        "3. Once the 5-second secure timer finishes, click download to return here!\n\n"
        "🔐 *Already have a token?* Just paste it directly into this chat to receive your file!"
    )
    # Check if a token was passed via deep link: t.me/bot?start=TOKEN
    if context.args:
        token = context.args[0]
        from handlers.download import initiate_verification
        await initiate_verification(update, context, token)
    else:
        # Mini App configuration
        mini_app_url = os.getenv("MINI_APP_URL", "https://your-domain.com/miniapp")
        keyboard = [
            [InlineKeyboardButton("📱 Open Mini App", web_app=WebAppInfo(url=mini_app_url))]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        banner_path = os.path.join("assets", "banner.png")
        if os.path.exists(banner_path):
            try:
                with open(banner_path, 'rb') as photo:
                    await update.message.reply_photo(
                        photo=photo,
                        caption=welcome_text,
                        parse_mode="Markdown",
                        reply_markup=reply_markup
                    )
                return
            except Exception as e:
                print(f"Error sending banner photo: {e}")
                
        await update.message.reply_text(
            welcome_text, 
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
