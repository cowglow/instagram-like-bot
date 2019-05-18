const puppeteer = require('puppeteer');

const baseURI = 'https://www.instagram.com/';
const loginURL = 'accounts/login/';
const hashTagURL = 'explore/tags/';

// puppeteer.launch({
//     headless: false
// }).then(async browser => {
//    const page = await browser.newPage();
//    await page.goto(baseURI);
//
// });
const instagramLikeBot = {
    browser: null,
    page: null,

    initialize: async () => {
        instagramLikeBot.browser = await puppeteer.launch({
            headless: false
        });

        instagramLikeBot.page = await instagramLikeBot.browser.newPage();
    },

    login: async (username, password) => {
        // Query selectors
        const usernameInputSelector = 'input[name="username"]';
        const passwordInputSelector = 'input[name="password"]';
        const submitButtonSelector = 'button[type="submit"]';

        // Go to login page
        await instagramLikeBot.page.goto(baseURI + loginURL, {waitUntil: 'networkidle2'});

        // Login form
        await instagramLikeBot.page.waitForSelector(usernameInputSelector);

        await instagramLikeBot.page.click(usernameInputSelector);
        await instagramLikeBot.page.keyboard.type(username, {delay: 50});

        await instagramLikeBot.page.click(passwordInputSelector);
        await instagramLikeBot.page.keyboard.type(password, {delay: 50});

        await instagramLikeBot.page.click(submitButtonSelector);

    },

    likeRecentFromHashTags: async (hashTags = [], maxLimit = 0) => {
        // Query selector
        const mostRecent = 'article > div:nth-child(3) img[decoding="auto"]';
        const postModal = 'article > div';
        const likeIcon = 'button > span[aria-label="Like"]';
        const closeButton = '//button[contains(text(), "Close")]';

        // Loop though hash tags
        for (let i = 0; i < hashTags.length; i++) {
            await instagramLikeBot.page.goto(baseURI + hashTagURL + hashTags[i], {waitUntil: 'networkidle2'});
            await instagramLikeBot.page.waitFor(3000);

            // Loop through post
            let posts = await instagramLikeBot.page.$$(mostRecent);

            if (posts.length > 0) {
                for (let ii = 0; ii < maxLimit; ii++) {
                    let post = posts[ii];

                    // Click on the post
                    await post.click();
                    await instagramLikeBot.page.waitFor(postModal);

                    // Click like button
                    let isLikeable = await post.$(likeIcon);
                    if (isLikeable) {
                        // console.log(isLikeable);
                        await post.parent.click(likeIcon);
                    }
                    await instagramLikeBot.page.waitFor(3000);

                    // Close the modal
                    let closeModalButton = await instagramLikeBot.page.$x(closeButton);
                    await closeModalButton[0].click();
                    await instagramLikeBot.page.waitFor(1000);
                }
            }
        }
    }
};

module.exports = instagramLikeBot;
