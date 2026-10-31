// ==========================================================================
// IGNITE 2026 - Omnipresent Scarlett AI Assistant & Page Transitions
// Shared across all pages: index.html, cultural.html, sports.html, schedule.html, contact.html
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 0. Phoenix Flying Welcome Animation Handler (for index.html)
    const welcomeOverlay = document.getElementById('phoenixWelcomeOverlay');
    const welcomeSkipBtn = document.getElementById('welcomeSkipBtn');

    if (welcomeOverlay) {
        // If user already experienced it in this browsing session, dismiss immediately without flashing
        const hasSeenIntro = sessionStorage.getItem('igniteWelcomeSeen');
        if (hasSeenIntro) {
            welcomeOverlay.style.display = 'none';
        } else {
            const dismissWelcome = () => {
                welcomeOverlay.classList.add('dismissed');
                sessionStorage.setItem('igniteWelcomeSeen', 'true');
                setTimeout(() => {
                    welcomeOverlay.style.display = 'none';
                }, 800);
            };

            if (welcomeSkipBtn) {
                welcomeSkipBtn.addEventListener('click', dismissWelcome);
            }

            // Auto dismiss smoothly after 3.2s flight
            setTimeout(dismissWelcome, 3300);
        }
    }

    // 1. Sticky Navbar scroll effect
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Smooth reveal observer for cards
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.glass-card, .event-card, .timeline-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // 2.1. Add to Calendar Dropdown & iCal Generator (for schedule.html)
    const addToCalBtn = document.getElementById('addToCalBtn');
    const calDropdownMenu = document.getElementById('calDropdownMenu');
    const downloadIcalBtn = document.getElementById('downloadIcalBtn');

    if (addToCalBtn && calDropdownMenu) {
        addToCalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = calDropdownMenu.classList.contains('show');
            if (isOpen) {
                calDropdownMenu.classList.remove('show');
                addToCalBtn.setAttribute('aria-expanded', 'false');
            } else {
                calDropdownMenu.classList.add('show');
                addToCalBtn.setAttribute('aria-expanded', 'true');
            }
        });

        document.addEventListener('click', (e) => {
            if (!calDropdownMenu.contains(e.target) && e.target !== addToCalBtn) {
                calDropdownMenu.classList.remove('show');
                addToCalBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (downloadIcalBtn) {
        downloadIcalBtn.addEventListener('click', () => {
            // Generate official RFC 5545 .ics calendar event
            const icsData = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Greenwood High//IGNITE 2026//EN',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH',
                'BEGIN:VEVENT',
                'UID:ignite-2026-' + Date.now() + '@greenwoodhigh.edu.in',
                'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
                'DTSTART;TZID=Asia/Kolkata:20261113T083000',
                'DTEND;TZID=Asia/Kolkata:20261114T183000',
                'SUMMARY:IGNITE 2026 | Greenwood High Flagship Fest',
                'DESCRIPTION:IGNITE 2026 at Greenwood High International School: 12 cultural events and 8 sports tournaments across two electrifying days.',
                'LOCATION:Greenwood High International School, Chikkawadayarapura, Heggondahalli, Bengaluru, Karnataka 560087',
                'STATUS:CONFIRMED',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'IGNITE_2026_Schedule.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    // 2.2. Countdown Timer Engine (Oakridge Codefest Style)
    function initCountdown() {
        const countdownEl = document.querySelector('[data-target]');
        if (!countdownEl) return;

        const targetTime = new Date(countdownEl.getAttribute('data-target')).getTime();
        const daysEl = countdownEl.querySelector('[data-unit="days"]');
        const hoursEl = countdownEl.querySelector('[data-unit="hours"]');
        const minutesEl = countdownEl.querySelector('[data-unit="minutes"]');
        const secondsEl = countdownEl.querySelector('[data-unit="seconds"]');

        function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

        function update() {
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                if (daysEl) daysEl.textContent = '00';
                if (hoursEl) hoursEl.textContent = '00';
                if (minutesEl) minutesEl.textContent = '00';
                if (secondsEl) secondsEl.textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            if (daysEl) daysEl.textContent = pad(days);
            if (hoursEl) hoursEl.textContent = pad(hours);
            if (minutesEl) minutesEl.textContent = pad(minutes);
            if (secondsEl) secondsEl.textContent = pad(seconds);
        }

        update();
        setInterval(update, 1000);
    }
    initCountdown();

    // 2.3. Oakridge-style Interactive 3D Card Hover Tilt
    const interactiveCards = document.querySelectorAll('.event-card, .programme-box, .glass-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -3;
            const rotY = ((x - cx) / cx) * 3;
            card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-3px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // 3. Cultural Events Filtering Logic (for cultural.html)
    const subFilterBtns = document.querySelectorAll('.sub-filter-btn');
    const culturalCards = document.querySelectorAll('#culturalGrid .event-card');

    if (subFilterBtns.length > 0) {
        subFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                subFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                culturalCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 40);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. Omnipresent AI Assistant "SCARLETT" Knowledge Engine
    const scarlettKnowledge = [
        {
            keywords: ['who are you', 'your name', 'what is your name', 'scarlett'],
            response: "I'm **Scarlett**, the official assistant for Greenwood High's IGNITE 2026. Ask me about any event's team size, fee, rules or schedule days, or about registration, food, and entry!"
        },
        {
            keywords: ['fee', 'fees', 'cost', 'price', 'pay', 'payment', 'how much'],
            response: "**Fees per team**:\n• Battle of the Bands, Dress to Impress: ₹1,000\n• Insync, Wolf of Wall Street: ₹800\n• All other cultural events: ₹600 (Pitch Perfect and Through the Lens are per participant)\n• Basketball, Football: ₹1,300 · Volleyball: ₹1,000 · Flag Football: ₹800 · Badminton: ₹700 · Table Tennis, Tennis: ₹600 · Shooting: ₹500\nCultural events are paid online. Sports are paid at the counter."
        },
        {
            keywords: ['wolf of wall street', 'wall street', 'stock', 'trading', 'sell me this pen', 'bidding'],
            response: "**Wolf of Wall Street**:\n• **Team**: 3 to 5 · **Fee**: ₹800 · **Per school**: up to 2 teams\n• **Format**: 2-day live market simulation with Sell Me This Pen, Bidding Wars, Insider Info, Breaking News, and a final IPO pitch.\n• **Bring**: A laptop. Read the case study and background info we send before the event."
        },
        {
            keywords: ['veritas', 'escape room', 'clues', 'detective', 'investigation'],
            response: "**Veritas**:\n• **Team**: 3 to 6 · **Fee**: ₹600 · **Per school**: up to 2 teams\n• **Format**: Escape-room investigation with a 1-hour time limit. Judged on correct suspect, motive and hints used. A different winner each day!"
        },
        {
            keywords: ['through the lens', 'photography', 'photographer', 'camera', 'dslr'],
            response: "**Through the Lens**:\n• **Solo** · **Fee**: ₹600 · **Per school**: up to 3 photographers\n• **Format**: 3 rounds, 3 themes (raw emotions, high-speed sports, rhythm of music).\n• **Bring**: Your own DSLR or mirrorless camera. Smartphone photography is not permitted."
        },
        {
            keywords: ['radioshack', 'cup pong', 'bottle flip', 'walk-in', 'walk in'],
            response: "**Radioshack Games**:\n• **Team**: 1 to 5 · **Fee**: ₹600, or included in the walk-in fee\n• Drop in on either day and play Cup Pong, Cup Stack Race or Trivia Bottle Flip."
        },
        {
            keywords: ['dress to impress', 'fashion', 'runway', 'outfit', 'sustainable', 'upcycl'],
            response: "**Dress to Impress**:\n• **Team**: 4 to 6 · **Fee**: ₹1,000 · **Per school**: up to 2 teams\n• **Format**: 7-minute runway plus a short design explanation. Round 1 (Reforged): mythological houses, at least 40% upcycled materials. Round 2 (Legacy, Reworn): traditional Indian attire through historical eras.\n• **Bring**: All clothing and accessories from home."
        },
        {
            keywords: ['respawn', 'gaming', 'minecraft', 'fifa', 'roblox', 'esports'],
            response: "**Respawn**:\n• **Team**: FIFA and Roblox solo, Minecraft 4 · **Fee**: ₹600 · **Per school**: 1 entry per game\n• **Games**: FIFA knockouts with random clubs, Minecraft squads over up to five mini-games, Roblox checkpoint race on Day 1 and runway on Day 2.\n• **Bring**: Your own gaming equipment for Minecraft and Roblox."
        },
        {
            keywords: ['pitch perfect', 'singing', 'singer', 'vocal', 'voice', 'song'],
            response: "**Pitch Perfect**:\n• **Solo** · **Fee**: ₹600 · **Per school**: up to 3 singers · **Day 1 only**\n• **Format**: Two rounds of solo vocals.\n• **Send**: Your backing track to ignite@greenwoodhigh.edu.in at least a week before."
        },
        {
            keywords: ['kryptos visos', 'face paint', 'painting', 'brushes'],
            response: "**Kryptos Visos**:\n• **Team**: 2 (painter + model) · **Fee**: ₹600 · **Per school**: up to 2 teams\n• **Format**: Day 1 theme announced in advance. Day 2 finalists get a different theme each, revealed 10 minutes before painting.\n• **Bring**: Your own skin-safe paints and brushes."
        },
        {
            keywords: ['directors cut', "director's cut", 'director', 'film', 'drama', 'theater', 'theatre', 'acting'],
            response: "**Director's Cut**:\n• **Team**: 4 to 5 · **Fee**: ₹600 · **Per school**: 1 team\n• **Format**: Day 1 performance from a creative brief, then an improvisation challenge. Day 2 an original 3–7 minute short film.\n• **Bring**: All your filming equipment."
        },
        {
            keywords: ['insync', 'dance', 'choreography', 'dancer'],
            response: "**Insync**:\n• **Team**: 1 to 9 · **Fee**: ₹800 · **Per school**: up to 2 teams\n• **Days**: Day 1 heats, finals on Day 2.\n• **Send**: Your music to ignite@greenwoodhigh.edu.in at least a week before."
        },
        {
            keywords: ['battle of the bands', 'my band', 'our band', 'live music', 'rock', 'band'],
            response: "**Battle of the Bands**:\n• **Team**: 2 to 7 · **Fee**: ₹1,000 · **Per school**: up to 2 bands\n• **Format**: 12–15 bands. Showcase round on Day 1, knockouts on Day 2.\n• **Bring**: Your own instruments. Drums and piano are provided."
        },
        {
            keywords: ['dyed in crimson', 'murder', 'crime scene', 'detective', 'crimson'],
            response: "**Dyed in Crimson**:\n• **Team**: 1 to 3 · **Fee**: ₹600\n• **Format**: A two-day murder mystery across the whole campus, with live theatre, puzzles, ciphers and investigation. Around 150–200 players in about 80 teams."
        },
        {
            keywords: ['flag football'],
            response: "**Flag Football**: 7 a side plus 2 subs, mixed teams, ₹800. Four 12-minute quarters, no kickoffs, no field goals, and tackling is an automatic ejection. Full rules are on the Sports page."
        },
        {
            keywords: ['table tennis', 'ping pong'],
            response: "**Table Tennis**: Teams of 3 to 5, boys and girls, ₹600. Singles, doubles, then a deciding reverse singles. Bring your own ITTF-approved paddle if you like; balls are provided."
        },
        {
            keywords: ['sport', 'sports', 'football', 'basketball', 'badminton', 'tennis', 'volleyball', 'shooting'],
            response: "IGNITE 2026 has **8 sports**:\n• Basketball (10–12, ₹1,300)\n• Football (boys 14–18, girls 9–12, ₹1,300)\n• Flag Football (7 + 2 subs, mixed, ₹800)\n• Volleyball (up to 12, ₹1,000)\n• Badminton (2–6, ₹700)\n• Table Tennis (3–5, ₹600)\n• Tennis (3, ₹600)\n• Shooting (up to 3 per event, ₹500)\nEach school can enter one team per sport. Register online and pay at the counter."
        },
        {
            keywords: ['rule', 'rules', 'uniform', 'id card', 'photo id', 'school id', 'food', 'lunch', 'wristband', 'medicine'],
            response: "**Key rules**:\n• Wear your school uniform (PE kit for sports) and bring your 2026–27 school ID.\n• Wear your wristband all day.\n• No outside food or drink, only empty water bottles. Food stalls on campus take coupons.\n• Carrying medicine? Email ignite@greenwoodhigh.edu.in first.\n• Zero tolerance for drugs and alcohol.\nThe full list is on the Rules page."
        },
        {
            keywords: ['mascot', 'phoenix', 'symbol', 'cause', 'charity', 'fundrais'],
            response: "Our mascot is the **Phoenix**, a symbol of resilience, rebirth and energy. IGNITE is Bangalore's biggest student-run fest, and it raises funds for the education of underprivileged girls."
        },
        {
            keywords: ['when is ignite', 'what date', 'dates', 'which day', 'schedule', 'event days'],
            response: "IGNITE 2026 is on **Friday 13 and Saturday 14 November**. The Schedule page shows which cultural events run on which day. Sports fixtures are set once registrations close."
        },
        {
            keywords: ['register', 'registration', 'sign up', 'email', 'contact', 'venue', 'location', 'where'],
            response: "IGNITE 2026 is on 13–14 November at Greenwood High International School, Sarjapur, Bangalore.\n• **Registrations**: 2 to 10 November.\n• **Cultural**: Register and pay online. **Sports**: Register online, pay at the counter.\n• **Questions**: ignite@greenwoodhigh.edu.in or @ignite.gwh on Instagram."
        }
    ];

    function getScarlettReply(userQuery) {
        const queryLower = userQuery.toLowerCase().trim();
        for (const item of scarlettKnowledge) {
            if (item.keywords.some(kw => queryLower.includes(kw))) {
                return item.response;
            }
        }
        return "I'm Scarlett, your IGNITE 2026 assistant! I have full information on all 12 Cultural events and 8 Sports tournaments. Ask me about any event's rules, team sizes, schedule, or details!";
    }

    // Scarlett Chat Widget DOM Elements
    const scarlettVoiceBtn = document.getElementById('scarlettVoiceBtn');
    const scarlettWindow = document.getElementById('scarlettChatWindow');
    const scarlettClose = document.getElementById('scarlettChatClose');
    const scarlettInput = document.getElementById('scarlettChatInput');
    const scarlettSend = document.getElementById('scarlettSendBtn');
    const scarlettMessages = document.getElementById('scarlettChatMessages');
    const scarlettChips = document.querySelectorAll('.scarlett-chip');

    function toggleScarlettChat(forceOpen = null) {
        if (!scarlettWindow) return;
        if (forceOpen === true) {
            scarlettWindow.classList.add('open');
        } else if (forceOpen === false) {
            scarlettWindow.classList.remove('open');
        } else {
            scarlettWindow.classList.toggle('open');
        }
        if (scarlettWindow.classList.contains('open') && scarlettInput) {
            scarlettInput.focus();
        }
    }

    if (scarlettVoiceBtn) scarlettVoiceBtn.addEventListener('click', () => toggleScarlettChat());
    if (scarlettClose) scarlettClose.addEventListener('click', () => toggleScarlettChat(false));

    function appendScarlettMessage(sender, text) {
        if (!scarlettMessages) return;
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement('div');
        msgDiv.className = `scarlett-msg ${sender}`;
        
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');

        msgDiv.innerHTML = `
            <div class="scarlett-msg-bubble">${formattedText}</div>
            <span class="scarlett-msg-time">${timeStr}</span>
        `;
        scarlettMessages.appendChild(msgDiv);
        scarlettMessages.scrollTop = scarlettMessages.scrollHeight;
    }

    function handleScarlettSend() {
        if (!scarlettInput) return;
        const query = scarlettInput.value.trim();
        if (!query) return;

        appendScarlettMessage('user', query);
        scarlettInput.value = '';

        setTimeout(() => {
            const reply = getScarlettReply(query);
            appendScarlettMessage('bot', reply);
        }, 320);
    }

    if (scarlettSend) scarlettSend.addEventListener('click', handleScarlettSend);
    if (scarlettInput) {
        scarlettInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleScarlettSend();
        });
    }

    scarlettChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (scarlettInput) {
                scarlettInput.value = prompt;
                handleScarlettSend();
            }
        });
    });

    // 5. Fire page transitions between HTML files
    // Leaving: flames sweep up and burn the page away.
    // Arriving: the dark curtain burns off to reveal the new page.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const EMBER = '#120504';
    const TONGUE = 240;   // px of flame above the burn line
    const BODY = 160;     // px of glowing body below the burn line
    const COL = 4;        // column width in px
    const COVER_MS = 750;
    const REVEAL_MS = 850;

    // Spark engine
    const GLOW = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 32;
        const g = c.getContext('2d');
        const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
        gr.addColorStop(0.00, 'rgba(255,240,200,1)');
        gr.addColorStop(0.25, 'rgba(255,160,50,0.7)');
        gr.addColorStop(1.00, 'rgba(255,60,10,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, 32, 32);
        return c;
    })();

    function newSpark(x, y, vx, vy, size, maxLife, gravity, drag) {
        return {
            x: x, y: y, vx: vx, vy: vy, size: size,
            life: 0, max: maxLife, g: gravity, drag: drag,
            seed: Math.random() * 100,
            fl: 0.4 + Math.random() * 0.5
        };
    }

    function stepSpark(s, dt) {
        s.life += dt;
        if (s.life >= s.max) return false;
        const d = Math.pow(s.drag, dt);
        s.vx *= d;
        s.vy = s.vy * d + s.g * dt;
        s.vx += Math.sin(s.seed + s.life * 0.35) * 0.12 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        return true;
    }

    // Draws a spark as a streak stretched along its velocity, plus a halo on big ones.
    function drawSpark(c, s) {
        const k = s.life / s.max;                                  // 0 new, 1 gone
        const flicker = 0.6 + 0.4 * Math.sin(s.life * s.fl * 3 + s.seed);
        const a = Math.max(0, (1 - k) * flicker);
        const g = Math.round(240 - 190 * k);                       // white-yellow -> red
        const b = Math.round(170 * (1 - k) * (1 - k));
        const w = s.size * (1 - 0.55 * k);
        c.strokeStyle = 'rgba(255,' + g + ',' + b + ',' + a.toFixed(2) + ')';
        c.lineWidth = w;
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(s.x, s.y);
        c.lineTo(s.x - s.vx * 2.2 - 0.01, s.y - s.vy * 2.2);
        c.stroke();
        if (s.size > 1.5) {
            const r = w * 4;
            c.globalAlpha = a * 0.7;
            c.drawImage(GLOW, s.x - r, s.y - r, r * 2, r * 2);
            c.globalAlpha = 1;                                     // always restore it
        }
    }

    let canvas = null, ctx = null, W = 0, H = 0;
    let strips = null;
    let particles = [];
    let transitioning = false;

    function makeStrip(mode) {
        const c = document.createElement('canvas');
        c.width = 1;
        c.height = TONGUE + BODY;
        const g = c.getContext('2d');
        const grad = g.createLinearGradient(0, 0, 0, TONGUE + BODY);
        if (mode === 'cover') {
            grad.addColorStop(0.00, 'rgba(196,36,26,0)');
            grad.addColorStop(0.30, 'rgba(255,61,46,0.55)');
            grad.addColorStop(0.52, 'rgba(255,120,30,0.95)');
            grad.addColorStop(0.60, 'rgba(255,200,70,1)');
            grad.addColorStop(0.78, 'rgba(190,45,20,1)');
            grad.addColorStop(1.00, EMBER);
        } else {
            grad.addColorStop(0.00, EMBER);
            grad.addColorStop(0.30, 'rgba(120,20,10,1)');
            grad.addColorStop(0.50, 'rgba(255,61,46,1)');
            grad.addColorStop(0.60, 'rgba(255,200,70,1)');
            grad.addColorStop(0.80, 'rgba(255,100,30,0.6)');
            grad.addColorStop(1.00, 'rgba(255,61,46,0)');
        }
        g.fillStyle = grad;
        g.fillRect(0, 0, 1, TONGUE + BODY);
        return c;
    }

    function resizeCanvas() {
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function setupCanvas() {
        if (canvas) return;
        canvas = document.createElement('canvas');
        canvas.className = 'fire-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        strips = { cover: makeStrip('cover'), reveal: makeStrip('reveal') };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function noise(x, t) {
        return (Math.sin(x * 0.07 + t * 0.012) +
                Math.sin(x * 0.13 - t * 0.019) +
                Math.sin(x * 0.23 + t * 0.031)) / 3;
    }

    function drawFire(mode, p, t, dt) {
        const amp = 50;
        const startY = H + TONGUE + amp;
        const endY = -BODY * 1.4 - amp;
        const base = startY - p * (startY - endY);
        const strip = strips[mode];

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, W, H);

        for (let x = 0; x < W; x += COL) {
            const wave = Math.sin(x * 0.012 + t * 0.004) * 0.6 + Math.sin(x * 0.031 - t * 0.007) * 0.4;
            const front = base + amp * wave;
            const s = 1 + 0.3 * noise(x, t);
            const top = front - TONGUE * s;
            const bottom = front + BODY * s;

            if (mode === 'cover') {
                if (bottom < H) {
                    ctx.fillStyle = EMBER;
                    ctx.fillRect(x, Math.max(bottom - 1, 0), COL, H - Math.max(bottom - 1, 0));
                }
            } else if (top > 0) {
                ctx.fillStyle = EMBER;
                ctx.fillRect(x, 0, COL, Math.min(top + 1, H));
            }
            if (bottom > 0 && top < H) {
                ctx.drawImage(strip, 0, 0, 1, TONGUE + BODY, x, top, COL, (TONGUE + BODY) * s);
            }
        }

        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.35;
        for (let x = -40; x < W + 80; x += 80) {
            const wv = Math.sin(x * 0.012 + t * 0.004) * 0.6 + Math.sin(x * 0.031 - t * 0.007) * 0.4;
            ctx.drawImage(GLOW, x - 110, base + amp * wv - 110, 220, 220);
        }
        ctx.globalAlpha = 1;

        if (p > 0.02 && p < 0.98) {
            const count = Math.round((9 + 10 * Math.sin(p * Math.PI)) * dt);
            for (let i = 0; i < count && particles.length < 420; i++) {
                const x = Math.random() * W;
                const wv = Math.sin(x * 0.012 + t * 0.004) * 0.6 + Math.sin(x * 0.031 - t * 0.007) * 0.4;
                const y = base + amp * wv + (Math.random() - 0.3) * BODY * 0.6;
                const big = Math.random() < 0.2;
                const speed = big ? 6 + Math.random() * 10 : 2.5 + Math.random() * 7;
                const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
                particles.push(newSpark(
                    x, y,
                    Math.cos(ang) * speed + 0.8, Math.sin(ang) * speed,
                    big ? 1.8 + Math.random() * 1.6 : 0.8 + Math.random() * 1.0,
                    big ? 45 + Math.random() * 40 : 24 + Math.random() * 26,
                    0.1, 0.982
                ));
            }
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            if (!stepSpark(particles[i], dt)) { particles.splice(i, 1); continue; }
            drawSpark(ctx, particles[i]);
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    function runFire(mode, duration, done) {
        setupCanvas();
        resizeCanvas();
        particles = [];
        canvas.classList.add('active');
        const start = performance.now();
        let last = start;
        function frame(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 0.5 - Math.cos(p * Math.PI) / 2;
            drawFire(mode, eased, now, Math.min((now - last) / 16.7, 3));
            last = now;
            if (p < 1) {
                requestAnimationFrame(frame);
            } else {
                if (mode === 'reveal') {
                    canvas.classList.remove('active');
                    ctx.clearRect(0, 0, W, H);
                }
                if (done) done();
            }
        }
        requestAnimationFrame(frame);
    }

    let arrivedByFire = false;
    try { arrivedByFire = sessionStorage.getItem('igniteBurn') === '1'; } catch (err) { /* ignore */ }
    if (arrivedByFire) {
        try { sessionStorage.removeItem('igniteBurn'); } catch (err) { /* ignore */ }
    }
    if (arrivedByFire && welcomeOverlay) {
        welcomeOverlay.classList.add('dismissed');
        welcomeOverlay.style.display = 'none';
        try { sessionStorage.setItem('igniteWelcomeSeen', 'true'); } catch (err) { /* ignore */ }
    }
    if (arrivedByFire && !reduceMotion) {
        setupCanvas();
        canvas.classList.add('active');
        drawFire('reveal', 0, 0, 1);
        document.documentElement.classList.remove('fire-arriving');
        let started = false;
        const beginReveal = () => {
            if (started) return;
            started = true;
            setTimeout(() => runFire('reveal', REVEAL_MS), 120);
        };
        if (document.readyState === 'complete') beginReveal();
        else {
            window.addEventListener('load', beginReveal);
            setTimeout(beginReveal, 1000);
        }
    } else {
        document.documentElement.classList.remove('fire-arriving');
    }

    window.addEventListener('pageshow', (e) => {
        document.body.classList.remove('fade-out');
        document.documentElement.classList.remove('fire-arriving');
        if (e.persisted && canvas) {
            canvas.classList.remove('active');
            ctx.clearRect(0, 0, W, H);
        }
        transitioning = false;
    });

    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.href;
            const currentUrl = window.location.href.split('#')[0];
            const hrefAttribute = link.getAttribute('href');

            if (
                e.defaultPrevented ||
                e.ctrlKey || e.metaKey || e.shiftKey || e.altKey ||
                link.getAttribute('target') === '_blank' || 
                link.hasAttribute('download') ||
                hrefAttribute.startsWith('mailto:') || 
                hrefAttribute.startsWith('tel:') ||
                hrefAttribute.startsWith('javascript:') ||
                hrefAttribute.startsWith('#') ||
                link.origin !== window.location.origin ||
                targetUrl.split('#')[0] === currentUrl
            ) {
                return;
            }

            e.preventDefault();
            if (transitioning) return;
            transitioning = true;

            if (reduceMotion) {
                document.body.classList.add('fade-out');
                setTimeout(() => { window.location.href = hrefAttribute; }, 180);
                return;
            }

            runFire('cover', COVER_MS, () => {
                try { sessionStorage.setItem('igniteBurn', '1'); } catch (err) { /* ignore */ }
                window.location.href = hrefAttribute;
            });
        });
    });
});
