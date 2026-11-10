/**
 * ====================================================================
 * PORTFOLIO JAVASCRIPT - K VIJAYA DHARSHINI
 * Clean Vanilla JS (No External Dependencies Needed)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------
    // 1. DYNAMIC COPYRIGHT YEAR
    // ----------------------------------------------------------------
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ----------------------------------------------------------------
    // 2. MOBILE NAVBAR TOGGLE & ACCESSIBILITY
    // ----------------------------------------------------------------
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navMenu) {
        const toggleMenu = (open) => {
            const isOpen = typeof open === "boolean" ? open : !navMenu.classList.contains("open");
            navMenu.classList.toggle("open", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        };

        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close when a nav link is clicked
        navLinks.forEach((link) => {
            link.addEventListener("click", () => toggleMenu(false));
        });

        // Close on click outside
        document.addEventListener("click", (e) => {
            if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close on ESC key press
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navMenu.classList.contains("open")) {
                toggleMenu(false);
            }
        });
    }

    // ----------------------------------------------------------------
    // 3. NAVBAR GLASS BLUR EFFECT ON SCROLL
    // ----------------------------------------------------------------
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.style.background = "rgba(9, 13, 22, 0.95)";
            navbar.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.4)";
        } else {
            navbar.style.background = "rgba(9, 13, 22, 0.85)";
            navbar.style.boxShadow = "none";
        }
    }, { passive: true });

    // ----------------------------------------------------------------
    // 4. ACTIVE LINK HIGHLIGHTER ON SCROLL (IntersectionObserver)
    // ----------------------------------------------------------------
    const sections = document.querySelectorAll("section[id]");

    const observerOptions = {
        root: null,
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    const href = link.getAttribute("href");
                    if (href === `#${activeId}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    // ----------------------------------------------------------------
    // 5. ANIMATED NUMBER COUNTERS (Hero Stats)
    // ----------------------------------------------------------------
    const statCards = document.querySelectorAll(".stat-num");
    let hasCounted = false;

    const animateCounters = () => {
        statCards.forEach((stat) => {
            const originalText = stat.textContent.trim();
            // Check for float (like 8.04) or integer with suffix (like 04+, 07+)
            const isFloat = originalText.includes(".");
            const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, ""));
            const suffix = originalText.replace(/[0-9.]/g, "");

            if (isNaN(numericValue)) return;

            let current = 0;
            const duration = 1400; // ms
            const steps = 40;
            const stepTime = duration / steps;
            const increment = numericValue / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    stat.textContent = (isFloat ? numericValue.toFixed(2) : String(Math.round(numericValue)).padStart(2, "0")) + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = (isFloat ? current.toFixed(2) : String(Math.round(current)).padStart(2, "0")) + suffix;
                }
            }, stepTime);
        });
    };

    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                animateCounters();
                heroObserver.disconnect();
            }
        }, { threshold: 0.3 });

        heroObserver.observe(heroSection);
    } else {
        animateCounters();
    }

    // ----------------------------------------------------------------
    // 6. CERTIFICATE & INTERNSHIP IMAGE LIGHTBOX / MODAL VIEWER
    // ----------------------------------------------------------------
    // Create lightbox DOM elements dynamically
    const lightbox = document.createElement("div");
    lightbox.id = "imgLightbox";
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close Preview">&times;</button>
            <img class="lightbox-img" src="" alt="Certificate Preview">
            <p class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Apply Lightbox Styles dynamically
    const lightboxStyle = document.createElement("style");
    lightboxStyle.textContent = `
        #imgLightbox {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        #imgLightbox.active {
            display: flex;
        }
        .lightbox-overlay {
            position: absolute;
            inset: 0;
            background: rgba(4, 7, 14, 0.88);
            backdrop-filter: blur(10px);
        }
        .lightbox-content {
            position: relative;
            z-index: 2;
            max-width: 900px;
            width: 100%;
            background: #0f172a;
            border: 1px solid rgba(56, 189, 248, 0.3);
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: zoomIn 0.25s ease-out;
        }
        .lightbox-close {
            position: absolute;
            top: 10px;
            right: 14px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #fff;
            font-size: 28px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: grid;
            place-items: center;
            transition: 0.2s;
            z-index: 3;
        }
        .lightbox-close:hover {
            background: #ef4444;
        }
        .lightbox-img {
            width: 100%;
            max-height: 75vh;
            object-fit: contain;
            background: #ffffff;
            display: block;
        }
        .lightbox-caption {
            padding: 12px 18px;
            color: #e2e8f0;
            font-size: 13.5px;
            text-align: center;
            width: 100%;
            background: #090d16;
            margin: 0;
        }
        @keyframes zoomIn {
            from { transform: scale(0.92); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(lightboxStyle);

    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const lightboxClose = lightbox.querySelector(".lightbox-close");
    const lightboxOverlay = lightbox.querySelector(".lightbox-overlay");

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    const openLightbox = (src, caption) => {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || "Certificate Preview";
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxOverlay.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });

    // Attach click listeners to all certificate & internship images/cards
    const previewTargets = document.querySelectorAll(".cert-media img, .credential-preview img");
    previewTargets.forEach((img) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
            const title = img.closest(".card")?.querySelector("h3, h4")?.textContent || img.alt;
            openLightbox(img.src, title);
        });
    });

    // ----------------------------------------------------------------
    // 7. TOAST NOTIFICATION & COPY EMAIL HELPER
    // ----------------------------------------------------------------
    const showToast = (message) => {
        let toast = document.getElementById("portfolioToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "portfolioToast";
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(30px);
                background: #0ea5e9;
                color: #ffffff;
                padding: 10px 22px;
                border-radius: 30px;
                font-size: 13px;
                font-weight: 600;
                box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4);
                z-index: 10000;
                opacity: 0;
                transition: transform 0.25s ease, opacity 0.25s ease;
                pointer-events: none;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(30px)";
        }, 2500);
    };

    const emailValue = document.querySelector(".detail-val[href^='mailto']");
    if (emailValue) {
        emailValue.title = "Click to copy email address";
        emailValue.addEventListener("click", (e) => {
            const email = emailValue.textContent.trim();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast("Email address copied to clipboard! 📋");
                }).catch(() => {});
            }
        });
    }

    // ----------------------------------------------------------------
    // 8. SECTION STEPPER BUTTONS (If #prevBtn / #nextBtn exist)
    // ----------------------------------------------------------------
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const sectionCounter = document.getElementById("sectionCounter");
    const allSections = Array.from(document.querySelectorAll("section"));

    if (prevBtn || nextBtn || sectionCounter) {
        let activeIdx = 0;

        const updateStepper = () => {
            if (sectionCounter && allSections.length > 0) {
                sectionCounter.textContent =
                    String(activeIdx + 1).padStart(2, "0") + " / " + String(allSections.length).padStart(2, "0");
            }
            if (prevBtn) prevBtn.disabled = activeIdx === 0;
            if (nextBtn) nextBtn.disabled = activeIdx === allSections.length - 1;
        };

        const scrollToSectionIdx = (idx) => {
            activeIdx = Math.max(0, Math.min(idx, allSections.length - 1));
            allSections[activeIdx].scrollIntoView({ behavior: "smooth", block: "start" });
            updateStepper();
        };

        if (prevBtn) prevBtn.addEventListener("click", () => scrollToSectionIdx(activeIdx - 1));
        if (nextBtn) nextBtn.addEventListener("click", () => scrollToSectionIdx(activeIdx + 1));

        window.addEventListener("scroll", () => {
            const scrollPos = window.scrollY + window.innerHeight * 0.35;
            allSections.forEach((sec, i) => {
                if (sec.offsetTop <= scrollPos) activeIdx = i;
            });
            updateStepper();
        }, { passive: true });

        updateStepper();
    }
});