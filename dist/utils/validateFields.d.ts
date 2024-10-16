export type Params = Record<PropertyKey, any>;
export type Field = {
    key: string;
    type: string;
    required: boolean;
    isCollection?: boolean;
    enumValues?: string[];
};
/**
 * Validates the fields of an object based on the provided validation rules.
 *
 * @param params - The object containing the fields to be validated.
 * @param validFields - An array of field validation rules.
 * @returns An object containing the validated fields.
 * @throws {LesgoException} If a required field is missing or if a field has an invalid type.
 */
declare const validateFields: <T extends Params>(params: T, validFields: Field[]) => T;
export default validateFields;
