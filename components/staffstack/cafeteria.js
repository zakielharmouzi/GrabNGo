import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabase/supabase';
import { useFocusEffect } from '@react-navigation/native';



const Cafeteria = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
   
    useFocusEffect(
        React.useCallback(() => {
            const fetchOrders = async () => {
                const username = await AsyncStorage.getItem('email');
                getOrders();
            };
            fetchOrders();
        }, [])
    );

    const getOrders = async () => {
        const { data, error } = await supabase
            .from('order')
            .select('*')
            .eq('restaurant_id', 'cafeteria')
            .filter('status', 'eq', 'pending');
        if (error) {
            alert(error.message);
            return;
        }

        const ordersWithItems = await Promise.all(data.map(async (order) => {
            const { data: orderItems, error: orderItemsError } = await supabase
                .from('order_item')
                .select('*')
                .eq('order_id', order.order_id);

            if (orderItemsError) {
                console.error(orderItemsError.message);
                return order;
            }
            return { ...order, items: orderItems };
        }));

        setOrders(ordersWithItems);
    };

    const updateOrderStatus = async (orderId) => {
        const { error } = await supabase
            .from('order')
            .update({ status: 'ready' })
            .eq('order_id', orderId);

        if (error) {
            alert(error.message);
        } else {
            alert(`Order ${orderId} is now ready!`);
            getOrders(); // Refresh the orders list
        }
    };

    const renderOrder = ({ item }) => (
        <View style={styles.orderContainer}>
            <Text style={styles.orderTitle}>Order ID: {item.order_id}</Text>
            <Text style={styles.orderTitle}>Order Status: {item.user_id}</Text>
            <FlatList
                data={item.items}
                renderItem={renderOrderItem}
                keyExtractor={(orderItem) => `item-${item.order_id}-${orderItem.id}`}
            />
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => updateOrderStatus(item.order_id)}
            >
                <Text style={styles.buttonText}>Mark as Ready</Text>
            </TouchableOpacity>
        </View>
    );

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItemContainer}>
            <Text>{item.item_description}</Text>
            <Text>Quantity: {item.quantity}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Orders</Text>
            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item) => `order-${item.order_id}`}
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
    button: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    // Add any additional styles you need here
});

export default Cafeteria;
