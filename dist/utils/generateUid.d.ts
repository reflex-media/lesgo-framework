interface GenerateUidParams {
    prefix?: string;
    suffix?: string;
    length?: number;
}
declare const generateUid: (params?: GenerateUidParams) => string;
export default generateUid;
