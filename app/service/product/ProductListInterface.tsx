import {Float} from "react-native/Libraries/Types/CodegenTypes";

export interface ProductListInterface {
    id: number | undefined;
    name: string | undefined;
    price: string | undefined;
    price_not_formatted: number | undefined;
    special: string|undefined|boolean;
    special_not_formatted: string|boolean;
    image: string | undefined;
    max: number | undefined;
    box: number | undefined;
    quantity: number | undefined;
    sachet: boolean | undefined;
    carton: number | undefined;
    doorstep: Float | undefined,
    expiry_date: string | undefined;
}

export type ProductList = {
    id: number;
    name: string;
    price: string;
    price_not_formatted: number;
    special: string|undefined|boolean;
    special_not_formatted: string|undefined|boolean;
    image: string;
    max: number;
    box: number;
    quantity: number;
    sachet: boolean;
    carton: number;
    doorstep: Float,
    expiry_date: string;
}
