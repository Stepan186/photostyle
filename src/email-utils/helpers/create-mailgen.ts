import Mailgen from 'mailgen';

export const createMailgen = (theme: string = 'default') => {
    const appName = process.env.APP_NAME || 'Woci.ru';

    return new Mailgen({
        theme,
        product: {
            name: appName,
            link: process.env.FRONTEND_URL || 'https://woci.ru/',
            copyright: `© ${new Date().getFullYear()} ${appName}.`,
        },
    });
};