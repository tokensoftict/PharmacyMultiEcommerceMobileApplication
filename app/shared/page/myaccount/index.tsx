import {
    drug,
    edit,
    eyeFilled,
    help, homeLike,
    location, logout,
    notification,
    order,
    security, switch_icon, truckInTracking,
    user,
    walletFilled,
} from '@/assets/icons';
import {CommonActions, useNavigation, useRoute} from "@react-navigation/native";
import {NavigationProps} from "@/shared/routes/stack.tsx";
import React, {useState} from "react";
import Wrapper from "@/shared/component/wrapper";
import {View, Image, TouchableOpacity, Alert} from "react-native";
import {styles} from './styles';
import Icon from "@/shared/component/icon";
import Typography from "@/shared/component/typography";
import {normalize} from "@/shared/helpers";
import AuthSessionService from "@/service/auth/AuthSessionService";
import Section from "@/shared/component/section";
import Environment from "@/shared/utils/Environment.tsx";
import LoginService from "@/service/auth/LoginService.tsx";
import {useLoading} from "@/shared/utils/LoadingProvider.tsx";

export default function MyAccount() {
    const {navigate} = useNavigation<NavigationProps>();
    const userProfile = (new AuthSessionService()).getAuthSession();
    const { showLoading, hideLoading } = useLoading();


    function getAccountMenu(section: string) {
        const menuItems = {
            general : [
                {
                    name: 'My Orders',
                    leftIcon: <Icon icon={order} />,
                    onPress: () => navigate('orders'),
                },
                /*
                {
                    name: 'Voucher',
                    leftIcon: <Icon icon={vocher} />,
                    onPress: () => navigate('vouchers'),
                },
                */
                {
                    name: 'Wishlist',
                    leftIcon: <Icon icon={homeLike} />,
                    onPress: () => navigate('wishlist'),
                },
                {
                    name: 'Med Reminder',
                    leftIcon: <Icon icon={drug} />,
                    onPress: () => navigate('splashScreen'),
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
            applicationSettings : [
                {
                    name: 'Notifications',
                    leftIcon: <Icon icon={notification} />,
                    onPress: () => navigate('security'),
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
                                    new AuthSessionService().setEnvironment("")
                                    CommonActions.reset({
                                        index: 0, // Set the index of the active screen
                                        routes: [{ name: 'storeSelector' }], // Replace with your target screen
                                    })
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
                                            CommonActions.reset({
                                                index: 0, // Set the index of the active screen
                                                routes: [{ name: 'login' }], // Replace with your target screen
                                            })
                                            hideLoading();
                                            navigate('login')
                                        }
                                    })
                                }},
                        ]);
                    }
                },
            ],
            support : [
                {
                    name: 'Help Center',
                    leftIcon: <Icon icon={help} />,
                    onPress: () => navigate('security'),
                },
                {
                    name: 'Contact Us',
                    leftIcon: <Icon icon={security} />,
                    onPress: () => navigate('security'),
                },
            ]
        }

        if(Environment.isWholeSalesEnvironment()) {
            menuItems.general.splice(2, 1)
        }
        // @ts-ignore
        return menuItems[section]
    }


    return (
        <Wrapper>
            <View style={styles.container}>
                <View style={styles.profileText}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon icon={user} />
                        <Typography
                            style={{
                                fontWeight: '700',
                                fontSize: 24,
                                marginLeft: normalize(10),
                            }}>
                            My Account
                        </Typography>
                    </View>
                </View>
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
                                { userProfile?.data?.firstname}
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
                <Section title="General" elements={getAccountMenu("general")}/>
                <Section title="Account Settings" elements={getAccountMenu("accountSettings")} />
                <Section title="Application Settings" elements={getAccountMenu("applicationSettings")} />
                <Section title="Support" elements={getAccountMenu("support")} />
            </View>
        </Wrapper>
    );
}
