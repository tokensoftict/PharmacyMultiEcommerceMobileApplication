import WholesalesHomePage from "@/applications/wholesales/home/wholesalesHome";
import {
    home as HomeIcon,
    myAccount,
    listCart, more, categories, qrcode,
} from '@/assets/icons';
import Cart from "@/shared/page/cart";
import Categories from "@/shared/page/categories";
import MyAccount from "@/shared/page/myaccount";
import QrcodeScreen from "@/shared/page/qrcode";

export default [
    {
        id: '1',
        displayName: 'Home',
        name: 'homeTab',
        icon: HomeIcon,
        component: WholesalesHomePage,
    },
    {
        id: '2',
        displayName: 'Category',
        name: 'categories',
        icon: categories,
        component: Categories,
    },

    {
        id: '3',
        displayName: 'My Cart',
        name: 'myCart',
        icon: listCart,
        component: Cart,
    },

    {
        id: '4',
        displayName: 'QR Code',
        name: 'qrcode',
        icon: qrcode,
        component: QrcodeScreen,
    },
    {
        id: '5',
        displayName: 'Account',
        name: 'myAccount',
        icon: myAccount,
        component: MyAccount,
    },
];
