// ==UserScript==
// @name         CS Dark Mobile - Image fixes
// @namespace    http://tampermonkey.net/
// @version      20260601.01
// @description  fixing images across cs to fit theme
// @author       june "layercake" "fleuraward" claw
// @match        https://www.chickensmoothie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/580433/CS%20Silver-studded%20Blue%20-%20Image%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/580433/CS%20Silver-studded%20Blue%20-%20Image%20fixes.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // images for the adopt section
const adoptandstoreimgs = {
    'dogs': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/dogs.png?v=2?v=2',
    'horses':'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/horses.png?v=2?v=2',
    'cats':'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/cats.png?v=2?v=2',
    'butterfly wolves':'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/butterflywolves.png?v=2?v=2',
    'rodents':'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/rodents.png?v=2?v=2',
    'second-generation pets':'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/2ndgens.png?v=2?v=2',
    'hatchery':'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/hatchery.png?v=2?v=2',
    'other':'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/other.png?v=2?v=2',
    'special event':'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/species/specialevent.png?v=2?v=2',

    'category.php?id=8': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/store/accessories.png?v=3',
    'category.php?id=11': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/store/wigs.png?v=3',
    'category.php?id=2': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/store/costumes.png?v=3',
    'category.php?id=3': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/store/casual.png?v=3',
    'category.php?id=5': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/store/objects.png?v=3',
    'category.php?id=1': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/store/extra.png?v=3',
    'category.php?id=7': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/store/pets.png?v=3',
    'category.php?id=9': 'https://www.chickensmoothie.com/Forum/styles/CSDark/theme/images/store/specials.png?v=3'
};

    // images for the forum pages
    const forumnimgs = {
        'forum_unread_subforum.gif': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/forum_unread_subforum.png',
        'forum_unread.gif': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/forum_unread.png'
    };

    // replace forum background images
    function processBackground(el) {
        try {
            const bg = getComputedStyle(el).backgroundImage;

            for (const key in forumnimgs) {
                if (bg.includes(key)) {
                    el.style.backgroundImage = `url("${forumnimgs[key]}")`;
                }
            }
        } catch (e) {}
    }

    function processImage(img) {
        if (!img?.src) return;

// for head
    if (img.src === 'https://www.chickensmoothie.com/Forum/styles/CSMobile/theme/images/head.png') {
        img.src = 'https://raw.githubusercontent.com/fleuraward/CS-Mobile-Dark/refs/heads/main/assets/head.png';
        return;
    }

    // for nav
    if (img.src === 'https://www.chickensmoothie.com/Forum/styles/CSMobile/theme/images/nav.png?1') {
        img.src = 'https://raw.githubusercontent.com/fleuraward/CS-Mobile-Dark/refs/heads/main/assets/nav.png';
        return;
    }

        // fix pet img bgs to fit theme
        try {
            const imgUrl = new URL(img.src);

            const petsandarchive = {
                'd1ff78': '2c2c2c', // pet images across site
                '90dc35': '3c3c3c', // archive images
                'c6e194': 'ffb5e3' // pets in trades
            };

            const currentBg = imgUrl.searchParams.get('bg');

            if (petsandarchive[currentBg]) {
                imgUrl.searchParams.set('bg', petsandarchive[currentBg]);
                img.src = imgUrl.toString();
            }
        } catch (e) {}

        // fix the adopt images
        const link = img.closest('li.iewibl a');

        if (link) {
            try {
                const href = link.getAttribute('href');

                if (adoptandstoreimgs[href]) {
                    img.src = adoptandstoreimgs[href];
                }

            } catch (e) {}
        }
    }

    document.querySelectorAll('dl').forEach(processBackground);
    document.querySelectorAll('img').forEach(processImage);

    // observer to process the images for all
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return;

                if (node.tagName === 'DL') {
                    processBackground(node);
                }

                node.querySelectorAll?.('dl').forEach(processBackground);

                if (node.tagName === 'IMG') {
                    processImage(node);
                }

                node.querySelectorAll?.('img').forEach(processImage);
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();