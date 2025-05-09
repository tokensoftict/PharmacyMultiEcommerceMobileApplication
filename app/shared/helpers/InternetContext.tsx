// InternetProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Typography from "@/shared/component/typography";
import {normalize} from "@/shared/helpers/index.ts";

interface InternetContextType {
    isConnected: boolean;
}

const InternetContext = createContext<InternetContextType>({
    isConnected: true,
});

export const useInternet = () => useContext(InternetContext);

const NoInternetDialog = ({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) => {
    if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Typography style={styles.title}>Connection Issue</Typography>
                    <Typography style={styles.message}>
                        We're having trouble connecting. Please check your network and try again.
                    </Typography>
                    <TouchableOpacity onPress={onDismiss} style={styles.button}>
                        <Typography style={styles.buttonText}>Okay</Typography>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export const InternetProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(true);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const connected = !!state.isConnected;
            setIsConnected(connected);

            // Reset dialog dismissal when back online
            if (connected) {
                setDismissed(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <InternetContext.Provider value={{ isConnected }}>
            {children}
            <NoInternetDialog
                visible={!isConnected && !dismissed}
                onDismiss={() => setDismissed(true)}
            />
        </InternetContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: normalize(10),
        padding: normalize(20),
        elevation: normalize(5),
        alignItems: 'center',
    },
    title: {
        fontSize: normalize(18),
        fontWeight: '600',
        marginBottom: normalize(10),
        textAlign: 'center',
    },
    message: {
        fontSize: normalize(15),
        textAlign: 'center',
        marginBottom: normalize(20),
    },
    button: {
        backgroundColor: '#d9534f',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(25),
        borderRadius: normalize(5),
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
