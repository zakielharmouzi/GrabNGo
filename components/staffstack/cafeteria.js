import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabase/supabase';
import { useFocusEffect } from '@react-navigation/native';

const Cafeteria = ({ navigation }) => {
    const [orders, setOrders] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchOrders = async () => {
                getOrders();
            };

            fetchOrders();
        }, [])
    );

    const getOrders = async (username) => {
        const { data, error } = await supabase
            .from('order')
            .select('*')
            .eq('restaurant_id','cafeteria')

        if (error) {
            alert(error.message);
            return;
        }

        // Fetch order items for each order
        const ordersWithItems = await Promise.all(data.map(async (order) => {
            const { data: orderItems, error: orderItemsError } = await supabase
                .from('order_item')
                .select('*')
                .eq('order_id', order.order_id);

            if (orderItemsError) {
                console.error(orderItemsError.message);
                return order; // Return the order without items if there's an error
            }

            return { ...order, items: orderItems };
        }));

        setOrders(ordersWithItems);
    };

    const renderOrder = ({ item }) => {
    // Check if the order_id exists
    const orderId = item.order_id?.toString() ?? 'unknown-order-id';
    const orderStatus = item.status?.toString() ?? 'unknown-order-status'
    return (
        <View style={styles.orderContainer}>
            <Text style={styles.orderTitle}>Order ID: {orderId}</Text>
            <Text style={styles.orderTitle}>Order Status: {orderStatus}</Text>
            <FlatList
                data={item.items}
                renderItem={renderOrderItem}
                keyExtractor={(orderItem) => orderItem.id?.toString() ?? 'unknown-item-id'}
            />
        </View>
    );
};

   const renderOrderItem = ({ item }) => {
    // Check if the item has an id
    const itemId = item.id?.toString() ?? 'unknown-item-id';
    return (
        <View style={styles.orderItemContainer} key={itemId}>
            <Text>{item.item_description}</Text>
            <Text>Quantity: {item.quantity}</Text>
        </View>
    );
};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Orders</Text>
            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.order_id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    orderContainer: {
        padding: 10,
        marginVertical: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderItemContainer: {
        padding: 10,
        borderColor: 'gray',
        borderBottomWidth: 1,
    },
    // Add any additional styles you need here
});

export default Cafeteria;
