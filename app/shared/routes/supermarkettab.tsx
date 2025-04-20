import {
    home as HomeIcon,
    myAccount,
    listCart, categories, qrcode,
} from '@/assets/icons';
import Cart from "@/shared/page/cart";
import Categories from "@/shared/page/categories";
import MyAccount from "@/shared/page/myaccount";
import QrcodeScreen from "@/shared/page/qrcode";
import Login from "@/applications/auth/login";
import Environment from "@/shared/utils/Environment.tsx";
import {useNavigation} from "@react-navigation/native";
import SupermarketHome from "@/applications/supermarket/home/supermarketHome.tsx";

// @ts-ignore
const RequireLogin = ({ children, fallback }) => {
    const isLoggedIn = Environment.isLogin(); // You can replace this with a useAuth hook if needed
    return isLoggedIn ? children : fallback;
};

// @ts-ignore
const withAuth = (Component) => () => (
    <RequireLogin fallback={<Login navigation={useNavigation()} />}>
        <Component />
    </RequireLogin>
);


export default [
    {
        id: '1',
        displayName: 'Home',
        name: 'homeTab',
        icon: HomeIcon,
        component: SupermarketHome,
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
        component:withAuth(Cart),
    },

    {
        id: '4',
        displayName: 'QR Code',
        name: 'qrcode',
        icon: qrcode,
        component: withAuth(QrcodeScreen),
    },
    {
        id: '5',
        displayName: 'Account',
        name: 'myAccount',
        icon: myAccount,
        component: withAuth(MyAccount),
    },
];
