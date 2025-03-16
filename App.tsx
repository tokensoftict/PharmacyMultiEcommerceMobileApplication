import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import RoutesStack, {RootStackParamList} from "@/shared/routes/stack";
import {store} from '@/redux/store/store';
import * as action from "@/redux/actions";
import {Provider} from 'react-redux';
import useDarkMode from "@/shared/hooks/useDarkMode";
import RoutesTab from '@/shared/routes/tab';
import {palette, semantic} from "@/shared/constants/colors";
import Icon from "@/shared/component/icon";
import {ActivityIndicator, Platform, StyleSheet, View} from "react-native";
import {normalize} from "@/shared/helpers";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {FONT} from "@/shared/constants/fonts";
import Typography from "@/shared/component/typography";
import {LoadingProvider} from "@/shared/utils/LoadingProvider";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import {usePushNotification} from "@/notification/usePushNotification.ts";




//import FullScreenReminder from "@/shared/page/medreminder2/reminder/FullScreenReminder.tsx";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigation() {
    const {isDarkMode} = useDarkMode();

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                tabBarLabelStyle: styles.tabBarLabel,
            })}
        >
            {RoutesTab.map(route => (
                <Tab.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={{
                        tabBarLabel: ({focused}) => (
                            <Typography
                                style={[
                                    styles.tabBarText,
                                    {color: focused ? palette.main.p500 : semantic.text.black}
                                ]}
                            >
                                {route.displayName}
                            </Typography>
                        ),
                        tabBarIcon: ({focused}) => (
                            <Icon
                                customStyles={{
                                    width: normalize(24),
                                    height: normalize(24),
                                    resizeMode: 'contain',
                                    tintColor: focused ? palette.main.p500 : semantic.text.black,
                                }}
                                icon={route.icon}
                            />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}



function App(): React.JSX.Element {
    const [page, setPage] = useState('login');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        usePushNotification().then((status) => {
        }).catch(() => {
        }).finally(() => {
            new AuthSessionService().autoLogin().then((value) => {
                if(value.loginStatus) {
                    setPage('storeSelector');
                }
                setLoading(false);
            })
        })
    }, []);

    if (loading) {
        return <View style={{flex : 1, justifyContent : "center"}}><ActivityIndicator size="large" color="red" /></View>;
    }

    // Navigation.registerComponent('FullScreenReminder', () => FullScreenReminder);


    return (
        <Provider store={store}>
            <NavigationContainer>
                <LoadingProvider>
                    <Stack.Navigator
                        // @ts-ignore
                        initialRouteName={page}
                        screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="tab" component={TabNavigation} />
                        {RoutesStack.map(route => (
                            <Stack.Screen
                                key={route.path}
                                name={route.path}
                                component={route.component}
                            />
                        ))}
                    </Stack.Navigator>
                </LoadingProvider>
            </NavigationContainer>
        </Provider>
    );
}

export default App;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: semantic.text.lightgrey,
        position: 'absolute',
        borderTopWidth: 0,
        elevation: normalize(5),
        ...Platform.select({
            ios: {
                height: normalize(80),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                paddingHorizontal: normalize(5),
                paddingBottom: normalize(30),
            },
            android: {
                height: normalize(70),
                paddingHorizontal: normalize(5),
                paddingBottom: normalize(15),
            }
        })
    },
    tabBarItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarLabel: {
        fontFamily: FONT.BOLD,
        fontSize: normalize(11),
        marginTop: normalize(-10),
    },
    tabBarText: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                fontWeight: '600',
                fontSize: normalize(12),
                bottom: normalize(-10),
            },
            android: {
                fontWeight: '800',
                fontSize: normalize(14),
                bottom: normalize(-5),
            }
        })
    }
});
