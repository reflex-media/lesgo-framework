interface Params {
    [key: string]: any;
}
interface Field {
    key: string;
    type: string;
    required: boolean;
    isCollection?: boolean;
    enumValues?: string[];
}
declare const validateFields: (params: Params, validFields: Field[]) => {
    [key: string]: any;
};
export default validateFields;
