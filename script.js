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

    // 0.5 Interactive Sparks & Ember Particle Field Engine (Hero Background)
    const sparksCanvas = document.getElementById('heroSparksCanvas');
    const heroEl = document.querySelector('.hero');

    if (sparksCanvas && heroEl) {
        const sCtx = sparksCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        let dpr = 1;
        let isHeroVisible = true;
        let animId = null;

        // Mouse tracking for interactive heat wave / wind draft
        const mouse = {
            x: -9999,
            y: -9999,
            prevX: -9999,
            prevY: -9999,
            vx: 0,
            vy: 0,
            active: false,
            idleTimer: null
        };

        function resizeSparks() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = heroEl.clientWidth;
            height = heroEl.clientHeight;
            sparksCanvas.width = width * dpr;
            sparksCanvas.height = height * dpr;
            sparksCanvas.style.width = width + 'px';
            sparksCanvas.style.height = height + 'px';
            sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        window.addEventListener('resize', resizeSparks);
        resizeSparks();

        function updateMousePosition(clientX, clientY) {
            const rect = heroEl.getBoundingClientRect();
            const currX = clientX - rect.left;
            const currY = clientY - rect.top;

            if (mouse.prevX !== -9999) {
                mouse.vx = currX - mouse.prevX;
                mouse.vy = currY - mouse.prevY;
            } else {
                mouse.vx = 0;
                mouse.vy = 0;
            }

            mouse.prevX = mouse.x = currX;
            mouse.prevY = mouse.y = currY;
            mouse.active = true;

            clearTimeout(mouse.idleTimer);
            mouse.idleTimer = setTimeout(() => {
                mouse.active = false;
                mouse.vx = 0;
                mouse.vy = 0;
            }, 120);
        }

        heroEl.addEventListener('mousemove', (e) => {
            updateMousePosition(e.clientX, e.clientY);
        });

        heroEl.addEventListener('mouseleave', () => {
            mouse.active = false;
            mouse.x = -9999;
            mouse.y = -9999;
            mouse.prevX = -9999;
            mouse.prevY = -9999;
            mouse.vx = 0;
            mouse.vy = 0;
        });

        heroEl.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        heroEl.addEventListener('touchend', () => {
            mouse.active = false;
        });

        // Ember Particle Definition
        const PARTICLE_COUNT = 70;
        const particles = [];

        function spawnEmber(bottomOnly = true) {
            const life = 0;
            const maxLife = 160 + Math.random() * 220; // 3 to 6.5 seconds
            const size = Math.random() < 0.75 ? (1.2 + Math.random() * 1.6) : (2.8 + Math.random() * 1.8);
            const x = Math.random() * (width || 1200);
            const y = bottomOnly ? (height * 0.75 + Math.random() * height * 0.25) : (Math.random() * (height || 800));
            const baseVy = -(0.55 + Math.random() * 1.15); // gentle upward drift
            const vx = (Math.random() - 0.5) * 0.7;
            const seed = Math.random() * 100;
            const swaySpeed = 0.02 + Math.random() * 0.025;
            const swayAmp = 0.35 + Math.random() * 0.55;

            return {
                x, y, vx, vy: baseVy, baseVy, size, life, maxLife, seed, swaySpeed, swayAmp,
                heatBoost: 0
            };
        }

        // Pre-populate particles so screen is alive immediately
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = spawnEmber(false);
            p.life = Math.random() * p.maxLife * 0.85;
            particles.push(p);
        }

        let lastTime = performance.now();

        function renderSparks(now) {
            if (!isHeroVisible) {
                animId = null;
                return;
            }

            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            sCtx.clearRect(0, 0, width, height);

            mouse.vx *= 0.88;
            mouse.vy *= 0.88;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.life += 1;

                if (p.life >= p.maxLife || p.y < -30 || p.x < -40 || p.x > width + 40) {
                    particles[i] = spawnEmber(true);
                    continue;
                }

                // Upward drift and natural wind sway
                p.y += p.vy;
                p.x += p.vx + Math.sin(p.seed + p.life * p.swaySpeed) * p.swayAmp;

                // Restoring natural upward velocity
                p.vy = p.vy * 0.985 + p.baseVy * 0.015;
                p.vx *= 0.975;
                p.heatBoost = Math.max(0, p.heatBoost - 0.02);

                // Interactive Heat Wave / Cursor Wind Draft
                if (mouse.active) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const distSq = dx * dx + dy * dy;
                    const radius = 135;

                    if (distSq < radius * radius && distSq > 0.1) {
                        const dist = Math.sqrt(distSq);
                        const force = (1 - dist / radius);
                        const angle = Math.atan2(dy, dx);

                        const pushStrength = force * 2.2;
                        p.vx += Math.cos(angle) * pushStrength + mouse.vx * 0.08 * force;
                        p.vy += Math.sin(angle) * pushStrength + mouse.vy * 0.08 * force;

                        p.vy -= force * 0.75;
                        p.heatBoost = Math.min(1, p.heatBoost + force * 0.6);
                    }
                }

                // Visual color & flicker based on lifetime
                const progress = p.life / p.maxLife;
                
                let baseAlpha = 1;
                if (progress < 0.12) {
                    baseAlpha = progress / 0.12;
                } else if (progress > 0.75) {
                    baseAlpha = Math.max(0, (1 - progress) / 0.25);
                }

                const flicker = 0.72 + 0.28 * Math.sin(p.seed * 11 + p.life * 0.3);
                const finalAlpha = Math.min(1, Math.max(0, baseAlpha * flicker + p.heatBoost * 0.3));

                let r, g, b;
                if (progress < 0.25 || p.heatBoost > 0.4) {
                    r = 255;
                    g = Math.round(220 + 35 * (1 - progress));
                    b = Math.round(140 * (1 - progress));
                } else if (progress < 0.65) {
                    r = 255;
                    g = Math.round(120 + 80 * (1 - (progress - 0.25) / 0.4));
                    b = 20;
                } else {
                    r = Math.round(210 + 45 * (1 - progress));
                    g = Math.round(45 + 50 * (1 - progress));
                    b = 10;
                }

                const currentSize = p.size * (1 - 0.25 * progress);
                sCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha.toFixed(2)})`;

                if (currentSize > 2.4 || p.heatBoost > 0.3) {
                    sCtx.shadowColor = `rgba(${r}, ${Math.max(60, g)}, 10, ${Math.min(1, finalAlpha * 0.9)})`;
                    sCtx.shadowBlur = currentSize * 3;
                    sCtx.beginPath();
                    sCtx.arc(p.x, p.y, currentSize / 2, 0, Math.PI * 2);
                    sCtx.fill();
                    sCtx.shadowBlur = 0;
                } else {
                    sCtx.beginPath();
                    sCtx.arc(p.x, p.y, currentSize / 2, 0, Math.PI * 2);
                    sCtx.fill();
                }
            }

            animId = requestAnimationFrame(renderSparks);
        }

        if ('IntersectionObserver' in window) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isHeroVisible = entry.isIntersecting;
                    if (isHeroVisible && !animId) {
                        lastTime = performance.now();
                        animId = requestAnimationFrame(renderSparks);
                    }
                });
            }, { threshold: 0.05 });
            heroObserver.observe(heroEl);
        } else {
            animId = requestAnimationFrame(renderSparks);
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

    // 2.3. Interactive 3D Card Tilt with Cursor Spotlight (Stripe & Apple style)
    const eventCards = document.querySelectorAll('.event-card, .moment-card');
    eventCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set dynamic spotlight coordinates
            card.style.setProperty('--spot-x', `${x}px`);
            card.style.setProperty('--spot-y', `${y}px`);

            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -6.5;
            const rotY = ((x - cx) / cx) * 6.5;

            card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--spot-x', '-999px');
            card.style.setProperty('--spot-y', '-999px');
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // 2.4. Magnetic Navbar "Register" Button and Hero CTAs
    const magneticBtns = document.querySelectorAll('.btn-register-nav, .hero-actions-group .btn-glow');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const pullX = x * 0.36;
            const pullY = y * 0.36;
            btn.style.transform = `translate(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px) scale(1.05)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    // 3. Cultural Events Filtering Logic with Smooth Sliding Pill (iOS Native feel - cultural.html only)
    const culturalGrid = document.querySelector('#culturalGrid');
    const filterBar = culturalGrid ? document.querySelector('.event-filter-bar:not(.schedule-category-filter)') : null;
    const subFilterBtns = filterBar ? filterBar.querySelectorAll('.sub-filter-btn') : [];
    const culturalCards = document.querySelectorAll('#culturalGrid .event-card');

    if (filterBar && subFilterBtns.length > 0 && culturalCards.length > 0) {
        // Create or acquire the sliding pill indicator
        let pill = filterBar.querySelector('.filter-pill-indicator');
        if (!pill) {
            pill = document.createElement('div');
            pill.className = 'filter-pill-indicator';
            filterBar.insertBefore(pill, filterBar.firstChild);
        }

        const updatePill = (targetBtn) => {
            if (!pill || !targetBtn) return;
            pill.style.transform = `translateX(${targetBtn.offsetLeft}px)`;
            pill.style.width = `${targetBtn.offsetWidth}px`;
        };

        // Initialize pill position to the active tab
        const initialActive = filterBar.querySelector('.sub-filter-btn.active') || subFilterBtns[0];
        if (initialActive) {
            // Quick delayed position on load to ensure fonts/layout are calculated
            setTimeout(() => updatePill(initialActive), 40);
        }

        window.addEventListener('resize', () => {
            const currentActive = filterBar.querySelector('.sub-filter-btn.active');
            if (currentActive) updatePill(currentActive);
        });

        subFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                subFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updatePill(btn);

                const filterValue = btn.getAttribute('data-filter');

                culturalCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const matches = filterValue === 'all' || category === filterValue;

                    if (matches) {
                        card.style.display = 'flex';
                        // Quick animation frame for smooth entry
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'perspective(1000px) scale(1) translateY(0px)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'perspective(1000px) scale(0.95) translateY(12px)';
                        setTimeout(() => {
                            if (!btn.classList.contains('active')) return;
                            card.style.display = 'none';
                        }, 220);
                    }
                });
            });
        });
    }

    // 3.1. Schedule Page Interactive Filtering (Category: Sports vs Cultural, and Day Switcher)
    const schedCategoryFilter = document.querySelector('.schedule-category-filter');
    const schedCategoryBtns = document.querySelectorAll('.schedule-category-filter .sub-filter-btn');
    const schedDayBtns = document.querySelectorAll('.day-tab-btn');
    const schedCards = document.querySelectorAll('.schedule-card');
    const schedMatrixRows = document.querySelectorAll('.days-table tbody tr');
    const day1Block = document.getElementById('day1Schedule');
    const day2Block = document.getElementById('day2Schedule');

    if (schedCategoryFilter && schedCategoryBtns.length > 0) {
        let schedPill = schedCategoryFilter.querySelector('.filter-pill-indicator');
        if (!schedPill) {
            schedPill = document.createElement('div');
            schedPill.className = 'filter-pill-indicator';
            schedCategoryFilter.insertBefore(schedPill, schedCategoryFilter.firstChild);
        }

        const updateSchedPill = (targetBtn) => {
            if (!schedPill || !targetBtn) return;
            schedPill.style.transform = `translateX(${targetBtn.offsetLeft}px)`;
            schedPill.style.width = `${targetBtn.offsetWidth}px`;
        };

        const initialCategoryActive = schedCategoryFilter.querySelector('.sub-filter-btn.active') || schedCategoryBtns[0];
        if (initialCategoryActive) {
            setTimeout(() => updateSchedPill(initialCategoryActive), 50);
        }

        window.addEventListener('resize', () => {
            const current = schedCategoryFilter.querySelector('.sub-filter-btn.active');
            if (current) updateSchedPill(current);
        });

        const applyCategoryFilter = (cat) => {
            // Filter schedule cards
            schedCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                const show = (cat === 'all') || (cardCat === cat) || (cardCat === 'ceremony');
                if (show) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });

            // Filter matrix table rows
            schedMatrixRows.forEach(row => {
                const rowCat = row.getAttribute('data-category');
                const show = (cat === 'all') || (rowCat === cat) || (rowCat === 'ceremony');
                if (show) {
                    row.classList.remove('is-hidden');
                } else {
                    row.classList.add('is-hidden');
                }
            });
        };

        schedCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                schedCategoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateSchedPill(btn);

                const filterVal = btn.getAttribute('data-schedule-category');
                applyCategoryFilter(filterVal);
            });
        });
    }

    // Day Switcher Logic (Day 1 vs Day 2 vs Full Fest / Both)
    if (schedDayBtns.length > 0 && day1Block && day2Block) {
        schedDayBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                schedDayBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const dayMode = btn.getAttribute('data-schedule-day');
                if (dayMode === 'day1') {
                    day1Block.classList.remove('is-hidden');
                    day2Block.classList.add('is-hidden');
                } else if (dayMode === 'day2') {
                    day1Block.classList.add('is-hidden');
                    day2Block.classList.remove('is-hidden');
                } else {
                    day1Block.classList.remove('is-hidden');
                    day2Block.classList.remove('is-hidden');
                }
            });
        });
    }

    // 4. Omnipresent AI Assistant "SCARLETT" Knowledge Engine
    const scarlettKnowledge = [
        {
            name: 'who are you',
            phrases: ['who are you', 'your name', 'what is your name', 'about you', 'who made you'],
            primaryKeywords: ['scarlett'],
            keywords: ['assistant', 'ai', 'bot', 'help'],
            response: "I'm **Scarlett**, the official AI assistant for Greenwood High's **IGNITE 2026**! 🔥\n\nAsk me about any of our **8 sports tournaments** or **12 cultural competitions**, rules, fees, event heads, schedule days, registrations, or campus entry guidelines."
        },
        // --- 8 SPORTS DISCIPLINES (INDIVIDUAL DEDICATED CARDS) ---
        {
            name: 'basketball',
            phrases: [
                'event details for basketball', 'details for basketball', 'basketball details',
                'basketball rules', 'basketball event', 'basketball heads', 'basketball fee', 'basketball info'
            ],
            primaryKeywords: ['basketball', 'b-ball', 'bball', 'hoops'],
            keywords: ['sagar simha', 'asmi nigam', 'fiba', 'overtime'],
            response: "**Basketball (IGNITE 2026)**\n" +
                      "🏀 **Format**: Full-court championship featuring boys & girls divisions in the indoor arena.\n" +
                      "👥 **Squad Size**: 10 to 12 players per team (8 teams total).\n" +
                      "💰 **Fee**: ₹1,300 per team (Register online, pay at the counter).\n" +
                      "👤 **Event Heads**: Sagar Simha & Asmi Nigam\n" +
                      "📋 **Key Rules**:\n" +
                      "• Follows standard FIBA rules in a knockout bracket (win to advance).\n" +
                      "• Four 10-minute quarters with rolling substitutions.\n" +
                      "• In case of a tie, 5-minute overtime periods are played until a winner emerges.\n" +
                      "• Referees' decisions are strictly final."
        },
        {
            name: 'football',
            phrases: [
                'event details for football', 'details for football', 'football details',
                'football rules', 'football event', 'football heads', 'football fee', 'football info', 'soccer details'
            ],
            primaryKeywords: ['football', 'soccer'],
            keywords: ['aarav kohle', 'atharva limaye', 'fifa', 'astro turf', '11v11', '7v7', 'penalties'],
            response: "**Football (IGNITE 2026)**\n" +
                      "⚽ **Venue**: Greenwood High FIFA-standard astro turf under the floodlights.\n" +
                      "👥 **Squad Size**: Boys 11-a-side (squad 14–18) · Girls 7-a-side (squad 9–12).\n" +
                      "💰 **Fee**: ₹1,300 per team (Register online, pay at the counter).\n" +
                      "👤 **Event Heads**: Aarav Kohle & Atharva Limaye\n" +
                      "📋 **Key Rules**:\n" +
                      "• Standard FIFA rules. Boys: 25-minute halves; Girls: 20-minute halves with 5-min half-time.\n" +
                      "• Knockout format. If drawn at full-time: 5 penalties, then sudden death.\n" +
                      "• Rolling substitutions allowed. Yellow/red cards carry FIFA suspensions."
        },
        {
            name: 'flag football',
            phrases: [
                'event details for flag football', 'details for flag football', 'flag football details',
                'flag football rules', 'flag football event', 'flag football heads', 'flag football fee'
            ],
            primaryKeywords: ['flag football', 'gridiron'],
            keywords: ['prithvi gowda', 'american football', 'touchdown'],
            response: "**Flag Football (IGNITE 2026)**\n" +
                      "🏈 **Format**: Non-contact American football on the open gridiron turf.\n" +
                      "👥 **Squad Size**: 7-a-side mixed teams + 2 substitutes (maximum 2 female players on field at any time).\n" +
                      "💰 **Fee**: ₹800 per team (Register online, pay at the counter).\n" +
                      "👤 **Event Head**: Prithvi Gowda\n" +
                      "📋 **Key Rules**:\n" +
                      "• Four 12-minute quarters with a 5-minute half-time break.\n" +
                      "• No kickoffs: offensive team starts from their own 5-yard line, 4 downs to cross midfield.\n" +
                      "• Physical tackling, tripping, or roughness results in immediate ejection.\n" +
                      "• Touchdowns: 6 pts. Extra point: 1 pt (from 5-yd line) or 2 pts (from 10-yd line)."
        },
        {
            name: 'volleyball',
            phrases: [
                'event details for volleyball', 'details for volleyball', 'volleyball details',
                'volleyball rules', 'volleyball event', 'volleyball heads', 'volleyball fee'
            ],
            primaryKeywords: ['volleyball', 'volley'],
            keywords: ['preyasi', 'vachhrajani', 'aarav gokul', 'fivb', 'spikes'],
            response: "**Volleyball (IGNITE 2026)**\n" +
                      "🏐 **Format**: High-flying spikes, rock-solid blocks & rallies in the indoor sports complex.\n" +
                      "👥 **Squad Size**: Up to 12 players per team (Boys & girls divisions, 8 teams cap).\n" +
                      "💰 **Fee**: ₹1,000 per team (Register online, pay at the counter).\n" +
                      "👤 **Event Heads**: Preyasi Jignesh Vachhrajani & Aarav Gokul\n" +
                      "📋 **Key Rules**:\n" +
                      "• Follows FIVB rules. Knockout tournament.\n" +
                      "• Best of 3 sets: First two sets to 25 points; deciding 3rd set to 15 points (must win by 2).\n" +
                      "• Standard rotation and substitution rules apply."
        },
        {
            name: 'badminton',
            phrases: [
                'event details for badminton', 'details for badminton', 'badminton details',
                'badminton rules', 'badminton event', 'badminton heads', 'badminton fee', 'badminton head'
            ],
            primaryKeywords: ['badminton', 'shuttlecock', 'shuttlers'],
            keywords: ['shashrik ranjith', 'bwf', 'non-marking', 'singles', 'doubles'],
            response: "**Badminton (IGNITE 2026)**\n" +
                      "🏸 **Format**: Interschool team ties on synthetic indoor courts.\n" +
                      "👥 **Squad Size**: 2 to 6 players per team (Boys & girls).\n" +
                      "💰 **Fee**: ₹700 per team (Register online, pay at the counter).\n" +
                      "👤 **Event Head**: Shashrik Ranjith\n" +
                      "📋 **Key Rules**:\n" +
                      "• Follows BWF rules. Knockout format.\n" +
                      "• Each tie consists of: Singles 1, Singles 2, and deciding Doubles if required.\n" +
                      "• 21 points rally-point system. Feather shuttlecocks provided by committee.\n" +
                      "• Bring your own rackets. Non-marking shoes are strictly mandatory."
        },
        {
            name: 'table tennis',
            phrases: [
                'event details for table tennis', 'details for table tennis', 'table tennis details',
                'table tennis rules', 'table tennis event', 'table tennis heads', 'table tennis fee', 'ping pong'
            ],
            primaryKeywords: ['table tennis', 'ping pong', 'tt'],
            keywords: ['shaurya grover', 'ittf', 'paddle', 'paddles'],
            response: "**Table Tennis (IGNITE 2026)**\n" +
                      "🏓 **Format**: High-velocity spin, precision loops, and lightning reactions.\n" +
                      "👥 **Squad Size**: 3 to 5 players per team (Boys & girls).\n" +
                      "💰 **Fee**: ₹600 per team (Register online, pay at the counter).\n" +
                      "👤 **Event Head**: Shaurya Grover\n" +
                      "📋 **Key Rules**:\n" +
                      "• Follows ITTF rules. Knockout format.\n" +
                      "• Ties consist of: Singles 1, Doubles, and Singles 2 (first to 2 matches wins).\n" +
                      "• Matches are best of 5 games to 11 points (must win by 2 points).\n" +
                      "• ITTF-approved paddles allowed. Official balls provided."
        },
        {
            name: 'tennis',
            phrases: [
                'event details for tennis', 'details for tennis', 'tennis details',
                'tennis rules', 'tennis event', 'tennis heads', 'tennis fee', 'lawn tennis'
            ],
            primaryKeywords: ['tennis', 'lawn tennis'],
            keywords: ['vihaan bhatt', 'itf', 'hard courts', 'racquet'],
            response: "**Tennis (IGNITE 2026)**\n" +
                      "🎾 **Venue**: Greenwood High championship hard courts.\n" +
                      "👥 **Squad Size**: 3 players per team (Boys & girls).\n" +
                      "💰 **Fee**: ₹600 per team (Register online, pay at the counter).\n" +
                      "👤 **Event Head**: Vihaan Bhatt\n" +
                      "📋 **Key Rules**:\n" +
                      "• Follows ITF rules. Knockout format.\n" +
                      "• Tie format: Singles 1, Singles 2, and deciding Doubles match if needed.\n" +
                      "• Matches are one set to 6 games with 7-point tiebreak at 6-all (finals best of 3 sets).\n" +
                      "• Non-marking tennis shoes mandatory. Bring your own racquets; balls provided."
        },
        {
            name: 'shooting',
            phrases: [
                'event details for shooting', 'details for shooting', 'shooting details',
                'shooting rules', 'shooting event', 'shooting heads', 'shooting fee', 'air rifle', 'air pistol'
            ],
            primaryKeywords: ['shooting', 'air rifle', 'air pistol', 'marksman', 'shooters'],
            keywords: ['kashvi mahesh', 'sasha roshan', 'issf', '10m', 'target'],
            response: "**Shooting (IGNITE 2026)**\n" +
                      "🎯 **Venue**: Greenwood High indoor 10m shooting range.\n" +
                      "🎯 **Categories**: 10m Air Rifle & 10m Air Pistol (Boys & girls).\n" +
                      "👥 **Cap**: 24 shooters per event (up to 3 shooters per school).\n" +
                      "💰 **Fee**: ₹500 per shooter (Register online, pay at the counter).\n" +
                      "👤 **Event Heads**: Kashvi Mahesh & Sasha Roshan\n" +
                      "📋 **Key Rules**:\n" +
                      "• ISSF rules apply. 30 shots in 45 minutes after a 15-minute sighting period.\n" +
                      "• Top 8 shooters advance to the elimination final.\n" +
                      "• Bring your own weapon, pellets, and shooting jacket/gear (strict safety inspection).\n" +
                      "• Range Safety Officers' instructions must be obeyed immediately."
        },
        {
            name: 'all sports overview',
            phrases: [
                'all sports', 'sports list', 'list of sports', 'what sports', 'which sports',
                'sports events', 'sports overview', 'sports tournaments', 'tell me about sports'
            ],
            primaryKeywords: ['sports', 'athletics'],
            keywords: ['championship', 'fixtures', 'tournaments'],
            response: "IGNITE 2026 features **8 championship sports tournaments**:\n\n" +
                      "• **Basketball**: 10–12 per squad · ₹1,300 (Indoor arena)\n" +
                      "• **Football**: Boys 11v11, Girls 7v7 · ₹1,300 (FIFA astro turf)\n" +
                      "• **Flag Football**: Mixed 7v7 + 2 subs · ₹800 (Gridiron)\n" +
                      "• **Volleyball**: Up to 12 per squad · ₹1,000 (Indoor complex)\n" +
                      "• **Badminton**: 2–6 per team · ₹700 (Synthetic courts)\n" +
                      "• **Table Tennis**: 3–5 per team · ₹600\n" +
                      "• **Tennis**: 3 per team · ₹600 (Hard courts)\n" +
                      "• **Shooting**: 10m Air Rifle & Pistol · ₹500 per shooter\n\n" +
                      "Register online and pay fees at the venue counter on Day 1!"
        },

        // --- 12 CULTURAL EVENTS (INDIVIDUAL DEDICATED CARDS) ---
        {
            name: 'battle of the bands',
            phrases: ['battle of the bands', 'botb', 'band event', 'rock band', 'live music'],
            primaryKeywords: ['battle of the bands', 'botb'],
            keywords: ['srisha suresh', 'mihir kulkarni', 'krithick satish', 'drums', 'amps', 'bands'],
            response: "**Battle of the Bands (Cultural)**\n" +
                      "🎸 **Category**: Performing Arts · Showcase Day 1, Finals Day 2\n" +
                      "👥 **Band Size**: 2 to 7 members (12–15 bands total, up to 2 bands per school).\n" +
                      "💰 **Fee**: ₹1,000 per band (Paid online).\n" +
                      "👤 **Event Heads**: Srisha Suresh, Mihir Kulkarni & Krithick Satish\n" +
                      "📋 **Details**:\n" +
                      "• Day 1 showcase round, Day 2 knockout-style head-to-head competition.\n" +
                      "• Bring your own guitars, effect pedals, and instruments. Full drum kit and piano provided."
        },
        {
            name: 'dyed in crimson',
            phrases: ['dyed in crimson', 'murder mystery', 'crime scene', 'detective event'],
            primaryKeywords: ['dyed in crimson', 'crimson'],
            keywords: ['eric leene', 'niyati kasu', 'charanjit harshvardhan', 'mystery', 'deduction', 'murder'],
            response: "**Dyed in Crimson (Cultural)**\n" +
                      "🩸 **Category**: Strategy and Logic · Both Days\n" +
                      "👥 **Team Size**: 1 to 3 participants (150–200 participants across ~80 teams).\n" +
                      "💰 **Fee**: ₹600 per team (Paid online).\n" +
                      "👤 **Event Heads**: Eric Leene, Niyati Kasu & Charanjit Harshvardhan\n" +
                      "📋 **Details**:\n" +
                      "• Large-scale 2-day murder mystery across the Greenwood High campus combining theatrical storytelling, puzzles, ciphers, scavenger elements, and live interrogation."
        },
        {
            name: 'wolf of wall street',
            phrases: ['wolf of wall street', 'wall street', 'stock market', 'trading event', 'sell me this pen'],
            primaryKeywords: ['wolf of wall street', 'trading', 'stocks'],
            keywords: ['sara partiban', 'manusri devineni', 'bidding', 'ipo', 'insider'],
            response: "**Wolf of Wall Street (Cultural)**\n" +
                      "📈 **Category**: Strategy and Logic · Both Days\n" +
                      "👥 **Team Size**: 3 to 5 members (up to 2 teams per school).\n" +
                      "💰 **Fee**: ₹800 per team (Paid online).\n" +
                      "👤 **Event Heads**: Sara Partiban & Manusri Devineni\n" +
                      "📋 **Details**:\n" +
                      "• 2-day live market simulation with Sell Me This Pen, Bidding Wars, Confidential Insider Information, market-shaking Breaking News, and a final IPO pitch.\n" +
                      "• Bring your laptops and prepare from the case studies sent beforehand."
        },
        {
            name: 'veritas',
            phrases: ['veritas', 'escape room', 'escape room event'],
            primaryKeywords: ['veritas', 'escape room'],
            keywords: ['riddhi kamani', 'ishita de', 'shreya mathur', 'clues', 'suspect'],
            response: "**Veritas (Cultural)**\n" +
                      "🔍 **Category**: Strategy and Logic · Days 1 & 2\n" +
                      "👥 **Team Size**: 3 to 6 participants (up to 2 teams per school).\n" +
                      "💰 **Fee**: ₹600 per team (Paid online).\n" +
                      "👤 **Event Heads**: Riddhi Kamani, Ishita De & Shreya Mathur\n" +
                      "📋 **Details**:\n" +
                      "• Immersive escape-room investigation under a strict 1-hour countdown.\n" +
                      "• Teams solve intricate puzzles and deduce suspect identity and motive. A distinct winner is crowned each day!"
        },
        {
            name: 'dress to impress',
            phrases: ['dress to impress', 'fashion show', 'fashion runway', 'fashion event'],
            primaryKeywords: ['dress to impress', 'dti'],
            keywords: ['sayesha dod', 'bhaavika vukku', 'ananya pandey', 'runway', 'couture', 'upcycled'],
            response: "**Dress to Impress (Cultural)**\n" +
                      "👗 **Category**: Visual Arts · Both Days\n" +
                      "👥 **Team Size**: 4 to 6 models/designers (up to 2 teams per school).\n" +
                      "💰 **Fee**: ₹1,000 per team (Paid online).\n" +
                      "👤 **Event Heads**: Sayesha Dod, Bhaavika Vukku & Ananya Pandey\n" +
                      "📋 **Details**:\n" +
                      "• 7-minute runway walk plus design concept presentation.\n" +
                      "• Round 1 (Reforged): Mythological houses featuring at least 40% upcycled materials.\n" +
                      "• Round 2 (Legacy, Reworn): Traditional Indian attire through historical eras.\n" +
                      "• Bring all garments, accessories, and styling gear from home."
        },
        {
            name: 'pitch perfect',
            phrases: ['pitch perfect', 'singing event', 'solo singing', 'vocals'],
            primaryKeywords: ['pitch perfect', 'singing', 'singer', 'vocal', 'vocals'],
            keywords: ['mahira karan', 'shivansi gudla', 'backing track', 'song', 'solo vocal'],
            response: "**Pitch Perfect (Cultural)**\n" +
                      "🎤 **Category**: Performing Arts · Day 1 Only\n" +
                      "👥 **Format**: Solo vocals (up to 3 singers per school).\n" +
                      "💰 **Fee**: ₹600 per participant (Paid online).\n" +
                      "👤 **Event Heads**: Mahira Karan & Shivansi Gudla\n" +
                      "📋 **Details**:\n" +
                      "• Two competitive rounds of live solo vocal performances.\n" +
                      "• Backing tracks must be submitted to ignite@greenwoodhigh.edu.in at least 1 week prior."
        },
        {
            name: 'respawn',
            phrases: ['respawn', 'gaming event', 'esports', 'minecraft', 'fifa', 'roblox'],
            primaryKeywords: ['respawn', 'esports', 'fifa', 'minecraft', 'roblox'],
            keywords: ['vivaan srivastava', 'arpit kumar', 'tabashmi bhattacharya', 'gaming'],
            response: "**Respawn (Cultural)**\n" +
                      "🎮 **Category**: Strategy and Logic · Both Days\n" +
                      "👥 **Format**: Solo (FIFA, Roblox) · Squad of 4 (Minecraft). 1 entry per game per school.\n" +
                      "💰 **Fee**: ₹600 per team/game (Paid online).\n" +
                      "👤 **Event Heads**: Vivaan Srivastava, Arpit Kumar & Tabashmi Bhattacharya\n" +
                      "📋 **Details**:\n" +
                      "• FIFA: Random club draws every knockout match.\n" +
                      "• Minecraft: 4-player squads through up to 5 intense mini-game challenges.\n" +
                      "• Roblox: Checkpoint time trials on Day 1; runway showcase on Day 2. Bring your own gaming laptops."
        },
        {
            name: 'radioshack',
            phrases: ['radioshack', 'radioshack games', 'arcade games', 'cup pong', 'bottle flip'],
            primaryKeywords: ['radioshack'],
            keywords: ['nimrit kaur', 'reina chatterjee', 'mini-games', 'walk-in', 'cup stack'],
            response: "**Radioshack Games (Cultural)**\n" +
                      "⚡ **Category**: Strategy and Logic · Drop in Both Days\n" +
                      "👥 **Format**: 1 to 5 players per team.\n" +
                      "💰 **Fee**: ₹600 per team (or included with general walk-in festival pass).\n" +
                      "👤 **Event Heads**: Nimrit Kaur & Reina Chatterjee\n" +
                      "📋 **Details**:\n" +
                      "• Drop in between events and play fast-paced arcade mini-games: Cup Pong, Cup Stack Race, and Trivia Bottle Flip!"
        },
        {
            name: 'kryptos visos',
            phrases: ['kryptos visos', 'face painting', 'body painting', 'face paint'],
            primaryKeywords: ['kryptos visos', 'face paint'],
            keywords: ['arohi tiwari', 'deeksha nalluri', 'painter', 'brushes', 'skin-safe'],
            response: "**Kryptos Visos (Cultural)**\n" +
                      "🎨 **Category**: Visual Arts · Both Days\n" +
                      "👥 **Team Size**: 2 participants (1 painter + 1 model, up to 2 teams per school).\n" +
                      "💰 **Fee**: ₹600 per team (Paid online).\n" +
                      "👤 **Event Heads**: Arohi Tiwari & Deeksha Nalluri\n" +
                      "📋 **Details**:\n" +
                      "• Day 1 theme announced in advance.\n" +
                      "• Day 2 finalists receive surprise individual themes 10 minutes before the painting timer starts.\n" +
                      "• Bring your own skin-safe paints and brushes."
        },
        {
            name: 'through the lens',
            phrases: ['through the lens', 'photography event', 'photo contest', 'photographer'],
            primaryKeywords: ['through the lens', 'photography', 'photographer'],
            keywords: ['siddharth venkatesh', 'anvitha bakshi', 'camera', 'dslr', 'mirrorless'],
            response: "**Through the Lens (Cultural)**\n" +
                      "📷 **Category**: Visual Arts · Both Days\n" +
                      "👥 **Format**: Solo photography (up to 3 photographers per school).\n" +
                      "💰 **Fee**: ₹600 per participant (Paid online).\n" +
                      "👤 **Event Heads**: Siddharth Venkatesh & Anvitha Bakshi\n" +
                      "📋 **Details**:\n" +
                      "• 3 rounds covering 3 distinct themes: raw human emotion, high-speed sports motion, and the rhythm of live music.\n" +
                      "• Bring your own DSLR or mirrorless camera (smartphone photography is strictly disqualified)."
        },
        {
            name: "director's cut",
            phrases: ["director's cut", 'directors cut', 'short film', 'drama event', 'film making'],
            primaryKeywords: ["director's cut", 'directors cut'],
            keywords: ['lavya sen', 'navaneeth sreenath', 'theater', 'acting', 'film'],
            response: "**Director's Cut (Cultural)**\n" +
                      "🎬 **Category**: Performing Arts · Both Days\n" +
                      "👥 **Team Size**: 4 to 5 members (1 team per school).\n" +
                      "💰 **Fee**: ₹600 per team (Paid online).\n" +
                      "👤 **Event Heads**: Lavya Sen & Navaneeth Sreenath\n" +
                      "📋 **Details**:\n" +
                      "• Day 1 live theatrical performance from creative brief + improvisation challenge.\n" +
                      "• Day 2 screening of an original 3–7 minute short film. Bring your own cameras and editing gear."
        },
        {
            name: 'insync',
            phrases: ['insync', 'dance event', 'group dance', 'dance competition', 'choreography'],
            primaryKeywords: ['insync', 'dance', 'dancer', 'choreography'],
            keywords: ['divija attaluri', 'akshata naveen', 'heats'],
            response: "**Insync (Cultural)**\n" +
                      "💃 **Category**: Performing Arts · Heats Day 1, Finals Day 2\n" +
                      "👥 **Team Size**: 1 to 9 dancers (up to 2 teams per school).\n" +
                      "💰 **Fee**: ₹800 per team (Paid online).\n" +
                      "👤 **Event Heads**: Divija Attaluri & Akshata Naveen\n" +
                      "📋 **Details**:\n" +
                      "• Premier dance showdown. Heats on Day 1, high-octane finals on Day 2.\n" +
                      "• Performance audio tracks must be submitted to ignite@greenwoodhigh.edu.in 1 week in advance."
        },
        {
            name: 'all cultural overview',
            phrases: [
                'all cultural', 'cultural list', 'list of cultural', 'what cultural',
                'cultural events', 'cultural overview', 'tell me about cultural'
            ],
            primaryKeywords: ['cultural'],
            keywords: ['performing arts', 'visual arts', 'strategy'],
            response: "IGNITE 2026 features **12 premier cultural competitions** across three categories:\n\n" +
                      "🎭 **Performing Arts**:\n• Battle of the Bands (₹1,000) · In Sync (₹800) · Pitch Perfect (₹600) · Director's Cut (₹600)\n\n" +
                      "🎨 **Visual Arts**:\n• Dress to Impress (₹1,000) · Kryptos Visos (₹600) · Through the Lens (₹600)\n\n" +
                      "🧠 **Strategy & Logic**:\n• Dyed in Crimson (₹600) · Wolf of Wall Street (₹800) · Veritas Escape Room (₹600) · Respawn Gaming (₹600) · Radioshack (₹600)\n\n" +
                      "All cultural registrations are submitted and paid online!"
        },

        // --- REGISTRATION & CAMPUS NOTICE ---
        {
            name: 'registrations',
            phrases: [
                'how to register', 'register', 'registration', 'sign up', 'internal forms',
                'internal form', 'bgt', 'sjp', 'icse campus', 'registration link'
            ],
            primaryKeywords: ['register', 'registration', 'registrations'],
            keywords: ['fee', 'payment', 'portal', 'deadline', 'dates'],
            response: "**Registrations for IGNITE 2026**\n" +
                      "📅 **Window**: Open 2 November – 12 November 2026 (Extended!).\n" +
                      "🔗 **Portal**: Head to the [Registrations page](registrations.html) to submit your school delegation.\n" +
                      "💳 **Payment Methods**:\n" +
                      "• **Cultural Events**: Registered and paid online via the portal.\n" +
                      "• **Sports Tournaments**: Registered online, payment made at the venue counter on Day 1.\n" +
                      "📌 **Notice**: Students from **Greenwood High BGT and SJP ICSE campuses** can register directly using their internal campus forms!"
        },

        // --- GENERAL FEES ---
        {
            name: 'fees overview',
            phrases: ['fee overview', 'all fees', 'how much does it cost', 'cost of events', 'pricing'],
            primaryKeywords: ['fee', 'fees', 'cost', 'price', 'pricing', 'payment'],
            keywords: ['pay', 'charges'],
            response: "**IGNITE 2026 Fee Structure**:\n\n" +
                      "🏆 **Sports Tournaments** (Pay at Counter):\n" +
                      "• Basketball & Football: ₹1,300 per team\n" +
                      "• Volleyball: ₹1,000 per team\n" +
                      "• Flag Football: ₹800 per team\n" +
                      "• Badminton: ₹700 per team\n" +
                      "• Table Tennis & Tennis: ₹600 per team\n" +
                      "• Shooting: ₹500 per shooter\n\n" +
                      "🎭 **Cultural Events** (Pay Online):\n" +
                      "• Battle of the Bands & Dress to Impress: ₹1,000 per team\n" +
                      "• In Sync & Wolf of Wall Street: ₹800 per team\n" +
                      "• All other cultural events: ₹600 per team/entry"
        },

        // --- LEADERSHIP & ORGANISING TEAM ---
        {
            name: 'organising team',
            phrases: [
                'organising team', 'organizing team', 'ignite heads', 'student heads',
                'who is organizing', 'leadership', 'teachers in charge', 'cultural heads', 'sports heads'
            ],
            primaryKeywords: ['heads', 'organisers', 'organizers', 'captains', 'prefects'],
            keywords: ['vikrant', 'aarya', 'anita', 'aarnavi', 'miraya', 'akanksha', 'anaahira', 'saheli', 'sowmya', 'suhani', 'koshika', 'hiba', 'rishabh', 'akshita', 'nivaan'],
            response: "**IGNITE 2026 Leadership Directorate**\n\n" +
                      "👑 **IGNITE Heads**:\n" +
                      "• Vikrant Shetty Tomar\n• Aarya Poddar\n• Anita Ganesh Bhat\n• Aarnavi Nagendran\n• Miraya Singh\n• Akanksha Ajith Karimpana\n• Anaahira Bansod\n\n" +
                      "👩‍🏫 **Teachers in Charge**:\n" +
                      "• Ms. Saheli Gupta · Ms. Sowmya S\n\n" +
                      "🎭 **Cultural Heads**: Suhani Singh & Koshika Goel\n" +
                      "🏆 **Sports Heads**: Hiba Gabriel, Rishabh Kamani, Akshita Rai, Nivaan Abraham"
        },

        // --- DATES & SCHEDULE ---
        {
            name: 'dates and schedule',
            phrases: [
                'when is ignite', 'dates of ignite', 'event dates', 'which day', 'what time', 'schedule matrix', 'timings', 'fixtures'
            ],
            primaryKeywords: ['schedule', 'dates', 'when', 'timings', 'fixtures'],
            keywords: ['november', 'friday', 'saturday', 'day 1', 'day 2', 'matrix', 'timing'],
            response: "IGNITE 2026 takes place on **Friday, 13 November & Saturday, 14 November 2026** at Greenwood High International School:\n\n" +
                      "• **Day 1 (Fri 13 Nov)**: Opening Ceremony at 08:30 AM (IB Amphitheatre), followed by sports & cultural heats/qualifiers from 09:30 AM onwards.\n" +
                      "• **Day 2 (Sat 14 Nov)**: Finals & championship ties from 08:30 AM onwards, culminating in the Grand Closing Ceremony at 02:45 PM.\n\n" +
                      "Visit the **[Schedule page](schedule.html)** to filter by Sports or Cultural and view exact venues & times for every event!"
        },
        {
            name: 'ceremonies',
            phrases: [
                'opening ceremony', 'closing ceremony', 'valedictory', 'inauguration', 'when does it start', 'when does it end', 'prize distribution'
            ],
            primaryKeywords: ['opening ceremony', 'closing ceremony', 'ceremony', 'valedictory', 'inauguration'],
            keywords: ['amphitheatre', 'ib amphitheatre', '8:30 am', '2:45 pm', 'awards', 'trophies', 'start time'],
            response: "**IGNITE 2026 Ceremonies**:\n\n" +
                      "🌟 **Opening Ceremony**: Friday, 13 Nov 2026 · 08:30 AM – 09:15 AM at the **IB Amphitheatre**.\n" +
                      "🏆 **Grand Closing & Valedictory**: Saturday, 14 Nov 2026 · 02:45 PM – 03:30 PM at the **IB Amphitheatre** (ICSE Old Auditorium as backup).\n\n" +
                      "Full chronological fixtures and venues are on the **[Schedule page](schedule.html)**!"
        },

        // --- GENERAL RULES & ENTRY ---
        {
            name: 'rules and conduct',
            phrases: [
                'fest rules', 'dress code', 'what to wear', 'uniform', 'id card', 'food rules', 'guidelines'
            ],
            primaryKeywords: ['rules', 'conduct', 'uniform', 'entry', 'wristband', 'food', 'medicine'],
            keywords: ['id', 'regulations', 'discipline', 'prohibited'],
            response: "**Key Rules & Code of Conduct for IGNITE 2026**:\n\n" +
                      "• **Uniform**: Wear your official school uniform (or official school PE sports kit for athletic events).\n" +
                      "• **ID Card**: Bring your valid 2026–27 school photo ID. Official wristbands must be worn at all times.\n" +
                      "• **Food & Drinks**: No outside food or beverages allowed. Campus food stalls operate on event food coupons.\n" +
                      "• **Medication**: Essential medicine must be declared by email to ignite@greenwoodhigh.edu.in beforehand.\n" +
                      "• **Strict Zero Tolerance**: Drugs, alcohol, vaping, or unsporting conduct will result in immediate disqualification and campus removal."
        },

        // --- MASCOT & CAUSE ---
        {
            name: 'mascot and charity',
            phrases: ['mascot', 'phoenix', 'charity', 'cause', 'girls education', 'fundraising'],
            primaryKeywords: ['mascot', 'phoenix', 'cause'],
            keywords: ['charity', 'symbol', 'purpose'],
            response: "The emblem of IGNITE 2026 is the **Phoenix**, symbolizing resilience, rebirth, and boundless fiery passion.\n\n" +
                      "IGNITE is Bangalore's largest student-driven festival, and proceeds go towards funding the **education and empowerment of underprivileged girls**."
        }
    ];

    function getScarlettReply(userQuery) {
        if (!userQuery) return "I'm Scarlett, your IGNITE 2026 assistant! Ask me about any event's rules, fees, schedule, or team sizes!";
        
        const raw = userQuery.toLowerCase().trim();
        const clean = raw.replace(/[?!.,;:()\[\]"']/g, ' ');

        let bestItem = null;
        let highestScore = 0;

        for (const item of scarlettKnowledge) {
            let score = 0;

            // 1. Exact phrase matches (highest confidence: 80 pts)
            if (item.phrases) {
                for (const phrase of item.phrases) {
                    if (raw.includes(phrase)) {
                        score += 80;
                        break;
                    }
                }
            }

            // 2. Primary keyword match (strong signal: 45 pts each)
            if (item.primaryKeywords) {
                for (const pk of item.primaryKeywords) {
                    const regex = new RegExp('\\b' + pk.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
                    if (regex.test(clean)) {
                        score += 45;
                    }
                }
            }

            // 3. Secondary keywords (supporting signal: 10 pts each)
            if (item.keywords) {
                for (const kw of item.keywords) {
                    if (clean.includes(kw)) {
                        score += 10;
                    }
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestItem = item;
            }
        }

        if (bestItem && highestScore >= 25) {
            return bestItem.response;
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

    // -------------------------------------------------------------------------
    // Creative Bottom-Left Live Notice: Extended Registrations
    // -------------------------------------------------------------------------
    function initBottomLeftNotice() {
        let noticeEl = document.getElementById('igniteLiveNotice');
        let reopenBtn = document.getElementById('igniteNoticeReopen');

        if (!noticeEl) {
            const wrap = document.createElement('div');
            wrap.innerHTML = `
                <div id="igniteLiveNotice" class="ignite-live-notice" role="region" aria-label="Registration Update">
                    <div class="live-notice-glow"></div>
                    <div class="live-notice-content">
                        <div class="live-notice-badge-row">
                            <span class="live-notice-pulse">
                                <span class="pulse-ring"></span>
                                <span class="pulse-core"></span>
                            </span>
                            <span class="live-notice-tag">UPDATE • EXTENDED</span>
                            <button id="liveNoticeClose" class="live-notice-close" aria-label="Dismiss notice">✕</button>
                        </div>
                        <div class="live-notice-body">
                            <div class="live-notice-icon">🔥</div>
                            <div class="live-notice-text">
                                <div class="live-notice-title">Registrations Extended!</div>
                                <div class="live-notice-desc">All Cultural &amp; Sports entries now open until <strong>12th November</strong>.</div>
                            </div>
                        </div>
                        <div class="live-notice-footer">
                            <a href="registrations.html" class="live-notice-btn" id="liveNoticeAction">
                                <span>Register Squad</span>
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </a>
                            <span class="live-notice-expiry">⏳ Nov 12 Deadline</span>
                        </div>
                    </div>
                </div>
                <button id="igniteNoticeReopen" class="ignite-notice-reopen" aria-label="Show Registration Notice" title="Registrations Extended to Nov 12">
                    <span class="pulse-ring"></span>
                    <span class="reopen-icon">🔥</span>
                    <span class="reopen-text">Extended to Nov 12</span>
                </button>
            `;
            while (wrap.firstElementChild) {
                document.body.appendChild(wrap.firstElementChild);
            }
            noticeEl = document.getElementById('igniteLiveNotice');
            reopenBtn = document.getElementById('igniteNoticeReopen');
        }

        const closeBtn = document.getElementById('liveNoticeClose');
        const actionBtn = document.getElementById('liveNoticeAction');

        // Check if user is currently on registrations.html
        const isRegPage = window.location.pathname.endsWith('registrations.html');
        if (isRegPage && actionBtn) {
            actionBtn.innerHTML = `<span>View Forms</span><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`;
            actionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector('.regs-section');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Interactive cursor torchlight glow on hover
        if (noticeEl) {
            const glowEl = noticeEl.querySelector('.live-notice-glow');
            noticeEl.addEventListener('mousemove', (e) => {
                if (!glowEl) return;
                const rect = noticeEl.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                glowEl.style.transform = `translate(${x - 65}px, ${y - 65}px)`;
            });
            noticeEl.addEventListener('mouseleave', () => {
                if (glowEl) {
                    glowEl.style.transform = '';
                }
            });
        }

        // Show notice with smooth spring after 1s delay
        const wasDismissed = sessionStorage.getItem('igniteNoticeDismissed') === '1';

        if (wasDismissed) {
            if (reopenBtn) reopenBtn.classList.add('is-visible');
        } else {
            setTimeout(() => {
                if (noticeEl && sessionStorage.getItem('igniteNoticeDismissed') !== '1') {
                    noticeEl.classList.add('is-visible');
                }
            }, 1000);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (noticeEl) noticeEl.classList.remove('is-visible');
                sessionStorage.setItem('igniteNoticeDismissed', '1');
                setTimeout(() => {
                    if (reopenBtn) reopenBtn.classList.add('is-visible');
                }, 350);
            });
        }

        if (reopenBtn) {
            reopenBtn.addEventListener('click', () => {
                reopenBtn.classList.remove('is-visible');
                sessionStorage.removeItem('igniteNoticeDismissed');
                setTimeout(() => {
                    if (noticeEl) noticeEl.classList.add('is-visible');
                }, 150);
            });
        }
    }

    initBottomLeftNotice();

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
        let isFirstFrame = true;
        function frame(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 0.5 - Math.cos(p * Math.PI) / 2;
            drawFire(mode, eased, now, Math.min((now - last) / 16.7, 3));
            if (isFirstFrame) {
                isFirstFrame = false;
                document.documentElement.classList.remove('fire-arriving');
            }
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
        let started = false;
        const beginReveal = () => {
            if (started) return;
            started = true;
            runFire('reveal', REVEAL_MS);
        };
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            requestAnimationFrame(beginReveal);
        } else {
            window.addEventListener('DOMContentLoaded', beginReveal);
            window.addEventListener('load', beginReveal);
            setTimeout(beginReveal, 300);
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

            const isExternal = (hrefAttribute.startsWith('http://') || hrefAttribute.startsWith('https://')) && link.origin !== window.location.origin;
            if (
                e.defaultPrevented ||
                e.ctrlKey || e.metaKey || e.shiftKey || e.altKey ||
                link.getAttribute('target') === '_blank' || 
                link.hasAttribute('download') ||
                hrefAttribute.startsWith('mailto:') || 
                hrefAttribute.startsWith('tel:') ||
                hrefAttribute.startsWith('javascript:') ||
                hrefAttribute.startsWith('#') ||
                isExternal ||
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
