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
                pageTitle: "Truong The Nhat - Personal Portfolio Resume Theme",
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
                pageTitle: "Truong The Nhat - Hồ sơ cá nhân",
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

            const resetWord = (word) => {
                if (!word) return;
                word.classList.remove("is-active");
                word.style.transform = "translate3d(0, 0, 0)";
            };

            const moveWord = (word, clientX, clientY) => {
                const rect = word.getBoundingClientRect();
                const deltaX = clientX - (rect.left + rect.width / 2);
                const deltaY = clientY - (rect.top + rect.height / 2);
                const offsetX = Math.max(-18, Math.min(18, deltaX * 0.18));
                const offsetY = Math.max(-12, Math.min(12, deltaY * 0.18));

                word.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            };

            title.addEventListener("pointermove", (event) => {
                const targetWord =
                    event.target instanceof Element
                        ? event.target.closest(".about-title-word")
                        : null;

                if (!targetWord || !title.contains(targetWord)) return;

                if (activeWord && activeWord !== targetWord) {
                    resetWord(activeWord);
                }

                activeWord = targetWord;
                activeWord.classList.add("is-active");
                moveWord(activeWord, event.clientX, event.clientY);
            });

            title.addEventListener("pointerout", (event) => {
                const fromWord =
                    event.target instanceof Element
                        ? event.target.closest(".about-title-word")
                        : null;

                if (!fromWord || !title.contains(fromWord)) return;

                const toWord =
                    event.relatedTarget instanceof Element
                        ? event.relatedTarget.closest(".about-title-word")
                        : null;

                if (toWord && title.contains(toWord)) {
                    if (fromWord !== toWord) {
                        resetWord(fromWord);
                    }
                    activeWord = toWord;
                    activeWord.classList.add("is-active");
                    return;
                }

                if (activeWord === fromWord) {
                    activeWord = null;
                }
                resetWord(fromWord);
            });

            title.addEventListener("pointerleave", () => {
                if (!activeWord) return;
                resetWord(activeWord);
                activeWord = null;
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
            setText(".header-sidebar .box .info .text-label", content.profileRole);
            setText(".user-bar .box-author .info .text-label", content.profileRole);

            setText("#about .heading-section .tag-heading", content.aboutTag);
            renderAboutTitleWords(content.aboutTitle);
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

            $("[data-i18n]").each(function () {
                const key = $(this).data("i18n");
                if (key === "about.title") {
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
            let touchTimer;

            const setTouchPoint = (clientX, clientY) => {
                const rect = this.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                this.style.setProperty("--touch-x", `${x}px`);
                this.style.setProperty("--touch-y", `${y}px`);
            };

            $item.on("mousemove", function (e) {
                setTouchPoint(e.clientX, e.clientY);
            });

            $item.on("touchstart touchmove", function (e) {
                const touches = e.originalEvent.touches;
                const touch = touches && touches[0];
                if (!touch) return;

                setTouchPoint(touch.clientX, touch.clientY);
                $item.addClass("is-touch-active");
                clearTimeout(touchTimer);
            });

            $item.on("touchend touchcancel", function () {
                clearTimeout(touchTimer);
                touchTimer = setTimeout(() => {
                    $item.removeClass("is-touch-active");
                }, 220);
            });
        });
    };

    /* handleUserBarGlowEffect
  -------------------------------------------------------------------------*/
    const handleUserBarGlowEffect = () => {
        const $userBar = $(".main-content.style-fullwidth .user-bar.style-1");
        if (!$userBar.length) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            $userBar.addClass("is-intro-finished");
            return;
        }

        $userBar.addClass("is-intro-animating");

        const finishIntro = () => {
            $userBar.removeClass("is-intro-animating").addClass("is-intro-finished");
        };

        $userBar.one("animationend", function (e) {
            if (
                e.originalEvent &&
                e.originalEvent.animationName !== "user-bar-reveal"
            ) {
                return;
            }
            finishIntro();
        });

        setTimeout(() => {
            if (!$userBar.hasClass("is-intro-finished")) {
                finishIntro();
            }
        }, 1650);

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
        handleUserBarGlowEffect();
        handleQuickContactGlowEffect();
        handlePartnerLogoMask();
        preventDefault();
        spliting();
        handleSidebar();
    });
})(jQuery);
