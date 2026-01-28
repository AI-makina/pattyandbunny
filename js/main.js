/* ========================================
   PATTY & BUN-NY - Main JavaScript
   ======================================== */

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    initMenuBuilder();
    initMenuBuilder2();
    initHeroScroll();
    initCommercialSection();
    initPanelNavigation();
    initPanelNavigation2();
    initMenuParallax();
    initMainNavigation();
    initNavbarColorChange();
    initSectionFadeOverlay();
    initMobileMenu();
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

        // Phase 1: Video shifts up (300px desktop, 215px tablet portrait, 150px mobile landscape)
        var isTabletPortrait = window.innerWidth >= 768 && window.innerWidth <= 990 && window.innerHeight > 500;
        var isMobileLandscape = window.innerHeight <= 500;

        var videoShiftAmount = isTabletPortrait ? 215 : (isMobileLandscape ? 150 : 300);
        var videoMoveUp = phase1Progress * videoShiftAmount;

        // Heading shifts up by default, but DOWN for mobile landscape
        var headingShiftAmount = isMobileLandscape ? -30 : 30;
        var headingMoveUp = phase1Progress * headingShiftAmount;

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

            if (isTabletPortrait) {
                // TABLET PORTRAIT: Sequential menu animation
                // Phase 3 (100vh-200vh): Burgers sweep in from left to center
                // Phase 4 (200vh to 200vh+100px): Burgers hold in center
                // Phase 5 (200vh+100px to 300vh+100px): Burgers exit right
                // When 25% of burgers exit done, sides start entering
                // Phase 6: Sides hold for 100px, then unlock

                var holdDistance = 100; // 100px hold
                var sweepDistance = viewportHeight; // 100vh for sweep animations

                // Phase 3: Burgers sweep in (100vh to 200vh)
                var burgersInStart = viewportHeight;
                var burgersInEnd = viewportHeight * 2;
                var burgersInProgress = scrollY > burgersInStart ? Math.min((scrollY - burgersInStart) / (burgersInEnd - burgersInStart), 1) : 0;

                // Phase 4: Burgers hold (200vh to 200vh + 100px)
                var burgersHoldStart = burgersInEnd;
                var burgersHoldEnd = burgersHoldStart + holdDistance;

                // Phase 5: Burgers exit right (200vh+100px to 300vh+100px)
                var burgersOutStart = burgersHoldEnd;
                var burgersOutEnd = burgersOutStart + sweepDistance;
                var burgersOutProgress = scrollY > burgersOutStart ? Math.min((scrollY - burgersOutStart) / (burgersOutEnd - burgersOutStart), 1) : 0;

                // Sides start entering when 25% of burgers exit is done
                var sidesInStart = burgersOutStart + (sweepDistance * 0.25);
                var sidesInEnd = sidesInStart + sweepDistance;
                var sidesInProgress = scrollY > sidesInStart ? Math.min((scrollY - sidesInStart) / (sidesInEnd - sidesInStart), 1) : 0;

                // Phase 6: Sides hold (after sides fully in, hold for 100px)
                var sidesHoldStart = sidesInEnd;
                var sidesHoldEnd = sidesHoldStart + holdDistance;

                // Eased progress for smoother animation
                var easeIn = 1 - Math.pow(1 - burgersInProgress, 3);
                var easeOut = 1 - Math.pow(1 - burgersOutProgress, 3);
                var easeSidesIn = 1 - Math.pow(1 - sidesInProgress, 3);

                // Burgers position: -50% (off left) to 0% (centered, shifted left) to 100% (off right)
                var burgersCenter = 0; // centered position (shifted left)
                var sidesCenter = 19; // sides position (150px more to the right, ~19% on tablet)
                var burgersInPosition = -50 + ((burgersCenter + 50) * easeIn); // -50% to 0%
                var burgersOutPosition = burgersCenter + (100 * easeOut); // 0% to 100%
                var finalBurgersPosition = burgersOutProgress > 0 ? burgersOutPosition : burgersInPosition;

                menuLeft.style.left = finalBurgersPosition + '%';
                menuLeft.style.right = 'auto';

                // Burgers opacity: fade in during sweep in, fade out during sweep out
                var burgersOpacity = burgersInProgress;
                if (burgersOutProgress > 0) {
                    burgersOpacity = 1 - burgersOutProgress;
                }
                menuLeft.style.opacity = burgersOpacity;

                // Sides position: -50% (off left) to 25% (centered, 200px right of burgers)
                var sidesPosition = -50 + ((sidesCenter + 50) * easeSidesIn); // -50% to 25%
                menuRight.style.left = sidesPosition + '%';
                menuRight.style.right = 'auto';
                menuRight.style.opacity = sidesInProgress;

            } else if (isMobileLandscape) {
                // MOBILE LANDSCAPE: Sequential menu with vertical shift up
                // Phase 3: Burgers sweep in from left to center
                // Phase 4: Burgers hold at center
                // Phase 5: Burgers shift UP (parallax out of view)
                // When 75% shifted up, sides start sweeping in
                // Phase 6: Sides sweep in from left to center
                // Phase 7: Sides hold at center
                // Phase 8: Sides shift UP

                var holdDistance = 100; // 100px hold
                var sweepDistance = viewportHeight * 0.8; // Sweep distance
                var shiftUpDistance = viewportHeight * 0.8; // Distance to shift up

                // Phase 3: Burgers sweep in (100vh to 180vh)
                var burgersInStart = viewportHeight;
                var burgersInEnd = burgersInStart + sweepDistance;
                var burgersInProgress = scrollY > burgersInStart ? Math.min((scrollY - burgersInStart) / (burgersInEnd - burgersInStart), 1) : 0;

                // Phase 4: Burgers hold (after sweep in, hold for 100px)
                var burgersHoldStart = burgersInEnd;
                var burgersHoldEnd = burgersHoldStart + holdDistance;

                // Phase 5: Burgers shift UP
                var burgersShiftStart = burgersHoldEnd;
                var burgersShiftEnd = burgersShiftStart + shiftUpDistance;
                var burgersShiftProgress = scrollY > burgersShiftStart ? Math.min((scrollY - burgersShiftStart) / (burgersShiftEnd - burgersShiftStart), 1) : 0;

                // Sides start entering after burgers are fully out of view
                var sidesInStart = burgersShiftEnd;
                var sidesInEnd = sidesInStart + sweepDistance;
                var sidesInProgress = scrollY > sidesInStart ? Math.min((scrollY - sidesInStart) / (sidesInEnd - sidesInStart), 1) : 0;

                // Phase 7: Sides hold
                var sidesHoldStart = sidesInEnd;
                var sidesHoldEnd = sidesHoldStart + holdDistance;

                // Phase 8: Sides shift UP
                var sidesShiftStart = sidesHoldEnd;
                var sidesShiftEnd = sidesShiftStart + shiftUpDistance;
                var sidesShiftProgress = scrollY > sidesShiftStart ? Math.min((scrollY - sidesShiftStart) / (sidesShiftEnd - sidesShiftStart), 1) : 0;

                // Eased progress for smoother animation
                var easeIn = 1 - Math.pow(1 - burgersInProgress, 3);
                var easeShiftUp = 1 - Math.pow(1 - burgersShiftProgress, 3);
                var easeSidesIn = 1 - Math.pow(1 - sidesInProgress, 3);
                var easeSidesShiftUp = 1 - Math.pow(1 - sidesShiftProgress, 3);

                // Burgers horizontal position: -50% (off left) to center (2%)
                var burgersCenter = 2;
                var burgersPosition = -50 + ((burgersCenter + 50) * easeIn); // -50% to 2%
                menuLeft.style.left = burgersPosition + '%';
                menuLeft.style.right = 'auto';

                // Burgers vertical position: start at 100%
                // Then shift up completely out of view (200% to clear viewport)
                var burgersBaseTop = 100;
                var burgersVerticalShift = easeShiftUp * 180; // 0 to 180% (exits top of viewport)
                menuLeft.style.top = 'calc(' + burgersBaseTop + '% - ' + burgersVerticalShift + '%)';

                // Burgers opacity: fade in during sweep, stay visible during shift
                menuLeft.style.opacity = burgersInProgress;

                // Sides horizontal position: -50% (off left) to center (20%)
                var sidesCenter = 20;
                var sidesPosition = -50 + ((sidesCenter + 50) * easeSidesIn); // -50% to 20%
                menuRight.style.left = sidesPosition + '%';
                menuRight.style.right = 'auto';

                // Sides vertical position: 130px lower, then shift up
                var sidesVerticalShift = easeSidesShiftUp * 100;
                menuRight.style.top = 'calc(50% + 130px - ' + sidesVerticalShift + '%)';

                // Sides opacity
                menuRight.style.opacity = sidesInProgress;

            } else {
                // DESKTOP/TABLET LANDSCAPE: Original side-by-side animation
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
        }

        // Overlay opacity: transition from 50% to 75% during menu animation
        if (heroOverlay) {
            var overlayProgress;
            if (isTabletPortrait) {
                // For tablet portrait, use burgers in progress
                var burgersInStart = viewportHeight;
                var burgersInEnd = viewportHeight * 2;
                overlayProgress = scrollY > burgersInStart ? Math.min((scrollY - burgersInStart) / (burgersInEnd - burgersInStart), 1) : 0;
            } else if (isMobileLandscape) {
                // For mobile landscape, use burgers in progress
                var burgersInStart = viewportHeight;
                var burgersInEnd = burgersInStart + (viewportHeight * 0.8);
                overlayProgress = scrollY > burgersInStart ? Math.min((scrollY - burgersInStart) / (burgersInEnd - burgersInStart), 1) : 0;
            } else {
                overlayProgress = phase3Progress;
            }
            var overlayOpacity = 0.5 + (0.25 * overlayProgress); // 0.5 to 0.75
            heroOverlay.style.backgroundColor = 'rgba(0, 0, 0, ' + overlayOpacity + ')';
        }
    });
}

function initMenuBuilder() {
    var toppingItems = document.querySelectorAll('.topping-item');
    var selectAllBtn = document.querySelector('.select-all-btn');

    toppingItems.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');

        checkbox.addEventListener('change', function() {
            updateToppingVideos();
            // Update button state based on current selection
            updateSelectAllButtonState();
        });
    });

    // Select All button functionality
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', function() {
            var currentState = selectAllBtn.getAttribute('data-state');

            if (currentState === 'default') {
                // Select all toppings
                toppingItems.forEach(function(item) {
                    var checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = true;
                });
                selectAllBtn.setAttribute('data-state', 'all');
                selectAllBtn.textContent = 'Default';
            } else {
                // Reset to default (top bun, patty, bottom bun)
                toppingItems.forEach(function(item) {
                    var checkbox = item.querySelector('input[type="checkbox"]');
                    var topping = item.getAttribute('data-topping');
                    checkbox.checked = (topping === 'top_bun' || topping === 'patty' || topping === 'bottom_bun');
                });
                selectAllBtn.setAttribute('data-state', 'default');
                selectAllBtn.textContent = 'Select All';
            }
            updateToppingVideos();
        });
    }

    function updateSelectAllButtonState() {
        if (!selectAllBtn) return;
        var allChecked = true;
        toppingItems.forEach(function(item) {
            var checkbox = item.querySelector('input[type="checkbox"]');
            if (!checkbox.checked) allChecked = false;
        });
        if (allChecked) {
            selectAllBtn.setAttribute('data-state', 'all');
            selectAllBtn.textContent = 'Default';
        } else {
            selectAllBtn.setAttribute('data-state', 'default');
            selectAllBtn.textContent = 'Select All';
        }
    }

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
        cheeseVideo.pause();
        pattyVideo.classList.remove('active');
        pattyVideo.pause();
        comboVideo.classList.add('active');
        comboVideo.play().catch(function(e) { console.log('Combo video play error:', e); });
    } else {
        comboVideo.classList.remove('active');
        comboVideo.pause();
        if (cheeseSelected) {
            cheeseVideo.classList.add('active');
            cheeseVideo.play().catch(function(e) { console.log('Cheese video play error:', e); });
        } else {
            cheeseVideo.classList.remove('active');
            cheeseVideo.pause();
        }
        if (pattySelected) {
            pattyVideo.classList.add('active');
            pattyVideo.play().catch(function(e) { console.log('Patty video play error:', e); });
        } else {
            pattyVideo.classList.remove('active');
            pattyVideo.pause();
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
            video.pause();
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
    var toppingItems = document.querySelectorAll('.topping-item-2[data-topping-2]');
    var selectAllBtn = document.querySelector('.select-all-btn-2');

    toppingItems.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');

        checkbox.addEventListener('change', function() {
            updateToppingImages();
            // Update button state based on current selection
            updateSelectAllButtonState2();
        });
    });

    // Select All button functionality
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', function() {
            var currentState = selectAllBtn.getAttribute('data-state');

            if (currentState === 'default') {
                // Select all toppings
                toppingItems.forEach(function(item) {
                    var checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = true;
                });
                selectAllBtn.setAttribute('data-state', 'all');
                selectAllBtn.textContent = 'Default';
            } else {
                // Reset to default (top bun, patty, bottom bun)
                toppingItems.forEach(function(item) {
                    var checkbox = item.querySelector('input[type="checkbox"]');
                    var topping = item.getAttribute('data-topping-2');
                    checkbox.checked = (topping === 'top_bun' || topping === 'patty' || topping === 'bottom_bun');
                });
                selectAllBtn.setAttribute('data-state', 'default');
                selectAllBtn.textContent = 'Select All';
            }
            updateToppingImages();
        });
    }

    function updateSelectAllButtonState2() {
        if (!selectAllBtn) return;
        var allChecked = true;
        toppingItems.forEach(function(item) {
            var checkbox = item.querySelector('input[type="checkbox"]');
            if (!checkbox.checked) allChecked = false;
        });
        if (allChecked) {
            selectAllBtn.setAttribute('data-state', 'all');
            selectAllBtn.textContent = 'Default';
        } else {
            selectAllBtn.setAttribute('data-state', 'default');
            selectAllBtn.textContent = 'Select All';
        }
    }

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

/* ========================================
   COMMERCIAL SECTION
   ======================================== */

function initCommercialSection() {
    var section = document.querySelector('.commercial-section');
    var video = document.querySelector('.commercial-video');
    var image = document.querySelector('.commercial-image');

    if (!section || !video || !image) return;

    var hasPlayed = false;
    var isOutOfView = true;
    var videoEnded = false;

    // When video ends, show image instantly
    video.addEventListener('ended', function() {
        videoEnded = true;
        image.classList.add('visible');
    });

    // Create observer for 15% visibility (to start playing)
    var playObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !hasPlayed && isOutOfView === false) {
                // 15% visible and hasn't played yet this cycle
                video.currentTime = 0;
                video.play().catch(function(e) { console.log('Commercial video play error:', e); });
                hasPlayed = true;
                videoEnded = false;
                image.classList.remove('visible');
            }
        });
    }, { threshold: 0.15 });

    // Create observer for 0% visibility (to reset)
    var resetObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) {
                // Completely out of view - reset for next time
                isOutOfView = true;
                hasPlayed = false;
                video.pause();
                video.currentTime = 0;
            } else {
                // At least partially visible
                isOutOfView = false;
            }
        });
    }, { threshold: 0 });

    playObserver.observe(section);
    resetObserver.observe(section);

    // Handle fade out when scrolling past
    window.addEventListener('scroll', function() {
        var rect = section.getBoundingClientRect();
        var viewportHeight = window.innerHeight;

        // Calculate how far the section has scrolled past the top of viewport
        if (rect.top < 0) {
            // Section is being scrolled past (top is above viewport)
            var scrolledPast = Math.abs(rect.top);
            var sectionHeight = rect.height;
            // Fade out over the height of the section
            var fadeProgress = Math.min(scrolledPast / sectionHeight, 1);
            section.style.opacity = 1 - fadeProgress;
        } else {
            // Section is still in view or below
            section.style.opacity = 1;
        }
    });
}

/* ========================================
   PANEL NAVIGATION (Toppings/Sauces)
   ======================================== */

function initPanelNavigation() {
    var toppingsTable = document.querySelector('.toppings-table');
    if (!toppingsTable) return;

    var backBtn = toppingsTable.querySelector('.nav-back');
    var nextBtn = toppingsTable.querySelector('.nav-next');
    var panelTitle = toppingsTable.querySelector('.panel-title');
    var toppingsPanel = toppingsTable.querySelector('.toppings-panel');
    var saucesPanel = toppingsTable.querySelector('.sauces-panel');
    var sidesPanel = toppingsTable.querySelector('.sides-panel');
    var drinksPanel = toppingsTable.querySelector('.drinks-panel');

    if (!backBtn || !nextBtn || !toppingsPanel || !saucesPanel || !sidesPanel || !drinksPanel) return;

    var panels = [
        { panel: toppingsPanel, title: 'Toppings' },
        { panel: saucesPanel, title: 'Sauces' },
        { panel: sidesPanel, title: 'Sides' },
        { panel: drinksPanel, title: 'Drinks' }
    ];
    var currentIndex = 0;

    function updatePanel(index) {
        panels.forEach(function(p, i) {
            if (i === index) {
                p.panel.classList.add('active-panel');
            } else {
                p.panel.classList.remove('active-panel');
            }
        });
        panelTitle.textContent = panels[index].title;
        backBtn.disabled = (index === 0);
        nextBtn.disabled = (index === panels.length - 1);
        currentIndex = index;
    }

    nextBtn.addEventListener('click', function() {
        if (currentIndex < panels.length - 1) {
            updatePanel(currentIndex + 1);
        }
    });

    backBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            updatePanel(currentIndex - 1);
        }
    });
}

/* ========================================
   PANEL NAVIGATION METHOD 2 (Toppings/Sauces)
   ======================================== */

function initPanelNavigation2() {
    var toppingsTable = document.querySelector('.toppings-table-2');
    if (!toppingsTable) return;

    var backBtn = toppingsTable.querySelector('.nav-back-2');
    var nextBtn = toppingsTable.querySelector('.nav-next-2');
    var panelTitle = toppingsTable.querySelector('.panel-title-2');
    var toppingsPanel = toppingsTable.querySelector('.toppings-panel-2');
    var saucesPanel = toppingsTable.querySelector('.sauces-panel-2');
    var sidesPanel = toppingsTable.querySelector('.sides-panel-2');
    var drinksPanel = toppingsTable.querySelector('.drinks-panel-2');

    if (!backBtn || !nextBtn || !toppingsPanel || !saucesPanel || !sidesPanel || !drinksPanel) return;

    var panels = [
        { panel: toppingsPanel, title: 'Toppings' },
        { panel: saucesPanel, title: 'Sauces' },
        { panel: sidesPanel, title: 'Sides' },
        { panel: drinksPanel, title: 'Drinks' }
    ];
    var currentIndex = 0;

    function updatePanel(index) {
        panels.forEach(function(p, i) {
            if (i === index) {
                p.panel.classList.add('active-panel');
            } else {
                p.panel.classList.remove('active-panel');
            }
        });
        panelTitle.textContent = panels[index].title;
        backBtn.disabled = (index === 0);
        nextBtn.disabled = (index === panels.length - 1);
        currentIndex = index;
    }

    nextBtn.addEventListener('click', function() {
        if (currentIndex < panels.length - 1) {
            updatePanel(currentIndex + 1);
        }
    });

    backBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            updatePanel(currentIndex - 1);
        }
    });
}

/* ========================================
   MENU PARALLAX EFFECT
   ======================================== */

function initMenuParallax() {
    var menuItems = document.querySelectorAll('.menu-item-row');

    menuItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            item.classList.add('parallax-hover');
        });

        item.addEventListener('mouseleave', function() {
            item.classList.remove('parallax-hover');
        });
    });
}

/* ========================================
   MAIN NAVIGATION
   ======================================== */

function initMainNavigation() {
    var navLinks = document.querySelectorAll('.main-nav a[data-nav]');
    var viewportHeight = window.innerHeight;
    var navDropdown = document.querySelector('.nav-dropdown');
    var menuLink = document.querySelector('.nav-link[data-nav="menu"]');
    var dropdownLinks = document.querySelectorAll('.dropdown-content a');

    // Toggle dropdown on menu click
    if (menuLink && navDropdown) {
        menuLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navDropdown.classList.toggle('active');
        });
    }

    // Close dropdown when clicking dropdown options
    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navDropdown.classList.remove('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (navDropdown && !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('active');
        }
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var navType = link.getAttribute('data-nav');

            switch(navType) {
                case 'home':
                    // Instant scroll to top
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    break;

                case 'burgers':
                case 'sides':
                case 'drinks':
                    // Scroll to hero menu section (where menu panels are fully visible)
                    // This is at approximately 200vh scroll position
                    window.scrollTo({ top: viewportHeight * 2, behavior: 'instant' });
                    // Close dropdown
                    if (navDropdown) navDropdown.classList.remove('active');
                    break;

                case 'custom':
                    // Scroll to menu builder section
                    var menuBuilder = document.getElementById('menu-builder');
                    if (menuBuilder) {
                        var offsetTop = menuBuilder.offsetTop;
                        window.scrollTo({ top: offsetTop, behavior: 'instant' });
                    }
                    // Close dropdown
                    if (navDropdown) navDropdown.classList.remove('active');
                    break;

                case 'contact':
                    // Scroll to contact section
                    var contactSection = document.getElementById('contact');
                    if (contactSection) {
                        var offsetTop = contactSection.offsetTop;
                        window.scrollTo({ top: offsetTop, behavior: 'instant' });
                    }
                    break;

                case 'menu':
                    // Main menu link - handled by separate toggle handler
                    break;
            }
        });
    });
}

/* ========================================
   NAVBAR COLOR CHANGE
   ======================================== */

function initNavbarColorChange() {
    var navbar = document.querySelector('.main-nav');
    var menuBuilder = document.getElementById('menu-builder');

    if (!navbar || !menuBuilder) return;

    window.addEventListener('scroll', function() {
        var builderTop = menuBuilder.getBoundingClientRect().top;
        var navbarHeight = navbar.offsetHeight;

        // When navbar touches the builder section
        if (builderTop <= navbarHeight) {
            navbar.classList.add('nav-red');
        } else {
            navbar.classList.remove('nav-red');
        }
    });
}

/* ========================================
   SECTION FADE OVERLAY
   ======================================== */

function initSectionFadeOverlay() {
    var fadeOverlay = document.querySelector('.section-fade-overlay');
    var contactSection = document.getElementById('contact');

    if (!fadeOverlay || !contactSection) return;

    window.addEventListener('scroll', function() {
        var viewportHeight = window.innerHeight;
        var contactRect = contactSection.getBoundingClientRect();

        // Calculate how much of contact section is in viewport
        // Start fading when contact is 25% visible (75% of viewport height from top)
        var startPoint = viewportHeight * 0.75;

        // Contact section top relative to start point
        var progress = 0;

        if (contactRect.top < startPoint) {
            // Calculate progress from 25% visible to fully visible
            // When contactRect.top = startPoint, progress = 0
            // When contactRect.top = 0 (fully visible), progress = 1
            progress = (startPoint - contactRect.top) / startPoint;
            progress = Math.min(Math.max(progress, 0), 1);
        }

        // Fade from 0 to 0.75 (75% opacity)
        var opacity = progress * 0.75;
        fadeOverlay.style.opacity = opacity;
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */

function initMobileMenu() {
    var hamburgerBtn = document.querySelector('.hamburger-btn');
    var mobileOverlay = document.querySelector('.mobile-menu-overlay');
    var closeBtn = document.querySelector('.mobile-menu-close');
    var mobileDropdown = document.querySelector('.mobile-dropdown');
    var mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    var mobileNavLinks = document.querySelectorAll('.mobile-menu-links > a[data-nav]');
    var mobileDropdownLinks = document.querySelectorAll('.mobile-dropdown-content a');
    var viewportHeight = window.innerHeight;

    if (!hamburgerBtn || !mobileOverlay || !closeBtn) return;

    // Open menu
    hamburgerBtn.addEventListener('click', function() {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu with X button
    closeBtn.addEventListener('click', function() {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Reset dropdown state
        if (mobileDropdown) mobileDropdown.classList.remove('active');
    });

    // Toggle dropdown menu
    if (mobileDropdownToggle && mobileDropdown) {
        mobileDropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mobileDropdown.classList.toggle('active');
        });
    }

    // Close menu and navigate when clicking main links (HOME, CONTACT)
    mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var navType = link.getAttribute('data-nav');

            // Close menu
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (mobileDropdown) mobileDropdown.classList.remove('active');

            // Navigate
            if (navType === 'home') {
                window.scrollTo({ top: 0, behavior: 'instant' });
            } else if (navType === 'contact') {
                var contactSection = document.getElementById('contact');
                if (contactSection) {
                    window.scrollTo({ top: contactSection.offsetTop, behavior: 'instant' });
                }
            }
        });
    });

    // Close menu and navigate when clicking dropdown links
    mobileDropdownLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var navType = link.getAttribute('data-nav');

            // Close menu
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (mobileDropdown) mobileDropdown.classList.remove('active');

            // Check viewport mode
            var isTabletPortrait = window.innerWidth <= 990 && window.innerWidth >= 768 && window.innerHeight > 500;
            var isMobileLandscape = window.innerHeight <= 500;

            // Navigate
            switch(navType) {
                case 'burgers':
                    if (isMobileLandscape) {
                        // Mobile landscape - burgers hold position
                        var holdDistance = 100;
                        var sweepDistance = viewportHeight * 0.8;
                        var burgersInEnd = viewportHeight + sweepDistance;
                        var burgersHoldStart = burgersInEnd;
                        window.scrollTo({ top: burgersHoldStart, behavior: 'instant' });
                    } else {
                        // Desktop/tablet - same position
                        window.scrollTo({ top: viewportHeight * 2, behavior: 'instant' });
                    }
                    break;
                case 'sides':
                case 'drinks':
                    if (isMobileLandscape) {
                        // Mobile landscape - sides appear after burgers fully exit
                        var holdDistance = 100;
                        var sweepDistance = viewportHeight * 0.8;
                        var shiftUpDistance = viewportHeight * 0.8;
                        var burgersInEnd = viewportHeight + sweepDistance;
                        var burgersHoldEnd = burgersInEnd + holdDistance;
                        var burgersShiftEnd = burgersHoldEnd + shiftUpDistance;
                        var sidesInStart = burgersShiftEnd;
                        var sidesInEnd = sidesInStart + sweepDistance;
                        var sidesHoldStart = sidesInEnd + holdDistance;
                        window.scrollTo({ top: sidesHoldStart, behavior: 'instant' });
                    } else if (isTabletPortrait) {
                        // In tablet portrait, sides appear after burgers exit
                        var holdDistance = 100;
                        var sweepDistance = viewportHeight;
                        var burgersHoldEnd = (viewportHeight * 2) + holdDistance;
                        var sidesInStart = burgersHoldEnd + (sweepDistance * 0.25);
                        var sidesHoldStart = sidesInStart + sweepDistance;
                        window.scrollTo({ top: sidesHoldStart, behavior: 'instant' });
                    } else {
                        // Desktop/tablet landscape - sides visible at same position as burgers
                        window.scrollTo({ top: viewportHeight * 2, behavior: 'instant' });
                    }
                    break;
                case 'custom':
                    var menuBuilder = document.getElementById('menu-builder');
                    if (menuBuilder) {
                        window.scrollTo({ top: menuBuilder.offsetTop, behavior: 'instant' });
                    }
                    break;
            }
        });
    });
}
