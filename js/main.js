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

(function ($) {
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
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
    };

    /* Tab Slide 
  ------------------------------------------------------------------------------------- */
    var tabSlide = function () {
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
            $(".tab-slide li").on("click", function () {
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

            $(window).on("resize", function () {
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

        $(".choose-item").on("click", function () {
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
            $toggles.each(function () {
                $(this).toggleClass("active", isDark);
            });
        };

        const savedMode = localStorage.getItem("darkMode");
        const defaultMode = $body.data("default-mode") || "light";
        const isDarkInitially = savedMode
            ? savedMode === "enabled"
            : defaultMode === "dark";

        $body.toggleClass("dark-mode", isDarkInitially);
        updateToggles(isDarkInitially);
        applyLogo(isDarkInitially);

        $toggles.on("click", function () {
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
            hireMe: "Hire Me",
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
                "cta.hire_me": "Hire Me",
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
                pageTitle: "Truong The Nhat - Portfolio",
                profileRole: "Multimedia Design",
                aboutTag: "About",
                aboutIntroPrefix: "Hello! I'm",
                aboutRoleWords: ["Multimedia Design", "UI/UX Developer"],
                aboutTitle: "Designing Visual Experiences",
                aboutDescription:
                    "Hello! I'm Truong The Nhat, a Multimedia Designer with 3+ years of experience in video editing, motion graphics, and digital design, creating impactful visual content for brands and digital platforms.",
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
                    "Brand Promotion Video",
                    "Animated Social Media Ads",
                    "Marketing Poster Series",
                    "Brand Identity & Visual Kit",
                ],
                portfolioCategories: [
                    "VIDEO EDITING",
                    "MOTION GRAPHICS",
                    "GRAPHIC DESIGN",
                    "BRANDING DESIGN",
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
                hireMe: "Hire Me",
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
                rights: "© 2025 Truong The Nhat. All rights reserved.",
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
                pageTitle: "Truong The Nhat - Portfolio",
                profileRole: "Thiết kế Đa phương tiện",
                aboutTag: "Giới thiệu",
                aboutIntroPrefix: "Xin chào! Tôi là",
                aboutRoleWords: ["Thiết kế Đa phương tiện", "Nhà phát triển UI/UX"],
                aboutTitle: "Thiết kế trải nghiệm thị giác",
                aboutDescription:
                    "Xin chào! Tôi là Trương Thế Nhật, nhà thiết kế đa phương tiện với hơn 3 năm kinh nghiệm về dựng video, motion graphics và thiết kế số, tạo ra nội dung hình ảnh ấn tượng cho thương hiệu và nền tảng số.",
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
                    "Bộ poster marketing",
                    "Nhận diện thương hiệu & bộ visual",
                ],
                portfolioCategories: [
                    "DỰNG VIDEO",
                    "MOTION GRAPHICS",
                    "THIẾT KẾ ĐỒ HỌA",
                    "THIẾT KẾ THƯƠNG HIỆU",
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
                rights: "© 2025 Trương Thế Nhật. Đã đăng ký bản quyền.",
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
                    event.target instanceof Element
                        ? event.target.closest(".about-title-word")
                        : null;
                if (!targetWord || !title.contains(targetWord)) return;
                setActiveWord(targetWord);
            });

            title.addEventListener("pointermove", (event) => {
                pointerX = event.clientX;
                pointerY = event.clientY;
                isPointerInside = true;

                const targetWord =
                    event.target instanceof Element
                        ? event.target.closest(".about-title-word")
                        : null;

                if (targetWord && title.contains(targetWord)) {
                    setActiveWord(targetWord);
                }

                scheduleWordAnimation();
            });

            title.addEventListener("pointerout", (event) => {
                const fromWord =
                    event.target instanceof Element
                        ? event.target.closest(".about-title-word")
                        : null;
                const toWord =
                    event.relatedTarget instanceof Element
                        ? event.relatedTarget.closest(".about-title-word")
                        : null;

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
                lang === "vi"
                    ? "Tr\u01b0\u01a1ng Th\u1ebf Nh\u1eadt"
                    : "Truong The Nhat";

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

            $("[data-i18n]").each(function () {
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
            savedLanguage === "vi" || savedLanguage === "en"
                ? savedLanguage
                : defaultLanguage === "vi"
                ? "vi"
                : "en";

        applyLanguage(initialLanguage);

        $toggle.on("click", function () {
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

    $navLinks.on("click", function (e) {
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

        isScrollingByClick = true;

        const currentId = $target.attr("id");
        $navLinks
            .removeClass("active")
            .filter(`[href="#${currentId}"]`)
            .addClass("active");

        $("html, body").animate({ scrollTop: offsetTop }, 0, function () {
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

        $sections.each(function (index) {
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
            $sections.each(function (index) {
                if (index < currentIndex) $(this).addClass("dimmed");
            });
        }
    };

    let scrollTimer;
    $(window).on("scroll resize", function () {
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

    /* handleEffectSpotlight
  -------------------------------------------------------------------------*/
    const handleEffectSpotlight = () => {
        if (!$(".area-effect").length) return;
        $(".area-effect").each(function () {
            const $container = $(this);
            const $spotlight = $container.find(".spotlight");
            $spotlight.css("opacity", "1");
            $container.on("mousemove", function (e) {
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

        $touchItems.each(function () {
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

            $item.on("mousemove", function (e) {
                setTouchPoint(e.clientX, e.clientY);
                setPortfolioTilt(e.clientX, e.clientY);
            });

            $item.on("touchstart touchmove", function (e) {
                const touches = e.originalEvent.touches;
                const touch = touches && touches[0];
                if (!touch) return;

                setTouchPoint(touch.clientX, touch.clientY);
                setPortfolioTilt(touch.clientX, touch.clientY);
                $item.addClass("is-touch-active");
                clearTimeout(touchTimer);
            });

            $item.on("mouseleave", function () {
                resetPortfolioTilt();
            });

            $item.on("touchend touchcancel", function () {
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
                typeof options.onAvatarRollDone === "function"
                    ? options.onAvatarRollDone
                    : null;
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
            const startY = -Math.max(window.innerHeight * 0.3, 260);
            let impactX = window.innerWidth / 2;
            let impactY = window.innerHeight / 2;

            const resolveTitleImpact = () => {
                if (!titleElement) {
                    return {
                        impactX: window.innerWidth / 2,
                        impactY: window.innerHeight / 2,
                    };
                }

                const titleBox =
                    titleElement.querySelector(".intro-center-title__inner") || titleElement;
                const titleRect = titleBox.getBoundingClientRect();
                if (!titleRect.width || !titleRect.height) {
                    return {
                        impactX: window.innerWidth / 2,
                        impactY: window.innerHeight / 2,
                    };
                }

                const titleStyles = window.getComputedStyle(titleBox);
                const borderTopWidth =
                    parseFloat(titleStyles.borderTopWidth || "0") || 0;
                const borderCenterY = titleRect.top + borderTopWidth * 0.5;
                const titleCenterX = titleRect.left + titleRect.width / 2;

                return {
                    impactX: titleCenterX,
                    // Bottom of the avatar touches the top border center of the title box.
                    impactY: borderCenterY - avatarRadius,
                };
            };

            const avatarGhost = avatar.cloneNode(true);
            avatarGhost.classList.remove("avatar-final-flash");
            avatarGhost.classList.add("header-avatar-ghost");
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
            const impactPoint = resolveTitleImpact();
            impactX = impactPoint.impactX;
            impactY = impactPoint.impactY;
            let titleImpactDent = null;
            if (titleElement) {
                const titleInner =
                    titleElement.querySelector(".intro-center-title__inner") || titleElement;
                const titleChars = Array.from(
                    titleElement.querySelectorAll(".intro-center-title__char:not(.is-space)")
                );

                if (titleInner && titleChars.length) {
                    const titleRect = titleInner.getBoundingClientRect();
                    const dentSigma = Math.max(titleRect.width * 0.16, 56);

                    titleChars.forEach((char) => {
                        const charRect = char.getBoundingClientRect();
                        const charCenterX = charRect.left + charRect.width / 2;
                        const dx = Math.abs(charCenterX - impactX);
                        const influence = Math.exp(
                            -(dx * dx) / (2 * dentSigma * dentSigma)
                        );
                        const isRoleLine = !!char.closest(
                            ".intro-center-title__line--role"
                        );
                        const lineFactor = isRoleLine ? 0.56 : 1;
                        const dentY = 4 + influence * 20 * lineFactor;
                        const dentTilt =
                            (charCenterX < impactX ? -1 : 1) *
                            influence *
                            8 *
                            lineFactor;

                        char.dataset.impactDentY = dentY.toFixed(3);
                        char.dataset.impactDentTilt = dentTilt.toFixed(3);
                    });

                    titleImpactDent = {
                        titleInner,
                        titleChars,
                    };
                }
            }
            window.gsap.set(avatarGhost, {
                autoAlpha: 1,
                left: impactX,
                top: startY,
                xPercent: -50,
                yPercent: -50,
                rotation: 0,
                scale: 0.9,
                filter: "blur(0px)",
                transformOrigin: "50% 50%",
            });
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
                defaults: { ease: "power3.out" },
                onComplete: () => {
                    notifyAvatarRollDone();
                    headerSidebar.classList.remove("is-intro-animating");
                    headerSidebar.classList.add("is-intro-finished");
                    avatar.classList.remove("avatar-final-flash");
                    avatar.style.visibility = "";
                    avatarGhost.classList.remove("is-rolling");
                    avatarGhost.remove();

                    window.gsap.set(
                        [headerSidebar, avatarGhost, ...navItems, ...revealTargets],
                        {
                            clearProps:
                                "x,y,opacity,visibility,scale,filter,clipPath,rotation,transformOrigin,left,top,xPercent,yPercent",
                        }
                    );
                    resolve();
                },
            });

            if (titleImpactDent) {
                const dentHits = [
                    { time: 0.76, strength: 1, recover: 0.24 },
                    { time: 1.28, strength: 0.72, recover: 0.2 },
                    { time: 1.66, strength: 0.54, recover: 0.18 },
                ];

                dentHits.forEach((hit) => {
                    const compressDuration = 0.1;
                    const recoverStart = hit.time + compressDuration;

                    introTimeline
                        .to(
                            titleImpactDent.titleInner,
                            {
                                y: 3.5 * hit.strength,
                                scaleX: 1 + 0.015 * hit.strength,
                                scaleY: 1 - 0.055 * hit.strength,
                                duration: compressDuration,
                                ease: "power2.out",
                            },
                            hit.time
                        )
                        .to(
                            titleImpactDent.titleChars,
                            {
                                y: (_, el) =>
                                    parseFloat(el.dataset.impactDentY || "0") *
                                    hit.strength,
                                rotation: (_, el) =>
                                    parseFloat(
                                        el.dataset.impactDentTilt || "0"
                                    ) * hit.strength,
                                duration: compressDuration,
                                ease: "power2.out",
                                stagger: {
                                    each: 0.003,
                                    from: "center",
                                },
                            },
                            hit.time
                        )
                        .to(
                            titleImpactDent.titleChars,
                            {
                                y: 0,
                                rotation: 0,
                                duration: hit.recover,
                                ease: "power3.out",
                                stagger: {
                                    each: 0.003,
                                    from: "center",
                                },
                            },
                            recoverStart
                        )
                        .to(
                            titleImpactDent.titleInner,
                            {
                                y: 0,
                                scaleX: 1,
                                scaleY: 1,
                                duration: hit.recover,
                                ease: "power3.out",
                            },
                            recoverStart
                        );
                });
            }

            introTimeline
                .to(
                    avatarGhost,
                    {
                        top: impactY,
                        scaleX: 1.2,
                        scaleY: 0.76,
                        duration: 0.8,
                        ease: "power2.in",
                    },
                    0
                )
                .to(
                    avatarGhost,
                    {
                        top: impactY - 124,
                        scaleX: 0.88,
                        scaleY: 1.14,
                        duration: 0.34,
                        ease: "power2.out",
                    },
                    0.8
                );

            introTimeline
                .to(
                    avatarGhost,
                    {
                        top: impactY + 24,
                        scaleX: 1.16,
                        scaleY: 0.84,
                        duration: 0.22,
                        ease: "power2.inOut",
                    },
                    1.14
                )
                .to(
                    avatarGhost,
                    {
                        top: impactY - 56,
                        scaleX: 0.94,
                        scaleY: 1.08,
                        duration: 0.18,
                        ease: "power2.out",
                    },
                    1.36
                )
                .to(
                    avatarGhost,
                    {
                        top: impactY,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 0.14,
                        ease: "power1.out",
                    },
                    1.54
                )
                .to(
                    avatarGhost,
                    {
                        left: finalX,
                        top: finalY - 74,
                        rotation: -990,
                        duration: 0.94,
                        ease: "power2.inOut",
                    },
                    1.62
                )
                .to(
                    avatarGhost,
                    {
                        top: finalY + 20,
                        scaleX: 1.12,
                        scaleY: 0.9,
                        duration: 0.22,
                        ease: "power2.in",
                    },
                    2.56
                )
                .to(
                    avatarGhost,
                    {
                        top: finalY - 14,
                        scaleX: 0.96,
                        scaleY: 1.05,
                        duration: 0.15,
                        ease: "power1.out",
                    },
                    2.78
                )
                .to(
                    avatarGhost,
                    {
                        top: finalY,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: -1080,
                        duration: 0.16,
                        ease: "power1.out",
                    },
                    2.93
                );

            introTimeline
                .call(
                    () => {
                        notifyAvatarRollDone();
                        avatarGhost.classList.remove("is-rolling");
                    },
                    null,
                    3.11
                )
                .to(
                    headerSidebar,
                    {
                        clipPath: expandedClip,
                        duration: 1.18,
                        ease: "power2.out",
                    },
                    3.15
                )
                .call(
                    () => {
                        avatar.classList.remove("avatar-final-flash");
                        void avatar.offsetWidth;
                        avatar.classList.add("avatar-final-flash");
                    },
                    null,
                    3.17
                )
                .to(
                    revealTargets,
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.46,
                        stagger: 0.08,
                    },
                    3.41
                )
                .to(
                    navItems,
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.52,
                        stagger: 0.08,
                    },
                    3.45
                );
        });
    };

    /* handleFeaturedProjectReveal
  -------------------------------------------------------------------------*/
    const handleFeaturedProjectReveal = () => {
        const section = document.querySelector("#portfolio");
        const cardsWrap = section?.querySelector(".tabs-content-wrap");
        const cards = cardsWrap
            ? Array.from(cardsWrap.querySelectorAll(".portfolio-item"))
            : [];

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
        const hasGsapScrollTrigger =
            typeof window.gsap !== "undefined" &&
            typeof window.ScrollTrigger !== "undefined";

        if (prefersReducedMotion || !hasGsapScrollTrigger) {
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
            window.gsap.set(card, { autoAlpha: 0 });
        });

        cards.forEach((card, index) => {
            const tiltDir = index % 2 === 0 ? 1 : -1;
            card.style.setProperty("--portfolio-tilt-dir", `${tiltDir}`);
        });

        const timeline = window.gsap.timeline({
            defaults: { ease: "none" },
        });
        const revealOffsets = [0, 0.22, 0.52, 0.84];
        const revealDurations = [0.56, 0.58, 0.62, 0.66];

        cards.forEach((card, index) => {
            const dir = index % 2 === 0 ? -1 : 1;
            const img = card.querySelector(".img-style img");
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
                window.gsap.set(beam, { autoAlpha: 0, xPercent: -150 });
            }

            const revealAt =
                revealOffsets[index] ??
                revealOffsets[revealOffsets.length - 1] +
                    (index - revealOffsets.length + 1) * 0.64;
            const revealDuration =
                revealDurations[index] ?? revealDurations[revealDurations.length - 1];

            timeline.fromTo(
                card,
                {
                    x: () => getCenterOffset(card).x,
                    y: () => getCenterOffset(card).y,
                    autoAlpha: 0,
                    scale: 0.82,
                    rotation: dir * 10,
                    skewX: dir * 5,
                    filter: "blur(14px) saturate(0.55)",
                },
                {
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

            if (img) {
                timeline.fromTo(
                    img,
                    {
                        scale: 1.24,
                        rotation: dir * 2.4,
                        filter: "brightness(0.72) saturate(0.7)",
                    },
                    {
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
                    tag,
                    { y: 28, autoAlpha: 0 },
                    {
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
                    title,
                    { y: 24, autoAlpha: 0 },
                    {
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
                    beam,
                    { xPercent: -150, autoAlpha: 0 },
                    {
                        xPercent: 150,
                        autoAlpha: 0.85,
                        duration: revealDuration * 0.45,
                        immediateRender: false,
                    },
                    beamStart
                );
                timeline.to(
                    beam,
                    {
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
                    cards.map((card) => card.querySelector(".img-style img")).filter(Boolean),
                    {
                        clearProps: "transform,filter",
                    }
                );
                window.gsap.set(
                    cards.flatMap((card) =>
                        Array.from(
                            card.querySelectorAll(".tag, .title, .project-reveal-beam")
                        )
                    ),
                    {
                        clearProps: "transform,opacity,visibility",
                    }
                );
                self.kill(false);
            },
        });

        window.ScrollTrigger.refresh();
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
                .one("animationend.handleUserBarIntro", function (e) {
                    if (
                        e.originalEvent &&
                        e.originalEvent.animationName !== "user-bar-reveal"
                    ) {
                        return;
                    }
                    finishIntro();
                });

            setTimeout(finishIntro, 1650);

            if (!$userBar.data("touchGlowBound")) {
                let touchTimer;
                $userBar.on("touchstart touchmove", function () {
                    $userBar.addClass("is-touch-active");
                    clearTimeout(touchTimer);
                });
                $userBar.on("touchend touchcancel", function () {
                    clearTimeout(touchTimer);
                    touchTimer = setTimeout(() => {
                        $userBar.removeClass("is-touch-active");
                    }, 220);
                });
                $userBar.data("touchGlowBound", "true");
            }
        });
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
            const aboutTitleWrap = aboutTitleTarget
                ? aboutTitleTarget.closest(".heading-section")
                : null;
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
                return { allChars: [], solidChars: [] };
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
            return { allChars, solidChars };
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
                            userBar,
                            {
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
                            autoAlpha: 0.14,
                            y: 12,
                            scale: 0.82,
                            filter: "blur(8px)",
                        });
                        introTimeline.to(
                            userBarNameChars,
                            {
                                autoAlpha: 0.32,
                                y: 7,
                                scale: 0.9,
                                filter: "blur(4px)",
                                duration: 0.2,
                                ease: "power2.out",
                                stagger: {
                                    each: 0.014,
                                    from: "start",
                                },
                            },
                            0.03
                        );
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
                                titleChars,
                                {
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
                                titleInner,
                                {
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
                                titleChars,
                                {
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

                            introTimeline.to(
                                userBarNameChars,
                                {
                                    autoAlpha: 1,
                                    y: 0,
                                    scale: 1,
                                    filter: "blur(0px)",
                                    duration: 0.28,
                                    ease: "back.out(1.8)",
                                    stagger: {
                                        each: 0.03,
                                        from: "start",
                                    },
                                },
                                0.34
                            );

                            introTimeline.call(
                                () => {
                                    userBarName.classList.add("is-fill-hit");
                                },
                                null,
                                0.48
                            );
                            introTimeline.to(
                                userBarNameChars,
                                {
                                    textShadow:
                                        "0 0 16px rgba(69, 231, 123, 0.72), 0 0 28px rgba(69, 231, 123, 0.34)",
                                    duration: 0.22,
                                    ease: "power2.out",
                                    yoyo: true,
                                    repeat: 1,
                                    stagger: {
                                        each: 0.028,
                                        from: "start",
                                    },
                                },
                                0.44
                            );
                            introTimeline.call(
                                () => {
                                    userBarName.classList.remove("is-fill-hit");
                                    window.gsap.set(userBarNameChars, {
                                        clearProps:
                                            "opacity,visibility,transform,filter,textShadow",
                                    });
                                    window.gsap.set(userBarName, {
                                        clearProps:
                                            "opacity,visibility,transform,filter,letterSpacing,textShadow",
                                    });
                                },
                                null,
                                1.22
                            );
                        } else {
                            introTimeline.to(
                                centerIntroTitle,
                                {
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
                            centerIntroTitle,
                            {
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
                window.gsap.set(userBar, { autoAlpha: 0 });
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

    /* preventDefault
  -------------------------------------------------------------------------*/
    const preventDefault = () => {
        $(".link-no-action").on("click", function (e) {
            e.preventDefault();
        });
        $(".section-resume .education-item .content a").on("click", function (e) {
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
        };

        const openModal = () => {
            buildModalForm();
            lastFocusedElement = document.activeElement;
            $modal.addClass("is-open").attr("aria-hidden", "false");
            $body.addClass("contact-modal-open");

            const $focusTarget = $modal
                .find("input, textarea")
                .filter(":visible")
                .first();
            const $fallbackTarget = $modal
                .find("button")
                .filter(":visible")
                .first();
            const $targetToFocus = $focusTarget.length
                ? $focusTarget
                : $fallbackTarget;

            if ($targetToFocus.length) {
                setTimeout(() => {
                    $targetToFocus.trigger("focus");
                }, 50);
            }
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

        $openButtons.on("click", function (e) {
            e.preventDefault();
            openModal();
        });

        $modal.on("click", "[data-close-contact-modal]", function (e) {
            e.preventDefault();
            closeModal();
        });

        $(document)
            .off("keydown.handleContactModal")
            .on("keydown.handleContactModal", function (e) {
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
                .on("click.handleSidebar", ".show-sidebar", function (e) {
                    e.preventDefault();
                    $(".popup-show-bar").toggleClass("show");

                    if (
                        !$(".popup-show-bar").hasClass("show") &&
                        !$(".popup-menu-mobile").hasClass("show")
                    ) {
                        $("body").removeClass("no-scroll");
                    }
                })
                .on("click.handleSidebar", ".show-menu-mobile", function (e) {
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
                .on("click.handleSidebar", ".overlay-popup", function () {
                    closeAllPopups();
                })
                .on(
                    "click.handleSidebar",
                    ".popup-menu-mobile .nav_link",
                    function () {
                        closeAllPopups();
                    }
                );
        };

    // Dom Ready
    $(function () {
        headerFixed();
        tabSlide();
        settings_color();
        switchMode();
        switchLanguage();
        oneNavOnePage();
        handleEffectSpotlight();
        handleCounterTouchEffect();
        handleFeaturedProjectReveal();
        handleQuickContactGlowEffect();
        handlePartnerLogoMask();
        preventDefault();
        spliting();
        runOrderedIntroSequence().catch((error) => {
            console.error("runOrderedIntroSequence failed:", error);
        });
        handleContactModal();
        handleSidebar();
    });
})(jQuery);

