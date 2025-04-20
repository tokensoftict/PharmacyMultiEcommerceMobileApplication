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
import EditProfile from "../../applications/supermarket/editProfile";
import Checkout from "../../shared/page/checkout";
import AddressList from "@/shared/page/myaccount/address/addressList/index";
import NewAddress from  "@/shared/page/myaccount/address/newAddress/index";
import PaymentMethodList from "@/shared/page/myaccount/paymentmethod";
import DeliveryMethodList from "@/shared/page/myaccount/deliverymethod";
import ChangePassword from "@/applications/auth/security";
import Wishlist from "@/shared/page/wishlist";
import Orders from "@/shared/page/orders";
import ShowOrder from "@/shared/page/orders/show";
import StoreSelectionScreen from "@/applications/auth/storeSelector";
import MainMenu from "@/shared/page/medreminder/main";
import SplashScreen from "@/shared/page/medreminder/splashscreen";
import MedReminderForm from "@/shared/page/medreminder/new-medreminder";
import ListMedReminder from "@/shared/page/medreminder/list-medreminder";
import HistoryLogs from "@/shared/page/medreminder/history-logs";
import RefillTracker from "@/shared/page/medreminder/refill-tracker";
import ViewReminder from "@/shared/page/medreminder/view-reminder";
import ViewLogs from "@/shared/page/medreminder/view-logs";
import WholesalesNavigation from "@/applications/wholesales/WholesalesNavigation.tsx";
import CreateWholesales from "@/applications/wholesales/create";
import StorePendingApproval from "applications/wholesales/storependingapprovalpage";
import {StoreProfile} from "@/applications/wholesales/storeprofile";
import SupermarketNavigation from "@/applications/supermarket/SupermarketNavigation";
import Categories from "@/shared/page/categories";
import Brands from "@/shared/page/brands";
import SalesRepresentativeNavigation from "@/applications/salesrepresentative/salesRepresentativeNavigation.tsx";

export type RootStackParamList = {
    wholesales:undefined,
    supermarket:undefined,
    sales_representative:undefined,
    login: undefined,
    createAccount: undefined,
    enterOTP: undefined,
    forgotPassword: undefined,
    resetPassword: undefined,
    security: undefined
    wholesalesHome : undefined,
    detailProduct:undefined,
    productList:undefined,
    editProfile:undefined,
    checkout:undefined,
    wishlist:undefined,

    addressList:undefined,
    newAddress:undefined,
    paymentMethodList:undefined,
    deliveryMethodList:undefined,
    orders:undefined,
    showOrder:undefined,
    storeSelector:undefined,


    splashScreen:undefined,
    mainMenu : undefined,


    medReminderForm : undefined,
    listMedReminder : undefined,
    historyLogs : undefined,
    refillTracker : undefined,
    viewLogs : undefined,
    viewReminder : undefined,
    createWholesalesStore : undefined,
    storePendingApproval:undefined,
    storeProfile:undefined,
    brands:undefined,
    categories:undefined,
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
        path: 'wholesales',
        component: WholesalesNavigation,
        private : false,
    },
    {
        path: 'createWholesalesStore',
        component: CreateWholesales,
        private : false,
    },
    {
        path: 'supermarket',
        component: SupermarketNavigation,
        private : false,
    },
    {
        path: 'sales_representative',
        component: SalesRepresentativeNavigation,
        private : false,
    },
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
        path: 'security',
        component: ChangePassword,
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
    },
    {
        path: 'editProfile',
        component: EditProfile,
        private: true,
    },
    {
        path: 'checkout',
        component: Checkout,
        private: true,
    },
    {
        path:'addressList',
        component: AddressList,
        private: true
    },
    {
        path:'newAddress',
        component: NewAddress,
        private: true
    },
    {
        path:'paymentMethodList',
        component: PaymentMethodList,
        private: true
    },
    {
        path:'deliveryMethodList',
        component: DeliveryMethodList,
        private: true
    },
    {
        path:'wishlist',
        component: Wishlist,
        private: true
    },
    {
        path:'orders',
        component: Orders,
        private: true
    },
    {
        path:'showOrder',
        component: ShowOrder,
        private: true
    },
    {
        path:'storeSelector',
        component: StoreSelectionScreen,
        private: true
    },
    {
        path:'medReminderForm',
        component: MedReminderForm,
        private: true
    },

    {
        path:'splashScreen',
        component: SplashScreen,
        private: true
    },
    {
        path:'mainMenu',
        component: MainMenu,
        private: true
    },
    {
        path:'listMedReminder',
        component: ListMedReminder,
        private: true
    },
    {
        path:'historyLogs',
        component: HistoryLogs,
        private: true
    },
    {
        path:'refillTracker',
        component: RefillTracker,
        private: true
    },
    {
        path:'viewReminder',
        component: ViewReminder,
        private: true
    },
    {
        path:'viewLogs',
        component: ViewLogs,
        private: true
    },
    {
        path:'storePendingApproval',
        component: StorePendingApproval,
        private: true
    },
    {
        path:'storeProfile',
        component: StoreProfile,
        private: true
    },
    {
        path:'brands',
        component: Brands,
        private: true
    },
    {
        path:'categories',
        component: Categories,
        private: true
    },
];


export default RoutesStack;
