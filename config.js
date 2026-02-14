// ============================================
// 💝 CUSTOMIZE YOUR VALENTINE'S WEBSITE HERE 💝
// ============================================

const CONFIG = {
    // Nome della ragazza ❤️
    valentineName: "Luna",

    // The title that appears in the browser tab
    // You can use emojis! 💝 💖 💗 💓 💞 💕
    pageTitle: "Luna, vuoi essere per sempre mia? 💘",

    // Floating emojis that appear in the background
    // Find more emojis at: https://emojipedia.org
    floatingEmojis: {
        hearts: ['❤️', '💖', '💝', '💗', '💓', '💕', '💘'],
        bears: ['🧸', '🐻'],
        sparkles: ['✨', '🌟']
    },

    // Questions and answers
    // Customize each question and its possible responses
    questions: {
        first: {
            text: "Luna… ti va di passare un momento con me? ❤️😳",
            yesBtn: "Sì 💞",
            noBtn: "No 🙄",
            secretAnswer: "Ok… allora te lo dico: io ti amo. 💖"
        },
        second: {
            text: "Quanto mi ami?",
            startText: "Così tanto!",
            nextBtn: "Continua ❤️"
        },
        third: {
            text: "Luna, vogliamo baciarci, abbracciarci e stare tutta la giornata insieme il 14 febbraio? 🌹",
            yesBtn: "Sì, certo! 💘",
            noBtn: "No 😅"
        }
    },

    // Love meter messages
    // They show up depending on how far they slide the meter
    loveMessages: {
        extreme: "OK… MA QUANTO SEI CARINAAA TI AMO TOPPO 😭💘🚀",
        high: "Dammi più affetto!!!🚀💝",
        normal: "E ancora un pochino di più 😌"
    },

    // Messages that appear after they say "Yes!"
    celebration: {
        title: "SÌÌÌ! LUNAAA MI HAI RESO FELICISSIMO!!!💖",
        message: "Ho una lettera per te.... aprila quando vuoi 💌",
        emojis: "💘💖💝💗💓💕🌹✨"
    },

    // Link alla lettera d'amore
    links: {
        loveLetterUrl: "lettera.html",
        loveLetterBtn: "Apri la lettera 💌"
    },

    // Color scheme for the website
    // Use https://colorhunt.co or https://coolors.co to find beautiful color combinations
    colors: {
        backgroundStart: "#1a0b16",
        backgroundEnd: "#3a0f2a",
        buttonBackground: "#ff2e63",
        buttonHover: "#ff5c88",
        textColor: "#ffffff"
    },

    // Animation settings
    // Adjust these if you want faster/slower animations
    animations: {
        floatDuration: "15s",           // How long it takes hearts to float up (10-20s recommended)
        floatDistance: "50px",          // How far hearts move sideways (30-70px recommended)
        bounceSpeed: "0.5s",            // Speed of bouncing animations (0.3-0.7s recommended)
        heartExplosionSize: 1.5         // Size of heart explosion effect (1.2-2.0 recommended)
    },

    // Performance (anti-lag)
    // Se su telefono “lagga”, metti forceLowEnd: true
    performance: {
        forceLowEnd: false
    },

    // Background Music (Optional)
    // Add your own music URL after getting proper licenses
    music: {
        enabled: true,
        autoplay: false,
        // ✅ Musica locale: crea la cartella "assets" e metti un mp3 (es: assets/musica.mp3)
        // ✅ Musica online: incolla un link diretto a un file .mp3
        musicUrl: "assets/No. 1 Party Anthem - Arctic Monkey (slowed + reverb).mp3",
        startText: "🎵 Avvia musica",
        stopText: "🔇 Ferma musica",
        volume: 0.55
    }
};

// Don't modify anything below this line unless you know what you're doing
window.VALENTINE_CONFIG = CONFIG; 