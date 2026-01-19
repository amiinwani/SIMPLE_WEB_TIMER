export const LOGO_EMOJIS = ['⏳', '🎯', '⚡', '🍅', '🧘', '🍵', '🌱', '🕰️', '🌔', '🎹'];

export const getRandomLogo = () => {
    return LOGO_EMOJIS[Math.floor(Math.random() * LOGO_EMOJIS.length)];
};
