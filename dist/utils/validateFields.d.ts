export type Params = {
    [key: string]: any;
};
export type Field = {
    key: string;
    type: string;
    required: boolean;
    isCollection?: boolean;
    enumValues?: string[];
};
declare const validateFields: (params: Params, validFields: Field[]) => {
    [key: string]: any;
};
export default validateFields;
