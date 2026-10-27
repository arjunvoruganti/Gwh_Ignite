// ==========================================================================
// IGNITE 2026 - Omnipresent Scarlett AI Assistant & Page Transitions
// Shared across all pages: index.html, cultural.html, sports.html, schedule.html, contact.html
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
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
            response: "I'm **Scarlett**, the official omnipresent AI assistant for Greenwood High's IGNITE 2026! I can assist you with rules, team limits, schedules, formats, and registration for every single Cultural and Sports event."
        },
        {
            keywords: ['wolf of wall street', 'wall street', 'stock', 'trading', 'pen'],
            response: "**Wolf of Wall Street**:\n• **Participants**: Teams of 3 to 5 people\n• **Tagline**: *'Trade the market. Survive the chaos. Become the Wolf.'*\n• **Format**: 2-day live market simulation with 'Sell Me This Pen', Bidding Wars, Insider Info, Breaking News, and a final IPO pitch.\n• **Rule**: Review the provided case study and background info prior to the event."
        },
        {
            keywords: ['veritas', 'escape room', 'clues', 'detective', 'investigation'],
            response: "**Veritas**:\n• **Participants**: Teams of 3 to 6 people\n• **Tagline**: *'Can you crack the case before it's too late?'*\n• **Format**: Escape-room investigation testing critical thinking & deduction under a strict 1-hour time limit. Different winner each day!"
        },
        {
            keywords: ['through the lens', 'photography', 'photo', 'camera', 'dslr'],
            response: "**Through the Lens**:\n• **Participants**: Solo event (no teams)\n• **Tagline**: *'Frame it. Feel it. Tell it.'*\n• **Format**: 3 rounds across 3 themes (raw emotions, high-speed sports, rhythm of music).\n• **Strict Rule**: Participants must use DSLR or mirrorless cameras only (no smartphone cameras)."
        },
        {
            keywords: ['respawn', 'gaming', 'minecraft', 'fifa', 'roblox', 'esports'],
            response: "**Respawn (Gaming Arena)**:\n• **Participants**: Roblox and FIFA are solo; Minecraft requires 4 players per team\n• **Tagline**: *'Rise. Fall. Respawn.'*\n• **Games**: Minecraft action minigames knockouts, FIFA Champions League tournament with random clubs, and 2-day Roblox challenges (Obby race Day 1, Dress to Impress Day 2).\n• **Rule**: Bring your own laptops for Minecraft and devices/chargers for Roblox!"
        },
        {
            keywords: ['pitch perfect', 'singing', 'vocal', 'voice', 'song', 'sing'],
            response: "**Pitch Perfect**:\n• **Participants**: Solo event (no teams)\n• **Tagline**: *'Every voice gets a chance. Every note is a statement. Step onto the stage and make it yours.'*\n• **Format**: 2 rounds of knockout vocal battles to determine the summit's finest voice."
        },
        {
            keywords: ['kryptos visos', 'face paint', 'painting', 'brushes'],
            response: "**Kryptos Visos**:\n• **Participants**: 2 people per team (1 painter + 1 model)\n• **Tagline**: *'Bring your brushes, beat the clock, and let your creativity IGNITE!'*\n• **Details**: Day 1 theme pre-announced; Day 2 theme revealed 10 minutes prior with custom themes per duo.\n• **Rule**: Bring your own skin-safe paints and brushes."
        },
        {
            keywords: ['directors cut', 'director', 'film', 'drama', 'theater', 'acting', 'short film'],
            response: "**Directors Cut**:\n• **Participants**: 4 to 5 people per team\n• **Tagline**: *'Create the story, adapt to the challenge, and own the final cut.'*\n• **Details**: Day 1 live theatrical performance & surprise unscripted improvisation; Day 2 original 3–7 min short film under genre constraints."
        },
        {
            keywords: ['insync', 'dance', 'choreography', 'dancer'],
            response: "**Insync**:\n• **Participants**: 1 to 9 people per team\n• **Tagline**: *'Feel the beat. Move In Sync.'*\n• **Details**: High-voltage dance celebration, choreography rounds, and creative movement battles."
        },
        {
            keywords: ['battle of the bands', 'band', 'bands', 'music', 'live music', 'rock'],
            response: "**Battle of the Bands**:\n• **Participants**: 3 to 8 people per team\n• **Tagline**: *'For whom the band tolls. 12-15 bands. The ultimate showdown.'*\n• **Details**: 2-day live outdoor musical clash for Bangalore's top 12–15 student bands. Backline amps & drum kit provided; bring guitars, pedals, & sticks."
        },
        {
            keywords: ['dyed in crimson', 'murder', 'crime scene', 'trail', 'crimson'],
            response: "**Dyed in Crimson**:\n• **Participants**: Exactly 3 people per team\n• **Tagline**: *'One Murder, One Campus, Two days. Can you uncover what happened before the trail goes cold?'*\n• **Details**: The whole Greenwood High campus transforms into a 2-day live crime scene with actor interrogations, hidden ciphers, and forensic evidence analysis."
        },
        {
            keywords: ['dress to impress', 'fashion', 'runway', 'outfit', 'sustainable'],
            response: "**Dress to Impress**:\n• **Participants**: 4 to 6 people per team\n• **Tagline**: *'Think beyond the theme — Where creativity meets competition.'*\n• **Details**: Sustainable runway competition reimagining ancient lore and Indian heritage eras through repurposed and upcycled couture design."
        },
        {
            keywords: ['sport', 'sports', 'football', 'basketball', 'badminton', 'table tennis', 'swimming', 'athletics'],
            response: "IGNITE 2026 features 6 premier sports arenas:\n1) **7v7 Football Cup** on astro turf\n2) **Hoop Matrix Basketball** (5v5 Boys & Girls)\n3) **Shuttle Smash Badminton** (Singles/Doubles)\n4) **Spin Clash Table Tennis**\n5) **AquaIgnite Swimming Meet** (50m/100m/Relays)\n6) **Sprint & Field Invitational** (100m, 200m, 400m, relays)."
        },
        {
            keywords: ['mascot', 'phoenix', 'symbol'],
            response: "Our official mascot is the **Ignite Phoenix** — representing resurrection, fiery passion, and daring creativity across both our Cultural stages and Sports colosseums!"
        },
        {
            keywords: ['register', 'registration', 'email', 'contact', 'venue', 'location'],
            response: "IGNITE 2026 takes place on October 24th - 25th, 2026 at the Greenwood High International Campus, Sarjapur, Bangalore! You can register by emailing **ignite@greenwoodhigh.edu.in** or visiting our **contact.html** page."
        }
    ];

    function getScarlettReply(userQuery) {
        const queryLower = userQuery.toLowerCase().trim();
        for (const item of scarlettKnowledge) {
            if (item.keywords.some(kw => queryLower.includes(kw))) {
                return item.response;
            }
        }
        return "I'm Scarlett, your IGNITE 2026 copilot! I have full information on all 10 Cultural events and our 6 Sports arenas. Ask me about any event's rules, team sizes, schedule, or details!";
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

    // 5. Page transitions between HTML files (identical to GWHMUN 2026)
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.href;
            const currentUrl = window.location.href.split('#')[0];
            const hrefAttribute = link.getAttribute('href');

            if (
                link.getAttribute('target') === '_blank' || 
                hrefAttribute.startsWith('mailto:') || 
                hrefAttribute.startsWith('javascript:') ||
                hrefAttribute.startsWith('#') ||
                targetUrl.split('#')[0] === currentUrl
            ) {
                return;
            }

            e.preventDefault();
            document.body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = hrefAttribute;
            }, 380);
        });
    });
});
