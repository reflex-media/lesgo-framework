export type Queue = {
    alias: string;
    name: string;
    url: string;
};
declare const _default: (queue: string | Queue) => string;
export default _default;
