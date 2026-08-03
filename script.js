let currentAudio = null;
let input = document.getElementById("userInput");
let modeBicara = false;
  
        // Cek dukungan browser untuk Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Maaf, browser Anda tidak mendukung fitur Speech-to-Text.');
        } else {
            const recognition = new SpeechRecognition();

            // Pengaturan bahasa (Bahasa Indonesia)
            recognition.lang = 'id-ID';
            recognition.interimResults = false;



function  sendMessage() {
        
        let teksbox = document.getElementById("teksbox");
        let msg = input.value;
        if(!msg)  return;
        teksbox.textContent = "User: " + msg;
        input.value = "";
 
        fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: msg})
        })
        .then(res => res.json())
        .then(data => {
            let jawabanAI = data.reply; 

            if (currentAudio) {
                currentAudio.pause();
            }

            // siapkan audio di belakang
            currentAudio = new Audio('/tts?text=' + encodeURIComponent(jawabanAI));

            currentAudio.oncanplaythrough = function() {
                // set status ke ngomong
                kondisiGlobal = true;

                // munculkan teks dan suara
                teksbox.textContent = "AI: " + jawabanAI;
              
                currentAudio.play().catch(e => {
                    //kalau gagal memutar audio
                    kondisiGlobal = false;
                   if (modeBicara) recognition.start();
                });
                
                currentAudio.oncanplaythrough = null;
            };

            // setelah Audio diputar
            currentAudio.onended = function() {
                kondisiGlobal = false;
                if (modeBicara) recognition.start();
            };
        })
        .catch(err => {
            console.error("Error:", err);
            // jika eror pada fetch
            kondisiGlobal = false;
          if (modeBicara) recognition.start();
        });
    }

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { // !e.shiftKey biar Shift+Enter bisa ganti baris
    e.preventDefault(); // biar ga newline
    sendMessage();
  }
});
document.getElementById('exit-btn').addEventListener('click', function() {
    if (confirm('Apakah kamu yakin ingin mematikan server?')) {
        fetch('/shutdown', { method: 'POST' });
        setTimeout(function() {
            window.location.reload(); //refresh
        }, 100); //tunggu 100 ms setelah shutdown
    }
});


const btnMulai = document.getElementById('btnMulai');
      
            btnMulai.addEventListener('click', () => {
                if (modeBicara) {
                recognition.stop();
                  modeBicara = false;
                  btnMulai.textContent = 'Mulai Bicara';
               } else {
                 recognition.start();
                  modeBicara = true;
                  btnMulai.textContent = 'Matikan Bicara';
               }
});

            
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                input.value = text;
                modeBicara = true;
               sendMessage();
            };

            recognition.onstart = () => {
                btnMulai.disabled = true;
                btnMulai.textContent = 'Dengar ......';
            };


            recognition.onspeechend = () => {
               modeBicara = false;
               recognition.stop();
            };

            recognition.onend = () => {
                btnMulai.disabled = false;
                btnMulai.textContent = (modeBicara ? 'Matikan' : 'Mulai') + ' Bicara';
               
            };


            recognition.onerror = (event) => {
                alert('Terjadi kesalahan: ' + event.error);
               modeBicara =false;
                btnMulai.textContent = 'Mulai Bicara';
            };
        }