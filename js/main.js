/* ========================================
   PATTY & BUN-NY - Main JavaScript
   ======================================== */

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    initMenuBuilder();
    initMenuBuilder2();
    initHeroScroll();
});

/* ========================================
   HERO SCROLL EFFECT
   ======================================== */

function initHeroScroll() {
    var heroHeading = document.querySelector('.hero-heading');
    var heroVideo = document.querySelector('.hero-video-behind');
    var heroWrapper = document.querySelector('.hero-section-wrapper');
    var heroOverlay = document.querySelector('.hero-overlay');
    var menuLeft = document.querySelector('.hero-menu-left');
    var menuRight = document.querySelector('.hero-menu-right');

    if (!heroHeading || !heroVideo || !heroWrapper) return;


    // Set initial positions (both centered)
    heroVideo.style.transform = 'translate(-50%, -50%)';
    heroHeading.style.transform = 'translate(-50%, -50%)';

    window.addEventListener('scroll', function() {
        var scrollY = window.scrollY;
        var viewportHeight = window.innerHeight;

        // Phase 1: Video reveal (0 to 50vh scroll)
        var phase1End = viewportHeight * 0.5;
        var phase1Progress = Math.min(scrollY / phase1End, 1);

        // Phase 2: Fade out video and heading (50vh to 100vh scroll)
        var phase2Start = phase1End;
        var phase2End = viewportHeight * 1.0;
        var phase2Progress = scrollY > phase2Start ? Math.min((scrollY - phase2Start) / (phase2End - phase2Start), 1) : 0;

        // Phase 3: Menu sweep in (100vh to 200vh scroll)
        var phase3Start = phase2End;
        var phase3End = viewportHeight * 2.0;
        var phase3Progress = scrollY > phase3Start ? Math.min((scrollY - phase3Start) / (phase3End - phase3Start), 1) : 0;

        // Phase 1: Video shifts up 300px, fades in
        var videoMoveUp = phase1Progress * 300;
        var headingMoveUp = phase1Progress * 30;

        // Video fades in from 0% to 100% over first 50px of shift
        var fadeEndPx = 50;
        var videoFadeIn = Math.min(videoMoveUp / fadeEndPx, 1);

        // Phase 2: Both fade out (video starts at 1, heading starts at 1)
        var fadeOutOpacity = 1 - phase2Progress;

        // Final video opacity: fade in during phase 1, fade out during phase 2
        var finalVideoOpacity = phase2Progress > 0 ? fadeOutOpacity : videoFadeIn;
        var finalHeadingOpacity = fadeOutOpacity;

        // Apply transforms and opacity for video and heading
        heroVideo.style.transform = 'translate(-50%, calc(-50% - ' + videoMoveUp + 'px))';
        heroVideo.style.opacity = finalVideoOpacity;
        heroHeading.style.transform = 'translate(-50%, calc(-50% - ' + headingMoveUp + 'px))';
        heroHeading.style.opacity = finalHeadingOpacity;

        // Phase 3: Menu panels sweep in
        if (menuLeft && menuRight) {
            // Eased progress for smoother animation
            var easeOut = 1 - Math.pow(1 - phase3Progress, 3);

            // Left menu: from -50% (off-screen left) to 7% (left side of viewport)
            var leftPosition = -50 + (57 * easeOut); // -50% to 7%
            menuLeft.style.left = leftPosition + '%';
            menuLeft.style.opacity = phase3Progress;

            // Right menu: from -50% (off-screen right) to 7% (right side of viewport)
            var rightPosition = -50 + (57 * easeOut); // -50% to 7%
            menuRight.style.right = rightPosition + '%';
            menuRight.style.opacity = phase3Progress;
        }

        // Overlay opacity: transition from 50% to 75% during phase 3
        if (heroOverlay) {
            var overlayOpacity = 0.5 + (0.25 * phase3Progress); // 0.5 to 0.75
            heroOverlay.style.backgroundColor = 'rgba(0, 0, 0, ' + overlayOpacity + ')';
        }
    });
}

function initMenuBuilder() {
    var toppingItems = document.querySelectorAll('.topping-item');

    toppingItems.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');

        checkbox.addEventListener('change', function() {
            updateToppingVideos();
        });
    });


    updateToppingVideos();
}

function updateToppingVideos() {
    // Get checkbox states
    var cheeseSelected = document.querySelector('.topping-item[data-topping="cheese"] input').checked;
    var pattySelected = document.querySelector('.topping-item[data-topping="patty"] input').checked;
    var topBunSelected = document.querySelector('.topping-item[data-topping="top_bun"] input').checked;
    var bottomBunSelected = document.querySelector('.topping-item[data-topping="bottom_bun"] input').checked;
    var picklesSelected = document.querySelector('.topping-item[data-topping="pickles"] input').checked;
    var onionSelected = document.querySelector('.topping-item[data-topping="onion"] input').checked;
    var tomatoSelected = document.querySelector('.topping-item[data-topping="tomato"] input').checked;
    var lettuceSelected = document.querySelector('.topping-item[data-topping="lettuce"] input').checked;

    // Get video elements
    var cheeseVideo = document.querySelector('.topping-video[data-topping="cheese"]');
    var pattyVideo = document.querySelector('.topping-video[data-topping="patty"]');
    var comboVideo = document.querySelector('.topping-video[data-topping="pattyandcheese"]');
    var topBunVideo = document.querySelector('.topping-video[data-topping="top_bun"]');
    var bottomBunVideo = document.querySelector('.topping-video[data-topping="bottom_bun"]');
    var picklesVideo = document.querySelector('.topping-video[data-topping="pickles"]');
    var onionVideo = document.querySelector('.topping-video[data-topping="onion"]');
    var tomatoVideo = document.querySelector('.topping-video[data-topping="tomato"]');
    var lettuceVideo = document.querySelector('.topping-video[data-topping="lettuce"]');

    // Rule 1: Handle anchor (patty/cheese combo)
    if (cheeseSelected && pattySelected) {
        cheeseVideo.classList.remove('active');
        pattyVideo.classList.remove('active');
        comboVideo.classList.add('active');
        comboVideo.play().catch(function(e) { console.log('Combo video play error:', e); });
    } else {
        comboVideo.classList.remove('active');
        if (cheeseSelected) {
            cheeseVideo.classList.add('active');
            cheeseVideo.play().catch(function(e) { console.log('Cheese video play error:', e); });
        } else {
            cheeseVideo.classList.remove('active');
        }
        if (pattySelected) {
            pattyVideo.classList.add('active');
            pattyVideo.play().catch(function(e) { console.log('Patty video play error:', e); });
        } else {
            pattyVideo.classList.remove('active');
        }
    }

    // Position anchor at center
    comboVideo.style.top = '50%';
    pattyVideo.style.top = '50%';
    cheeseVideo.style.top = '50%';

    // Handle visibility for other toppings
    function setActive(video, isSelected) {
        if (isSelected) {
            video.classList.add('active');
            video.play().catch(function(e) { console.log('Video play error:', e); });
        } else {
            video.classList.remove('active');
        }
    }

    setActive(topBunVideo, topBunSelected);
    setActive(bottomBunVideo, bottomBunSelected);
    setActive(picklesVideo, picklesSelected);
    setActive(onionVideo, onionSelected);
    setActive(tomatoVideo, tomatoSelected);
    setActive(lettuceVideo, lettuceSelected);

    // ========================================
    // ABOVE ANCHOR POSITIONING RULES
    // ========================================

    // Rule 2: Default - top bun at -60px (60px below center)
    // Rule 3: Pickles at -40px, top bun at 0px
    // Rule 4: Onion at -20px, pickles at 20px, top bun at 60px
    // Rule 5: Onion (no pickles) at -20px, top bun at 20px
    // Rule 6: Toppings drop when removed

    if (onionSelected && picklesSelected) {
        // Rule 4: Onion + Pickles + top bun
        onionVideo.style.top = 'calc(50% - 35px)';      // 35px above center
        picklesVideo.style.top = 'calc(50% - 50px)';    // 50px above center
        topBunVideo.style.top = 'calc(50% - 60px)';     // 60px above center
    } else if (picklesSelected && !onionSelected) {
        // Rule 3: Pickles + top bun only
        picklesVideo.style.top = 'calc(50% + 10px)';    // -10px = 10px below center
        topBunVideo.style.top = '50%';                   // 0px = at center
    } else if (onionSelected && !picklesSelected) {
        // Rule 5: Onion + top bun only (no pickles)
        onionVideo.style.top = 'calc(50% - 35px)';      // 35px above center
        topBunVideo.style.top = '50%';                   // 0px = at center
    } else {
        // Rule 2: Default - only top bun
        topBunVideo.style.top = 'calc(50% + 60px)';     // -60px = 60px below center
    }

    // ========================================
    // BELOW ANCHOR POSITIONING RULES
    // ========================================

    // Rule 2: Default - bottom bun at 60px (toward patty)
    // Rule 10: Tomatoes at 10px, bottom bun at 0px
    // Rule 11: Lettuce at -35px, tomatoes at -50px, bottom bun at -60px
    // Rule 12: Lettuce (no tomatoes) at -35px, bottom bun at 0px
    // Rule 13: Toppings move up when removed

    if (tomatoSelected && lettuceSelected) {
        // Rule 11: Tomatoes + Lettuce + bottom bun
        tomatoVideo.style.top = 'calc(50% + 25px)';       // -25px = 25px below center
        lettuceVideo.style.top = 'calc(50% + 80px)';      // -80px = 80px below center
        bottomBunVideo.style.top = 'calc(50% + 100px)';   // -100px = 100px below center
    } else if (lettuceSelected && !tomatoSelected) {
        // Rule 10: Lettuce + bottom bun only
        lettuceVideo.style.top = 'calc(50% + 10px)';      // -10px = 10px below center
        bottomBunVideo.style.top = 'calc(50% + 40px)';    // -40px = 40px below center (away from patty)
    } else if (tomatoSelected && !lettuceSelected) {
        // Rule 12: Tomatoes + bottom bun only (no lettuce)
        tomatoVideo.style.top = 'calc(50% + 25px)';       // -25px = 25px below center
        bottomBunVideo.style.top = '50%';                  // 0px = at center
    } else {
        // Rule 2: Default - only bottom bun
        bottomBunVideo.style.top = 'calc(50% - 60px)';    // 60px = 60px above center (toward patty)
    }
}

/* ========================================
   METHOD 2: Image-based Menu Builder
   ======================================== */

function initMenuBuilder2() {
    var toppingItems = document.querySelectorAll('.topping-item-2');

    toppingItems.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');

        checkbox.addEventListener('change', function() {
            updateToppingImages();
        });
    });

    updateToppingImages();
}

function updateToppingImages() {
    // Get checkbox states
    var cheeseSelected = document.querySelector('.topping-item-2[data-topping-2="cheese"] input').checked;
    var pattySelected = document.querySelector('.topping-item-2[data-topping-2="patty"] input').checked;
    var topBunSelected = document.querySelector('.topping-item-2[data-topping-2="top_bun"] input').checked;
    var bottomBunSelected = document.querySelector('.topping-item-2[data-topping-2="bottom_bun"] input').checked;
    var picklesSelected = document.querySelector('.topping-item-2[data-topping-2="pickles"] input').checked;
    var onionSelected = document.querySelector('.topping-item-2[data-topping-2="onion"] input').checked;
    var baconSelected = document.querySelector('.topping-item-2[data-topping-2="bacon"] input').checked;
    var tomatoSelected = document.querySelector('.topping-item-2[data-topping-2="tomato"] input').checked;
    var lettuceSelected = document.querySelector('.topping-item-2[data-topping-2="lettuce"] input').checked;

    // Get image elements
    var cheeseImg = document.querySelector('.topping-image[data-topping-2="cheese"]');
    var pattyImg = document.querySelector('.topping-image[data-topping-2="patty"]');
    var comboImg = document.querySelector('.topping-image[data-topping-2="pattyandcheese"]');
    var topBunImg = document.querySelector('.topping-image[data-topping-2="top_bun"]');
    var bottomBunImg = document.querySelector('.topping-image[data-topping-2="bottom_bun"]');
    var picklesImg = document.querySelector('.topping-image[data-topping-2="pickles"]');
    var onionImg = document.querySelector('.topping-image[data-topping-2="onion"]');
    var baconImg = document.querySelector('.topping-image[data-topping-2="bacon"]');
    var tomatoImg = document.querySelector('.topping-image[data-topping-2="tomato"]');
    var lettuceImg = document.querySelector('.topping-image[data-topping-2="lettuce"]');

    // Rule 1: Handle anchor (patty/cheese combo)
    if (cheeseSelected && pattySelected) {
        cheeseImg.classList.remove('active');
        pattyImg.classList.remove('active');
        comboImg.classList.add('active');
    } else {
        comboImg.classList.remove('active');
        if (cheeseSelected) {
            cheeseImg.classList.add('active');
        } else {
            cheeseImg.classList.remove('active');
        }
        if (pattySelected) {
            pattyImg.classList.add('active');
        } else {
            pattyImg.classList.remove('active');
        }
    }

    // Position anchor at center
    comboImg.style.top = '50%';
    pattyImg.style.top = '50%';
    cheeseImg.style.top = '50%';

    // Handle visibility for other toppings
    function setActive(img, isSelected) {
        if (isSelected) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    }

    setActive(topBunImg, topBunSelected);
    setActive(bottomBunImg, bottomBunSelected);
    setActive(picklesImg, picklesSelected);
    setActive(onionImg, onionSelected);
    setActive(baconImg, baconSelected);
    setActive(tomatoImg, tomatoSelected);
    setActive(lettuceImg, lettuceSelected);

    // ========================================
    // ABOVE ANCHOR POSITIONING RULES (Method 2)
    // ========================================
    // Rule 2: Default - top bun at -60px
    // Rule 3: Only pickles - pickles at -15px, top bun to 0px
    // Rule 4: Only onions - onions at 30px, top bun to 0px
    // Rule 5: Only bacon - bacon at 60px, top bun to 0px
    // Rule 6: Bacon + Onion - onion at 110px, top bun to 75px
    // Rule 7: Bacon + Pickles - pickles at 60px, top bun to 75px
    // Rule 8: Bacon + Onion + Pickles - pickles at 140px, top bun to 150px
    // Rule 9: Onion + Pickles (no bacon) - pickles at 70px, top bun to 90px

    if (baconSelected && onionSelected && picklesSelected) {
        // Rule 8: Bacon + Onion + Pickles + top bun
        baconImg.style.top = 'calc(50% - 60px)';      // 60px above center
        onionImg.style.top = 'calc(50% - 110px)';     // 110px above center
        picklesImg.style.top = 'calc(50% - 140px)';   // 140px above center
        topBunImg.style.top = 'calc(50% - 150px)';    // 150px above center
    } else if (baconSelected && onionSelected && !picklesSelected) {
        // Rule 6: Bacon + Onion (no pickles)
        baconImg.style.top = 'calc(50% - 60px)';      // 60px above center
        onionImg.style.top = 'calc(50% - 110px)';     // 110px above center
        topBunImg.style.top = 'calc(50% - 75px)';     // 75px above center
    } else if (baconSelected && picklesSelected && !onionSelected) {
        // Rule 7: Bacon + Pickles (no onion)
        baconImg.style.top = 'calc(50% - 60px)';      // 60px above center
        picklesImg.style.top = 'calc(50% - 60px)';    // 60px above center
        topBunImg.style.top = 'calc(50% - 75px)';     // 75px above center
    } else if (baconSelected && !onionSelected && !picklesSelected) {
        // Rule 5: Only bacon
        baconImg.style.top = 'calc(50% - 60px)';      // 60px above center
        topBunImg.style.top = '50%';                   // 0px = at center
    } else if (onionSelected && picklesSelected && !baconSelected) {
        // Rule 9: Onion + Pickles (no bacon)
        onionImg.style.top = 'calc(50% - 30px)';      // 30px above center
        picklesImg.style.top = 'calc(50% - 70px)';    // 70px above center
        topBunImg.style.top = 'calc(50% - 90px)';     // 90px above center
    } else if (onionSelected && !picklesSelected && !baconSelected) {
        // Rule 4: Only onions
        onionImg.style.top = 'calc(50% - 30px)';      // 30px above center
        topBunImg.style.top = '50%';                   // 0px = at center
    } else if (picklesSelected && !onionSelected && !baconSelected) {
        // Rule 3: Only pickles
        picklesImg.style.top = 'calc(50% + 15px)';    // -15px = 15px below center
        topBunImg.style.top = '50%';                   // 0px = at center
    } else {
        // Rule 2: Default - only top bun
        topBunImg.style.top = 'calc(50% + 60px)';     // -60px = 60px below center
    }

    // ========================================
    // BELOW ANCHOR POSITIONING RULES (Method 2)
    // ========================================
    // Rule 2: Default - bottom bun at 60px (toward patty)
    // Rule 10: Lettuce at -15px, bottom bun to -50px
    // Rule 11: Tomatoes at -30px, lettuce to -100px, bottom bun to -120px
    // Rule 13: Toppings move up when removed

    if (tomatoSelected && lettuceSelected) {
        // Rule 11: Tomatoes + Lettuce + bottom bun
        tomatoImg.style.top = 'calc(50% + 35px)';       // -35px = 35px below center
        lettuceImg.style.top = 'calc(50% + 115px)';     // -115px = 115px below center
        bottomBunImg.style.top = 'calc(50% + 160px)';   // -160px = 160px below center
    } else if (lettuceSelected && !tomatoSelected) {
        // Rule 10: Lettuce + bottom bun only
        lettuceImg.style.top = 'calc(50% + 15px)';      // -15px = 15px below center
        bottomBunImg.style.top = 'calc(50% + 50px)';    // -50px = 50px below center
    } else if (tomatoSelected && !lettuceSelected) {
        // Tomatoes + bottom bun only (no lettuce)
        tomatoImg.style.top = 'calc(50% + 35px)';       // -35px = 35px below center
        bottomBunImg.style.top = '50%';                  // 0px = at center
    } else {
        // Rule 2: Default - only bottom bun
        bottomBunImg.style.top = 'calc(50% - 60px)';    // 60px = 60px above center (toward patty)
    }
}
