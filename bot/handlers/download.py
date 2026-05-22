import random
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from services.token_service import check_token_validity, validate_and_consume_token

def generate_math_captcha():
    num1 = random.randint(1, 15)
    num2 = random.randint(1, 15)
    op = random.choice(['+', '-'])
    if op == '-' and num1 < num2:
        num1, num2 = num2, num1  # Ensure positive results
    
    correct = num1 + num2 if op == '+' else num1 - num2
    
    # Generate 3 unique incorrect answers
    options = {correct}
    while len(options) < 4:
        wrong = correct + random.choice([-3, -2, -1, 1, 2, 3, 4, 5])
        if wrong >= 0:
            options.add(wrong)
            
    options_list = list(options)
    random.shuffle(options_list)
    return num1, num2, op, correct, options_list

async def process_token(update: Update, context: ContextTypes.DEFAULT_TYPE):
    token = update.message.text.strip()
    await initiate_verification(update, context, token)

async def initiate_verification(update: Update, context: ContextTypes.DEFAULT_TYPE, token: str):
    # Check if token is valid before starting verification
    pdf_data, error_msg = check_token_validity(token)
    if error_msg:
        await update.message.reply_text(f"❌ {error_msg}")
        return

    # Generate Math CAPTCHA
    num1, num2, op, correct, options = generate_math_captcha()
    
    # Store verification state in user_data
    context.user_data['pending_token'] = token
    context.user_data['captcha_answer'] = correct
    
    # Build inline buttons
    keyboard = []
    row = []
    for opt in options:
        row.append(InlineKeyboardButton(str(opt), callback_data=f"verify_captcha:{opt}"))
        if len(row) == 2:
            keyboard.append(row)
            row = []
    if row:
        keyboard.append(row)
        
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    question_text = (
        "🤖 *Human Verification Required*\n\n"
        "To prevent automated spam and deliver your study material, "
        "please solve this simple math question:\n\n"
        f"👉 *{num1} {op} {num2} = ?*"
    )
    
    await update.message.reply_text(question_text, reply_markup=reply_markup, parse_mode="Markdown")

async def verify_callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    data = query.data
    if not data or not data.startswith("verify_captcha:"):
        return
        
    selected_ans = int(data.split(":")[1])
    correct_ans = context.user_data.get('captcha_answer')
    token = context.user_data.get('pending_token')
    
    if correct_ans is None or token is None:
        await query.edit_message_text("❌ Verification session expired or invalid. Please request a new link from the website.")
        return
        
    if selected_ans == correct_ans:
        # Correct answer! Consume token and send the document
        pdf_data, error_msg = validate_and_consume_token(token)
        if error_msg:
            await query.edit_message_text(f"❌ {error_msg}")
            context.user_data.pop('pending_token', None)
            context.user_data.pop('captcha_answer', None)
            return
            
        file_id = pdf_data.get('telegram_file_id')
        if not file_id:
            await query.edit_message_text("❌ Sorry, the file could not be found.")
            return
            
        await query.edit_message_text("✅ Verification successful! Sending your PDF...")
        try:
            await context.bot.send_document(chat_id=update.effective_chat.id, document=file_id)
        except Exception as e:
            await context.bot.send_message(chat_id=update.effective_chat.id, text="❌ Error sending the document. Please contact admin.")
            print(f"Error sending document: {e}")
        
        # Clean up state
        context.user_data.pop('pending_token', None)
        context.user_data.pop('captcha_answer', None)
    else:
        # Wrong answer! Generate a new CAPTCHA
        num1, num2, op, correct, options = generate_math_captcha()
        context.user_data['captcha_answer'] = correct
        
        keyboard = []
        row = []
        for opt in options:
            row.append(InlineKeyboardButton(str(opt), callback_data=f"verify_captcha:{opt}"))
            if len(row) == 2:
                keyboard.append(row)
                row = []
        if row:
            keyboard.append(row)
            
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        question_text = (
            "❌ *Incorrect answer. Let's try another one!*\n\n"
            "To prevent automated spam and deliver your study material, "
            "please solve this math question:\n\n"
            f"👉 *{num1} {op} {num2} = ?*"
        )
        
        await query.edit_message_text(question_text, reply_markup=reply_markup, parse_mode="Markdown")
