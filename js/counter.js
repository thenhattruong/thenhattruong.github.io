function isElementInViewport($el) {
    var el = $el[0];
    if (!el) return false;
    var rect = el.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.bottom > 0 && rect.top < viewportHeight;
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

    // Skip already-counted items before touching layout.
    $(".counter-item:not(.counted)").each(function() {
        var $counter = $(this);
        if (isElementInViewport($counter)) {
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
    var counterRafId = 0;
    window.addEventListener("scroll", function() {
        if (counterRafId) return;
        counterRafId = window.requestAnimationFrame(function() {
            counterRafId = 0;
            checkCounters();
        });
    }, { passive: true });
    $(window).on("load", checkCounters);
    $(document).ready(checkCounters);
}

window.checkCounters = checkCounters;
window.resetCountersToZero = resetCountersToZero;
