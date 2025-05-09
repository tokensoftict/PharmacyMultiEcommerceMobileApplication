import {
    add_circle,
    brand,
    categories,
    drug,
    edit,
    homeLike,
    location, logout,
    notification,
    order, qrcode,
    security, store, storeprofile, switch_icon, truckInTracking,
    user,
    walletFilled,
} from '@/assets/icons';
import {CommonActions, useNavigation, useRoute} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import React, {useState} from "react";
import {View, Image, TouchableOpacity, Alert, ScrollView} from "react-native";
import {styles} from './styles';
import Icon from "@/shared/component/icon";
import Typography from "@/shared/component/typography";
import {normalize} from "@/shared/helpers";
import AuthSessionService from "@/service/auth/AuthSessionService";
import Section from "@/shared/component/section";
import Environment from "@/shared/utils/Environment.tsx";
import LoginService from "@/service/auth/LoginService.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";
import Toastss from "@/shared/utils/Toast.tsx";
import {semantic} from "@/shared/constants/colors.ts";
import StoreDialog from "@/shared/page/myaccount/contactus";
import WrapperNoScroll from "@/shared/component/wrapperNoScroll";
import HeaderWithIcon from "@/shared/component/headerBack";
import {IconButton} from "react-native-paper";

export default function MyAccount() {
    const {navigate} = useNavigation<NavigationProps>();
    const userProfile = (new AuthSessionService()).getAuthSession();
    const { showLoading, hideLoading } = useLoading();
    const [showContactUs, setShowContactUs] = useState<boolean>(false);


    function getAccountMenu(section: string) {
        const menuItems = {
            general : [
                {
                    name: 'My Orders',
                    leftIcon: <Icon icon={order} />,
                    onPress: () => navigate('orders'),
                },
                {
                    name: 'Wishlist',
                    leftIcon: <Icon icon={homeLike} />,
                    onPress: () => navigate('wishlist'),
                },
                {
                    name: 'My QR Code',
                    leftIcon: <Icon icon={qrcode} />,
                    onPress: () => navigate('qrcode'),
                },
            ],
            accountSettings : [
                {
                    name: 'Address',
                    leftIcon: <Icon icon={location} />,
                    onPress: () => navigate('addressList'),
                },
                {
                    name: 'Payment Methods',
                    leftIcon: <Icon icon={walletFilled} />,
                    onPress: () => navigate('paymentMethodList'),
                },
                {
                    name: 'Delivery Methods',
                    leftIcon: <Icon icon={truckInTracking} />,
                    onPress: () => navigate('deliveryMethodList'),
                },
                /*
                {
                    name: 'Dark Mode',
                    leftIcon: <Icon icon={eyeFilled} />,
                    rightElement: (
                        <Toggle
                            isEnabled={toggleDarkMode || isDarkMode}
                            setIsEnabled={(newValue) => {
                                setToggleDarkMode(newValue)
                                changeColorScheme().catch()
                            }}
                        />
                    ),
                },
                */
            ] ,
            mystore:[
                {
                    name: 'Create Your Store',
                    leftIcon: <Icon icon={store} />,
                    onPress: () => navigate('createWholesalesStore'),
                },
                {
                    name: 'My Store Profile',
                    leftIcon: <Icon icon={storeprofile} />,
                    onPress: () => navigate('storeProfile'),
                },
            ],
            applicationSettings : [
                {
                    name: 'Notifications',
                    leftIcon: <Icon icon={notification} />,
                    onPress: () => navigate('notifications'),
                },
                {
                    name: 'Security',
                    leftIcon: <Icon icon={security} />,
                    onPress: () => navigate('security'),
                },
                {
                    name: 'Switch Store',
                    leftIcon: <Icon icon={switch_icon} />,
                    onPress: () =>{
                        Alert.alert('PS GDC', 'Are you sure you want to Switch Store?', [
                            {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel',
                            },
                            {text: 'Yes', onPress: () => {
                                    CommonActions.reset({
                                        index: 0, // Set the index of the active screen
                                        routes: [{ name: 'storeSelector' }], // Replace with your target screen
                                    })
                                    new AuthSessionService().removeImpersonateCustomerData();
                                    new AuthSessionService().setEnvironment("")
                                    navigate('storeSelector')
                                }}
                        ])
                    },
                },
                {
                    name: 'Log out',
                    leftIcon: <Icon icon={logout} />,
                    onPress: () =>  {
                        Alert.alert('PS GDC', 'Are you sure you want to log out?', [
                            {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel',
                            },
                            {text: 'Yes', onPress: () => {
                                    showLoading("Logging out... Please wait...");
                                    new LoginService().logout().then(function (result) {
                                        if (result) {
                                            hideLoading();
                                            CommonActions.reset({
                                                index: 0, // Set the index of the active screen
                                                routes: [{ name: 'login' }], // Replace with your target screen
                                            })
                                            navigate('login')
                                        } else {
                                            hideLoading();
                                            Toastss("There was an error login out, please restart the application.")
                                        }
                                    })
                                }},
                        ]);
                    }
                },
            ],
            support : [
                /*
                {
                    name: 'Help Center',
                    leftIcon: <Icon icon={help} />,
                    onPress: () => navigate('security'),
                },

                 */
                {
                    name: 'Contact Us',
                    leftIcon: <Icon icon={security} />,
                    onPress: () => openContactUsModal(true),
                },
            ]
        }

        if(Environment?.isWholeSalesEnvironment()) {
            menuItems.general.splice(2, 1)
            menuItems.general.push({
                name: 'Categories',
                leftIcon: <Icon icon={categories} tintColor={semantic.text.grey} />,
                onPress: () => navigate('categories'),
            })
        }

        if(userProfile?.data?.apps?.length === 1){
            menuItems.applicationSettings.splice(2, 1)
        }

        if(userProfile?.data?.apps?.length > 1){
            menuItems.mystore.splice(0, 1)

            if(userProfile?.data?.apps[1].info.status === false){
                menuItems.mystore[0] = {
                    name: 'My Store Profile',
                    leftIcon: <Icon icon={storeprofile} />,
                    onPress: () => navigate('storePendingApproval'),
                }
            } else {
               if(Environment.isSuperMarketEnvironment()) {
                   menuItems.mystore.splice(0, 1);
                   menuItems.general.push({
                       name: 'Brands',
                       leftIcon: <Icon icon={brand} tintColor={semantic.text.grey} />,
                       onPress: () => navigate('brands'),
                   })
               }
            }
        } else {
            menuItems.mystore.splice(1, 1)
        }

        if(Environment?.isSalesRepresentativeEnvironment()) {
            menuItems.general = [];
            menuItems.accountSettings = [];
            menuItems.mystore = [];
        }

        // @ts-ignore
        return menuItems[section]
    }

    const openContactUsModal = (status : boolean) => {
        setShowContactUs(status)
    }

    return (
        <WrapperNoScroll>
            <HeaderWithIcon icon={user}  title={"MY ACCOUNT"}
                            rightComponent={ <IconButton style={{alignItems : 'flex-end', opacity : 0}}  size={normalize(35)}  iconColor={'#FFF'} icon={add_circle}  />}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.profileInfo}>
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <Image
                            style={styles.image}
                            source={{uri: userProfile?.data?.image}}
                        />
                        <View style={{flexDirection: 'column', justifyContent: 'space-evenly'}}>
                            <Typography style={{fontWeight: '700', fontSize: 16}}>
                                { userProfile?.data?.firstname + " "+userProfile?.data?.lastname}
                            </Typography>
                            <Typography style={{fontWeight: '500', fontSize: 14}}>
                                { userProfile?.data?.phone}
                            </Typography>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Icon icon={edit} onPress={() => navigate('editProfile')}/>
                    </TouchableOpacity>
                </View>

                {
                    getAccountMenu('general').length > 0 ?
                        <Section title="General" elements={getAccountMenu("general")}/>
                        : <></>
                }

                {
                    getAccountMenu("accountSettings").length > 0 ?
                    <Section title="Account Settings" elements={getAccountMenu("accountSettings")} />
                        : <></>
                }

                {
                    getAccountMenu("mystore").length > 0 ?  <Section title="My Store" elements={getAccountMenu("mystore")} /> : <></>
                }
                <Section title="Application Settings" elements={getAccountMenu("applicationSettings")} />
                <Section title="Support" elements={getAccountMenu("support")} />
            </View>
            <StoreDialog visible={showContactUs} onClose={() => openContactUsModal(false)} />
            </ScrollView>
            <View style={{height : normalize(90), backgroundColor : 'rgba(0, 0, 0, 0)'}}></View>
        </WrapperNoScroll>
    );
}
