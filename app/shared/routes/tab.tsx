import WholesalesHomePage from "../../applications/wholesales/home/wholesalesHome";
import {
    home as HomeIcon,
    myAccount,
    brand,
    listCart, more,categories,
} from '../../assets/icons';
import Cart from "../../shared/page/cart";
import Categories from "../../shared/page/categories";

export default [
    {
        id: '1',
        displayName: 'Home',
        name: 'homeTab',
        icon: HomeIcon,
        component: WholesalesHomePage,
    },
    {
        id: '3',
        displayName: 'Categories',
        name: 'categories',
        icon: categories,
        component: Categories,
    },

    {
        id: '2',
        displayName: 'My Cart',
        name: 'myCart',
        icon: listCart,
        component: Cart,
    },

    {
        id: '3',
        displayName: 'More',
        name: 'more',
        icon: more,
        component: WholesalesHomePage,
    },
    {
        id: '4',
        displayName: 'My Account',
        name: 'profile',
        icon: myAccount,
        component: WholesalesHomePage,
    },
];
