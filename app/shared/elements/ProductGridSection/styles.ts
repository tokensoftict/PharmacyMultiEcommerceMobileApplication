import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
        color: 'red',
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    productCard: {
        width: '45%',
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#eee',
        borderWidth: 1,
    },
    price: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 5,
    },
});
