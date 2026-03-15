/**

 * headerFixed
 * tabSlide
 * settings_color
 * switchMode
 * switchLanguage
 * oneNavOnePage
 * handleEffectSpotlight
 * preventDefault
 * spliting
 * handleSidebar
 
**/

(function($) {
    ("use strict");

    const hasIntroSequence = () => Boolean(document.querySelector(".counter-scroll"));

    const setIntroLockState = (isLocked) => {
        if (!document.body || !hasIntroSequence()) return;

        document.documentElement.classList.toggle("intro-locked", isLocked);
        document.body.classList.toggle("intro-locked", isLocked);

        if (isLocked) {
            window.scrollTo(0, 0);
        }
    };

    if (document.body && hasIntroSequence()) {
        document.body.dataset.counterIntroReady = "false";
        setIntroLockState(true);
    }

    const forceBackToHomeOnReload = () => {
        if (!document.querySelector(".section-onepage")) return;

        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        const navEntries =
            typeof performance.getEntriesByType === "function" ?
            performance.getEntriesByType("navigation") : [];
        const navType = navEntries.length ? navEntries[0].type : "";
        const legacyNavType =
            performance.navigation &&
            typeof performance.navigation.type === "number" ?
            performance.navigation.type :
            -1;
        const isReloadNavigation =
            navType === "reload" || legacyNavType === 1;

        const resetToHome = () => {
            window.scrollTo(0, 0);

            if (window.location.hash) {
                window.history.replaceState(
                    null,
                    document.title,
                    window.location.pathname + window.location.search
                );
            }
        };

        const forceTopRepeatedly = () => {
            let frameCount = 0;
            const maxFrames = 24;

            const tick = () => {
                resetToHome();
                frameCount += 1;
                if (frameCount < maxFrames) {
                    window.requestAnimationFrame(tick);
                }
            };

            tick();
            window.setTimeout(resetToHome, 120);
            window.setTimeout(resetToHome, 320);
            window.setTimeout(resetToHome, 650);
        };

        window.addEventListener("beforeunload", function() {
            window.scrollTo(0, 0);
        });

        window.addEventListener("load", function() {
            if (isReloadNavigation) {
                forceTopRepeatedly();
            } else {
                resetToHome();
            }
        });
        window.addEventListener("pageshow", function(event) {
            if (event.persisted) {
                forceTopRepeatedly();
            }
        });

        if (isReloadNavigation) {
            forceTopRepeatedly();
        } else {
            resetToHome();
        }
    };

    /* headerFixed
  -------------------------------------------------------------------------*/
    const headerFixed = () => {
        const header = document.querySelector(".header-fixed");
        if (!header) return;
        let isFixed = false;
        const scrollThreshold = 350;
        const handleScroll = () => {
            const shouldBeFixed = window.scrollY >= scrollThreshold;
            if (shouldBeFixed !== isFixed) {
                header.classList.toggle("is-fixed", shouldBeFixed);
                isFixed = shouldBeFixed;
            }
        };
        window.addEventListener("scroll", handleScroll, {
            passive: true
        });
        handleScroll();
    };

    const handleSkillsMarqueeReveal = () => {
        const marquee = document.querySelector(".skills-marquee--scroll");
        if (!marquee) return;

        let isVisible = false;
        let observer = null;

        const revealOnce = () => {
            if (isVisible) return;
            marquee.classList.add("is-visible");
            if (document.body) {
                document.body.classList.add("has-skills-marquee");
            }
            isVisible = true;
            cleanup();
        };
        const onScrollReveal = () => {
            if (isVisible) return;
            const rect = marquee.getBoundingClientRect();
            const viewportHeight =
                window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < viewportHeight && rect.bottom > 0) {
                revealOnce();
            }
        };
        const cleanup = () => {
            window.removeEventListener("scroll", onScrollReveal);
            window.removeEventListener("resize", onScrollReveal);
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        };

        marquee.classList.remove("is-visible");
        marquee.style.marginTop = "";
        if (document.body) {
            document.body.classList.remove("has-skills-marquee");
        }

        if ("IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            revealOnce();
                        }
                    });
                }, {
                    root: null,
                    threshold: 0.12,
                }
            );
            observer.observe(marquee);
        } else {
            window.addEventListener("scroll", onScrollReveal, {
                passive: true
            });
            window.addEventListener("resize", onScrollReveal);
            onScrollReveal();
        }
    };

    const handlePartnerMarqueeReveal = () => {
        const marquee = document.querySelector("#partners .partner-marquee");
        if (!marquee) return;

        marquee.classList.add("partner-marquee-reveal");

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            marquee.classList.add("is-visible");
            return;
        }

        let isVisible = false;
        let observer = null;

        const revealOnce = () => {
            if (isVisible) return;
            marquee.classList.add("is-visible");
            isVisible = true;
            cleanup();
        };

        const onScrollReveal = () => {
            if (isVisible) return;
            const rect = marquee.getBoundingClientRect();
            const viewportHeight =
                window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) {
                revealOnce();
            }
        };

        const cleanup = () => {
            window.removeEventListener("scroll", onScrollReveal);
            window.removeEventListener("resize", onScrollReveal);
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        };

        if ("IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            revealOnce();
                        }
                    });
                }, {
                    root: null,
                    threshold: 0.15,
                }
            );
            observer.observe(marquee);
        } else {
            window.addEventListener("scroll", onScrollReveal, {
                passive: true
            });
            window.addEventListener("resize", onScrollReveal);
            onScrollReveal();
        }
    };

    const initSkillsMarqueeTooltips = () => {
        const marquee = document.querySelector(".skills-marquee");
        if (!marquee) return;

        const labelMap = {
            "tool-1": "Adobe Premiere Pro",
            "tool-2": "Adobe After Effects",
            "tool-3": "Adobe Illustrator",
            "tool-4": "Adobe Photoshop",
            "tool-5": "Blender",
            "tool-6": "CapCut",
            "tool-7": "Visual Studio Code",
            "tool-8": "GitHub",
        };

        let tooltip = document.querySelector(".skill-tooltip");
        if (!tooltip) {
            tooltip = document.createElement("div");
            tooltip.className = "skill-tooltip";
            document.body.appendChild(tooltip);
        }

        let activeTarget = null;
        let rafId = null;

        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const positionTooltip = () => {
            if (!activeTarget) return;
            const rect = activeTarget.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const x = rect.left + rect.width / 2 - tooltipRect.width / 2;
            const y = rect.top - tooltipRect.height - 10;

            const maxX = window.innerWidth - tooltipRect.width - 8;
            const maxY = window.innerHeight - tooltipRect.height - 8;
            const safeX = clamp(x, 8, Math.max(8, maxX));
            const safeY = clamp(y, 8, Math.max(8, maxY));

            tooltip.style.left = `${safeX}px`;
            tooltip.style.top = `${safeY}px`;
            rafId = window.requestAnimationFrame(positionTooltip);
        };

        const showTooltip = (label, target) => {
            if (!label) return;
            tooltip.textContent = label;
            tooltip.classList.add("is-visible");
            activeTarget = target;
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
            rafId = window.requestAnimationFrame(positionTooltip);
        };

        const hideTooltip = () => {
            tooltip.classList.remove("is-visible");
            activeTarget = null;
            if (rafId) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        marquee.querySelectorAll("img").forEach((img) => {
            if (img.closest(".skill-logo")) return;

            const isHiddenGroup = Boolean(img.closest('[aria-hidden="true"]'));

            const src = img.getAttribute("src") || "";
            const match = src.match(/tool-\d+/);
            const key = match ? match[0] : "";
            const label =
                img.getAttribute("data-label") ||
                img.getAttribute("alt") ||
                (key && labelMap[key]) ||
                "";

            if (!label) return;

            if (!img.getAttribute("alt")) {
                img.setAttribute("alt", label);
            }
            img.setAttribute("aria-label", label);
            img.setAttribute("title", label);

            const wrapper = document.createElement("span");
            wrapper.className = "skill-logo";
            wrapper.setAttribute("data-label", label);
            wrapper.setAttribute("role", "img");
            wrapper.setAttribute("aria-label", label);
            if (!isHiddenGroup) {
                wrapper.setAttribute("tabindex", "0");
            }

            const parent = img.parentNode;
            if (!parent) return;
            parent.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            wrapper.addEventListener("pointerenter", () => {
                showTooltip(label, wrapper);
            });
            wrapper.addEventListener("pointerleave", hideTooltip);
            if (!isHiddenGroup) {
                wrapper.addEventListener("focus", () => {
                    showTooltip(label, wrapper);
                });
                wrapper.addEventListener("blur", hideTooltip);
            }
        });
    };

    const initAboutIntroCharHover = () => {
        const intro = document.querySelector(".about-intro");
        if (!intro) return;

        const buildWords = (text) => {
            const frag = document.createDocumentFragment();
            text.split(/(\s+)/).forEach((token) => {
                if (!token) return;
                if (/\s+/.test(token)) {
                    frag.appendChild(document.createTextNode(token));
                    return;
                }
                const span = document.createElement("span");
                span.className = "word";
                span.textContent = token;
                frag.appendChild(span);
            });
            return frag;
        };

        const ensureWordWrap = () => {
            if (intro.querySelector(".word")) return;
            const hasChar = intro.querySelector(".char");
            if (hasChar) {
                const text = intro.textContent || "";
                intro.innerHTML = "";
                intro.appendChild(buildWords(text));
                return;
            }

            const walker = document.createTreeWalker(
                intro,
                NodeFilter.SHOW_TEXT, {
                    acceptNode: (node) => {
                        if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
                        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                        if (
                            node.parentElement &&
                            node.parentElement.classList.contains("word")
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    },
                }
            );

            const textNodes = [];
            while (walker.nextNode()) {
                textNodes.push(walker.currentNode);
            }

            textNodes.forEach((node) => {
                const frag = buildWords(node.nodeValue || "");
                node.parentNode.replaceChild(frag, node);
            });
        };

        ensureWordWrap();

        if (intro.dataset.wordHoverBound === "true") return;
        intro.dataset.wordHoverBound = "true";

        let lastWord = null;
        const getWord = (target) => {
            if (!target) return null;
            if (target.classList && target.classList.contains("word")) return target;
            if (target.closest) return target.closest(".word");
            return null;
        };

        const bounceWord = (wordEl) => {
            if (!wordEl || typeof window.gsap === "undefined") return;
            window.gsap.killTweensOf(wordEl);
            window.gsap.fromTo(
                wordEl, {
                    y: 0,
                }, {
                    y: -12,
                    duration: 0.22,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out",
                    overwrite: "auto",
                }
            );
        };

        const triggerBounce = (target) => {
            const wordEl = getWord(target);
            if (!wordEl || wordEl === lastWord) return;
            lastWord = wordEl;
            bounceWord(wordEl);
        };

        const triggerBounceFromPoint = (x, y) => {
            const el = document.elementFromPoint(x, y);
            if (!el) return;
            triggerBounce(el);
        };

        intro.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;
            triggerBounce(event.target);
        });

        intro.addEventListener("pointerdown", (event) => {
            triggerBounce(event.target);
        });

        intro.addEventListener(
            "touchstart",
            (event) => {
                const touch = event.touches && event.touches[0];
                if (!touch) return;
                triggerBounceFromPoint(touch.clientX, touch.clientY);
            }, {
                passive: true,
            }
        );

        intro.addEventListener(
            "touchmove",
            (event) => {
                const touch = event.touches && event.touches[0];
                if (!touch) return;
                triggerBounceFromPoint(touch.clientX, touch.clientY);
            }, {
                passive: true,
            }
        );

        intro.addEventListener("pointerleave", () => {
            lastWord = null;
        });

        intro.addEventListener("touchend", () => {
            lastWord = null;
        });

        intro.addEventListener("touchcancel", () => {
            lastWord = null;
        });
    };

    window.initAboutIntroCharHover = initAboutIntroCharHover;

    const handleResumeReveal = () => {
        const resumeSection = document.querySelector("#resume");
        if (!resumeSection) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        resumeSection.classList.add("resume-fade");

        if (prefersReducedMotion) {
            resumeSection.classList.add("is-visible");
            return;
        }

        let revealed = false;
        let observer = null;

        const revealOnce = () => {
            if (revealed) return;
            resumeSection.classList.add("is-visible");
            revealed = true;
            cleanup();
        };

        const onScrollReveal = () => {
            if (revealed) return;
            const rect = resumeSection.getBoundingClientRect();
            const viewportHeight =
                window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) {
                revealOnce();
            }
        };

        const cleanup = () => {
            window.removeEventListener("scroll", onScrollReveal);
            window.removeEventListener("resize", onScrollReveal);
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        };

        if ("IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            revealOnce();
                        }
                    });
                }, {
                    root: null,
                    threshold: 0.2,
                }
            );
            observer.observe(resumeSection);
        } else {
            window.addEventListener("scroll", onScrollReveal, {
                passive: true
            });
            window.addEventListener("resize", onScrollReveal);
            onScrollReveal();
        }
    };

    const handleContactReveal = () => {
        const contactSection = document.querySelector("#contact");
        if (!contactSection) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        contactSection.classList.add("contact-fade");

        if (prefersReducedMotion) {
            contactSection.classList.add("is-visible");
            return;
        }

        let revealed = false;
        let observer = null;

        const revealOnce = () => {
            if (revealed) return;
            contactSection.classList.add("is-visible");
            revealed = true;
            cleanup();
        };

        const onScrollReveal = () => {
            if (revealed) return;
            const rect = contactSection.getBoundingClientRect();
            const viewportHeight =
                window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) {
                revealOnce();
            }
        };

        const cleanup = () => {
            window.removeEventListener("scroll", onScrollReveal);
            window.removeEventListener("resize", onScrollReveal);
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        };

        if ("IntersectionObserver" in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            revealOnce();
                        }
                    });
                }, {
                    root: null,
                    threshold: 0.2,
                }
            );
            observer.observe(contactSection);
        } else {
            window.addEventListener("scroll", onScrollReveal, {
                passive: true
            });
            window.addEventListener("resize", onScrollReveal);
            onScrollReveal();
        }
    };

    const handlePricingReveal = () => {
        const pricingSection = document.querySelector("#pricing");
        if (!pricingSection) return;

        const items = Array.from(
            pricingSection.querySelectorAll(".pricing-item")
        );
        if (!items.length) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        items.forEach((item) => item.classList.add("pricing-reveal-ready"));

        if (prefersReducedMotion) {
            items.forEach((item) => item.classList.add("is-revealed"));
            return;
        }

        const revealItem = (item) => {
            if (item.classList.contains("is-revealed")) return;
            item.classList.add("is-revealed");
        };

        const revealVisible = () => {
            items.forEach((item) => {
                if (item.classList.contains("is-revealed")) return;
                if (!item.offsetParent) return;
                const rect = item.getBoundingClientRect();
                const viewportHeight =
                    window.innerHeight || document.documentElement.clientHeight;
                if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) {
                    revealItem(item);
                }
            });
        };

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        revealItem(entry.target);
                        obs.unobserve(entry.target);
                    });
                }, {
                    root: null,
                    threshold: 0.2,
                }
            );
            items.forEach((item) => observer.observe(item));
        } else {
            const onScroll = () => {
                revealVisible();
            };
            window.addEventListener("scroll", onScroll, {
                passive: true
            });
            window.addEventListener("resize", onScroll);
            onScroll();
        }

        revealVisible();

        $(document).on(
            "shown.bs.tab",
            '#pricing [data-bs-toggle="tab"]',
            function() {
                requestAnimationFrame(revealVisible);
            }
        );
    };

    const syncUserBarCenter = () => {
        const mainContent = document.querySelector(".main-content.style-fullwidth");
        const aboutSection = document.querySelector("#about");
        const userBar = document.querySelector(".user-bar");
        if (!mainContent || !aboutSection || !userBar) return;

        const updateCenterLine = () => {
            const isDesktop = window.matchMedia("(min-width: 1150px)").matches;
            const aboutRect = aboutSection.getBoundingClientRect();
            if (!aboutRect.height) return;
            if (!isDesktop) {
                userBar.style.top = "";
                return;
            }
            const centerLine = aboutRect.top + aboutRect.height / 2;
            mainContent.style.setProperty("--about-center-line", `${centerLine}px`);
            userBar.style.top = `${centerLine}px`;
        };

        let frameCount = 0;
        const settle = () => {
            updateCenterLine();
            frameCount += 1;
            if (frameCount < 6) {
                requestAnimationFrame(settle);
            }
        };
        requestAnimationFrame(settle);
        window.addEventListener("resize", updateCenterLine);
        window.addEventListener("load", updateCenterLine);

        if ("ResizeObserver" in window) {
            const observer = new ResizeObserver(() => {
                updateCenterLine();
            });
            observer.observe(aboutSection);
        }
    };

    const handleAboutOnlyAtTop = () => {
        if (!document.body) return;

        const update = () => {
            const atTop = window.scrollY <= 0;
            const hash = window.location.hash || "";
            const isAboutHash = hash === "" || hash === "#about";
            document.body.classList.toggle("about-only", atTop && isAboutHash);
        };

        update();
        window.addEventListener("scroll", update, {
            passive: true
        });
        window.addEventListener("load", update);
        window.addEventListener("hashchange", update);
    };

    /* Tab Slide 
  ------------------------------------------------------------------------------------- */
    var tabSlide = function() {
        if ($(".tab-slide").length > 0) {
            function updateTabSlide() {
                var $activeTab = $(".tab-slide li.active");
                if ($activeTab.length > 0) {
                    var $width = $activeTab.width();
                    var $left = $activeTab.position().left;
                    var sideEffect = $activeTab
                        .parent()
                        .find(".item-slide-effect");
                    $(sideEffect).css({
                        width: $width,
                        transform: "translateX(" + $left + "px)",
                    });
                }
            }
            $(".tab-slide li").on("click", function() {
                var itemTab = $(this).parent().find("li");
                $(itemTab).removeClass("active");
                $(this).addClass("active");

                var $width = $(this).width();
                var $left = $(this).position().left;
                var sideEffect = $(this).parent().find(".item-slide-effect");
                $(sideEffect).css({
                    width: $width,
                    transform: "translateX(" + $left + "px)",
                });
            });

            $(window).on("resize", function() {
                updateTabSlide();
            });

            updateTabSlide();
        }
    };

    /* settings_color
  ------------------------------------------------------------------------------------- */
    const settings_color = () => {
        if (!$(".settings-color").length) return;

        const COLOR_KEY = "selectedColorIndex";

        const savedIndex = localStorage.getItem(COLOR_KEY);

        if (savedIndex !== null) {
            setColor(savedIndex);
            setActiveItem(savedIndex - 1);
        }

        $(".choose-item").on("click", function() {
            const index = $(this).index();
            setColor(index + 1);
            setActiveItem(index);
            localStorage.setItem(COLOR_KEY, index + 1);
        });

        function setColor(index) {
            $("body").attr("data-color-primary", "color-primary-" + index);
        }

        function setActiveItem(index) {
            $(".choose-item")
                .removeClass("active")
                .eq(index)
                .addClass("active");
        }
    };

    /* switchMode
  ------------------------------------------------------------------------------------- */
    const switchMode = () => {
        const $toggles = $(".toggle-switch-mode");
        const $body = $("body");
        const $logoHeader = $(".main-logo");
        const $logoMobile = $("#logo_header_mobile");
        const tflight = $logoHeader.data("light");
        const tfdark = $logoHeader.data("dark");

        if (!$toggles.length) return;

        const applyLogo = (isDark) => {
            const src = isDark ? tfdark : tflight;
            $logoHeader.attr("src", src);
            $logoMobile.attr("src", src);
        };

        const updateToggles = (isDark) => {
            $toggles.each(function() {
                $(this).toggleClass("active", isDark);
            });
        };

        const savedMode = localStorage.getItem("darkMode");
        const defaultMode = $body.data("default-mode") || "light";
        const isDarkInitially = savedMode ?
            savedMode === "enabled" :
            defaultMode === "dark";

        $body.toggleClass("dark-mode", isDarkInitially);
        updateToggles(isDarkInitially);
        applyLogo(isDarkInitially);

        $toggles.on("click", function() {
            const isDark = !$body.hasClass("dark-mode");

            $body.toggleClass("dark-mode", isDark);
            updateToggles(isDark);
            applyLogo(isDark);
            localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
        });
    };

    /* switchLanguage
  ------------------------------------------------------------------------------------- */
    const switchLanguage = () => {
        const $toggle = $(".lang-switch-mode");
        if (!$toggle.length) return;

        const LANG_KEY = "siteLanguage";
        const lockedTerms = {
            profileRole: "Multimedia Design",
            aboutTitle: "Designing Visual Experiences",
            hireMe: "Contact Me",
        };
        const translations = {
            en: {
                "menu.demos": "Demos",
                "menu.home_default": "Home Default",
                "menu.about": "About",
                "menu.resume": "Resume",
                "menu.services": "Services",
                "menu.portfolio": "Portfolio",
                "menu.pricing": "Pricing",
                "menu.contact": "Contact",
                "cta.hire_me": "Contact Me",
                "contact.quick": "Quick Contact",
                "about.intro_prefix": "Hello! I'm",
                "about.role_word_1": "Multimedia Design",
                "about.role_word_2": "UI/UX Developer",
                "about.title": "Designing Visual Experiences",
            },
            vi: {
                "menu.demos": "Mẫu",
                "menu.home_default": "Trang chủ mặc định",
                "menu.about": "Giới thiệu",
                "menu.resume": "Hồ sơ",
                "menu.services": "Dịch vụ",
                "menu.portfolio": "Dự án",
                "menu.pricing": "Bảng giá",
                "menu.contact": "Liên hệ",
                "cta.hire_me": "Thuê tôi",
                "contact.quick": "Liên hệ nhanh",
                "about.intro_prefix": "Xin chào! Tôi là",
                "about.role_word_1": "Thiết kế Đa phương tiện",
                "about.role_word_2": "Nhà phát triển UI/UX",
                "about.title": "Thiết kế trải nghiệm thị giác",
            },
        };

        const pageContent = {
            en: {
                pageTitle: "Truong The Nhat",
                profileRole: "Multimedia Design",
                aboutTag: "About",
                aboutIntroPrefix: "Hello! I'm",
                aboutRoleWords: ["Multimedia Design", "UI/UX Developer"],
                aboutTitle: "Designing Visual Experiences",
                aboutDescription: "Hello! I'm Truong The Nhat, a Multimedia Designer with 3+ years of experience in video editing, motion graphics, and digital design, creating impactful visual content for brands and digital platforms.",
                aboutCounters: [
                    "Year in Creative Media",
                    "Creative Projects",
                    "Clients & Collaborations",
                ],
                resumeTag: "Resume",
                resumeHeading: "Education & Experience",
                resumeRoles: [
                    "Multimedia Designer",
                    "Visual Designer & Motion Graphics Artist",
                    "Junior Graphic Designer",
                    "B.Sc. in Information Technology",
                    "Designer | UI/UX Developer",
                ],
                resumeDates: [
                    "2025 - Present",
                    "2024 - 2025",
                    "2023 - 2024",
                    "2020 - 2024",
                    "2020 - Present",
                ],
                servicesTag: "Services",
                servicesHeading: "Multimedia Design Services",
                serviceTitles: [
                    "Video Editing & Post-Production",
                    "Motion Graphics & Animation",
                    "Graphic & Visual Design",
                    "Creative Media Production",
                ],
                serviceDescriptions: [
                    "Professional editing for commercials, social media content, brand videos, and storytelling visuals.",
                    "Creating dynamic motion graphics, animated titles, and visual effects to enhance digital content.",
                    "Designing eye-catching posters, social media graphics, branding materials, and marketing visuals.",
                    "Producing engaging multimedia content that helps brands communicate effectively across digital platforms.",
                ],
                portfolioTag: "Portfolio",
                portfolioHeading: "Featured Projects",
                portfolioTags: [
                    "Animated Social Media Ads",
                    "Promotion Video",
                    "Marketing Poster Series",
                    "Brand Identity & Visual Kit",
                ],
                portfolioCategories: [
                    "MOTION GRAPHICS",
                    "VIDEO EDITING",
                    "BRANDING DESIGN",
                    "GRAPHIC DESIGN",
                ],
                testimonialTag: "Testimonials",
                testimonialHeading: "Trusted By Clients",
                testimonialQuotes: [
                    "\"Working with Truong The Nhat was a great experience. The video editing and visual design were professional, engaging, and perfectly matched our brand identity.\"",
                    "\"Truong The Nhat brought fresh creative ideas to our project. The visuals and video editing were modern, engaging, and perfectly suited for our marketing campaign.\"",
                    "\"The final result exceeded our expectations. From graphic design to video editing, everything was delivered with great quality and attention to detail.\"",
                ],
                testimonialRoles: [
                    "Project Manager",
                    "Brand Manager",
                    "Creative Manager",
                ],
                pricingTag: "Pricing",
                pricingHeading: "My Pricing",
                pricingTabs: ["Standard Plan", "Premium Plan"],
                pricingTitles: ["Standard Plan", "Premium Plan"],
                standardFeatures: [
                    "1 Video Editing Project (up to 3 minutes)",
                    "Basic Motion Graphics",
                    "Social Media Format (TikTok / Reels / Shorts)",
                    "2 Revision Rounds",
                ],
                premiumFeatures: [
                    "Advanced Video Editing",
                    "Motion Graphics & Animation",
                    "Creative Visual Design",
                    "Unlimited Revisions",
                ],
                perHour: "/per hour",
                hireMe: "Contact Me",
                getStarted: "Get Started !",
                partnerTag: "Partner",
                partnerHeading: "Trusted By 50+ Brands Worldwide",
                contactTag: "Contact",
                contactLeadBefore: "Lets",
                contactLeadWords: ["Design", "Create", "Craft"],
                contactLeadAfter: "Incredible",
                contactSecondLine: "Work Together",
                namePlaceholder: "Your name",
                emailPlaceholder: "Your email",
                messagePlaceholder: "Your Message...",
                rights: "\u00A9 2026 Truong The Nhat Portfolio. All rights reserved.",
                settingsColor: "Color",
                settingsBackground: "Background",
                settingBackgroundNames: [
                    "Glowing Digital Waves",
                    "Vibrant Particle Glow",
                    "Cyber Particle Waves",
                    "Slow-Motion Particle Wave",
                    "Futuristic Cyber Matrix",
                    "Particle Wave Form",
                    "Looping Particle Animation",
                    "Seamless Particle Glow",
                    "Digital technology",
                    "Dotted waves bounce",
                ],
            },
            vi: {
                pageTitle: "Truong The Nhat",
                profileRole: "Thiết kế Đa phương tiện",
                aboutTag: "Giới thiệu",
                aboutIntroPrefix: "Xin chào! Tôi là",
                aboutRoleWords: ["Thiết kế Đa phương tiện", "Nhà phát triển UI/UX"],
                aboutTitle: "Thiết kế trải nghiệm thị giác",
                aboutDescription: "Xin chào! Tôi là Trương Thế Nhật, nhà thiết kế đa phương tiện với hơn 3 năm kinh nghiệm về dựng video, motion graphics và thiết kế số, tạo ra nội dung hình ảnh ấn tượng cho thương hiệu và nền tảng số.",
                aboutCounters: [
                    "Năm trong lĩnh vực sáng tạo",
                    "Dự án sáng tạo",
                    "Khách hàng & cộng tác",
                ],
                resumeTag: "Hồ sơ",
                resumeHeading: "Học vấn & Kinh nghiệm",
                resumeRoles: [
                    "Nhà thiết kế Đa phương tiện",
                    "Nhà thiết kế Hình ảnh & Motion Graphics",
                    "Nhà thiết kế Đồ họa Junior",
                    "Cử nhân Công nghệ Thông tin",
                    "Nhà thiết kế | Nhà phát triển UI/UX",
                ],
                resumeDates: [
                    "2025 - Hiện tại",
                    "2024 - 2025",
                    "2023 - 2024",
                    "2020 - 2024",
                    "2020 - Hiện tại",
                ],
                servicesTag: "Dịch vụ",
                servicesHeading: "Dịch vụ Thiết kế Đa phương tiện",
                serviceTitles: [
                    "Dựng video & hậu kỳ",
                    "Motion Graphics & hoạt họa",
                    "Thiết kế đồ họa & hình ảnh",
                    "Sản xuất nội dung truyền thông sáng tạo",
                ],
                serviceDescriptions: [
                    "Chỉnh sửa chuyên nghiệp cho TVC, nội dung mạng xã hội, video thương hiệu và kể chuyện bằng hình ảnh.",
                    "Tạo motion graphics, tiêu đề hoạt họa và hiệu ứng hình ảnh để nâng cao chất lượng nội dung số.",
                    "Thiết kế poster, ấn phẩm mạng xã hội, bộ nhận diện và hình ảnh marketing nổi bật.",
                    "Sản xuất nội dung đa phương tiện hấp dẫn giúp thương hiệu truyền thông hiệu quả trên nền tảng số.",
                ],
                portfolioTag: "Dự án",
                portfolioHeading: "Dự án nổi bật",
                portfolioTags: [
                    "Video quảng bá thương hiệu",
                    "Quảng cáo mạng xã hội dạng hoạt họa",
                    "Nhận diện thương hiệu & bộ visual",
                    "Bộ poster marketing",
                ],
                portfolioCategories: [
                    "DỰNG VIDEO",
                    "MOTION GRAPHICS",
                    "THIẾT KẾ THƯƠNG HIỆU",
                    "THIẾT KẾ ĐỒ HỌA",
                ],
                testimonialTag: "Đánh giá",
                testimonialHeading: "Được khách hàng tin tưởng",
                testimonialQuotes: [
                    "\"Làm việc cùng Trương Thế Nhật là một trải nghiệm rất tốt. Phần dựng video và thiết kế hình ảnh chuyên nghiệp, cuốn hút và phù hợp hoàn hảo với nhận diện thương hiệu của chúng tôi.\"",
                    "\"Trương Thế Nhật mang đến nhiều ý tưởng sáng tạo mới mẻ cho dự án. Hình ảnh và video hiện đại, thu hút, rất phù hợp cho chiến dịch marketing của chúng tôi.\"",
                    "\"Kết quả cuối cùng vượt mong đợi. Từ thiết kế đồ họa đến dựng video, mọi thứ đều được thực hiện chỉn chu với chất lượng cao và sự tỉ mỉ.\"",
                ],
                testimonialRoles: [
                    "Quản lý dự án",
                    "Quản lý thương hiệu",
                    "Quản lý sáng tạo",
                ],
                pricingTag: "Bảng giá",
                pricingHeading: "Bảng giá của tôi",
                pricingTabs: ["Gói Tiêu chuẩn", "Gói Cao cấp"],
                pricingTitles: ["Gói Tiêu chuẩn", "Gói Cao cấp"],
                standardFeatures: [
                    "1 dự án dựng video (tối đa 3 phút)",
                    "Motion Graphics cơ bản",
                    "Định dạng mạng xã hội (TikTok / Reels / Shorts)",
                    "2 lần chỉnh sửa",
                ],
                premiumFeatures: [
                    "Dựng video nâng cao",
                    "Motion Graphics & hoạt họa",
                    "Thiết kế hình ảnh sáng tạo",
                    "Chỉnh sửa không giới hạn",
                ],
                perHour: "/giờ",
                hireMe: "Thuê tôi",
                getStarted: "Bắt đầu ngay!",
                partnerTag: "Đối tác",
                partnerHeading: "Được 50+ thương hiệu trên toàn cầu tin tưởng",
                contactTag: "Liên hệ",
                contactLeadBefore: "Hãy",
                contactLeadWords: ["Thiết kế", "Sáng tạo", "Chế tác"],
                contactLeadAfter: "Ấn tượng",
                contactSecondLine: "Cùng nhau hợp tác",
                namePlaceholder: "Tên của bạn",
                emailPlaceholder: "Email của bạn",
                messagePlaceholder: "Tin nhắn của bạn...",
                rights: "© 2026 Trương Thế Nhật. Đã đăng ký bản quyền.",
                settingsColor: "Màu sắc",
                settingsBackground: "Nền",
                settingBackgroundNames: [
                    "Sóng số phát sáng",
                    "Hạt sáng rực rỡ",
                    "Sóng hạt công nghệ",
                    "Sóng hạt chuyển động chậm",
                    "Ma trận cyber tương lai",
                    "Dạng sóng hạt",
                    "Hoạt ảnh hạt lặp",
                    "Ánh sáng hạt liền mạch",
                    "Công nghệ số",
                    "Sóng chấm dao động",
                ],
            },
        };

        const setText = (selector, value) => {
            const element = document.querySelector(selector);
            if (element && typeof value === "string") {
                element.textContent = value;
            }
        };

        const setTextAll = (selector, value) => {
            if (typeof value !== "string") return;
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.textContent = value;
            });
        };

        const setTextList = (selector, values) => {
            if (!Array.isArray(values)) return;
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                if (values[index] !== undefined) {
                    element.textContent = values[index];
                }
            });
        };

        const setPlaceholder = (selector, value) => {
            const element = document.querySelector(selector);
            if (element && typeof value === "string") {
                element.setAttribute("placeholder", value);
                element.setAttribute("data-typing-base", value);
            }
        };

        const setBoundaryTextNodes = (selector, leading, trailing) => {
            const element = document.querySelector(selector);
            if (!element) return;

            const textNodes = Array.from(element.childNodes).filter(
                (node) => node.nodeType === 3
            );

            if (textNodes[0] && typeof leading === "string") {
                textNodes[0].nodeValue = `${leading} `;
            }

            if (textNodes[textNodes.length - 1] && typeof trailing === "string") {
                textNodes[textNodes.length - 1].nodeValue = ` ${trailing}`;
            }
        };

        const aboutTitleSelector = "#about [data-i18n='about.title']";

        const renderAboutTitleWords = (value) => {
            const title = document.querySelector(aboutTitleSelector);
            if (!title || typeof value !== "string") return;

            const words = value.trim().split(/\s+/).filter(Boolean);
            title.textContent = "";

            words.forEach((word, index) => {
                const wordSpan = document.createElement("span");
                wordSpan.className = "about-title-word";
                wordSpan.textContent = word;
                title.appendChild(wordSpan);

                if (index < words.length - 1) {
                    title.appendChild(document.createTextNode(" "));
                }
            });
        };

        const initAboutTitleMouseFollow = () => {
            const title = document.querySelector(aboutTitleSelector);
            if (!title || title.dataset.mouseFollowReady === "true") return;
            let activeWord = null;
            let frameId = 0;
            let pointerX = 0;
            let pointerY = 0;
            let isPointerInside = false;

            const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

            const animateActiveWord = () => {
                frameId = 0;
                if (!activeWord || !isPointerInside) return;

                const rect = activeWord.getBoundingClientRect();
                if (!rect.width || !rect.height) return;

                const normalizedX = clamp(
                    ((pointerX - rect.left) / rect.width) * 2 - 1,
                    -1,
                    1
                );
                const normalizedY = clamp(
                    ((pointerY - rect.top) / rect.height) * 2 - 1,
                    -1,
                    1
                );

                const moveX = normalizedX * 10;
                const moveY = normalizedY * 7;
                const rotate = normalizedX * 6;

                activeWord.style.transform = `translate3d(${moveX.toFixed(
                    2
                )}px, ${moveY.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg)`;
            };

            const scheduleWordAnimation = () => {
                if (frameId) return;
                frameId = window.requestAnimationFrame(animateActiveWord);
            };

            const clearActiveWord = () => {
                if (!activeWord) return;
                const wordToRelease = activeWord;
                wordToRelease.classList.remove("is-active");
                wordToRelease.classList.add("is-releasing");
                window.setTimeout(() => {
                    wordToRelease.classList.remove("is-releasing");
                    wordToRelease.style.removeProperty("transform");
                    wordToRelease.style.removeProperty("text-shadow");
                    wordToRelease.style.removeProperty("filter");
                }, 420);

                activeWord = null;
            };

            const setActiveWord = (nextWord) => {
                if (activeWord === nextWord) return;
                clearActiveWord();
                if (!nextWord) return;

                activeWord = nextWord;
                activeWord.classList.remove("is-releasing");
                activeWord.classList.add("is-active");
                scheduleWordAnimation();
            };

            title.addEventListener("pointerover", (event) => {
                const targetWord =
                    event.target instanceof Element ?
                    event.target.closest(".about-title-word") :
                    null;
                if (!targetWord || !title.contains(targetWord)) return;
                setActiveWord(targetWord);
            });

            title.addEventListener("pointermove", (event) => {
                pointerX = event.clientX;
                pointerY = event.clientY;
                isPointerInside = true;

                const targetWord =
                    event.target instanceof Element ?
                    event.target.closest(".about-title-word") :
                    null;

                if (targetWord && title.contains(targetWord)) {
                    setActiveWord(targetWord);
                }

                scheduleWordAnimation();
            });

            title.addEventListener("pointerout", (event) => {
                const fromWord =
                    event.target instanceof Element ?
                    event.target.closest(".about-title-word") :
                    null;
                const toWord =
                    event.relatedTarget instanceof Element ?
                    event.relatedTarget.closest(".about-title-word") :
                    null;

                if (fromWord && fromWord !== toWord) {
                    if (activeWord === fromWord) {
                        clearActiveWord();
                    } else {
                        fromWord.classList.remove("is-active");
                        fromWord.style.removeProperty("transform");
                    }
                }
            });

            title.addEventListener("pointerleave", () => {
                isPointerInside = false;
                clearActiveWord();
            });

            title.dataset.mouseFollowReady = "true";
        };

        const applyPageContent = (lang) => {
            const content = pageContent[lang];
            if (!content) return;

            document.title = content.pageTitle;
            const profileName =
                lang === "vi" ?
                "Tr\u01b0\u01a1ng Th\u1ebf Nh\u1eadt" :
                "Truong The Nhat";

            setText(".header-sidebar .box .info h6.font-4.mb_4", profileName);
            setText(".user-bar .box-author .info .name", profileName);
            setTextAll(
                ".header-sidebar .box .info .text-label, .user-bar .box-author .info .text-label",
                lockedTerms.profileRole
            );
            setTextAll(".js-open-contact-modal [data-i18n='cta.hire_me']", lockedTerms.hireMe);

            setText("#about .heading-section .tag-heading", content.aboutTag);
            setTextAll("#about [data-i18n='about.role_word_1']", lockedTerms.profileRole);
            renderAboutTitleWords(lockedTerms.aboutTitle);
            setText("#about > p.text_muted-color", content.aboutDescription);
            setTextList("#about .wrap-counter .counter-item .text-body-1", content.aboutCounters);

            setText("#resume .heading-section .tag-heading", content.resumeTag);
            setText("#resume .heading-section h3", content.resumeHeading);
            setTextList("#resume .education-item .content > span.text-body-1", content.resumeRoles);
            setTextList("#resume .education-item .date", content.resumeDates);

            setText("#services .heading-section .tag-heading", content.servicesTag);
            setText("#services .heading-section h3", content.servicesHeading);
            setTextList("#services .service-item .content h5 .link", content.serviceTitles);
            setTextList("#services .service-item .service-subtitle", content.serviceDescriptions);

            setText("#portfolio .heading-section .tag-heading", content.portfolioTag);
            setText("#portfolio .heading-section h3", content.portfolioHeading);
            setTextList("#portfolio .portfolio-item .tag", content.portfolioTags);
            setTextList("#portfolio .portfolio-item h5 .link", content.portfolioCategories);

            setText("#testimonial .heading-section .tag-heading", content.testimonialTag);
            setText("#testimonial .heading-section h3", content.testimonialHeading);
            setTextList("#testimonial .testimonial-item p.text-body-2", content.testimonialQuotes);
            setTextList("#testimonial .athor span.text-label", content.testimonialRoles);

            setText("#pricing .heading-section .tag-heading", content.pricingTag);
            setText("#pricing .heading-section h3", content.pricingHeading);
            setTextList("#pricing .menu-tab .nav-tab-item a", content.pricingTabs);
            setTextList("#pricing .pricing-item h4.title", content.pricingTitles);
            setTextList("#standard-plan .list-check li", content.standardFeatures);
            setTextList("#premium-plan .list-check li", content.premiumFeatures);
            setTextList("#pricing .wrap-pricing h3 .text-caption-1", [content.perHour, content.perHour]);
            setTextList("#pricing .wrap-pricing .tf-btn span", [content.getStarted, content.getStarted]);

            setText("#partners .heading-section .tag-heading", content.partnerTag);
            setText("#partners .heading-section h3", content.partnerHeading);

            setText("#contact .heading-section .tag-heading", content.contactTag);
            setBoundaryTextNodes(
                "#contact .heading-section .title h3.animationtext",
                content.contactLeadBefore,
                content.contactLeadAfter
            );
            setTextList("#contact .heading-section .title .tf-text .item-text", content.contactLeadWords);
            setText("#contact .heading-section .title h3.title", content.contactSecondLine);
            setPlaceholder("#name", content.namePlaceholder);
            setPlaceholder("#email", content.emailPlaceholder);
            setPlaceholder("#message", content.messagePlaceholder);
            setText("#contact .button-submit .tf-btn span", content.getStarted);
            setText(".section-contact.style-1 > p.font-3", content.rights);

            setText("#setting-menu .feature-color h5", content.settingsColor);
            setText("#setting-menu .features-background h5", content.settingsBackground);
            setTextList("#setting-menu .feature-bg-item a", content.settingBackgroundNames);
        };

        const setToggleState = (lang) => {
            const isVietnamese = lang === "vi";
            $toggle
                .text(isVietnamese ? "VI" : "EN")
                .toggleClass("active", isVietnamese)
                .attr(
                    "aria-label",
                    isVietnamese ? "Switch to English" : "Chuyển sang tiếng Việt"
                );
        };

        const applyLanguage = (lang) => {
            const normalizedLang = lang === "vi" ? "vi" : "en";
            const dictionary = translations[normalizedLang];

            if (typeof window.clearSplitTextAnimations === "function") {
                window.clearSplitTextAnimations();
            }

            $("[data-i18n]").each(function() {
                const key = $(this).data("i18n");
                if (
                    key === "about.title" ||
                    key === "about.role_word_1" ||
                    key === "cta.hire_me"
                ) {
                    return;
                }
                if (dictionary[key]) {
                    $(this).text(dictionary[key]);
                }
            });

            applyPageContent(normalizedLang);
            $("body").attr("data-language", normalizedLang);
            $("html").attr("lang", normalizedLang === "vi" ? "vi" : "en-US");
            setToggleState(normalizedLang);
            initAboutTitleMouseFollow();

            if (typeof window.refreshSplitTextAnimations === "function") {
                window.refreshSplitTextAnimations();
            }
        };

        const savedLanguage = localStorage.getItem(LANG_KEY);
        const defaultLanguage = $("body").data("language") || "en";
        const initialLanguage =
            savedLanguage === "vi" || savedLanguage === "en" ?
            savedLanguage :
            defaultLanguage === "vi" ?
            "vi" :
            "en";

        applyLanguage(initialLanguage);

        $toggle.on("click", function() {
            const currentLanguage =
                $("body").attr("data-language") === "vi" ? "vi" : "en";
            const nextLanguage = currentLanguage === "vi" ? "en" : "vi";
            applyLanguage(nextLanguage);
            spliting();
            localStorage.setItem(LANG_KEY, nextLanguage);
        });
    };

    /* oneNavOnePage
  -------------------------------------------------------------------------------------*/
    const oneNavOnePage = () => {
        if (!$(".section-onepage").length) return;

        const $navLinks = $(".nav_link");
        const $sections = $(".section");
        let isScrollingByClick = false;
        let isScrolling = false;
        let scrollTimeout;

        $navLinks.on("click", function(e) {
            e.preventDefault();

            const target = $(this).attr("href");
            const $target = $(target);
            if (!$target.length) return;

            let offsetTop;

            const hasUserBar =
                $(".userbar-fixed").length > 0 && window.innerWidth > 1200;

            if (hasUserBar) {
                const userBarTop = $(".userbar-fixed").offset()?.top || 0;
                const scrollTop = $(window).scrollTop();
                const userBarDistanceFromViewport = userBarTop - scrollTop;

                const paddingTop = parseInt($target.css("padding-top")) || 0;
                const targetContentTop = $target.offset().top + paddingTop;
                offsetTop = targetContentTop - userBarDistanceFromViewport;
            } else {
                if (
                    $target.hasClass("first-section") &&
                    window.innerWidth > 1200
                ) {
                    offsetTop = 0;
                } else {
                    const headerHeight = $(".header").outerHeight() || 0;
                    const paddingTop =
                        parseInt($target.css("padding-top")) || 0;
                    offsetTop =
                        $target.offset().top - headerHeight + paddingTop / 2;
                }
            }

            if (
                $(this).hasClass("avatar-link") &&
                window.matchMedia("(max-width: 767px)").matches
            ) {
                offsetTop = 0;
            }

            isScrollingByClick = true;

            const currentId = $target.attr("id");
            $navLinks
                .removeClass("active")
                .filter(`[href="#${currentId}"]`)
                .addClass("active");

            $("html, body").animate({
                scrollTop: offsetTop
            }, 0, function() {
                setTimeout(() => {
                    isScrollingByClick = false;
                }, 50);
            });

            $(".tf-sidebar-menu,.popup-menu-mobile").removeClass("show");
            $(".overlay-popup").removeClass("show");
            $("body").removeAttr("style");

            if ($(this).hasClass("open-popup")) {
                openYourPopup();
            }
        });

        const updateActiveMenu = () => {
            if (isScrollingByClick || isScrolling) return;

            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            const viewportTop = scrollTop;
            const viewportBottom = scrollTop + windowHeight;

            const viewportCenter = scrollTop + windowHeight / 2;

            let bestScore = -1;
            let currentSection = null;
            let currentIndex = -1;

            $sections.each(function(index) {
                const $section = $(this);

                const sectionTop = $section.offset().top;
                const sectionBottom = sectionTop + $section.outerHeight();
                const sectionHeight = $section.outerHeight();

                const visibleTop = Math.max(viewportTop, sectionTop);
                const visibleBottom = Math.min(viewportBottom, sectionBottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                const visiblePercentage = sectionHeight > 0 ? (visibleHeight / sectionHeight) * 100 : 0;

                const containsCenter = sectionTop <= viewportCenter && viewportCenter <= sectionBottom;

                let score = visiblePercentage;
                if (containsCenter) {
                    score += 1000;
                }

                const MIN_VISIBLE_PERCENTAGE = 30;

                if (score > bestScore && visiblePercentage >= MIN_VISIBLE_PERCENTAGE) {
                    bestScore = score;
                    currentSection = $section;
                    currentIndex = index;
                }
            });

            if (currentSection && currentSection.length) {
                const currentId = currentSection.attr("id");

                $navLinks
                    .removeClass("active")
                    .filter(`[href="#${currentId}"]`)
                    .addClass("active");
                $sections.removeClass("dimmed");
                $sections.each(function(index) {
                    if (index < currentIndex) $(this).addClass("dimmed");
                });
            }
        };

        let scrollTimer;
        $(window).on("scroll resize", function() {
            isScrolling = true;

            clearTimeout(scrollTimeout);
            clearTimeout(scrollTimer);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 50);

            scrollTimer = setTimeout(updateActiveMenu, 100);
        });
        updateActiveMenu();
    };

    /* handleMobileAvatarTop
  -------------------------------------------------------------------------------------*/
    const handleMobileAvatarTop = () => {
        $(document).on("click", ".user-bar .box-author .img-style", function(e) {
            if (!window.matchMedia("(max-width: 767px)").matches) return;
            e.preventDefault();
            $("html, body").animate({
                scrollTop: 0
            }, 0);
        });
    };

    /* handleEffectSpotlight
  -------------------------------------------------------------------------*/
    const handleEffectSpotlight = () => {
        if (!$(".area-effect").length) return;
        $(".area-effect").each(function() {
            const $container = $(this);
            const $spotlight = $container.find(".spotlight");
            $spotlight.css("opacity", "1");
            $container.on("mousemove", function(e) {
                const offset = $container.offset();
                const relX = e.pageX - offset.left;
                const relY = e.pageY - offset.top;
                $spotlight.css({
                    top: relY,
                    left: relX,
                });
            });
        });
    };

    /* handleCounterTouchEffect
  -------------------------------------------------------------------------*/
    const handleCounterTouchEffect = () => {
        const $touchItems = $(".counter-item, .portfolio-item");
        if (!$touchItems.length) return;
        $touchItems.each(function() {
            const $item = $(this);
            const isPortfolioItem = $item.hasClass("portfolio-item");
            let touchTimer;

            const setTouchPoint = (clientX, clientY) => {
                const rect = this.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                this.style.setProperty("--touch-x", `${x}px`);
                this.style.setProperty("--touch-y", `${y}px`);
            };

            const setPortfolioTilt = (clientX, clientY) => {
                if (!isPortfolioItem) return;
                const rect = this.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const relX = (clientX - rect.left) / rect.width;
                const relY = (clientY - rect.top) / rect.height;
                const clampedX = Math.min(Math.max(relX, 0), 1);
                const clampedY = Math.min(Math.max(relY, 0), 1);
                const maxTilt = 8;
                const dirRaw = parseFloat(this.style.getPropertyValue("--portfolio-tilt-dir"));
                const direction = Number.isFinite(dirRaw) && dirRaw !== 0 ? dirRaw : 1;
                const horizontalStrength = Math.max(
                    Math.abs(clampedX - 0.5) * 2,
                    0.4
                );
                const tiltX = (0.5 - clampedY) * maxTilt * 1.5;
                const tiltY = direction * horizontalStrength * maxTilt;

                this.style.setProperty("--portfolio-tilt-x", `${tiltY.toFixed(2)}deg`);
                this.style.setProperty("--portfolio-tilt-y", `${tiltX.toFixed(2)}deg`);
                $item.addClass("is-tilt-active");
            };

            const resetPortfolioTilt = () => {
                if (!isPortfolioItem) return;
                this.style.setProperty("--portfolio-tilt-x", "0deg");
                this.style.setProperty("--portfolio-tilt-y", "0deg");
                $item.removeClass("is-tilt-active");
            };

            $item.on("mousemove", function(e) {
                setTouchPoint(e.clientX, e.clientY);
                setPortfolioTilt(e.clientX, e.clientY);
            });

            $item.on("touchstart touchmove", function(e) {
                const touches = e.originalEvent.touches;
                const touch = touches && touches[0];
                if (!touch) return;

                setTouchPoint(touch.clientX, touch.clientY);
                setPortfolioTilt(touch.clientX, touch.clientY);
                $item.addClass("is-touch-active");
                clearTimeout(touchTimer);
            });

            $item.on("mouseleave", function() {
                resetPortfolioTilt();
            });

            $item.on("touchend touchcancel", function() {
                clearTimeout(touchTimer);
                touchTimer = setTimeout(() => {
                    $item.removeClass("is-touch-active");
                    resetPortfolioTilt();
                }, 220);
            });
        });
    };

    /* handleHeaderIntroSequence
  -------------------------------------------------------------------------*/
    const handleHeaderIntroSequence = (options = {}) => {
        return new Promise((resolve) => {
            const onAvatarRollDone =
                typeof options.onAvatarRollDone === "function" ?
                options.onAvatarRollDone :
                null;
            const titleElement =
                options.titleElement instanceof Element ? options.titleElement : null;
            const headerSidebar = document.querySelector(
                ".header .header-sidebar.style-1"
            );
            if (!headerSidebar || headerSidebar.dataset.introPlayed === "true") {
                if (onAvatarRollDone) onAvatarRollDone();
                resolve();
                return;
            }

            headerSidebar.dataset.introPlayed = "true";

            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const hasGsap = typeof window.gsap !== "undefined";

            const avatar = headerSidebar.querySelector(".box .avatar");
            const info = headerSidebar.querySelector(".box .info");
            const avatarHasNoRing = avatar?.classList.contains("avatar-no-ring");
            const navItems = Array.from(
                headerSidebar.querySelectorAll(".nav-menu.style-1 > li")
            ).filter((item) => window.getComputedStyle(item).display !== "none");
            const controls = headerSidebar.querySelector(".d-flex");
            const revealTargets = [info, controls].filter(Boolean);

            if (prefersReducedMotion || !hasGsap || !avatar) {
                headerSidebar.classList.add("is-intro-finished");
                if (onAvatarRollDone) onAvatarRollDone();
                resolve();
                return;
            }

            const collapsedClip = "inset(0 100% 0 0 round 160px)";
            const expandedClip = "inset(0 0% 0 0 round 160px)";
            const avatarRect = avatar.getBoundingClientRect();
            const avatarRadius = avatarRect.height / 2;
            const finalX = avatarRect.left + avatarRect.width / 2;
            const finalY = avatarRect.top + avatarRect.height / 2;
            const resolveTitleGeometry = () => {
                if (!titleElement) {
                    const fallbackX = window.innerWidth / 2;
                    const fallbackY = window.innerHeight / 2;

                    return {
                        left: fallbackX - avatarRadius * 3.2,
                        right: fallbackX + avatarRadius * 3.2,
                        bounceBaseY: fallbackY - avatarRadius * 0.24,
                    };
                }

                const titleBox =
                    titleElement.querySelector(".intro-center-title__inner") || titleElement;
                const titleRect = titleBox.getBoundingClientRect();
                if (!titleRect.width || !titleRect.height) {
                    const fallbackX = window.innerWidth / 2;
                    const fallbackY = window.innerHeight / 2;

                    return {
                        left: fallbackX - avatarRadius * 3.2,
                        right: fallbackX + avatarRadius * 3.2,
                        bounceBaseY: fallbackY - avatarRadius * 0.24,
                    };
                }

                const nameLine =
                    titleElement.querySelector(".intro-center-title__line--name") ||
                    titleBox;
                const nameRect = nameLine.getBoundingClientRect();
                const bounceLineRect =
                    nameRect.width && nameRect.height ? nameRect : titleRect;
                const bounceBaseY =
                    bounceLineRect.top +
                    bounceLineRect.height * 0.6 -
                    avatarRadius * 0.94;

                return {
                    left: titleRect.left,
                    right: titleRect.right,
                    bounceBaseY,
                };
            };

            const avatarGhost = avatar.cloneNode(true);
            avatarGhost.classList.remove("avatar-final-flash");
            avatarGhost.classList.add("header-avatar-ghost");
            avatarGhost.classList.add("avatar-bounce-plain");
            const avatarBounceTail = document.createElement("span");
            avatarBounceTail.className = "avatar-bounce-tail";
            avatarGhost.appendChild(avatarBounceTail);
            if (avatarHasNoRing) {
                avatarGhost.classList.add("avatar-entrance-vfx");
            }
            document.body.appendChild(avatarGhost);
            avatarGhost.classList.add("is-rolling");

            headerSidebar.classList.add("is-intro-animating");
            avatar.classList.remove("avatar-final-flash");
            avatar.style.visibility = "hidden";
            let hasNotifiedAvatarRollDone = false;
            const notifyAvatarRollDone = () => {
                if (hasNotifiedAvatarRollDone) return;
                hasNotifiedAvatarRollDone = true;
                if (onAvatarRollDone) onAvatarRollDone();
            };
            let avatarNoRingRevealTimeout = null;
            const playAvatarNoRingReveal = () => {
                if (!avatarHasNoRing) return;
                if (avatarNoRingRevealTimeout) {
                    window.clearTimeout(avatarNoRingRevealTimeout);
                }
                avatar.classList.remove("avatar-no-ring-reveal");
                void avatar.offsetWidth;
                avatar.classList.add("avatar-no-ring-reveal");
                avatarNoRingRevealTimeout = window.setTimeout(() => {
                    avatar.classList.remove("avatar-no-ring-reveal");
                    avatarNoRingRevealTimeout = null;
                }, 820);
            };

            window.gsap.set(headerSidebar, {
                autoAlpha: 1,
                clipPath: collapsedClip,
            });
            if (titleElement) {
                window.gsap.set(titleElement, {
                    autoAlpha: 1,
                    left: window.innerWidth / 2,
                    top: window.innerHeight / 2,
                    x: 0,
                    y: 0,
                    filter: "blur(0px)",
                });
            }
            const viewportMotionInset = Math.max(
                14,
                Math.min(28, avatarRadius * 0.45)
            );
            const motionRadius = avatarRadius * 1.22;
            const viewportMinX = motionRadius + viewportMotionInset;
            const viewportMaxX =
                window.innerWidth - motionRadius - viewportMotionInset;
            const viewportMinY = motionRadius + viewportMotionInset;
            const viewportMaxY =
                window.innerHeight - motionRadius - viewportMotionInset;
            const clampViewportX = (value) =>
                Math.max(viewportMinX, Math.min(viewportMaxX, value));
            const clampViewportY = (value) =>
                Math.max(viewportMinY, Math.min(viewportMaxY, value));

            const titleGeometry = resolveTitleGeometry();
            const titleTravelWidth = Math.max(
                avatarRadius * 4.8,
                titleGeometry.right - titleGeometry.left
            );
            const bounceBaseY = clampViewportY(titleGeometry.bounceBaseY);
            const bounceLandings = [{
                x: clampViewportX(titleGeometry.left + titleTravelWidth * 0.82),
                y: bounceBaseY,
            }, {
                x: clampViewportX(titleGeometry.left + titleTravelWidth * 0.54),
                y: clampViewportY(bounceBaseY - avatarRadius * 0.08),
            }, {
                x: clampViewportX(titleGeometry.left + titleTravelWidth * 0.08),
                y: clampViewportY(bounceBaseY + avatarRadius * 0.04),
            }, ];
            const avatarStartX =
                window.innerWidth +
                motionRadius +
                viewportMotionInset +
                avatarRadius * 1.9;
            const avatarStartY = clampViewportY(
                titleGeometry.bounceBaseY - Math.max(94, avatarRadius * 3)
            );
            const motionFinalX = clampViewportX(finalX);
            const motionFinalY = clampViewportY(finalY);
            const avatarFinalBounce = avatarHasNoRing ? 12 : 8;
            const finalArcPeak = {
                x: clampViewportX(
                    bounceLandings[2].x +
                    (motionFinalX - bounceLandings[2].x) * 0.58
                ),
                y: clampViewportY(
                    Math.min(bounceLandings[2].y, motionFinalY) -
                    Math.max(
                        110,
                        Math.min(
                            186,
                            Math.abs(bounceLandings[2].y - motionFinalY) *
                            0.42 +
                            60
                        )
                    )
                ),
            };
            let titleImpactState = null;
            let titleTypewriterChars = null;
            if (titleElement) {
                const titleInner =
                    titleElement.querySelector(".intro-center-title__inner") || titleElement;
                const titleChars = Array.from(
                    titleElement.querySelectorAll(".intro-center-title__char:not(.is-space)")
                );
                const titleNameChars = Array.from(
                    titleElement.querySelectorAll(
                        ".intro-center-title__line--name .intro-center-title__char:not(.is-space)"
                    )
                );
                const titleRoleChars = Array.from(
                    titleElement.querySelectorAll(
                        ".intro-center-title__line--role .intro-center-title__char:not(.is-space)"
                    )
                );

                window.gsap.set(titleInner, {
                    "--intro-title-impact-glow": 0,
                    transformOrigin: "50% 24%",
                    force3D: true,
                });

                if (titleChars.length) {
                    window.gsap.set(titleChars, {
                        autoAlpha: 0,
                        y: (_, el) =>
                            el.closest(".intro-center-title__line--role") ? 8 : 12,
                        filter: "blur(6px)",
                        color: (_, el) =>
                            el.closest(".intro-center-title__line--role") ?
                            "rgba(69, 231, 123, 0.92)" : "rgba(69, 231, 123, 1)",
                    });
                }

                if (titleNameChars.length || titleRoleChars.length) {
                    titleTypewriterChars = {
                        name: titleNameChars,
                        role: titleRoleChars,
                    };
                }

                if (titleInner && titleChars.length) {
                    titleImpactState = {
                        titleInner,
                        titleChars,
                        charHighlightLevels: titleChars.map(() => 0),
                    };
                }
            }
            const impactSplash = document.createElement("div");
            impactSplash.className = "intro-impact-splash";
            impactSplash.innerHTML = `
                <span class="intro-impact-splash__core"></span>
                <span class="intro-impact-splash__ring"></span>
                <span class="intro-impact-splash__spark intro-impact-splash__spark--line" data-dx="-78" data-dy="-12" data-rotation="194"></span>
                <span class="intro-impact-splash__spark" data-dx="-52" data-dy="-40" data-rotation="224"></span>
                <span class="intro-impact-splash__spark" data-dx="-24" data-dy="-60" data-rotation="252"></span>
                <span class="intro-impact-splash__spark intro-impact-splash__spark--line" data-dx="64" data-dy="-24" data-rotation="334"></span>
                <span class="intro-impact-splash__spark" data-dx="74" data-dy="-6" data-rotation="8"></span>
                <span class="intro-impact-splash__spark" data-dx="38" data-dy="18" data-rotation="26"></span>
                <span class="intro-impact-splash__spark" data-dx="-42" data-dy="16" data-rotation="162"></span>
            `;
            document.body.appendChild(impactSplash);

            const impactSplashCore = impactSplash.querySelector(
                ".intro-impact-splash__core"
            );
            const impactSplashRing = impactSplash.querySelector(
                ".intro-impact-splash__ring"
            );
            const impactSplashSparks = Array.from(
                impactSplash.querySelectorAll(".intro-impact-splash__spark")
            );

            window.gsap.set(impactSplash, {
                autoAlpha: 0,
                left: bounceLandings[0].x,
                top: bounceLandings[0].y,
                xPercent: -50,
                yPercent: -50,
                scale: 0.42,
                force3D: true,
            });
            if (impactSplashCore) {
                window.gsap.set(impactSplashCore, {
                    autoAlpha: 0,
                    scale: 0.16,
                    transformOrigin: "50% 50%",
                    force3D: true,
                });
            }
            if (impactSplashRing) {
                window.gsap.set(impactSplashRing, {
                    autoAlpha: 0,
                    scale: 0.34,
                    transformOrigin: "50% 50%",
                    force3D: true,
                });
            }
            impactSplashSparks.forEach((spark) => {
                const isLineSpark = spark.classList.contains(
                    "intro-impact-splash__spark--line"
                );
                window.gsap.set(spark, {
                    autoAlpha: 0,
                    x: 0,
                    y: 0,
                    scaleX: isLineSpark ? 0.18 : 0.24,
                    scaleY: isLineSpark ? 1 : 0.24,
                    rotation: parseFloat(spark.dataset.rotation || "0"),
                    transformOrigin: isLineSpark ? "0% 50%" : "50% 50%",
                    force3D: true,
                });
            });
            window.gsap.set(avatarGhost, {
                autoAlpha: avatarHasNoRing ? 0 : 1,
                left: avatarStartX,
                top: avatarStartY,
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: 0,
                rotation: avatarHasNoRing ? 14 : 10,
                scaleX: avatarHasNoRing ? 0.84 : 0.92,
                scaleY: avatarHasNoRing ? 0.84 : 0.92,
                filter: avatarHasNoRing ? "blur(14px)" : "blur(0px)",
                transformOrigin: "50% 50%",
                force3D: true,
                "--avatar-tail-opacity": 0,
                "--avatar-tail-length": "36px",
                "--avatar-tail-thickness": "12px",
                "--avatar-tail-rotation": "0deg",
                "--avatar-tail-blur": "8px",
                "--avatar-tail-flare-opacity": 0,
                "--avatar-tail-flare-scale": 0.78,
            });
            if (avatarHasNoRing) {
                window.gsap.set(avatarGhost, {
                    "--avatar-no-ring-aura-opacity": 0,
                    "--avatar-no-ring-aura-scale": 0.38,
                    "--avatar-no-ring-ring-opacity": 0,
                    "--avatar-no-ring-ring-scale": 0.68,
                    "--avatar-no-ring-streak-opacity": 0,
                    "--avatar-no-ring-streak-shift": "-48px",
                    "--avatar-no-ring-flare-opacity": 0,
                    "--avatar-no-ring-flare-scale": 0.72,
                    "--avatar-no-ring-image-scale": 0.78,
                    "--avatar-no-ring-image-y": "8px",
                    "--avatar-no-ring-image-brightness": 1.18,
                    "--avatar-no-ring-image-saturate": 1.14,
                    "--avatar-no-ring-image-shadow-alpha": 0,
                    "--avatar-no-ring-tilt": "-16deg",
                });
            }
            window.gsap.set(navItems, {
                autoAlpha: 0,
                y: 18,
                filter: "blur(4px)",
            });
            window.gsap.set(revealTargets, {
                autoAlpha: 0,
                y: 14,
                filter: "blur(4px)",
            });

            const introTimeline = window.gsap.timeline({
                defaults: {
                    ease: "power3.out"
                },
                onComplete: () => {
                    notifyAvatarRollDone();
                    headerSidebar.classList.remove("is-intro-animating");
                    headerSidebar.classList.add("is-intro-finished");
                    avatar.classList.remove("avatar-final-flash");
                    avatar.style.visibility = "";
                    avatarGhost.classList.remove("is-rolling");
                    avatarGhost.remove();
                    impactSplash.remove();
                    playAvatarNoRingReveal();

                    window.gsap.set(
                        [headerSidebar, avatarGhost, ...navItems, ...revealTargets], {
                            clearProps: "x,y,opacity,visibility,scale,scaleX,scaleY,filter,clipPath,rotation,transformOrigin,left,top,xPercent,yPercent",
                        }
                    );
                    resolve();
                },
            });

            const titleNameStart = 0.05;
            const titleNameDuration = 0.28;
            const titleNameStaggerEach = 0.026;
            const titleRoleStart = 0.32;
            const titleRoleDuration = 0.24;
            const titleRoleStaggerEach = 0.02;
            const getStaggerRevealEnd = (start, duration, count, staggerEach) =>
                count > 0 ?
                start + duration + Math.max(0, count - 1) * staggerEach :
                0;

            if (titleTypewriterChars) {
                if (titleTypewriterChars.name.length) {
                    introTimeline.to(
                        titleTypewriterChars.name, {
                            autoAlpha: 1,
                            y: 0,
                            filter: "blur(0px)",
                            duration: titleNameDuration,
                            ease: "power2.out",
                            stagger: {
                                each: titleNameStaggerEach,
                                from: "start",
                            },
                        },
                        titleNameStart
                    );
                }

                if (titleTypewriterChars.role.length) {
                    introTimeline.to(
                        titleTypewriterChars.role, {
                            autoAlpha: 1,
                            y: 0,
                            filter: "blur(0px)",
                            duration: titleRoleDuration,
                            ease: "power2.out",
                            stagger: {
                                each: titleRoleStaggerEach,
                                from: "start",
                            },
                        },
                        titleRoleStart
                    );
                }
            }

            const titleRevealStartTime = titleTypewriterChars ?
                Math.min(
                    titleTypewriterChars.name.length ? titleNameStart : Infinity,
                    titleTypewriterChars.role.length ? titleRoleStart : Infinity
                ) :
                0;
            const titleRevealEndTime = titleTypewriterChars ?
                Math.max(
                    getStaggerRevealEnd(
                        titleNameStart,
                        titleNameDuration,
                        titleTypewriterChars.name.length,
                        titleNameStaggerEach
                    ),
                    getStaggerRevealEnd(
                        titleRoleStart,
                        titleRoleDuration,
                        titleTypewriterChars.role.length,
                        titleRoleStaggerEach
                    )
                ) :
                0;
            const titleRevealHalfTime = titleTypewriterChars ?
                titleRevealStartTime +
                (titleRevealEndTime - titleRevealStartTime) * 0.5 :
                0;
            const titleNameBaseColor = {
                r: 69,
                g: 231,
                b: 123,
                a: 1
            };
            const titleRoleBaseColor = {
                r: 69,
                g: 231,
                b: 123,
                a: 0.92
            };
            const titleAccentColor = {
                r: 255,
                g: 255,
                b: 255,
                a: 0.98
            };
            const getTitleCharBaseColor = (char) =>
                char.closest(".intro-center-title__line--role") ?
                titleRoleBaseColor :
                titleNameBaseColor;
            const blendRgba = (fromColor, toColor, mix) => {
                const normalizedMix = Math.max(0, Math.min(1, mix));
                const lerp = (fromValue, toValue) =>
                    fromValue + (toValue - fromValue) * normalizedMix;

                return `rgba(${Math.round(lerp(fromColor.r, toColor.r))}, ${Math.round(
                    lerp(fromColor.g, toColor.g)
                )}, ${Math.round(lerp(fromColor.b, toColor.b))}, ${lerp(
                    fromColor.a,
                    toColor.a
                ).toFixed(3)})`;
            };
            const computeTitleImpactValues = (localImpactX, strength = 1) => {
                if (!titleImpactState) return [];

                const titleRect =
                    titleImpactState.titleInner.getBoundingClientRect();
                const dentSigma = Math.max(titleRect.width * 0.16, 56);

                return titleImpactState.titleChars.map((char) => {
                    const charRect = char.getBoundingClientRect();
                    const charCenterX = charRect.left + charRect.width / 2;
                    const dx = Math.abs(charCenterX - localImpactX);
                    const influence = Math.exp(
                        -(dx * dx) / (2 * dentSigma * dentSigma)
                    );
                    const isRoleLine = !!char.closest(
                        ".intro-center-title__line--role"
                    );
                    const lineFactor = isRoleLine ? 0.56 : 1;

                    return {
                        y: (4 + influence * 20 * lineFactor) *
                            (0.72 + strength * 0.46),
                        rotation: (charCenterX < localImpactX ? -1 : 1) *
                            influence *
                            8 *
                            lineFactor *
                            (0.72 + strength * 0.42),
                        influence,
                        charCenterX,
                    };
                });
            };
            const addTitleImpactPulse = (startTime, localImpactX, strength = 1) => {
                if (!titleImpactState) return;

                const dentValues = computeTitleImpactValues(
                    localImpactX,
                    strength
                );
                const charHighlightSnapshot = dentValues.map((value, index) => {
                    const previousValue =
                        titleImpactState.charHighlightLevels[index] || 0;
                    const sweepFeather = Math.max(22, avatarRadius * 0.9);
                    const sweepMix = Math.max(
                        0,
                        Math.min(
                            1,
                            ((value && typeof value.charCenterX === "number" ?
                                    value.charCenterX :
                                    localImpactX) -
                                localImpactX +
                                sweepFeather) /
                            sweepFeather
                        )
                    );
                    const impactMix = Math.max(
                        0,
                        Math.min(
                            1,
                            ((value && typeof value.influence === "number" ?
                                    value.influence :
                                    0) -
                                0.16) /
                            0.56
                        )
                    );
                    const nextValue = Math.max(
                        previousValue,
                        impactMix,
                        sweepMix
                    );

                    titleImpactState.charHighlightLevels[index] = nextValue;
                    return nextValue;
                });
                const compressDuration = 0.08;
                const recoverDuration = 0.22 + strength * 0.04;

                introTimeline
                    .to(
                        titleImpactState.titleInner, {
                            y: 6 + strength * 3,
                            scaleX: 1.02 + strength * 0.02,
                            scaleY: Math.max(0.82, 0.92 - strength * 0.06),
                            "--intro-title-impact-glow": 0.72 + strength * 0.28,
                            duration: compressDuration,
                            ease: "power2.out",
                        },
                        startTime
                    )
                    .to(
                        titleImpactState.titleChars, {
                            y: (index) => dentValues[index]?.y || 0,
                            rotation: (index) => dentValues[index]?.rotation || 0,
                            duration: compressDuration,
                            ease: "power2.out",
                            stagger: {
                                each: 0.0025,
                                from: "center",
                            },
                        },
                        startTime + compressDuration * 0.18
                    )
                    .to(
                        titleImpactState.titleChars, {
                            color: (index, el) =>
                                blendRgba(
                                    getTitleCharBaseColor(el),
                                    titleAccentColor,
                                    charHighlightSnapshot[index] || 0
                                ),
                            duration: 0.12,
                            ease: "power2.out",
                            stagger: {
                                each: 0.0025,
                                from: "center",
                            },
                        },
                        startTime
                    )
                    .to(
                        titleImpactState.titleChars, {
                            y: 0,
                            rotation: 0,
                            duration: recoverDuration,
                            ease: "elastic.out(1, 0.5)",
                            stagger: {
                                each: 0.0025,
                                from: "center",
                            },
                        },
                        startTime + compressDuration
                    )
                    .to(
                        titleImpactState.titleInner, {
                            y: 0,
                            scaleX: 1,
                            scaleY: 1,
                            "--intro-title-impact-glow": 0,
                            duration: recoverDuration + 0.02,
                            ease: "elastic.out(1, 0.46)",
                        },
                        startTime + compressDuration
                    );
            };
            const scheduleImpactSplash = (startTime, point, strength = 1) => {
                const splashY = clampViewportY(point.y + avatarRadius * 0.82);
                const driftMultiplier = 0.88 + strength * 0.16;

                introTimeline.set(
                    impactSplash, {
                        autoAlpha: 1,
                        left: point.x,
                        top: splashY,
                        scale: 0.42 + strength * 0.05,
                    },
                    startTime - 0.01
                );

                if (impactSplashCore) {
                    introTimeline
                        .set(
                            impactSplashCore, {
                                autoAlpha: 0,
                                scale: 0.16,
                            },
                            startTime - 0.012
                        )
                        .to(
                            impactSplashCore, {
                                autoAlpha: 0.94,
                                scale: 1.06 + strength * 0.1,
                                duration: 0.08,
                                ease: "power2.out",
                                force3D: true,
                            },
                            startTime - 0.01
                        )
                        .to(
                            impactSplashCore, {
                                autoAlpha: 0,
                                scale: 2 + strength * 0.24,
                                duration: 0.22,
                                ease: "power2.out",
                                force3D: true,
                            },
                            startTime + 0.07
                        );
                }

                if (impactSplashRing) {
                    introTimeline
                        .set(
                            impactSplashRing, {
                                autoAlpha: 0.78,
                                scale: 0.48,
                            },
                            startTime - 0.01
                        )
                        .to(
                            impactSplashRing, {
                                autoAlpha: 0,
                                scale: 1.7 + strength * 0.2,
                                duration: 0.3,
                                ease: "power2.out",
                                force3D: true,
                            },
                            startTime
                        );
                }

                impactSplashSparks.forEach((spark, index) => {
                    const dx = parseFloat(spark.dataset.dx || "0");
                    const dy = parseFloat(spark.dataset.dy || "0");
                    const isLineSpark = spark.classList.contains(
                        "intro-impact-splash__spark--line"
                    );

                    introTimeline.set(
                        spark, {
                            autoAlpha: isLineSpark ? 0.84 : 0.92,
                            x: 0,
                            y: 0,
                            scaleX: isLineSpark ? 0.18 : 0.24,
                            scaleY: isLineSpark ? 1 : 0.24,
                        },
                        startTime - 0.01 + index * 0.004
                    );

                    introTimeline.to(
                        spark, {
                            autoAlpha: 0,
                            x: dx * driftMultiplier,
                            y: dy * driftMultiplier,
                            scaleX: isLineSpark ? 1.14 : 0.05,
                            scaleY: isLineSpark ? 1 : 0.05,
                            duration: isLineSpark ? 0.24 : 0.28,
                            ease: "power2.out",
                            force3D: true,
                        },
                        startTime + index * 0.006
                    );
                });

                introTimeline.to(
                    impactSplash, {
                        autoAlpha: 0,
                        scale: 0.94 + strength * 0.06,
                        duration: 0.16,
                        ease: "power1.out",
                        force3D: true,
                    },
                    startTime + 0.22
                );
            };
            let avatarLastMotionX = avatarStartX;
            let avatarLastMotionY = avatarStartY;
            const setAvatarMotionPosition = (point, options = {}) => {
                const nextX =
                    options.clampX === false ? point.x : clampViewportX(point.x);
                const nextY =
                    options.clampY === false ? point.y : clampViewportY(point.y);

                window.gsap.set(avatarGhost, {
                    left: nextX,
                    top: nextY,
                });

                return {
                    x: nextX,
                    y: nextY
                };
            };
            const captureAvatarPosition = (point = null) => {
                if (point) {
                    avatarLastMotionX = point.x;
                    avatarLastMotionY = point.y;
                    return;
                }

                avatarLastMotionX = parseFloat(
                    window.gsap.getProperty(avatarGhost, "left")
                );
                avatarLastMotionY = parseFloat(
                    window.gsap.getProperty(avatarGhost, "top")
                );
            };
            const updateAvatarTail = (point = null) => {
                const nextX = point ?
                    point.x :
                    parseFloat(window.gsap.getProperty(avatarGhost, "left"));
                const nextY = point ?
                    point.y :
                    parseFloat(window.gsap.getProperty(avatarGhost, "top"));
                const velocityX = nextX - avatarLastMotionX;
                const velocityY = nextY - avatarLastMotionY;

                avatarLastMotionX = nextX;
                avatarLastMotionY = nextY;

                const tailAngle =
                    (Math.atan2(velocityY, velocityX) * 180) / Math.PI;
                const tailSpeed = Math.hypot(velocityX, velocityY);
                const tailEnergy = Math.max(0, Math.min(1, tailSpeed / 18));
                const tailOpacity = Math.min(0.72, tailEnergy * 0.72);
                const tailLength = 30 + tailEnergy * 30;
                const tailThickness = 10 + tailEnergy * 5;
                const tailBlur = 7 + tailEnergy * 4;
                const tailFlareOpacity = tailOpacity * 0.52;
                const tailFlareScale = 0.76 + tailEnergy * 0.26;

                window.gsap.set(avatarGhost, {
                    "--avatar-tail-opacity": tailOpacity,
                    "--avatar-tail-length": `${tailLength}px`,
                    "--avatar-tail-thickness": `${tailThickness}px`,
                    "--avatar-tail-rotation": `${tailAngle}deg`,
                    "--avatar-tail-blur": `${tailBlur}px`,
                    "--avatar-tail-flare-opacity": tailFlareOpacity,
                    "--avatar-tail-flare-scale": tailFlareScale,
                });
            };
            const getQuadraticPoint = (startPoint, controlPoint, endPoint, progress) => {
                const t = Math.max(0, Math.min(1, progress));
                const inverseT = 1 - t;

                return {
                    x: inverseT * inverseT * startPoint.x +
                        2 * inverseT * t * controlPoint.x +
                        t * t * endPoint.x,
                    y: inverseT * inverseT * startPoint.y +
                        2 * inverseT * t * controlPoint.y +
                        t * t * endPoint.y,
                };
            };
            const scheduleAvatarParabolaMotion = (
                startTime,
                startPoint,
                controlPoint,
                endPoint,
                duration,
                transformEase,
                visualProps = {},
                motionOptions = {}
            ) => {
                const motionProgress = {
                    value: 0
                };

                introTimeline.to(
                    motionProgress, {
                        value: 1,
                        duration,
                        ease: "none",
                        onStart: () => {
                            const normalizedStartPoint =
                                setAvatarMotionPosition(startPoint, motionOptions);
                            captureAvatarPosition(normalizedStartPoint);
                        },
                        onUpdate: () => {
                            const nextPoint = setAvatarMotionPosition(
                                getQuadraticPoint(
                                    startPoint,
                                    controlPoint,
                                    endPoint,
                                    motionProgress.value
                                ),
                                motionOptions
                            );
                            updateAvatarTail(nextPoint);
                        },
                    },
                    startTime
                );

                if (!Object.keys(visualProps).length) return;

                introTimeline.to(
                    avatarGhost, {
                        duration,
                        ease: transformEase,
                        force3D: true,
                        ...visualProps,
                    },
                    startTime
                );
            };
            const fadeAvatarTail = (startTime, duration = 0.08) => {
                introTimeline.to(
                    avatarGhost, {
                        "--avatar-tail-opacity": 0,
                        "--avatar-tail-flare-opacity": 0,
                        duration,
                        ease: "power1.out",
                    },
                    startTime
                );
            };
            const avatarAppearAdvance = 0.5;
            const avatarMaterializeLead = 0.12;
            const avatarMaterializeStart = titleTypewriterChars ?
                Math.max(0, titleRevealHalfTime - avatarAppearAdvance) :
                0.12;
            const avatarMaterializeDuration = avatarHasNoRing ? 0.24 : 0.16;
            const avatarEntryStart = avatarMaterializeStart + avatarMaterializeLead;
            const avatarEntryFallDuration = 0.24;
            const bounceRiseDuration1 = 0.16;
            const bounceFallDuration1 = 0.18;
            const bounceRiseDuration2 = 0.14;
            const bounceFallDuration2 = 0.16;
            const avatarFinalRiseDuration = 0.24;
            const avatarFinalDropDuration = avatarHasNoRing ? 0.32 : 0.3;
            const avatarFinalSettleDuration = 0.18;
            const avatarEntryControlPoint = {
                x: avatarStartX -
                    (avatarStartX - bounceLandings[0].x) * 0.28,
                y: clampViewportY(
                    Math.min(avatarStartY, bounceLandings[0].y) -
                    Math.max(28, avatarRadius * 0.9)
                ),
            };
            const bouncePeaks = [{
                x: clampViewportX(
                    bounceLandings[0].x +
                    (bounceLandings[1].x - bounceLandings[0].x) * 0.46
                ),
                y: clampViewportY(
                    Math.min(bounceLandings[0].y, bounceLandings[1].y) -
                    Math.max(58, avatarRadius * 1.9)
                ),
            }, {
                x: clampViewportX(
                    bounceLandings[1].x +
                    (bounceLandings[2].x - bounceLandings[1].x) * 0.48
                ),
                y: clampViewportY(
                    Math.min(bounceLandings[1].y, bounceLandings[2].y) -
                    Math.max(42, avatarRadius * 1.45)
                ),
            }, ];
            const bounce1ImpactTime = avatarEntryStart + avatarEntryFallDuration;
            const bounce2RiseStart = bounce1ImpactTime + 0.01;
            const bounce2ImpactTime =
                bounce2RiseStart + bounceRiseDuration1 + bounceFallDuration1;
            const bounce3RiseStart = bounce2ImpactTime + 0.01;
            const bounce3ImpactTime =
                bounce3RiseStart + bounceRiseDuration2 + bounceFallDuration2;
            const avatarFinalArcStart = bounce3ImpactTime + 0.06;
            const bounceTravelDuration1 =
                bounceRiseDuration1 + bounceFallDuration1;
            const bounceTravelDuration2 =
                bounceRiseDuration2 + bounceFallDuration2;
            const avatarFinalArcDuration =
                avatarFinalRiseDuration + avatarFinalDropDuration;
            const avatarFinalLandingPoint = {
                x: motionFinalX,
                y: clampViewportY(motionFinalY + avatarFinalBounce),
            };
            const avatarFinalLandingTime =
                avatarFinalArcStart +
                avatarFinalRiseDuration +
                avatarFinalDropDuration;

            addTitleImpactPulse(bounce1ImpactTime, bounceLandings[0].x, 0.76);
            addTitleImpactPulse(bounce2ImpactTime, bounceLandings[1].x, 0.92);
            addTitleImpactPulse(bounce3ImpactTime, bounceLandings[2].x, 1.08);

            scheduleImpactSplash(bounce1ImpactTime, bounceLandings[0], 0.82);
            scheduleImpactSplash(bounce2ImpactTime, bounceLandings[1], 0.94);
            scheduleImpactSplash(bounce3ImpactTime, bounceLandings[2], 1.08);

            introTimeline.to(
                avatarGhost, {
                    autoAlpha: 1,
                    filter: "blur(0px)",
                    duration: avatarMaterializeDuration,
                    ease: "power2.out",
                    force3D: true,
                },
                avatarMaterializeStart
            );

            scheduleAvatarParabolaMotion(
                avatarEntryStart, {
                    x: avatarStartX,
                    y: avatarStartY
                },
                avatarEntryControlPoint,
                bounceLandings[0],
                avatarEntryFallDuration,
                "power2.in", {
                    rotation: avatarHasNoRing ? -12 : -10,
                    scaleX: 1.18,
                    scaleY: 0.82,
                }, {
                    clampX: false
                }
            );
            fadeAvatarTail(bounce1ImpactTime + 0.01);
            scheduleAvatarParabolaMotion(
                bounce2RiseStart,
                bounceLandings[0],
                bouncePeaks[0],
                bounceLandings[1],
                bounceTravelDuration1,
                "power2.out", {
                    rotation: 10,
                    scaleX: 0.94,
                    scaleY: 1.08,
                }
            );
            fadeAvatarTail(bounce2ImpactTime + 0.01);
            scheduleAvatarParabolaMotion(
                bounce3RiseStart,
                bounceLandings[1],
                bouncePeaks[1],
                bounceLandings[2],
                bounceTravelDuration2,
                "power2.out", {
                    rotation: 8,
                    scaleX: 0.96,
                    scaleY: 1.06,
                }
            );
            fadeAvatarTail(bounce3ImpactTime + 0.02);
            scheduleAvatarParabolaMotion(
                avatarFinalArcStart,
                bounceLandings[2],
                finalArcPeak,
                avatarFinalLandingPoint,
                avatarFinalArcDuration,
                "power2.out", {
                    rotation: -10,
                    scaleX: 0.96,
                    scaleY: 1.06,
                }
            );
            introTimeline.to(
                avatarGhost, {
                    left: motionFinalX,
                    top: motionFinalY,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                    "--avatar-tail-opacity": 0,
                    "--avatar-tail-flare-opacity": 0,
                    duration: avatarFinalSettleDuration,
                    ease: "back.out(2.1)",
                    force3D: true,
                },
                avatarFinalLandingTime
            );

            if (avatarHasNoRing) {
                introTimeline.to(
                    avatarGhost, {
                        "--avatar-no-ring-aura-opacity": 0,
                        "--avatar-no-ring-aura-scale": 0.82,
                        "--avatar-no-ring-ring-opacity": 0,
                        "--avatar-no-ring-ring-scale": 0.88,
                        "--avatar-no-ring-streak-opacity": 0,
                        "--avatar-no-ring-streak-shift": "0px",
                        "--avatar-no-ring-flare-opacity": 0,
                        "--avatar-no-ring-flare-scale": 0.88,
                        "--avatar-no-ring-image-scale": 0.92,
                        "--avatar-no-ring-image-y": "2px",
                        "--avatar-no-ring-image-brightness": 1.1,
                        "--avatar-no-ring-image-saturate": 1.1,
                        "--avatar-no-ring-image-shadow-alpha": 0,
                        "--avatar-no-ring-tilt": "0deg",
                        duration: avatarMaterializeDuration,
                        ease: "power2.out",
                    },
                    avatarMaterializeStart
                );

                introTimeline.to(
                    avatarGhost, {
                        "--avatar-no-ring-aura-opacity": 0,
                        "--avatar-no-ring-aura-scale": 0.9,
                        "--avatar-no-ring-ring-opacity": 0,
                        "--avatar-no-ring-ring-scale": 0.94,
                        "--avatar-no-ring-streak-opacity": 0,
                        "--avatar-no-ring-streak-shift": "0px",
                        "--avatar-no-ring-flare-opacity": 0,
                        "--avatar-no-ring-flare-scale": 0.92,
                        "--avatar-no-ring-image-scale": 1,
                        "--avatar-no-ring-image-y": "0px",
                        "--avatar-no-ring-image-brightness": 1.18,
                        "--avatar-no-ring-image-saturate": 1.16,
                        "--avatar-no-ring-image-shadow-alpha": 0,
                        "--avatar-no-ring-tilt": "0deg",
                        duration: bounceRiseDuration1 + bounceFallDuration1,
                        ease: "power2.out",
                    },
                    bounce1ImpactTime
                );

                introTimeline.to(
                    avatarGhost, {
                        "--avatar-no-ring-aura-opacity": 0,
                        "--avatar-no-ring-aura-scale": 0.88,
                        "--avatar-no-ring-ring-opacity": 0,
                        "--avatar-no-ring-ring-scale": 1.18,
                        "--avatar-no-ring-streak-opacity": 0,
                        "--avatar-no-ring-streak-shift": "8px",
                        "--avatar-no-ring-flare-opacity": 0,
                        "--avatar-no-ring-flare-scale": 0.96,
                        "--avatar-no-ring-image-scale": 0.9,
                        "--avatar-no-ring-image-y": "1px",
                        "--avatar-no-ring-image-brightness": 1.02,
                        "--avatar-no-ring-image-saturate": 1.02,
                        "--avatar-no-ring-image-shadow-alpha": 0,
                        "--avatar-no-ring-tilt": "0deg",
                        duration: avatarFinalDropDuration + avatarFinalSettleDuration,
                        ease: "power1.out",
                    },
                    avatarFinalArcStart + avatarFinalRiseDuration
                );
            }

            let avatarMotionEndTime =
                avatarFinalLandingTime + avatarFinalSettleDuration;

            const avatarRollDoneTime = avatarMotionEndTime + 0.02;
            const sidebarRevealStart = avatarRollDoneTime + 0.04;
            const avatarFlashTime = sidebarRevealStart + 0.02;
            const revealTargetsStart = sidebarRevealStart + 0.26;
            const navItemsStart = sidebarRevealStart + 0.3;

            introTimeline
                .call(
                    () => {
                        notifyAvatarRollDone();
                        avatarGhost.classList.remove("is-rolling");
                    },
                    null,
                    avatarRollDoneTime
                )
                .to(
                    headerSidebar, {
                        clipPath: expandedClip,
                        duration: 1.18,
                        ease: "power2.out",
                    },
                    sidebarRevealStart
                )
                .call(
                    () => {
                        if (!avatarHasNoRing) {
                            avatar.classList.remove("avatar-final-flash");
                            void avatar.offsetWidth;
                            avatar.classList.add("avatar-final-flash");
                        }
                    },
                    null,
                    avatarFlashTime
                )
                .to(
                    revealTargets, {
                        autoAlpha: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.46,
                        stagger: 0.08,
                    },
                    revealTargetsStart
                )
                .to(
                    navItems, {
                        autoAlpha: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.52,
                        stagger: 0.08,
                    },
                    navItemsStart
                );
        });
    };

    /* handleFeaturedProjectReveal
  -------------------------------------------------------------------------*/
    const handleFeaturedProjectReveal = () => {
        const section = document.querySelector("#portfolio");
        const cardsWrap = section?.querySelector(".tabs-content-wrap");
        const cards = cardsWrap ?
            Array.from(cardsWrap.querySelectorAll(".portfolio-item")) : [];

        if (!section || !cardsWrap || !cards.length) return;

        section.classList.remove("is-sequence-mode");
        section.classList.remove("portfolio-reveal-complete");

        const showCardsNormally = () => {
            cards.forEach((card) => {
                card.style.removeProperty("transform");
                card.style.removeProperty("opacity");
                card.style.removeProperty("visibility");
            });
        };

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const hasGsapScrollTrigger =
            typeof window.gsap !== "undefined" &&
            typeof window.ScrollTrigger !== "undefined";

        if (prefersReducedMotion || !hasGsapScrollTrigger || isMobile) {
            showCardsNormally();
            return;
        }

        const getCenterOffset = (card) => {
            const wrapRect = cardsWrap.getBoundingClientRect();
            const centerX = wrapRect.left + wrapRect.width / 2;
            const centerY = wrapRect.top + wrapRect.height / 2;

            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            return {
                x: centerX - cardCenterX,
                y: centerY - cardCenterY + 24,
            };
        };

        cards.forEach((card) => {
            window.gsap.set(card, {
                autoAlpha: 0
            });
        });

        cards.forEach((card, index) => {
            const tiltDir = index % 2 === 0 ? 1 : -1;
            card.style.setProperty("--portfolio-tilt-dir", `${tiltDir}`);
        });

        const timeline = window.gsap.timeline({
            defaults: {
                ease: "none"
            },
        });
        const revealOffsets = [0, 0.22, 0.52, 0.84];
        const revealDurations = [0.56, 0.58, 0.62, 0.66];

        cards.forEach((card, index) => {
            const dir = index % 2 === 0 ? -1 : 1;
            const media = card.querySelector(".img-style img, .img-style video");
            const tag = card.querySelector(".tag");
            const title = card.querySelector(".title");
            const imgWrap = card.querySelector(".img-style");
            let beam = null;

            if (imgWrap) {
                beam = imgWrap.querySelector(".project-reveal-beam");
                if (!beam) {
                    beam = document.createElement("span");
                    beam.className = "project-reveal-beam";
                    imgWrap.appendChild(beam);
                }
                window.gsap.set(beam, {
                    autoAlpha: 0,
                    xPercent: -150
                });
            }

            const revealAt =
                revealOffsets[index] ??
                revealOffsets[revealOffsets.length - 1] +
                (index - revealOffsets.length + 1) * 0.64;
            const revealDuration =
                revealDurations[index] ?? revealDurations[revealDurations.length - 1];

            timeline.fromTo(
                card, {
                    x: () => getCenterOffset(card).x,
                    y: () => getCenterOffset(card).y,
                    autoAlpha: 0,
                    scale: 0.82,
                    rotation: dir * 10,
                    skewX: dir * 5,
                    filter: "blur(14px) saturate(0.55)",
                }, {
                    x: 0,
                    y: 0,
                    autoAlpha: 1,
                    scale: 1,
                    rotation: 0,
                    skewX: 0,
                    filter: "blur(0px) saturate(1)",
                    duration: revealDuration,
                    immediateRender: false,
                },
                revealAt
            );

            if (media) {
                timeline.fromTo(
                    media, {
                        scale: 1.24,
                        rotation: dir * 2.4,
                        filter: "brightness(0.72) saturate(0.7)",
                    }, {
                        scale: 1.04,
                        rotation: 0,
                        filter: "brightness(1) saturate(1)",
                        duration: revealDuration * 0.9,
                        immediateRender: false,
                    },
                    revealAt + 0.03
                );
            }

            if (tag) {
                timeline.fromTo(
                    tag, {
                        y: 28,
                        autoAlpha: 0
                    }, {
                        y: 0,
                        autoAlpha: 1,
                        duration: revealDuration * 0.6,
                        immediateRender: false,
                    },
                    revealAt + 0.12
                );
            }

            if (title) {
                timeline.fromTo(
                    title, {
                        y: 24,
                        autoAlpha: 0
                    }, {
                        y: 0,
                        autoAlpha: 1,
                        duration: revealDuration * 0.62,
                        immediateRender: false,
                    },
                    revealAt + 0.17
                );
            }

            if (beam) {
                const beamStart = revealAt + revealDuration * 0.35;
                timeline.fromTo(
                    beam, {
                        xPercent: -150,
                        autoAlpha: 0
                    }, {
                        xPercent: 150,
                        autoAlpha: 0.85,
                        duration: revealDuration * 0.45,
                        immediateRender: false,
                    },
                    beamStart
                );
                timeline.to(
                    beam, {
                        autoAlpha: 0,
                        duration: revealDuration * 0.2,
                    },
                    beamStart + revealDuration * 0.28
                );
            }
        });

        let hasLockedFinalState = false;
        window.ScrollTrigger.create({
            trigger: section,
            start: "top 62%",
            end: `+=${cards.length * 240}`,
            scrub: 0.45,
            animation: timeline,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                if (self.progress >= 0.995) {
                    section.classList.add("portfolio-reveal-complete");
                }
            },
            onLeave: (self) => {
                if (hasLockedFinalState) return;
                hasLockedFinalState = true;
                section.classList.add("portfolio-reveal-complete");
                timeline.progress(1);
                window.gsap.set(cards, {
                    clearProps: "transform,opacity,visibility,filter",
                });
                window.gsap.set(
                    cards
                    .map((card) =>
                        card.querySelector(".img-style img, .img-style video")
                    )
                    .filter(Boolean), {
                        clearProps: "transform,filter",
                    }
                );
                window.gsap.set(
                    cards.flatMap((card) =>
                        Array.from(
                            card.querySelectorAll(".tag, .title, .project-reveal-beam")
                        )
                    ), {
                        clearProps: "transform,opacity,visibility",
                    }
                );
                self.kill(false);
            },
        });

        window.ScrollTrigger.refresh();
    };

    const handleMobilePortfolioReveal = () => {
        const section = document.querySelector("#portfolio");
        if (!section) return;

        const items = Array.from(section.querySelectorAll(".portfolio-item"));
        if (!items.length) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        if (!isMobile) {
            items.forEach((item) => {
                item.classList.remove("mobile-reveal-ready", "is-mobile-revealed");
                item.style.removeProperty("--mobile-reveal-delay");
            });
            return;
        }

        items.forEach((item, index) => {
            item.classList.add("mobile-reveal-ready");
            item.style.setProperty(
                "--mobile-reveal-delay",
                `${(index * 0.08).toFixed(2)}s`
            );
        });

        if (prefersReducedMotion) {
            items.forEach((item) => item.classList.add("is-mobile-revealed"));
            return;
        }

        const revealItem = (item) => {
            if (item.classList.contains("is-mobile-revealed")) return;
            item.classList.add("is-mobile-revealed");
        };

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        revealItem(entry.target);
                        obs.unobserve(entry.target);
                    });
                }, {
                    root: null,
                    threshold: 0.2,
                }
            );

            items.forEach((item) => observer.observe(item));
        } else {
            const revealVisible = () => {
                items.forEach((item) => {
                    if (item.classList.contains("is-mobile-revealed")) return;
                    if (!item.offsetParent) return;
                    const rect = item.getBoundingClientRect();
                    const viewportHeight =
                        window.innerHeight || document.documentElement.clientHeight;
                    if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) {
                        revealItem(item);
                    }
                });
            };

            window.addEventListener("scroll", revealVisible, {
                passive: true
            });
            window.addEventListener("resize", revealVisible);
            revealVisible();
        }
    };

    /* handleUserBarGlowEffect
  -------------------------------------------------------------------------*/
    const handleUserBarGlowEffect = () => {
        return new Promise((resolve) => {
            const $userBar = $(".main-content.style-fullwidth .user-bar.style-1");
            if (!$userBar.length) {
                resolve();
                return;
            }

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                $userBar.removeClass("is-intro-animating").addClass("is-intro-finished");
                resolve();
                return;
            }

            let hasResolved = false;
            const finishIntro = () => {
                if (hasResolved) return;
                hasResolved = true;
                $userBar.removeClass("is-intro-animating").addClass("is-intro-finished");
                resolve();
            };

            $userBar.removeClass("is-intro-finished").addClass("is-intro-animating");

            $userBar
                .off("animationend.handleUserBarIntro")
                .one("animationend.handleUserBarIntro", function(e) {
                    if (
                        e.originalEvent &&
                        e.originalEvent.animationName !== "user-bar-reveal"
                    ) {
                        return;
                    }
                    finishIntro();
                });

            setTimeout(finishIntro, 1650);

            const allowTouchGlow = window.matchMedia(
                "(hover: hover) and (pointer: fine) and (min-width: 1150px)"
            ).matches;

            if (allowTouchGlow && !$userBar.data("touchGlowBound")) {
                let touchTimer;
                $userBar.on("touchstart touchmove", function() {
                    $userBar.addClass("is-touch-active");
                    clearTimeout(touchTimer);
                });
                $userBar.on("touchend touchcancel", function() {
                    clearTimeout(touchTimer);
                    touchTimer = setTimeout(() => {
                        $userBar.removeClass("is-touch-active");
                    }, 220);
                });
                $userBar.data("touchGlowBound", "true");
            } else if (!allowTouchGlow) {
                $userBar.removeClass("is-touch-active");
            }
        });
    };

    const handlePortfolioPopupLinks = () => {
        const $items = $("#portfolio .portfolio-item");
        if (!$items.length) return;

        $items.each(function() {
            const $item = $(this);
            const $mediaLink = $item
                .find(".img-style[data-fancybox], .img-style.js-open-project-video-modal")
                .first();
            const $titleLink = $item.find(".title .link").first();

            if (!$mediaLink.length || !$titleLink.length) return;

            const mediaHref = $mediaLink.attr("href");
            if (
                mediaHref &&
                (!$titleLink.attr("href") || $titleLink.attr("href") === "#")
            ) {
                $titleLink.attr("href", mediaHref);
            }

            $titleLink
                .off("click.handlePortfolioPopup")
                .on("click.handlePortfolioPopup", function(e) {
                    e.preventDefault();
                    $mediaLink.trigger("click");
                });
        });
    };

    const handleProjectVideoModal = () => {
        const $modal = $("#project-video-modal");
        const $triggers = $(".js-open-project-video-modal");
        const $video = $modal.find(".project-video-modal__video").first();
        const $videoSource = $video.find("source").first();
        const $dialog = $modal.find(".project-video-modal__dialog").first();
        if (
            !$modal.length ||
            !$triggers.length ||
            !$video.length ||
            !$videoSource.length ||
            !$dialog.length
        ) {
            return;
        }

        const $body = $("body");
        const defaultLabel = $dialog.attr("aria-label") || "Project video";
        let lastFocusedElement = null;

        const resetVideo = () => {
            const videoElement = $video.get(0);
            if (!videoElement) return;

            videoElement.pause();
            try {
                videoElement.currentTime = 0;
            } catch (_error) {
                // Some browsers block currentTime changes until metadata is ready.
            }
        };

        const configureVideo = ($trigger) => {
            const source = $trigger.attr("data-video-src");
            const poster = $trigger.attr("data-video-poster") || "";
            const label = $trigger.attr("data-video-label") || defaultLabel;
            const videoElement = $video.get(0);
            const sourceElement = $videoSource.get(0);

            if (!videoElement || !sourceElement || !source) return;

            if ((sourceElement.getAttribute("src") || "") !== source) {
                sourceElement.setAttribute("src", source);
                videoElement.load();
            }

            if (poster) {
                videoElement.setAttribute("poster", poster);
            } else {
                videoElement.removeAttribute("poster");
            }

            $dialog.attr("aria-label", label);
        };

        const openModal = ($trigger) => {
            lastFocusedElement = document.activeElement;
            configureVideo($trigger);
            $modal.addClass("is-open").attr("aria-hidden", "false");
            $body.addClass("project-video-modal-open");

            const videoElement = $video.get(0);
            if (!videoElement) return;

            setTimeout(() => {
                try {
                    videoElement.currentTime = 0;
                } catch (_error) {
                    // Ignore metadata timing issues and continue opening the modal.
                }

                const playResult = videoElement.play();
                if (playResult && typeof playResult.catch === "function") {
                    playResult.catch(() => {});
                }
            }, 60);
        };

        const closeModal = () => {
            if (!$modal.hasClass("is-open")) return;

            $modal.removeClass("is-open").attr("aria-hidden", "true");
            $body.removeClass("project-video-modal-open");
            resetVideo();

            if (
                lastFocusedElement &&
                typeof lastFocusedElement.focus === "function"
            ) {
                lastFocusedElement.focus();
            }
        };

        $triggers
            .off("click.handleProjectVideoModal")
            .on("click.handleProjectVideoModal", function(e) {
                e.preventDefault();
                openModal($(this));
            });

        $modal
            .off("click.handleProjectVideoModal", "[data-close-project-video]")
            .on("click.handleProjectVideoModal", "[data-close-project-video]", function(e) {
                e.preventDefault();
                closeModal();
            });

        $(document)
            .off("keydown.handleProjectVideoModal")
            .on("keydown.handleProjectVideoModal", function(e) {
                if (e.key === "Escape") {
                    closeModal();
                }
            });
    };

    /* lockUserBarScrollOnHover
  -------------------------------------------------------------------------*/
    const lockUserBarScrollOnHover = () => {
        const userBar = document.querySelector(
            ".main-content.style-fullwidth .user-bar.style-1"
        );
        if (!userBar || userBar.dataset.scrollLockBound === "true") return;

        userBar.addEventListener(
            "wheel",
            (event) => {
                event.preventDefault();
            }, {
                passive: false
            }
        );

        userBar.dataset.scrollLockBound = "true";
    };

    /* handleAboutIntroSequence
  -------------------------------------------------------------------------*/
    const handleAboutIntroSequence = () => {
        return new Promise((resolve) => {
            const aboutSection = document.querySelector("#about");
            if (!aboutSection) {
                resolve();
                return;
            }

            const aboutTargets = Array.from(aboutSection.children);
            if (!aboutTargets.length) {
                resolve();
                return;
            }

            const aboutTitleTarget = aboutSection.querySelector(".about-title-follow");
            const aboutTitleWrap = aboutTitleTarget ?
                aboutTitleTarget.closest(".heading-section") :
                null;
            const orderedAboutTargets = aboutTargets.filter(
                (target) => target !== aboutTitleWrap
            );

            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const hasGsap = typeof window.gsap !== "undefined";

            if (prefersReducedMotion || !hasGsap) {
                aboutSection.classList.add("is-intro-finished");
                if (aboutTitleWrap) {
                    aboutTitleWrap.style.removeProperty("opacity");
                    aboutTitleWrap.style.removeProperty("visibility");
                    aboutTitleWrap.style.removeProperty("transform");
                    aboutTitleWrap.style.removeProperty("filter");
                }
                orderedAboutTargets.forEach((target) => {
                    target.style.removeProperty("opacity");
                    target.style.removeProperty("visibility");
                    target.style.removeProperty("transform");
                    target.style.removeProperty("filter");
                });
                resolve();
                return;
            }

            window.gsap.to(orderedAboutTargets, {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                stagger: 0.09,
                ease: "power3.out",
                onStart: () => {
                    if (aboutTitleWrap) {
                        window.gsap.set(aboutTitleWrap, {
                            autoAlpha: 1,
                            y: 0,
                            filter: "blur(0px)",
                        });
                    }
                    if (typeof window.playAboutTitleReveal === "function") {
                        window.playAboutTitleReveal();
                    }
                },
                onComplete: () => {
                    if (aboutTitleWrap) {
                        window.gsap.set(aboutTitleWrap, {
                            clearProps: "opacity,visibility,transform,filter",
                        });
                    }
                    window.gsap.set(orderedAboutTargets, {
                        clearProps: "opacity,visibility,transform,filter",
                    });
                    aboutSection.classList.add("is-intro-finished");
                    resolve();
                },
            });
        });
    };

    /* handleCenterIntroTitle
  -------------------------------------------------------------------------*/
    const handleCenterIntroTitle = () => {
        let title = document.querySelector(".intro-center-title");
        if (title) return title;

        const createCharSpans = (text) => {
            const fragment = document.createDocumentFragment();
            Array.from(text).forEach((char) => {
                const span = document.createElement("span");
                span.className = "intro-center-title__char";
                if (char === " ") {
                    span.classList.add("is-space");
                    span.textContent = "\u00A0";
                } else {
                    span.textContent = char;
                }
                fragment.appendChild(span);
            });
            return fragment;
        };

        title = document.createElement("div");
        title.className = "intro-center-title";

        const inner = document.createElement("div");
        inner.className = "intro-center-title__inner";

        const nameLine = document.createElement("div");
        nameLine.className = "intro-center-title__line intro-center-title__line--name";
        nameLine.appendChild(createCharSpans("TRUONG THE NHAT"));

        const roleLine = document.createElement("div");
        roleLine.className = "intro-center-title__line intro-center-title__line--role";
        roleLine.appendChild(createCharSpans("PORTFOLIO"));

        inner.appendChild(nameLine);
        inner.appendChild(roleLine);
        title.appendChild(inner);
        document.body.appendChild(title);
        return title;
    };

    /* runOrderedIntroSequence
  -------------------------------------------------------------------------*/
    const runOrderedIntroSequence = async () => {
        const setCounterIntroReady = (isReady) => {
            if (!document.body || !document.querySelector(".counter-scroll")) {
                return;
            }
            document.body.dataset.counterIntroReady = isReady ? "true" : "false";
        };

        if (!hasIntroSequence()) return;

        setIntroLockState(true);
        setCounterIntroReady(false);

        try {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const hasGsap = typeof window.gsap !== "undefined";
            const userBar = document.querySelector(
                ".main-content.style-fullwidth .user-bar.style-1"
            );
            const aboutSection = document.querySelector("#about");
            const aboutTargets = aboutSection ? Array.from(aboutSection.children) : [];
            const centerIntroTitle = handleCenterIntroTitle();
            const replayAboutCounters = () => {
                const counterItems = Array.from(
                    document.querySelectorAll("#about .counter-item")
                );
                if (!counterItems.length) return;

                if (typeof window.resetCountersToZero === "function") {
                    window.resetCountersToZero();
                } else {
                    counterItems.forEach((item) => {
                        item.classList.remove("counted");

                        const odometerEl = item.querySelector(".odometer");
                        if (!odometerEl) return;

                        if (
                            odometerEl.odometer &&
                            typeof odometerEl.odometer.update === "function"
                        ) {
                            odometerEl.odometer.update(0);
                        } else {
                            odometerEl.textContent = "0";
                        }
                    });
                }

                if (typeof window.checkCounters === "function") {
                    window.requestAnimationFrame(() => {
                        window.checkCounters();
                    });
                }
            };
            let userBarIntroPromise = null;
            let userBarVisiblePromise = Promise.resolve();
            const prepareUserBarNameFill = (nameElement) => {
                if (!(nameElement instanceof Element)) {
                    return {
                        allChars: [],
                        solidChars: []
                    };
                }

                let sourceText = nameElement.dataset.fillSourceText;
                if (!sourceText) {
                    sourceText = (nameElement.textContent || "").trim();
                    nameElement.dataset.fillSourceText = sourceText;
                }

                const existingChars = nameElement.querySelectorAll(
                    ".userbar-name-fill__char"
                );
                if (!existingChars.length) {
                    const wrap = document.createElement("span");
                    wrap.className = "userbar-name-fill";

                    Array.from(sourceText).forEach((char) => {
                        const charSpan = document.createElement("span");
                        charSpan.className = "userbar-name-fill__char";
                        if (char === " ") {
                            charSpan.classList.add("is-space");
                            charSpan.textContent = "\u00A0";
                        } else {
                            charSpan.textContent = char;
                        }
                        wrap.appendChild(charSpan);
                    });

                    nameElement.textContent = "";
                    nameElement.appendChild(wrap);
                }

                const allChars = Array.from(
                    nameElement.querySelectorAll(".userbar-name-fill__char")
                );
                const solidChars = allChars.filter(
                    (charElement) => !charElement.classList.contains("is-space")
                );
                return {
                    allChars,
                    solidChars
                };
            };

            const startUserBarIntro = () => {
                if (userBarIntroPromise) return userBarIntroPromise;

                if (hasGsap && !prefersReducedMotion) {
                    userBarVisiblePromise = new Promise((resolveVisible) => {
                        const introTimeline = window.gsap.timeline();
                        const userBarName = document.querySelector(
                            ".main-content.style-fullwidth .user-bar.style-1 .box-author .name, .main-content.style-fullwidth .user-bar.style-1 .box-author .info .name"
                        );
                        const preparedUserBarName = prepareUserBarNameFill(userBarName);
                        const userBarNameChars = preparedUserBarName.solidChars;

                        if (userBar) {
                            introTimeline.to(
                                userBar, {
                                    autoAlpha: 1,
                                    duration: 0.22,
                                    ease: "power2.out",
                                    onComplete: resolveVisible,
                                },
                                0
                            );
                        } else {
                            resolveVisible();
                        }

                        if (userBarNameChars.length) {
                            window.gsap.set(userBarNameChars, {
                                autoAlpha: 0,
                                y: 11,
                                scale: 0.84,
                                filter: "blur(8px)",
                                textShadow: "0 0 0 rgba(69, 231, 123, 0)",
                            });
                        }

                        if (centerIntroTitle) {
                            const titleInner =
                                centerIntroTitle.querySelector(
                                    ".intro-center-title__inner"
                                ) || centerIntroTitle;
                            const titleChars = Array.from(
                                centerIntroTitle.querySelectorAll(
                                    ".intro-center-title__char:not(.is-space)"
                                )
                            );

                            if (userBarName && userBarNameChars.length && titleChars.length && titleInner) {
                                const targetRect = userBarName.getBoundingClientRect();
                                const targetX = targetRect.left + targetRect.width / 2;
                                const targetY = targetRect.top + targetRect.height / 2;
                                const innerRect = titleInner.getBoundingClientRect();
                                const innerX = innerRect.left + innerRect.width / 2;
                                const innerY = innerRect.top + innerRect.height / 2;
                                const innerDx = targetX - innerX;
                                const innerDy = targetY - innerY;
                                const targetSlots = userBarNameChars.length;
                                const titleCount = Math.max(titleChars.length - 1, 1);

                                titleChars.forEach((char, index) => {
                                    const rect = char.getBoundingClientRect();
                                    const charX = rect.left + rect.width / 2;
                                    const charY = rect.top + rect.height / 2;
                                    const slotIndex = Math.round(
                                        (index / titleCount) * (targetSlots - 1)
                                    );
                                    const targetChar = userBarNameChars[slotIndex];
                                    const targetCharRect =
                                        targetChar.getBoundingClientRect();
                                    const slotX =
                                        targetCharRect.left + targetCharRect.width / 2;
                                    const slotY =
                                        targetCharRect.top + targetCharRect.height / 2;

                                    char.dataset.suckDx = (slotX - charX).toFixed(3);
                                    char.dataset.suckDy = (slotY - charY).toFixed(3);
                                    char.dataset.suckScale = (
                                        0.08 + (slotIndex % 3) * 0.018
                                    ).toFixed(3);
                                    char.dataset.suckRotate = (
                                        (slotIndex % 2 === 0 ? -1 : 1) * (8 + (index % 4) * 2)
                                    ).toFixed(2);
                                });

                                introTimeline.to(
                                    titleChars, {
                                        y: (index) => -10 - (index % 4) * 2.5,
                                        rotation: (index) => (index % 2 === 0 ? -10 : 10),
                                        scale: 1.05,
                                        duration: 0.16,
                                        ease: "power2.out",
                                        stagger: {
                                            each: 0.009,
                                            from: "center",
                                        },
                                    },
                                    0.04
                                );

                                introTimeline.to(
                                    titleInner, {
                                        x: innerDx * 0.2,
                                        y: innerDy * 0.2,
                                        scaleX: 0.95,
                                        scaleY: 0.91,
                                        filter: "blur(0.8px)",
                                        duration: 0.22,
                                        ease: "power2.out",
                                    },
                                    0.12
                                );

                                introTimeline.to(
                                    titleChars, {
                                        x: (_, el) =>
                                            parseFloat(el.dataset.suckDx || "0"),
                                        y: (_, el) =>
                                            parseFloat(el.dataset.suckDy || "0"),
                                        scale: (_, el) =>
                                            parseFloat(el.dataset.suckScale || "0.1"),
                                        rotation: (_, el) =>
                                            parseFloat(el.dataset.suckRotate || "0"),
                                        autoAlpha: 0,
                                        filter: "blur(10px)",
                                        duration: 0.64,
                                        ease: "power4.in",
                                        stagger: {
                                            each: 0.014,
                                            from: "start",
                                        },
                                    },
                                    0.2
                                );

                                userBarNameChars.forEach((charElement, index) => {
                                    const charRevealStart = 0.34 + index * 0.036;
                                    introTimeline.to(
                                        charElement, {
                                            autoAlpha: 1,
                                            y: 0,
                                            scale: 1.02,
                                            filter: "blur(0px)",
                                            textShadow: "0 0 14px rgba(69, 231, 123, 0.72), 0 0 24px rgba(69, 231, 123, 0.34)",
                                            duration: 0.14,
                                            ease: "power2.out",
                                        },
                                        charRevealStart
                                    );
                                    introTimeline.to(
                                        charElement, {
                                            scale: 1,
                                            textShadow: "0 0 0 rgba(69, 231, 123, 0)",
                                            duration: 0.14,
                                            ease: "power1.out",
                                        },
                                        charRevealStart + 0.14
                                    );
                                });

                                const typingEndTime =
                                    0.62 + Math.max(userBarNameChars.length - 1, 0) * 0.036;
                                introTimeline.call(
                                    () => {
                                        window.gsap.set(userBarNameChars, {
                                            clearProps: "opacity,visibility,transform,filter,textShadow,scale",
                                        });
                                        window.gsap.set(userBarName, {
                                            clearProps: "opacity,visibility,transform,filter,letterSpacing,textShadow",
                                        });
                                    },
                                    null,
                                    typingEndTime + 0.18
                                );
                            } else {
                                introTimeline.to(
                                    centerIntroTitle, {
                                        autoAlpha: 0,
                                        y: -10,
                                        filter: "blur(8px)",
                                        duration: 0.4,
                                        ease: "power2.out",
                                    },
                                    0.24
                                );
                            }

                            introTimeline.to(
                                centerIntroTitle, {
                                    autoAlpha: 0,
                                    duration: 0.12,
                                    ease: "power1.out",
                                    onComplete: () => {
                                        centerIntroTitle.remove();
                                    },
                                },
                                1.12
                            );
                        }
                    });
                } else {
                    if (centerIntroTitle) {
                        centerIntroTitle.remove();
                    }
                    userBarVisiblePromise = Promise.resolve();
                }

                userBarIntroPromise = handleUserBarGlowEffect();
                return userBarIntroPromise;
            };

            if (hasGsap && !prefersReducedMotion) {
                if (centerIntroTitle) {
                    window.gsap.set(centerIntroTitle, {
                        autoAlpha: 1,
                        left: window.innerWidth / 2,
                        top: window.innerHeight / 2,
                        y: 0,
                        filter: "blur(0px)",
                    });
                }
                if (userBar) {
                    window.gsap.set(userBar, {
                        autoAlpha: 0
                    });
                }
                if (aboutTargets.length) {
                    window.gsap.set(aboutTargets, {
                        autoAlpha: 0,
                        y: 24,
                        filter: "blur(8px)",
                    });
                }
            } else if (centerIntroTitle) {
                centerIntroTitle.remove();
            }

            await handleHeaderIntroSequence({
                onAvatarRollDone: startUserBarIntro,
                titleElement: centerIntroTitle,
            });
            handleHeaderAvatarTrail();

            if (!userBarIntroPromise) {
                startUserBarIntro();
            }

            await userBarVisiblePromise;
            await handleAboutIntroSequence();
            setCounterIntroReady(true);
            replayAboutCounters();
            await userBarIntroPromise;
        } finally {
            setCounterIntroReady(true);
            setIntroLockState(false);
        }
    };

    /* handleHeaderAvatarTrail
  -------------------------------------------------------------------------*/
    const handleHeaderAvatarTrail = () => {
        const avatar = document.querySelector(
            ".header-sidebar .box .avatar.avatar-no-ring"
        );
        const link = avatar?.querySelector(".avatar-link");
        if (!avatar || !link || avatar.dataset.liveTrailReady === "true") return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const canHover = window.matchMedia("(hover: hover)").matches;
        if (prefersReducedMotion || !canHover) return;

        avatar.dataset.liveTrailReady = "true";
        avatar.classList.add("avatar-live-trail");

        let tail = avatar.querySelector(".avatar-live-tail");
        if (!tail) {
            tail = document.createElement("span");
            tail.className = "avatar-live-tail";
            tail.setAttribute("aria-hidden", "true");
            avatar.insertBefore(tail, link);
        }

        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

        let rafId = 0;
        let isPointerActive = false;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let lastX = 0;
        let lastY = 0;
        let lastAngle = 0;
        let tailBoost = 0;

        const scheduleRender = () => {
            if (!rafId) {
                rafId = window.requestAnimationFrame(render);
            }
        };

        const render = () => {
            rafId = 0;

            const smoothing = isPointerActive ? 0.24 : 0.16;
            currentX += (targetX - currentX) * smoothing;
            currentY += (targetY - currentY) * smoothing;

            const velocityX = currentX - lastX;
            const velocityY = currentY - lastY;
            lastX = currentX;
            lastY = currentY;

            const distance = Math.hypot(currentX, currentY);
            const speed = Math.hypot(velocityX, velocityY);
            const distanceMix = clamp(distance / 12, 0, 1);
            const speedMix = clamp(speed / 2.4, 0, 1);

            tailBoost = isPointerActive ?
                Math.max(distanceMix * 0.72, speedMix) :
                tailBoost * 0.84;

            if (speed > 0.02) {
                lastAngle = (Math.atan2(velocityY, velocityX) * 180) / Math.PI;
            }

            avatar.style.setProperty(
                "--avatar-live-tilt-x",
                `${(-currentY * 0.55).toFixed(2)}deg`
            );
            avatar.style.setProperty(
                "--avatar-live-tilt-y",
                `${(currentX * 0.55).toFixed(2)}deg`
            );
            avatar.style.setProperty(
                "--avatar-live-image-x",
                `${currentX.toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-image-y",
                `${currentY.toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-image-scale",
                `${(0.9 + distanceMix * 0.02 + tailBoost * 0.03).toFixed(3)}`
            );
            avatar.style.setProperty(
                "--avatar-live-image-brightness",
                `${(1 + distanceMix * 0.04 + tailBoost * 0.08).toFixed(3)}`
            );
            avatar.style.setProperty(
                "--avatar-live-image-saturate",
                `${(1 + distanceMix * 0.06 + tailBoost * 0.12).toFixed(3)}`
            );
            avatar.style.setProperty(
                "--avatar-live-image-shadow-alpha",
                `${Math.min(0.32, distanceMix * 0.08 + tailBoost * 0.24).toFixed(3)}`
            );

            avatar.style.setProperty(
                "--avatar-live-aura-x",
                `${(-currentX * 0.28).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-aura-y",
                `${(-currentY * 0.28).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-aura-opacity",
                `${Math.min(0.58, distanceMix * 0.12 + tailBoost * 0.42).toFixed(
                    3
                )}`
            );
            avatar.style.setProperty(
                "--avatar-live-aura-scale",
                `${(0.78 + tailBoost * 0.24).toFixed(3)}`
            );

            avatar.style.setProperty(
                "--avatar-live-ring-x",
                `${(-currentX * 0.16).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-ring-y",
                `${(-currentY * 0.16).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-ring-opacity",
                `${Math.min(0.46, distanceMix * 0.1 + tailBoost * 0.28).toFixed(
                    3
                )}`
            );
            avatar.style.setProperty(
                "--avatar-live-ring-scale",
                `${(0.9 + tailBoost * 0.14).toFixed(3)}`
            );

            avatar.style.setProperty(
                "--avatar-live-flare-x",
                `${(currentX * 0.2).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-flare-y",
                `${(currentY * 0.2).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-flare-opacity",
                `${Math.min(0.42, distanceMix * 0.08 + tailBoost * 0.22).toFixed(
                    3
                )}`
            );
            avatar.style.setProperty(
                "--avatar-live-flare-scale",
                `${(0.82 + tailBoost * 0.14).toFixed(3)}`
            );

            avatar.style.setProperty(
                "--avatar-live-streak-x",
                `${(-velocityX * 4.4).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-streak-y",
                `${(-velocityY * 4.4).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-live-streak-opacity",
                `${Math.min(0.56, tailBoost * 0.54).toFixed(3)}`
            );

            avatar.style.setProperty(
                "--avatar-tail-opacity",
                `${Math.min(0.8, distanceMix * 0.22 + tailBoost * 0.56).toFixed(
                    3
                )}`
            );
            avatar.style.setProperty(
                "--avatar-tail-length",
                `${(32 + tailBoost * 34 + distanceMix * 10).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-tail-thickness",
                `${(10 + tailBoost * 5).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-tail-rotation",
                `${lastAngle.toFixed(2)}deg`
            );
            avatar.style.setProperty(
                "--avatar-tail-blur",
                `${(8 + tailBoost * 5).toFixed(2)}px`
            );
            avatar.style.setProperty(
                "--avatar-tail-flare-opacity",
                `${Math.min(0.48, tailBoost * 0.42).toFixed(3)}`
            );
            avatar.style.setProperty(
                "--avatar-tail-flare-scale",
                `${(0.78 + tailBoost * 0.24).toFixed(3)}`
            );

            const isSettled =
                Math.abs(targetX - currentX) < 0.08 &&
                Math.abs(targetY - currentY) < 0.08 &&
                distance < 0.14 &&
                tailBoost < 0.02 &&
                speed < 0.02;

            avatar.classList.toggle(
                "is-trail-active",
                isPointerActive || !isSettled
            );

            if (!isSettled || isPointerActive) {
                scheduleRender();
            }
        };

        const updatePointerTarget = (event) => {
            if (event.pointerType && event.pointerType !== "mouse") return;

            const rect = avatar.getBoundingClientRect();
            const normalizedX = clamp(
                (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
                -1,
                1
            );
            const normalizedY = clamp(
                (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
                -1,
                1
            );

            targetX = normalizedX * 10;
            targetY = normalizedY * 10;
            isPointerActive = true;
            avatar.classList.add("is-trail-active");
            scheduleRender();
        };

        const releasePointer = () => {
            isPointerActive = false;
            targetX = 0;
            targetY = 0;
            scheduleRender();
        };

        link.addEventListener("pointerenter", updatePointerTarget);
        link.addEventListener("pointermove", updatePointerTarget);
        link.addEventListener("pointerleave", releasePointer);
        link.addEventListener("pointercancel", releasePointer);
        window.addEventListener("blur", releasePointer);
    };

    /* handleQuickContactGlowEffect
  -------------------------------------------------------------------------*/
    const handleQuickContactGlowEffect = () => {
        const $quickContact = $(".quick-contact-floating");
        if (!$quickContact.length) return;

        let touchTimer;

        const activateGlow = () => {
            $quickContact.addClass("is-touch-active");
            clearTimeout(touchTimer);
        };

        const releaseGlow = () => {
            clearTimeout(touchTimer);
            touchTimer = setTimeout(() => {
                $quickContact.removeClass("is-touch-active");
            }, 220);
        };

        $quickContact.on("mousedown touchstart touchmove", activateGlow);
        $quickContact.on("mouseup mouseleave touchend touchcancel", releaseGlow);
    };

    const handleQuickContactReveal = () => {
        const quickContact = document.querySelector(".quick-contact-floating");
        if (!quickContact) return;

        const resumeSection = document.querySelector("#resume");
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        quickContact.classList.add("quick-contact-reveal");

        if (prefersReducedMotion) {
            quickContact.classList.add("is-visible");
            return;
        }

        if (!resumeSection) {
            quickContact.classList.add("is-visible");
            return;
        }

        let triggerY = 0;

        const setVisible = (isVisible) => {
            quickContact.classList.toggle("is-visible", isVisible);
        };

        const computeTrigger = () => {
            const rect = resumeSection.getBoundingClientRect();
            const viewportHeight =
                window.innerHeight || document.documentElement.clientHeight;
            triggerY = rect.top + window.scrollY - viewportHeight * 0.75;
        };

        const update = () => {
            if (document.body && document.body.classList.contains("about-only")) {
                setVisible(false);
                return;
            }
            setVisible(window.scrollY >= triggerY);
        };

        computeTrigger();
        update();

        let frameCount = 0;
        const settle = () => {
            computeTrigger();
            update();
            frameCount += 1;
            if (frameCount < 4) {
                requestAnimationFrame(settle);
            }
        };
        requestAnimationFrame(settle);

        window.addEventListener("scroll", update, {
            passive: true
        });
        window.addEventListener("resize", () => {
            computeTrigger();
            update();
        });
        window.addEventListener("load", () => {
            computeTrigger();
            update();
        });
    };

    /* handlePartnerLogoMask
  -------------------------------------------------------------------------*/
    const handlePartnerLogoMask = () => {
        const partnerItems = document.querySelectorAll(".section-partner.style-2 .partner-item");
        if (!partnerItems.length) return;

        partnerItems.forEach((item) => {
            const logo = item.querySelector("img");
            if (!logo) return;

            const src = logo.getAttribute("src");
            if (!src) return;

            item.style.setProperty("--partner-logo-mask", `url("${src}")`);
            item.classList.add("has-logo-mask");
        });
    };

    /* handlePartnerLogoLinks
  -------------------------------------------------------------------------*/
    const handlePartnerLogoLinks = () => {
        const partnerItems = document.querySelectorAll(".section-partner.style-2 .partner-item");
        if (!partnerItems.length) return;

        const partnerLinks = {
            "image.png": "https://rxglobal.de/",
            "image copy.png": "https://www.servustv.com/",
            "image copy 2.png": "https://www.wemod.com/fr",
            "image copy 3.png": "https://www.suprcon.com/",
            "image copy 4.png": "https://www.hellbrunn.at/",
            "image copy 5.png": "https://www.wko.at/ooe",
            "image copy 6.png": "https://www.ses-european.com/",
            "image copy 7.png": "https://www.tiroler-versicherung.at/",
            "image copy 8.png": "https://verdandi.at/",
            "image copy 9.png": "https://www.joyfilmsme.com/",
            "image copy 10.png": "https://www.spar.at/",
            "image copy 11.png": "https://www.hervis.at/shop/",
            "image copy 12.png": "https://www.monsterenergy.com/",
            "image copy 13.png": "https://www.vietcombank.com.vn/",
            "image copy 14.png": "https://mothquantum.com/"
        };

        partnerItems.forEach((item) => {
            const logo = item.querySelector("img.partner-logo");
            if (!logo) return;

            const src = logo.getAttribute("src");
            if (!src) return;

            const fileName = decodeURIComponent(src.split("/").pop() || "");
            const href = partnerLinks[fileName];
            if (!href) return;

            item.setAttribute("href", href);
            item.setAttribute("target", "_blank");
            item.setAttribute("rel", "noopener noreferrer");
        });
    };

    /* preventDefault
  -------------------------------------------------------------------------*/
    const preventDefault = () => {
        $(".link-no-action").on("click", function(e) {
            e.preventDefault();
        });
        $(".section-resume .education-item .content a").on("click", function(e) {
            e.preventDefault();
        });
    };

    /* spliting
  -------------------------------------------------------------------------*/
    const spliting = () => {
        if ($(".splitting").length) {
            Splitting();
        }
    };

    /* handleEmailPopup
  -------------------------------------------------------------------------*/
    const handleEmailPopup = () => {
        const $popup = $("#email-popup");
        const $trigger = $(".js-open-email-popup");
        const $status = $popup.find(".email-popup__status");
        if (!$popup.length || !$trigger.length) return;

        const $body = $("body");
        let lastFocusedElement = null;

        const setStatus = (message) => {
            if ($status.length) {
                $status.text(message || "");
            }
        };

        const fallbackCopyEmail = (emailAddress) => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = emailAddress;
            input.setAttribute("readonly", "");
            input.style.position = "absolute";
            input.style.left = "-9999px";
            document.body.appendChild(input);
            input.select();
            const copied = document.execCommand("copy");
            document.body.removeChild(input);
            return copied;
        };

        const copyEmail = async (emailAddress) => {
            if (!emailAddress) return false;

            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(emailAddress);
                    return true;
                } catch (error) {
                    return fallbackCopyEmail(emailAddress);
                }
            }

            return fallbackCopyEmail(emailAddress);
        };

        const openPopup = () => {
            lastFocusedElement = document.activeElement;
            setStatus("");
            $popup.addClass("is-open").attr("aria-hidden", "false");
            $body.addClass("email-popup-open");

            const $focusTarget = $popup
                .find("[data-open-gmail], [data-copy-email], [data-close-email-popup]")
                .filter(":visible")
                .first();

            if ($focusTarget.length) {
                setTimeout(() => {
                    $focusTarget.trigger("focus");
                }, 50);
            }
        };

        const closePopup = () => {
            if (!$popup.hasClass("is-open")) return;

            $popup.removeClass("is-open").attr("aria-hidden", "true");
            $body.removeClass("email-popup-open");

            if (
                lastFocusedElement &&
                typeof lastFocusedElement.focus === "function"
            ) {
                lastFocusedElement.focus();
            }
        };

        $trigger.on("click", function(e) {
            e.preventDefault();
            openPopup();
        });

        $popup.on("click", "[data-close-email-popup]", function(e) {
            e.preventDefault();
            closePopup();
        });

        $popup.on("click", "[data-open-gmail]", function() {
            closePopup();
        });

        $popup.on("click", "[data-copy-email]", async function(e) {
            e.preventDefault();
            const emailAddress = $(this).data("email-address");
            const isCopied = await copyEmail(emailAddress);
            setStatus(
                isCopied ?
                "Email copied to clipboard." :
                "Could not copy email. Please copy it manually."
            );
        });

        $(document)
            .off("keydown.handleEmailPopup")
            .on("keydown.handleEmailPopup", function(e) {
                if (e.key === "Escape") {
                    closePopup();
                }
            });
    };

    /* handleSocialPopup
  -------------------------------------------------------------------------*/
    const handleSocialPopup = () => {
        const $triggers = $(".js-open-social-popup");
        if (!$triggers.length) return;

        const $body = $("body");
        let lastFocusedElement = null;

        const setStatus = ($popup, message) => {
            if (!$popup || !$popup.length) return;
            const $status = $popup.find(".email-popup__status");
            if ($status.length) {
                $status.text(message || "");
            }
        };

        const fallbackCopyText = (value) => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = value;
            input.setAttribute("readonly", "");
            input.style.position = "absolute";
            input.style.left = "-9999px";
            document.body.appendChild(input);
            input.select();
            const copied = document.execCommand("copy");
            document.body.removeChild(input);
            return copied;
        };

        const copyText = async (value) => {
            if (!value) return false;

            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(value);
                    return true;
                } catch (error) {
                    return fallbackCopyText(value);
                }
            }

            return fallbackCopyText(value);
        };

        const openPopup = ($popup) => {
            if (!$popup || !$popup.length) return;

            lastFocusedElement = document.activeElement;
            setStatus($popup, "");
            $popup.addClass("is-open").attr("aria-hidden", "false");
            $body.addClass("social-popup-open");

            const $focusTarget = $popup
                .find(
                    "[data-open-social], [data-copy-social], [data-close-social-popup]"
                )
                .filter(":visible")
                .first();

            if ($focusTarget.length) {
                setTimeout(() => {
                    $focusTarget.trigger("focus");
                }, 50);
            }
        };

        const closePopup = ($popup) => {
            if (!$popup || !$popup.length || !$popup.hasClass("is-open")) return;

            $popup.removeClass("is-open").attr("aria-hidden", "true");

            if (!$(".email-popup.social-popup.is-open").length) {
                $body.removeClass("social-popup-open");
            }

            if (
                lastFocusedElement &&
                typeof lastFocusedElement.focus === "function"
            ) {
                lastFocusedElement.focus();
            }
        };

        $triggers.on("click", function(e) {
            e.preventDefault();
            const target = $(this).data("popup-target");
            const $popup = target ? $(target) : $();
            if (!$popup.length) return;
            openPopup($popup);
        });

        $(document)
            .off("click.handleSocialPopup")
            .on("click.handleSocialPopup", "[data-close-social-popup]", function(e) {
                e.preventDefault();
                closePopup($(this).closest(".email-popup"));
            })
            .on("click.handleSocialPopup", "[data-open-social]", function() {
                closePopup($(this).closest(".email-popup"));
            })
            .on("click.handleSocialPopup", "[data-copy-social]", async function(e) {
                e.preventDefault();
                const $button = $(this);
                const $popup = $button.closest(".email-popup");
                const copyValue = $button.data("copy-value");
                const successMessage =
                    $button.data("copy-success") || "Copied to clipboard.";
                const failMessage =
                    $button.data("copy-fail") ||
                    "Could not copy. Please copy it manually.";
                const isCopied = await copyText(copyValue);
                setStatus($popup, isCopied ? successMessage : failMessage);
            });

        $(document)
            .off("keydown.handleSocialPopup")
            .on("keydown.handleSocialPopup", function(e) {
                if (e.key === "Escape") {
                    const $openPopup = $(".email-popup.social-popup.is-open");
                    if ($openPopup.length) {
                        closePopup($openPopup);
                    }
                }
            });
    };

    /* handleContactTypingEffect
  -------------------------------------------------------------------------*/
    const handleContactTypingEffect = () => {
        const typingSelector =
            ".form-contact input[placeholder], .form-contact textarea[placeholder]";
        const fields = Array.from(document.querySelectorAll(typingSelector));
        if (!fields.length) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const config = {
            startDelay: 320,
            typeSpeed: 58,
            deleteSpeed: 32,
            pauseAfterWord: 1100,
            pauseAfterDelete: 260,
            cycleDuration: 5000,
        };

        const states = new Map();

        const triggerClickAnimation = (state) => {
            if (!state || !state.field) return;
            const { field } = state;
            field.classList.remove("is-typing-clicked");
            void field.offsetWidth;
            field.classList.add("is-typing-clicked");
            if (state.clickTimer) {
                window.clearTimeout(state.clickTimer);
            }
            state.clickTimer = window.setTimeout(() => {
                field.classList.remove("is-typing-clicked");
            }, 560);
        };

        const getPhraseSignature = (phrases, isCustom) =>
            `${isCustom ? "custom" : "base"}:${phrases.join("|")}`;

        const resolvePhrases = (field) => {
            const custom = field.getAttribute("data-typing-phrases");
            if (custom) {
                const list = custom
                    .split("|")
                    .map((item) => item.trim())
                    .filter(Boolean);
                if (list.length) {
                    return {
                        phrases: list,
                        signature: getPhraseSignature(list, true),
                    };
                }
            }

            const baseText =
                field.getAttribute("data-typing-base") ||
                field.getAttribute("placeholder") ||
                "";
            const baseValue = baseText.trim();
            const phrases = baseValue ? [baseValue] : [];
            return {
                phrases,
                signature: getPhraseSignature(phrases, false),
            };
        };

        let rafId = null;

        const startLoop = () => {
            if (rafId !== null) return;
            rafId = window.requestAnimationFrame(step);
        };

        const updateStatePhrases = (state) => {
            const { phrases, signature } = resolvePhrases(state.field);
            if (!phrases.length) return false;

            if (state.signature !== signature) {
                state.phrases = phrases;
                state.signature = signature;
                state.phraseIndex = 0;
                state.charIndex = 0;
                state.isDeleting = false;
            }
            return true;
        };

        const getSpeedFactor = (field) => {
            const customSpeed = parseFloat(
                field.getAttribute("data-typing-speed") || ""
            );
            if (Number.isFinite(customSpeed) && customSpeed > 0) {
                return customSpeed;
            }
            if (
                field.id === "message" ||
                field.id === "modal-message" ||
                field.id === "name" ||
                field.id === "modal-name" ||
                field.id === "email" ||
                field.id === "modal-email"
            ) {
                return 1.5;
            }
            return 1;
        };

        const computeTimings = (phraseLength, speedFactor) => {
            const safeFactor = Number.isFinite(speedFactor) && speedFactor > 0 ?
                speedFactor :
                1;
            const pauseAfterWord = config.pauseAfterWord;
            const pauseAfterDelete = config.pauseAfterDelete;
            let typeDelay = config.typeSpeed / safeFactor;
            let deleteDelay = config.deleteSpeed / safeFactor;

            if (!phraseLength) {
                return {
                    typeDelay,
                    deleteDelay,
                    pauseAfterWord,
                    pauseAfterDelete,
                };
            }

            const baseTotal =
                phraseLength * (typeDelay + deleteDelay) +
                pauseAfterWord +
                pauseAfterDelete;

            if (baseTotal <= config.cycleDuration) {
                const extraIdle = config.cycleDuration - baseTotal;
                return {
                    typeDelay,
                    deleteDelay,
                    pauseAfterWord,
                    pauseAfterDelete: pauseAfterDelete + extraIdle,
                };
            }

            const available =
                config.cycleDuration - pauseAfterWord - pauseAfterDelete;
            if (available <= 0) {
                return {
                    typeDelay,
                    deleteDelay,
                    pauseAfterWord,
                    pauseAfterDelete,
                };
            }

            const perChar = available / (phraseLength * 2);
            typeDelay = perChar;
            deleteDelay = perChar;

            return {
                typeDelay,
                deleteDelay,
                pauseAfterWord,
                pauseAfterDelete,
            };
        };

        const setLineProgress = (state, phraseLength) => {
            const safeLength = phraseLength > 0 ? phraseLength : 0;
            const progress = safeLength ?
                Math.max(0, Math.min(1, state.charIndex / safeLength)) :
                0;
            state.field.style.setProperty(
                "--typing-line-progress",
                progress.toFixed(3)
            );
        };

        const advanceState = (state, now) => {
            if (!state.field.isConnected) {
                states.delete(state.field);
                return;
            }

            if (now < state.nextChangeAt) return;

            if (!updateStatePhrases(state)) {
                states.delete(state.field);
                return;
            }

            const phrase = state.phrases[state.phraseIndex] || "";
            const speedFactor = getSpeedFactor(state.field);
            const timings = computeTimings(phrase.length, speedFactor);

            let guard = 0;
            while (now >= state.nextChangeAt && guard < 6) {
                const speed = timings.typeDelay;

                state.charIndex += 1;
                if (state.charIndex > phrase.length) {
                    state.charIndex = phrase.length;
                }
                const nextText = phrase.substring(0, state.charIndex);
                state.field.setAttribute("placeholder", nextText);
                setLineProgress(state, phrase.length);

                if (state.charIndex >= phrase.length) {
                    states.delete(state.field);
                    break;
                }

                state.nextChangeAt = now + speed;
                guard += 1;
            }
        };

        const step = (now) => {
            states.forEach((state) => advanceState(state, now));
            if (states.size) {
                rafId = window.requestAnimationFrame(step);
            } else {
                rafId = null;
            }
        };

        const initField = (field) => {
            if (!field || states.has(field)) return;

            const base =
                field.getAttribute("data-typing-base") ||
                field.getAttribute("placeholder") ||
                "";
            if (!base.trim()) return;

            if (!field.getAttribute("data-typing-base")) {
                field.setAttribute("data-typing-base", base);
            }

            if (prefersReducedMotion) {
                field.setAttribute("placeholder", base);
                return;
            }

            const state = {
                field,
                phrases: [],
                signature: "",
                phraseIndex: 0,
                charIndex: 0,
                isDeleting: false,
                clickTimer: null,
                startDelay: config.startDelay,
                nextChangeAt: 0,
            };

            states.set(field, state);
            updateStatePhrases(state);

            field.setAttribute("placeholder", "");
            field.style.setProperty("--typing-line-progress", "0");
            state.nextChangeAt =
                (window.performance ? performance.now() : Date.now()) +
                state.startDelay;
            startLoop();

            const handleFocus = () => {
                field.classList.add("is-typing-focus");
                triggerClickAnimation(state);
            };

            const handlePointerDown = () => {
                field.classList.add("is-typing-focus");
                triggerClickAnimation(state);
            };

            const handleBlur = () => {
                field.classList.remove("is-typing-focus");
            };

            field.addEventListener("focus", handleFocus);
            field.addEventListener("pointerdown", handlePointerDown);
            field.addEventListener("blur", handleBlur);
        };

        const initFields = (root) => {
            const context = root && root.querySelectorAll ? root : document;
            const items = Array.from(context.querySelectorAll(typingSelector));
            items.forEach((field) => initField(field));
        };

        const contactSection = document.querySelector("#contact");

        const startTyping = (root) => {
            initFields(root);
            startLoop();
        };

        if (prefersReducedMotion) {
            startTyping(document);
        } else if (!contactSection) {
            startTyping(document);
        } else {
            let revealed = false;
            let observer = null;

            const revealOnce = () => {
                if (revealed) return;
                revealed = true;
                window.requestAnimationFrame(() => {
                    startTyping(contactSection);
                });
                cleanup();
            };

            const onScrollReveal = () => {
                if (revealed) return;
                const rect = contactSection.getBoundingClientRect();
                const viewportHeight =
                    window.innerHeight || document.documentElement.clientHeight;
                if (rect.top < viewportHeight * 0.85 && rect.bottom > 0) {
                    revealOnce();
                }
            };

            const cleanup = () => {
                window.removeEventListener("scroll", onScrollReveal);
                window.removeEventListener("resize", onScrollReveal);
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            };

            if ("IntersectionObserver" in window) {
                observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                revealOnce();
                            }
                        });
                    }, {
                        root: null,
                        threshold: 0.25,
                    }
                );
                observer.observe(contactSection);
            } else {
                window.addEventListener("scroll", onScrollReveal, {
                    passive: true
                });
                window.addEventListener("resize", onScrollReveal);
                onScrollReveal();
            }
        }

        window.refreshContactTypingEffect = (root) => {
            initFields(root);
            startLoop();
        };
    };

    /* handleContactServiceMessage
  -------------------------------------------------------------------------*/
    const handleContactServiceMessage = () => {
        const selector = ".list-tag a[data-contact-message]";

        $(document)
            .off("click.handleContactServiceMessage")
            .on("click.handleContactServiceMessage", selector, function(e) {
                e.preventDefault();
                const $link = $(this);
                const message = $link.data("contact-message");
                if (!message) return;

                const $form = $link.closest("form");
                let $textarea = $form
                    .find("textarea[name='message']")
                    .first();
                if (!$textarea.length) {
                    $textarea = $form
                        .find("#message, #modal-message, textarea")
                        .first();
                }
                if (!$textarea.length) return;

                $textarea.val(message);
                $textarea.trigger("input");
                $textarea.trigger("change");
                $textarea.focus();
            });
    };

    /* handleContactEmailJS
  -------------------------------------------------------------------------*/
    const handleContactEmailJS = () => {
        const $forms = $(".js-emailjs-form");
        if (!$forms.length) return;

        const statusMessages = {
            en: {
                sending: "Sending your message...",
                success: "Thanks! Your message has been sent.",
                error: "Sorry, something went wrong. Please try again.",
                missing: "EmailJS is not configured yet. Please add your keys.",
                missingSdk: "EmailJS SDK is not loaded. Please check the script tag.",
            },
            vi: {
                sending: "Đang gửi tin nhắn của bạn...",
                success: "Cảm ơn bạn! Tin nhắn đã được gửi.",
                error: "Xin lỗi, gửi thất bại. Vui lòng thử lại.",
                missing: "Biểu mẫu chưa được cấu hình EmailJS. Vui lòng thêm khóa.",
                missingSdk: "Chưa tải EmailJS. Vui lòng kiểm tra thẻ script.",
            },
        };

        const $toast = $("#form-toast");
        const $toastMessage = $toast.find(".form-toast__message");
        const $toastTitle = $toast.find(".form-toast__title");
        let toastTimer = null;

        const hideToast = () => {
            if (!$toast.length) return;
            $toast
                .removeClass("is-open")
                .removeAttr("data-status")
                .attr("aria-hidden", "true");
            $("body").removeClass("form-toast-open");
        };

        const showToast = (message, status) => {
            if (!$toast.length) return;
            $toastMessage.text(message);
            if (status) {
                $toast.attr("data-status", status);
            } else {
                $toast.removeAttr("data-status");
            }
            $toast.addClass("is-open").attr("aria-hidden", "false");
            $("body").addClass("form-toast-open");
            if (toastTimer) {
                clearTimeout(toastTimer);
            }
            toastTimer = setTimeout(hideToast, 4200);
        };

        const getLanguage = () =>
            $("body").attr("data-language") === "vi" ? "vi" : "en";

        const getStatusText = (key) => {
            const lang = getLanguage();
            if (statusMessages[lang] && statusMessages[lang][key]) {
                return statusMessages[lang][key];
            }
            return statusMessages.en[key] || "";
        };

        const getStatusTitle = (status) => {
            const lang = getLanguage();
            const titles = {
                en: {
                    success: "Message sent",
                    error: "Message failed",
                    sending: "Sending",
                },
                vi: {
                    success: "Đã gửi thành công",
                    error: "Gửi thất bại",
                    sending: "Đang gửi",
                },
            };
            const langTitles = titles[lang] || titles.en;
            return langTitles[status] || langTitles.error;
        };

        const notify = (key, status) => {
            const resolvedStatus =
                status || (key === "success" || key === "sending" ? key : "error");
            if ($toastTitle.length) {
                $toastTitle.text(getStatusTitle(resolvedStatus));
            }
            showToast(getStatusText(key), resolvedStatus);
        };

        const setStatus = ($form, key, status) => {
            const $status = $form.find(".form-status").first();
            if (!$status.length) return;
            $status.text("").removeAttr("data-status");
        };

        let emailJsReady = false;
        const ensureEmailJS = (publicKey) => {
            if (!window.emailjs || !publicKey) return false;
            if (emailJsReady) return true;
            try {
                try {
                    window.emailjs.init({
                        publicKey,
                    });
                } catch (error) {
                    window.emailjs.init(publicKey);
                }
                emailJsReady = true;
                return true;
            } catch (error) {
                console.error("EmailJS init failed:", error);
                return false;
            }
        };

        $(document)
            .off("click.handleFormToast")
            .on("click.handleFormToast", "[data-close-form-toast]", function() {
                hideToast();
            })
            .off("keydown.handleFormToast")
            .on("keydown.handleFormToast", function(e) {
                if (e.key === "Escape") {
                    hideToast();
                }
            });

        $(document)
            .off("submit.handleContactEmailJS")
            .on("submit.handleContactEmailJS", ".js-emailjs-form", function(e) {
                e.preventDefault();
                const $form = $(this);
                const formElement = $form.get(0);
                const serviceId = $form.data("emailjs-service");
                const templateId = $form.data("emailjs-template");
                const publicKey = $form.data("emailjs-public-key");

                if (!serviceId || !templateId || !publicKey) {
                    setStatus($form, "missing", "error");
                    notify("missing", "error");
                    return;
                }

                if (!window.emailjs) {
                    setStatus($form, "missingSdk", "error");
                    notify("missingSdk", "error");
                    return;
                }

                if (!ensureEmailJS(publicKey)) {
                    setStatus($form, "error", "error");
                    notify("error", "error");
                    return;
                }

                const $button = $form.find("button[type='submit']").first();
                $button.prop("disabled", true).attr("aria-busy", "true");
                setStatus($form, "sending", "sending");

                window.emailjs
                    .sendForm(serviceId, templateId, formElement)
                    .then(() => {
                        setStatus($form, "success", "success");
                        notify("success", "success");
                        if (formElement) {
                            formElement.reset();
                        }
                    })
                    .catch((error) => {
                        console.error("EmailJS send failed:", error);
                        setStatus($form, "error", "error");
                        notify("error", "error");
                    })
                    .finally(() => {
                        $button.prop("disabled", false).removeAttr("aria-busy");
                    });
            });
    };

    /* handleContactModal
  -------------------------------------------------------------------------*/
    const handleContactModal = () => {
        const $modal = $("#contact-modal");
        const $wrapper = $("#wrapper");
        const $openButtons = $(".js-open-contact-modal");
        const $sourceForm = $("#contact .form-contact").first();
        const $modalContent = $modal.find(".contact-modal__content");
        if (
            !$modal.length ||
            !$openButtons.length ||
            !$sourceForm.length ||
            !$modalContent.length
        ) {
            return;
        }

        if ($wrapper.length && !$wrapper.find("#contact-modal").length) {
            $wrapper.append($modal);
        }

        const $body = $("body");
        let lastFocusedElement = null;

        const buildModalForm = () => {
            const $clonedForm = $sourceForm.clone(false, false);
            const sourceElement = $sourceForm.get(0);
            const clonedElement = $clonedForm.get(0);

            $clonedForm.find("#name").attr("id", "modal-name");
            $clonedForm.find("#email").attr("id", "modal-email");
            $clonedForm.find("#message").attr("id", "modal-message");
            $clonedForm.find(".form-status").text("").removeAttr("data-status");
            $clonedForm.find(".item-shape").hide();

            if (sourceElement && clonedElement) {
                const computedStyle = window.getComputedStyle(sourceElement);
                clonedElement.style.background = computedStyle.background;
                clonedElement.style.borderTopColor = computedStyle.borderTopColor;
                clonedElement.style.borderTopStyle = computedStyle.borderTopStyle;
                clonedElement.style.borderTopWidth = computedStyle.borderTopWidth;

                [
                    "--Bg-linear-2",
                    "--Text-light",
                    "--Text-secondary",
                    "--Text-primary",
                    "--Bg-dark",
                ].forEach((cssVar) => {
                    const value = computedStyle.getPropertyValue(cssVar);
                    if (value) {
                        clonedElement.style.setProperty(cssVar, value.trim());
                    }
                });
            }

            $modalContent.empty().append($clonedForm);
            if (typeof window.refreshContactTypingEffect === "function") {
                window.refreshContactTypingEffect($modalContent.get(0));
            }
        };

        const openModal = () => {
            buildModalForm();
            lastFocusedElement = document.activeElement;
            $modal.addClass("is-open").attr("aria-hidden", "false");
            $body.addClass("contact-modal-open");
        };

        const closeModal = () => {
            if (!$modal.hasClass("is-open")) return;

            $modal.removeClass("is-open").attr("aria-hidden", "true");
            $body.removeClass("contact-modal-open");

            if (
                lastFocusedElement &&
                typeof lastFocusedElement.focus === "function"
            ) {
                lastFocusedElement.focus();
            }
        };

        $openButtons.on("click", function(e) {
            e.preventDefault();
            openModal();
        });

        $modal.on("click", "[data-close-contact-modal]", function(e) {
            e.preventDefault();
            closeModal();
        });

        $(document)
            .off("keydown.handleContactModal")
            .on("keydown.handleContactModal", function(e) {
                if (e.key === "Escape") {
                    closeModal();
                }
            });
    };

    /* handleSidebar
    -------------------------------------------------------------------------------------*/
    const handleSidebar = () => {
        const closeAllPopups = () => {
            $(
                ".popup-show-bar, .popup-menu-mobile, .overlay-popup"
            ).removeClass("show");
            $("body").removeClass("no-scroll");
        };

        $(document)
            .off("click.handleSidebar")
            .on("click.handleSidebar", ".show-sidebar", function(e) {
                e.preventDefault();
                $(".popup-show-bar").toggleClass("show");

                if (
                    !$(".popup-show-bar").hasClass("show") &&
                    !$(".popup-menu-mobile").hasClass("show")
                ) {
                    $("body").removeClass("no-scroll");
                }
            })
            .on("click.handleSidebar", ".show-menu-mobile", function(e) {
                e.preventDefault();
                const $target = $($(this).data("target"));
                if (!$target.length) return;

                const isOpen = $target.hasClass("show");
                closeAllPopups();

                if (!isOpen) {
                    $target.addClass("show");
                    $(".overlay-popup").addClass("show");
                    $("body").addClass("no-scroll");
                }
            })
            .on("click.handleSidebar", ".overlay-popup", function() {
                closeAllPopups();
            })
            .on(
                "click.handleSidebar",
                ".popup-menu-mobile .nav_link",
                function() {
                    closeAllPopups();
                }
            );
    };

    // Dom Ready
    $(function() {
        forceBackToHomeOnReload();
        headerFixed();
        handleAboutOnlyAtTop();
        syncUserBarCenter();
        tabSlide();
        settings_color();
        switchMode();
        switchLanguage();
        oneNavOnePage();
        handleMobileAvatarTop();
        lockUserBarScrollOnHover();
        handleEffectSpotlight();
        handleCounterTouchEffect();
        handleFeaturedProjectReveal();
        handleMobilePortfolioReveal();
        handleResumeReveal();
        handleContactReveal();
        handlePricingReveal();
        handlePortfolioPopupLinks();
        handleProjectVideoModal();
        handleQuickContactReveal();
        handleQuickContactGlowEffect();
        handlePartnerLogoMask();
        handlePartnerLogoLinks();
        handleSkillsMarqueeReveal();
        handlePartnerMarqueeReveal();
        initSkillsMarqueeTooltips();
        initAboutIntroCharHover();
        preventDefault();
        spliting();
        runOrderedIntroSequence().catch((error) => {
            console.error("runOrderedIntroSequence failed:", error);
        });
        handleEmailPopup();
        handleSocialPopup();
        handleContactTypingEffect();
        handleContactServiceMessage();
        handleContactEmailJS();
        handleContactModal();
        handleSidebar();
    });
})(jQuery);
