# Project-AI-Agent

Fina AI agent, adalah sebuah AI berbasis python-flask dan web GUI yang terintegrasi dengan tools dan terminal melalui browser.

Cara penginstalan :
1. Install semua file itu dan taruh dalam folder yang sama.
2. Pastikan Python terinstall, kalau belum, install python dulu
3. Install flask, request dan edge-tts.
   ```bash
   pip install flask requests edge-tts
   ```
4. Dapatkan AI grok lewat
   https://console.x.ai/home
   atau semacamnya.
5. Paste AI grok ke config.env

Cara pemakaian:
1. Jalankan app.py dengan python app.py
2. Buka localhost:3000
3. Ubah persona lewat persona.txt sesuai persona yang diinginkan.
4. Mode Bicara bisa diaktifkan lewat tombol

Fitur :
1. Edge-tts, suara Nanami Jepang, tapi dengan menggunakan bahasa Indonesia. Terdapat mapping bahasa Indonesia ke katakana sehingga pengucapan bahasa Indonesia dengan logat Jepang lebih natural
2. Persona dan nama yang bisa diubah-ubah
3. Gambar siluet Safina menggunakan canvas2d, yang bisa bergerak ketika ngobrol
4. Akses perintah terminal
5. Ubah gambar-gambar seperti background sesuai keinginan juga
