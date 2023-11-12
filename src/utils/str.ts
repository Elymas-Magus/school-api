export class Str {
    static random(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const val = [...Array(length)].reduce((accum, i) => {
            return accum + chars.charAt(Math.floor(Math.random() * chars.length));
        }, '');
        return val;
    }

    static replaceArray(needle: string, list: string[], val: string): string {
        list.forEach(item => {
            val.replace(needle, item);
        })
        return val;
    }

    static reverse(val: string): string {
        return [...val].reverse().join('');
    }
}