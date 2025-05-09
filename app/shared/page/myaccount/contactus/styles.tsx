
import {normalize} from '@/shared/helpers';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        elevation: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
        color: '#333',
    },
    map: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        marginVertical: 2,
        color: '#555',
        textAlign: 'left',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
    },
    actionButton: {
        padding: 14,
        borderRadius: 50,
        elevation: 3,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    closeButton: {
        backgroundColor: '#eee',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    closeText: {
        fontWeight: '600',
        color: '#444',
    },
});
