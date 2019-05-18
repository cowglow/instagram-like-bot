const instagramLikeBot = require('./src/application/InstagramLikeBot');
const env = require('dotenv').config({path: 'config.env'}).parsed;

const hashTags = [
    'jungle',
    'drumandbass',
    'dnb'
];

(async () => {

    await instagramLikeBot.initialize();

    await instagramLikeBot.login(env.username, env.password);

    await instagramLikeBot.likeRecentFromHashTags(hashTags, 5);
})();