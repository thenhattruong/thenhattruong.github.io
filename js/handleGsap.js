gsap.registerPlugin(ScrollTrigger);

(function($) {
    let splitTextInstances = [];
    let splitTextTweens = [];
    let aboutTitleRevealTween = null;

    const clearSplitTextAnimations = () => {
        splitTextTweens.forEach((tween) => {
            if (!tween) return;
            if (tween.scrollTrigger) {
                tween.scrollTrigger.kill();
            }
            tween.kill();
        });
        splitTextTweens = [];

        splitTextInstances.forEach((instance) => {
            if (instance && typeof instance.revert === "function") {
                instance.revert();
            }
        });
        splitTextInstances = [];

        if (aboutTitleRevealTween) {
            if (aboutTitleRevealTween.scrollTrigger) {
                aboutTitleRevealTween.scrollTrigger.kill();
            }
            aboutTitleRevealTween.kill();
            aboutTitleRevealTween = null;
        }
    };

    const playAboutTitleReveal = () => {
        if (!aboutTitleRevealTween) return;
        aboutTitleRevealTween.restart();
    };

    window.playAboutTitleReveal = playAboutTitleReveal;

    /* animation_text
  -------------------------------------------------------------------------*/
    var animation_text = function() {
        clearSplitTextAnimations();

        if ($(".split-text").length > 0) {
            var st = $(".split-text");
            if (st.length === 0) return;
            const isMobile = window.matchMedia("(max-width: 767px)").matches;
            gsap.registerPlugin(SplitText, ScrollTrigger);
            st.each(function(index, el) {
                const $el = $(el);
                const $target =
                    $el.find("p, a").length > 0 ? $el.find("p, a")[0] : el;
                const hasClass = $el.hasClass.bind($el);
                const pxl_split = new SplitText($target, {
                    type: "words, chars",
                    lineThreshold: 0.5,
                    linesClass: "split-line",
                });
                splitTextInstances.push(pxl_split);
                let split_type_set = pxl_split.chars;
                gsap.set($target, {
                    perspective: 400
                });

                const settings = {
                    scrollTrigger: {
                        trigger: $target,
                        start: "top 86%",
                        toggleActions: "play none none reverse",
                    },
                    duration: 0.9,
                    stagger: 0.02,
                    ease: "power3.out",
                };

                if (hasClass("effect-fade")) settings.opacity = 0;

                if (
                    hasClass("split-lines-transform") ||
                    hasClass("split-lines-rotation-x")
                ) {
                    if (isMobile) {
                        settings.scrollTrigger.start = "top 92%";
                        settings.duration = 0.6;
                        settings.stagger = 0.2;
                    }
                    pxl_split.split({
                        type: "lines",
                        lineThreshold: 0.5,
                        linesClass: "split-line",
                    });
                    split_type_set = pxl_split.lines;
                    settings.opacity = 0;
                    if (!isMobile) settings.stagger = 0.5;
                    if (hasClass("split-lines-rotation-x")) {
                        settings.rotationX = -120;
                        settings.transformOrigin = "top center -50";
                    } else {
                        settings.yPercent = 100;
                        settings.autoAlpha = 0;
                    }
                }

                if (hasClass("split-words-scale")) {
                    pxl_split.split({
                        type: "words"
                    });
                    split_type_set = pxl_split.words;
                    split_type_set.forEach((elw, index) => {
                        gsap.set(
                            elw, {
                                opacity: 0,
                                scale: index % 2 === 0 ? 0 : 2,
                                force3D: true,
                                duration: 0.1,
                                ease: "power3.out",
                                stagger: 0.02,
                            },
                            index * 0.01
                        );
                    });
                    const tween = gsap.to(split_type_set, {
                        scrollTrigger: {
                            trigger: el,
                            start: "top 86%",
                        },
                        rotateX: "0",
                        scale: 1,
                        opacity: 1,
                    });
                    splitTextTweens.push(tween);
                } else if (hasClass("effect-blur-fade")) {
                    pxl_split.split({
                        type: "words"
                    });
                    split_type_set = pxl_split.words;
                    const isTestimonialFeedback =
                        $el.is("p.text-body-2") &&
                        $el.closest("#testimonial .testimonial-item").length > 0;
                    const tween = gsap.fromTo(
                        split_type_set, {
                            opacity: 0,
                            filter: isTestimonialFeedback ? "blur(6px)" : "blur(10px)",
                            y: isTestimonialFeedback ? 12 : 20,
                        }, {
                            opacity: 1,
                            filter: "blur(0px)",
                            y: 0,
                            duration: isTestimonialFeedback ? 0.55 : 1,
                            stagger: isTestimonialFeedback ? 0.045 : 0.1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: $target,
                                start: isTestimonialFeedback ? "top 92%" : "top 86%",
                                toggleActions: "play none none reverse",
                            },
                        }
                    );
                    splitTextTweens.push(tween);
                } else {
                    const tween = gsap.from(split_type_set, settings);
                    splitTextTweens.push(tween);
                }
            });
        }

        const aboutTitle = document.querySelector("#about .about-title-follow");
        if (aboutTitle) {
            const aboutTitleWords = aboutTitle.querySelectorAll(".about-title-word");
            if (aboutTitleWords.length > 0) {
                const prefersReducedMotion = window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;

                if (prefersReducedMotion) {
                    aboutTitle.classList.remove("is-title-revealing", "is-flame-burst");
                    gsap.set(aboutTitle, {
                        clearProps: "transform,filter,textShadow,--about-title-glow",
                    });
                    gsap.set(aboutTitleWords, {
                        clearProps: "transform,opacity,filter,textShadow,color,clipPath",
                        opacity: 1,
                        filter: "none",
                    });
                } else {
                    gsap.set(aboutTitle, {
                        perspective: 900,
                        transformStyle: "preserve-3d",
                        "--about-title-glow": 0,
                    });
                    gsap.set(aboutTitleWords, {
                        clearProps: "color,textShadow",
                    });
                    gsap.set(aboutTitleWords, {
                        autoAlpha: 0,
                        y: 56,
                        x: 0,
                        rotationX: 0,
                        rotationZ: 0,
                        scale: 1,
                        filter: "none",
                        clipPath: "none",
                        transformOrigin: "50% 100%",
                    });

                    aboutTitleRevealTween = gsap.timeline({
                        paused: true,
                        onStart: () => aboutTitle.classList.add("is-title-revealing"),
                        onComplete: () => {
                            aboutTitle.classList.remove(
                                "is-title-revealing",
                                "is-flame-burst"
                            );
                            gsap.set(aboutTitleWords, {
                                clearProps: "color,textShadow",
                            });
                        },
                    });

                    aboutTitleRevealTween.to(aboutTitleWords, {
                        autoAlpha: 1,
                        y: 0,
                        x: 0,
                        rotationX: 0,
                        rotationZ: 0,
                        scale: 1,
                        filter: "none",
                        clipPath: "none",
                        duration: 1,
                        stagger: {
                            each: 0.1,
                            from: "start",
                        },
                        ease: "back.out(1.45)",
                    });

                    if (!document.body || !document.body.classList.contains("intro-locked")) {
                        window.requestAnimationFrame(() => {
                            if (aboutTitleRevealTween) {
                                aboutTitleRevealTween.play(0);
                            }
                        });
                    }
                }
            }
        }
    };

    const refreshSplitTextAnimations = () => {
        animation_text();
        ScrollTrigger.refresh();
        if (typeof window.initAboutIntroCharHover === "function") {
            window.initAboutIntroCharHover();
        }
    };

    window.clearSplitTextAnimations = clearSplitTextAnimations;
    window.refreshSplitTextAnimations = refreshSplitTextAnimations;

    /* scrolling_effect
  -------------------------------------------------------------------------*/
    var scrolling_effect = function() {
        if ($(".scrolling-effect").length > 0) {
            var st = $(".scrolling-effect");
            st.each(function(index, el) {
                var $el = $(el);
                var delay = parseFloat($el.data("delay")) || 0;
                var settings = {
                    scrollTrigger: {
                        trigger: el,
                        scrub: 3,
                        toggleActions: "play none none reverse",
                        start: "30px bottom",
                        end: "bottom bottom",
                        delay: delay,
                    },
                    duration: 0.8,
                    ease: "power3.out",
                };

                if ($el.hasClass("effectRight")) {
                    settings.opacity = 0;
                    settings.x = "80";
                }
                if ($el.hasClass("effectLeft")) {
                    settings.opacity = 0;
                    settings.x = "-80";
                }
                if ($el.hasClass("effectBottom")) {
                    settings.opacity = 0;
                    settings.y = "100";
                }
                if ($el.hasClass("effectTop")) {
                    settings.opacity = 0;
                    settings.y = "-80";
                }
                if ($el.hasClass("effectZoomIn")) {
                    settings.opacity = 0;
                    settings.scale = 0.4;
                }

                gsap.from(el, settings);
            });
        }
    };

    /* stackElement
  -------------------------------------------------------------------------*/
    var stackElement = function() {
        if ($(".stack-element").length > 0) {
            let totalHeight;
            let scrollTriggerInstances = [];

            const updateTotalHeight = () => {
                const headerHeight =
                    document.querySelector(".header-fixed")?.offsetHeight || 0;
                totalHeight = $(".tabs-content-wrap").outerHeight();

                scrollTriggerInstances.forEach((instance) => instance.kill());
                scrollTriggerInstances = [];

                document
                    .querySelectorAll(".element:not(:last-child)")
                    .forEach((element, index) => {
                        const tabHeight = element.offsetHeight;
                        totalHeight -= tabHeight;

                        const pinTrigger = ScrollTrigger.create({
                            trigger: element,
                            scrub: 1,
                            start: `top+=-${headerHeight} top`,
                            end: `+=${totalHeight}`,
                            pin: true,
                            pinSpacing: false,
                            animation: gsap.to(element, {
                                scale: 0.7,
                                opacity: 0,
                            }),
                        });

                        scrollTriggerInstances.push(pinTrigger);
                    });
            };

            updateTotalHeight();

            let resizeTimeout;
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(updateTotalHeight, 150);
            });
        }
    };

    /* animationFooter
    -------------------------------------------------------------------------------------*/
    var animationFooter = function() {
        if ($(".footer-container").length) {
            gsap.set(".footer-container", {
                yPercent: -100,
                scale: 0.8,
                opacity: 0,
                transformOrigin: "center bottom",
            });
            const uncover = gsap.timeline({
                paused: true
            });
            uncover.to(".footer-container", {
                yPercent: 0,
                scale: 1,
                opacity: 1,
                ease: "none",
            });
            ScrollTrigger.create({
                trigger: ".main-content",
                start: "bottom bottom",
                end: "+=10%",
                animation: uncover,
                scrub: 1,
            });
        }
    };

    /* scrollTransform
    -------------------------------------------------------------------------------------*/
    var scrollTransform = function() {
        const scrollTransformElements =
            document.querySelectorAll(".scroll-tranform");
        if (scrollTransformElements.length > 0) {
            scrollTransformElements.forEach(function(element) {
                const direction = element.dataset.direction || "up";
                const distance = element.dataset.distance || "10%";
                let animationProperty;
                switch (direction.toLowerCase()) {
                    case "left":
                        animationProperty = {
                            x: `-${distance}`
                        };
                        break;
                    case "right":
                        animationProperty = {
                            x: `${distance}`
                        };
                        break;
                    case "up":
                        animationProperty = {
                            y: `-${distance}`
                        };
                        break;
                    case "down":
                        animationProperty = {
                            y: `${distance}`
                        };
                        break;
                    default:
                        animationProperty = {
                            y: `-${distance}`
                        };
                }

                gsap.to(element, {
                    ...animationProperty,
                    scrollTrigger: {
                        trigger: element,
                        start: "top center",
                        end: "bottom top",
                        scrub: 2,
                    },
                });
            });
        }
    };

    $(function() {
        refreshSplitTextAnimations();
        scrolling_effect();
        stackElement();
        animationFooter();
        scrollTransform();
    });
})(jQuery);
