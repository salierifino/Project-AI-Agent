import os
import subprocess
import requests
import re
import json
import asyncio
from flask import Flask, render_template, request, Response, jsonify
from datetime import datetime
import edge_tts

app = Flask(__name__)

api_index = 0

# konfigurasi
def get_api():
    with open("static/config.env", "r") as f:
        lines = f.readlines()
        idx = api_index % len(lines)
        API_KEY = lines[idx].strip();
    return API_KEY


URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"

MEMORY_FILE = os.path.expanduser("~/.ai_memory.json")
VOICE = "ja-JP-NanamiNeural"

chat_history = []
MAX_HISTORY = 10

def id_to_katakana(text):
    # bersihkan perintah EXECUTE jika ada
    clean_text = (re.sub(r"EXECUTE:.*", "", text).strip()
                  .replace("-","") # hapus '-' agar mwnghilangkan jeda
                  .replace("_","")
                  .replace("{","")
                  .replace("}","")) 
    if not clean_text:
        return "プロセ ス セレサイ" # "Proses selesai" dalam katakana
        
    t = clean_text.lower() # jadi huruf kecil semua

   #mapping katakana 
    phonetic_rules = [
        # konsonan + ng,ny,n
        (r'ng([aeiou])', r'ンガ\1'), (r'ng', r'ン'), (r'ny', r'ニヤ'), (r'n\b', r'ン'),
        
        # konsonan mati di akhir kata
        (r'k\b', r'ク'), (r's\b', r'ス'), (r't\b', r'ト'), (r'd\b', r'ド'), 
        (r'p\b', r'プ'), (r'b\b', r'ブ'), (r'm\b', r'ム'), (r'h\b', r'オ'), 
        (r'l\b', r'ル'), (r'r\b', r'ル'),
        
        # Suku kata dasar katakana,
        (r'ba', 'バ'), (r'bi', 'ビ'), (r'bu', 'ブ'), (r'be', 'ベ'), (r'bo', 'ボ'),
        (r'ca', 'チャ'), (r'ci', 'チ'), (r'cu', 'チュ'), (r'ce', 'チェ'), (r'co', 'チョ'),
        (r'da', 'ダ'), (r'di', 'ディ'), (r'du', 'ドゥ'), (r'de', 'デ'), (r'do', 'ド'),
        (r'fa', 'ファ'), (r'fi', 'フィ'), (r'fu', 'フ'), (r'fe', 'フェ'), (r'fo', 'フォ'),
        (r'ga', 'ガ'), (r'gi', 'ギ'), (r'gu', 'グ'), (r'ge', 'ゲ'), (r'go', 'ゴ'),
        (r'ha', 'ハ'), (r'hi', 'ヒ'), (r'hu', 'フ'), (r'he', 'ヘ'), (r'ho', 'ホ'),
        (r'ja', 'ジャ'), (r'ji', 'ジ'), (r'ju', 'ジュ'), (r'je', 'ジェ'), (r'jo', 'ジョ'),
        (r'ka', 'カ'), (r'ki', 'キ'), (r'ku', 'ク'), (r'ke', 'ケ'), (r'ko', 'コ'),
        (r'la', 'ラ'), (r'li', 'リ'), (r'lu', 'ル'), (r'le', 'レ'), (r'lo', 'ロ'),
        (r'ma', 'マ'), (r'mi', 'ミ'), (r'mu', 'ム'), (r'me', 'メ'), (r'mo', 'モ'),
        (r'na', 'ナ'), (r'ni', 'ニ'), (r'nu', 'ヌ'), (r'ne', 'ネ'), (r'no', 'ノ'),
        (r'pa', 'パ'), (r'pi', 'ピ'), (r'pu', 'プ'), (r'pe', 'ペ'), (r'po', 'ポ'),
        (r'ra', 'ラ'), (r'ri', 'リ'), (r'lu', 'ル'), (r're', 'レ'), (r'ro', 'ロ'),
        (r'sa', 'サ'), (r'si', 'シ'), (r'su', 'ス'), (r'se', 'セ'), (r'so', 'ソ'),
        (r'ta', 'タ'), (r'ti', 'ティ'), (r'tu', 'トゥ'), (r'te', 'テ'), (r'to', 'ト'),
        (r'va', 'ヴァ'), (r'vi', 'ヴィ'), (r'vu', 'ヴ'), (r've', 'ヴェ'), (r'vo', 'ヴォ'),
        (r'wa', 'ワ'), (r'wi', 'ウィ'), (r'wu', 'ウゥ'), (r'we', 'ウェ'), (r'wo', 'ウォ'),
        (r'ya', 'ヤ'), (r'yi', 'イ'), (r'yu', 'ユ'), (r'ye', 'イェ'), (r'yo', 'ヨ'),
        (r'za', 'ザ'), (r'zi', 'ジ'), (r'zu', 'ズ'), (r'ze', 'ゼ'), (r'zo', 'ゾ'),
        
        # huruf vokal
        (r'a', 'ア'), (r'i', 'イ'), (r'u', 'ウ'), (r'e', 'エ'), (r'o', 'オ')
    ]

    for pattern, replace_with in phonetic_rules:
        t = re.sub(pattern, replace_with, t)

    # Bersihkan sisa-sisa huruf yg tidak termapping
    t = re.sub(r'[a-zA-Z]', '', t)
    
    return t

def load_memory():
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r", encoding="utf-8") as f: 
                return json.load(f)
        except: 
            pass
    return {"facts": []}

def save_memory(mem):
    with open(MEMORY_FILE, "w", encoding="utf-8") as f: 
        json.dump(mem, f, indent=2)

def execute_terminal(command):
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=15)
        
        output = result.stdout.strip() if result.stdout else ""
        errors = result.stderr.strip() if result.stderr else ""
        
        if errors and not output:
            return f"Terjadi Error atau Warning:\n{errors}"
        elif not output and not errors:
            return "Perintah berhasil dieksekusi (tanpa output)."
        
        return f"Output Terminal:\n{output}"
    except subprocess.TimeoutExpired:
        return "Error: Eksekusi melewati batas waktu (timeout 15 sec)."
    except Exception as e:
        return f"Gagal mengeksekusi perintah: {str(e)}"

async def generate_tts(text, output_path):
    # konversi ke katakana lalu ke tts logat jepang
    katakana_text = id_to_katakana(text)
    
    communicate = edge_tts.Communicate(katakana_text, VOICE)
    await communicate.save(output_path)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    global chat_history, api_index
    user_msg = request.json.get("message", "")
    if not user_msg:
        return jsonify({"reply": "Pesan tidak boleh kosong."})

    # memori dari JSON
    mem = load_memory()
    facts_str = "\n".join(mem["facts"][-5:])
    
    # SYSTEM PROMPT
    with open("static/persona.txt", "r") as f:
        persona = f.read()
    persona += f"Memori: {facts_str}"
    messages = [{"role": "system", "content": persona}]
    for past_msg in chat_history:
        messages.append(past_msg)  # memasukan obrolan sebelumnya
    messages.append({"role": "user", "content": user_msg})
    
    try:
        # loop agent 3 kali untuk ekssskusi terminal
        for _ in range(3):
            payload = {
                "model": MODEL,
                "messages": messages,
                "temperature": 0.2
            }
            
            r = requests.post(URL, json=payload, headers={"Authorization": f"Bearer {get_api()}"})
            
            if r.status_code != 200:
                error_text = r.text.lower()
                if r.status_code in [429, 402] or "token" in error_text or "limit" in error_text or "quota" in error_text:
                    api_index += 1
                    return chat()
                return jsonify({"reply": f"Groq API Error: {r.text}"})
                
            ai_res = r.json()["choices"][0]["message"]["content"]
            
            # cek apakah AI memberi eksekusi terminal
            if "EXECUTE:" in ai_res:
                match = re.search(r"EXECUTE:\s*(.*)", ai_res)
                if match:
                    command = match.group(1).strip()
                    terminal_output = execute_terminal(command)
                    
                    messages.append({"role": "assistant", "content": ai_res})
                    messages.append({"role": "user", "content": f"[Sistem Otomatis] Hasil dari perintah tersebut adalah:\n{terminal_output}\n\nSilakan berikan jawaban akhir atau tindakan lanjutan jika belum selesai."})
                    continue
            
            chat_history.append({"role": "user", "content": user_msg})
            chat_history.append({"role": "assistant", "content": ai_res})

            # Batasi memori chat
            if len(chat_history) > MAX_HISTORY * 2:
                chat_history = chat_history[-(MAX_HISTORY * 2):]

            # Kembalikan reply ke user
            return jsonify({"reply": ai_res})
            
        return jsonify({"reply": ai_res})

    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"})

@app.route('/tts')
def tts():
    text = request.args.get("text", "")
    if not text:
        return "Teks kosong", 400
        
    # folder dan file tts
    static_folder = os.path.join(app.root_path, 'static')
    os.makedirs(static_folder, exist_ok=True)
    audio_path = os.path.join(static_folder, 'output.mp3')
    
    # jalankan asyncronus
    asyncio.run(generate_tts(text, audio_path))
    
    # kirim audio ke browser
    from flask import send_file
    return send_file(audio_path, mimetype="audio/mpeg")

@app.route('/shutdown', methods=['POST'])
def shutdown():
    try:
        # mengirim sinyal unt matikan server
        import signal
        os.kill(os.getpid(), signal.SIGINT)
        return jsonify({"status": "success", "message": "Server dimatikan."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
