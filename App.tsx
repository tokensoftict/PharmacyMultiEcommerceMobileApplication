import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import RoutesStack, {RootStackParamList} from "./app/shared/routes/stack";
import {store} from './app/redux/store/store';
import {Provider} from 'react-redux';
import Toast from "react-native-toast-message";
import useDarkMode from "./app/shared/hooks/useDarkMode";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import RoutesTab from './app/shared/routes/tab';
import {palette, semantic} from "./app/shared/constants/colors";
import Icon from "./app/shared/component/icon";
import {Image, TouchableOpacity, View} from "react-native";
import {normalize} from "./app/shared/helpers";
import {white_shopping_cart} from "./app/assets/icons";
import {BottomTabBarButtonProps, createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {FONT} from "./app/shared/constants/fonts.ts";
import Typography from "./app/shared/component/typography";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();


const CustomTabButton = ({children, onPress} : any) => {
   return ( <TouchableOpacity
       style={{
           top: normalize(-30),
           justifyContent : "center",
           alignItems : 'center'
       }}
       onPress={onPress}
   >
       <View style={{
           width : normalize(70),
           height : normalize(70),
           backgroundColor: palette.main.p500,
           borderRadius : normalize(35),
           shadowColor: '#171717',
           elevation : 50,
           shadowOffset: {width: 2, height: 2},
           shadowOpacity: 0.5,
           shadowRadius: 1,
       }}>
           {children}
       </View>
   </TouchableOpacity>)
};


function TabNavigation() {

    const {isDarkMode} = useDarkMode();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown : false,
                tabBarStyle : {
                    height: normalize(85),
                    paddingHorizontal: normalize(5),
                    paddingTop: 0,
                    backgroundColor: semantic.text.lightgrey,
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation : normalize(50),
                    shadowOffset: {width: 2, height: 2},
                    shadowOpacity: 0.5,
                    shadowRadius: 1,
                },
                tabBarLabelStyle : {
                    color : semantic.background.red.d100,
                    fontFamily: FONT.BOLD,
                    fontSize : normalize(11),
                    marginTop : normalize(-15)
                }
            })}
        >
            {RoutesTab.map(route => (

                route.name == "myCart" ?
                    <Tab.Screen
                        key={route.name}
                        name={route.name}
                        component={route.component}
                        options={{
                            tabBarLabel: "",
                            tabBarIcon : ({focused}) => {
                                return (
                                    <Image
                                        source={white_shopping_cart}
                                        resizeMode="contain"
                                        tintColor={semantic.background.white.w500}
                                        style={{
                                            width : normalize(30),
                                            height : normalize(30),
                                            tintColor : semantic.background.white.w500
                                        }}/>
                                );
                            },
                            tabBarButton : (props : BottomTabBarButtonProps) => {
                                return (
                                  <CustomTabButton {...props}/>
                                );
                            }
                        }}
                    />
                    :
                    <Tab.Screen
                        key={route.name}
                        name={route.name}
                        component={route.component}
                        options={{
                            tabBarLabel: ({focused, color}) => (
                                <Typography  style={{color: focused ? palette.main.p500 : semantic.text.black, fontWeight:'600',  marginTop : -15, fontSize: normalize(12)}}>{route.displayName}</Typography>
                            ),
                            tabBarIcon: ({focused, color}) => {
                                return (
                                    <Icon
                                        customStyles={{
                                            tintColor: focused
                                                ? palette.main.p500
                                                : semantic.text.black,
                                        }}
                                        icon={route.icon}
                                    />
                                );
                            }
                        }}
                    />
            ))}
        </Tab.Navigator>
    );
}

function App(): React.JSX.Element {
    return(
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={'login'}
                    screenOptions={{headerShown: false}}>
                    <Stack.Screen name="tab" component={TabNavigation} />
                    {RoutesStack.map(route => {
                        return (
                            <Stack.Screen
                                key={route.path}
                                name={route.path}
                                component={route.component}
                            />
                        );
                    })}
                </Stack.Navigator>
            </NavigationContainer>
            <Toast position='top'
                   bottomOffset={20}/>
        </Provider>
    );
}


export default App;
