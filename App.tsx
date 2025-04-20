import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import RoutesStack, {RootStackParamList} from "@/shared/routes/stack";
import {store} from '@/redux/store/store';
import {Provider} from 'react-redux';
import {ActivityIndicator,View} from "react-native";
import {LoadingProvider} from "@/shared/utils/LoadingProvider";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import {bootUpApplication} from "@/notification/usePushNotification.ts";
const Stack = createStackNavigator<RootStackParamList>();


function App(): React.JSX.Element {
    const [page, setPage] = useState("");
    const [loading, setLoading] = useState(true);
    const authService = new AuthSessionService();
    useEffect(() => {
        const initNotification = async () => {
            setLoading(true);
            await bootUpApplication();
            const startUpPage = JSON.parse(authService.getLaunchPage());
            setPage(startUpPage['page']);
            setLoading(false);
            return true
        }
        initNotification().then((response)=> {

        });
    }, []);

    if (loading) {
        return <View style={{flex : 1, justifyContent : "center"}}><ActivityIndicator size="large" color="red" /></View>;
    }

    return (
        <Provider store={store}>
            <NavigationContainer>
                <LoadingProvider>
                    <Stack.Navigator
                        // @ts-ignore
                        initialRouteName={page}
                        screenOptions={{ headerShown: false }}>
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


