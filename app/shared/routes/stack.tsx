import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import Login from "../../applications/auth/login";
import CreateAccount from "../../applications/auth/createAccount";
import EnterOtp from "../../applications/auth/enterOtp";
import ForgotPassword from "../../applications/auth/forgotPassword";
import ResetPassword from "../../applications/auth/resetPassword";
import WholesalesHomePage from "../../applications/wholesales/home/wholesalesHome.tsx";
import DetailProduct from "../page/product";
import ProductList from "../../shared/page/productList";

export type RootStackParamList = {
    login: undefined,
    createAccount: undefined,
    enterOTP: undefined,
    forgotPassword: undefined,
    resetPassword: undefined,
    wholesalesHome : undefined,
    detailProduct:undefined,
    productList:undefined,
}

export type RouteItem = {
    path: keyof RootStackParamList;
    component: any
    private: boolean,
}

export type RouteProps<T extends keyof RootStackParamList> = RouteProp<
    RootStackParamList,
    T
>;

export type NavigationProps = StackNavigationProp<RootStackParamList>;

const RoutesStack: RouteItem[] = [
    {
        path: 'login',
        component: Login,
        private : false,
    },
    {
        path: 'createAccount',
        component: CreateAccount,
        private: false
    },
    {
        path: 'enterOTP',
        component: EnterOtp,
        private: false
    },
    {
        path: 'forgotPassword',
        component: ForgotPassword,
        private: false
    },
    {
        path: 'resetPassword',
        component: ResetPassword,
        private: false
    },
    {
        path: 'wholesalesHome',
        component: WholesalesHomePage,
        private: true
    },
    {
        path: 'detailProduct',
        component: DetailProduct,
        private: true,
    },
    {
        path: 'productList',
        component: ProductList,
        private: true,
    }
];


export default RoutesStack;
