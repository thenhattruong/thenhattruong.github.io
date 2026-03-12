function isElementInViewport($el) {
    var top = $el.offset().top;
    var bottom = top + $el.outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return bottom > viewportTop && top < viewportBottom;
}

function normalizeCounterValue(rawValue) {
    var parsed = parseInt(rawValue, 10);
    return isNaN(parsed) ? 0 : parsed;
}

function getCounterDigitCount(rawValue) {
    var normalizedValue = Math.abs(normalizeCounterValue(rawValue));
    var digits = String(normalizedValue);
    return digits.length > 0 ? digits.length : 1;
}

function lockCounterWidth(odometerEl) {
    if (!odometerEl) return;

    var targetNumber = odometerEl.getAttribute("data-number");
    if (typeof targetNumber === "undefined") {
        targetNumber = odometerEl.dataset ? odometerEl.dataset.number : "";
    }

    var digitCount = getCounterDigitCount(targetNumber);
    odometerEl.style.setProperty("--odometer-digits", String(digitCount));

    var counterNumberEl = odometerEl.closest(".counter-number");
    if (counterNumberEl) {
        counterNumberEl.style.setProperty(
            "--counter-odometer-digits",
            String(digitCount)
        );
    }
}

function resetCountersToZero() {
    $(".counter-item").removeClass("counted");

    $(".counter-item .odometer").each(function() {
        var odometerEl = this;
        if (!odometerEl) return;
        lockCounterWidth(odometerEl);

        if (typeof Odometer !== "undefined") {
            if (!odometerEl.odometer && typeof Odometer === "function") {
                new Odometer({
                    el: odometerEl,
                    value: 0,
                });
            } else if (
                odometerEl.odometer &&
                typeof odometerEl.odometer.update === "function"
            ) {
                odometerEl.odometer.update(0);
            } else {
                odometerEl.innerHTML = "0";
            }
        } else {
            odometerEl.textContent = "0";
        }
    });
}

function checkCounters() {
    if (
        document.body &&
        document.body.dataset &&
        document.body.dataset.counterIntroReady === "false"
    ) {
        return;
    }

    $(".counter-item").each(function() {
        var $counter = $(this);
        if (isElementInViewport($counter) && !$counter.hasClass("counted")) {
            $counter.addClass("counted");

            var $odometer = $counter.find(".odometer");
            if (!$odometer.length) return;

            var targetNumber = $odometer.attr("data-number");
            if (typeof targetNumber === "undefined") {
                targetNumber = $odometer.data("number");
            }
            var targetValue = normalizeCounterValue(targetNumber);
            var odometerEl = $odometer[0];
            lockCounterWidth(odometerEl);

            if (typeof Odometer !== "undefined") {
                if (!odometerEl.odometer && typeof Odometer === "function") {
                    new Odometer({
                        el: odometerEl,
                        value: 0,
                    });
                }

                if (
                    odometerEl.odometer &&
                    typeof odometerEl.odometer.update === "function"
                ) {
                    odometerEl.odometer.update(0);
                    window.requestAnimationFrame(function() {
                        odometerEl.odometer.update(targetValue);
                    });
                } else {
                    odometerEl.innerHTML = "0";
                    setTimeout(function() {
                        odometerEl.innerHTML = String(targetValue);
                    }, 24);
                }
            } else {
                $odometer.text(targetValue);
            }
        }
    });
}

if ($(".counter-scroll").length > 0) {
    resetCountersToZero();
    $(window).on("scroll", checkCounters);
    $(window).on("load", checkCounters);
    $(document).ready(checkCounters);
}

window.checkCounters = checkCounters;
window.resetCountersToZero = resetCountersToZero;
