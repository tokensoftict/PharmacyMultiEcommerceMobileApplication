export interface CartInterface {
    status: boolean;
    data: Data;
}

export interface Items {
    id: number;
    name: string;
    description: any;
    price: string;
    price_not_formatted: number;
    total: string;
    total_not_formatted: number;
    cart_quantity: string;
    quantity: string;
    added_date: string;
    productcategory: string;
    manufacturer: string;
    classification: string;
    productgroup_id: any;
    image: string;
    max: number;
    box: number;
    sachet: boolean;
    carton: number;
    special: string;
    special_not_formatted: number;
    doorstep: string;
    expiry_date: any;
}

export interface Meta {
    noItems: number;
    totalItemsInCarts_formatted : string
    totalItemsInCarts: string;
    doorStepDelivery : doorStepDelivery
}

export interface doorStepDelivery {
    status : boolean,
    name : string,
    amount : string,
    deliveryDate : string,
    amount_formatted : string
}

export interface Data {
    items: Items[];
    meta: Meta;
}
