export const logger = {
    error(str: string) {
        throw Error(str);
    },
    warn(str: string) {
        console.warn(str);
    }
};