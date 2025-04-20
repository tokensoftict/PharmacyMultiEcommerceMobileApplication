import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import RoutesTab from "@/shared/routes/wholesalestab";
import ImpersonateTab from "@/shared/routes/impersonater_wholesalestab";
import Typography from "@/shared/component/typography";
import {palette, semantic} from "@/shared/constants/colors.ts";
import Icon from "@/shared/component/icon";
import {normalize} from "@/shared/helpers";
import {Platform, StyleSheet} from "react-native";
import {FONT} from "@/shared/constants/fonts";
import React from "react";
import Environment from "@/shared/utils/Environment.tsx";


const Tab = createBottomTabNavigator();

export default  function WholesalesNavigation() {

    let tab = RoutesTab;
    if(Environment.checkForImpersonateCustomerData()) {
         tab = ImpersonateTab;
    }

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                tabBarLabelStyle: styles.tabBarLabel,
            })}
        >
            {tab.map(route => (
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
