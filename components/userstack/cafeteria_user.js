import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../supabase/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cafeteria from '../staffstack/cafeteria';

const Separator = () => (
  <View style={styles.separator}>
    <Text style={styles.orderedTitle}>Ordered Items</Text>
  </View>
);

const Cafeteria_user = ({ navigation }) => {
    const [menuData, setMenuData] = useState([]);
    const [order, setOrder] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const get_menu = async () => {
                const { data, error } = await supabase
                    .from('restaurants')
                    .select('*')
                    .filter('restaurant_id', 'eq', 'cafeteria');

                if (!error && data) {
                    setMenuData(data);
                }
            };

            get_menu();
        }, [])
    );

    const handleAddToOrder = (item) => {
        setOrder((currentOrder) => {
            const itemIndex = currentOrder.findIndex((orderItem) => orderItem.item_id === item.item_id);
            if (itemIndex > -1) {
                const updatedOrder = [...currentOrder];
                updatedOrder[itemIndex].quantity += 1;
                return updatedOrder;
            } else {
                return [...currentOrder, { ...item, quantity: 1 }];
            }
        });
    };

    const handleRemoveFromOrder = (item_id) => {
        setOrder((currentOrder) => {
            const updatedOrder = currentOrder.filter((orderItem) => orderItem.item_id !== item_id);
            return updatedOrder;
        });
    };

    const submitOrder = async () => {
    const user_id = await AsyncStorage.getItem('email');
    const total_price = order.reduce((acc, item) => acc + (item.quantity * item.item_price), 0);
    const orderData = {
        user_id: user_id,
        restaurant_id: 'cafeteria',
        total_price: total_price,
        status: 'pending'
    };

    try {
        const { error: orderError } = await supabase.from('order').insert([orderData]);
        if (orderError) {
            throw orderError;
        }

        // Fetch the latest order for the user to get the order_id
        const { data: latestOrder, error: latestOrderError } = await supabase
            .from('order')
            .select('order_id')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (latestOrderError) {
            throw latestOrderError;
        }

        await submitOrderItems(latestOrder.order_id);
    } catch (error) {
        console.error('Error submitting order:', error.message);
        // Handle the error appropriately here
    }
};

const submitOrderItems = async (order_id) => {
    // Map over the order to create an array of order items
    const orderItems = order.map((item) => ({
        order_id: order_id,
        item_id: item.item_id,
        item_category: item.item_category, // Add item category
        item_description: item.item_description, // Add item description
        quantity: item.quantity,
        // Assuming you have item_price in the item object
        // and you want to store the price per item in the order_item table
        item_price: item.item_price,
        restaurant_id: 'cafeteria'
    }));

    console.log(orderItems);
    try {
        // Insert order items into the 'order_item' table
        const { error: orderItemsError } = await supabase
            .from('order_item')
            .insert(orderItems);

        if (orderItemsError) {
            throw orderItemsError;
        }

        // Clear the order state and navigate home after a successful submission
        setOrder([]); // Clear the order state
        alert('Order submitted successfully!');
        navigation.navigate('Home');
    } catch (error) {
        console.error('Error submitting order items:', error.message);
        // Handle the error appropriately here
    }
};

    const renderItem = ({ item, index }) => {
        if (item === 'separator') {
            return <Separator />;
        }

        const isOrderedItem = index > menuData.length;
        const itemKey = isOrderedItem ? `ordered-${item.item_id}` : item.item_id.toString();

        return (
            <View style={styles.itemContainer} key={itemKey}>
                <Text style={styles.itemName}>{item.item_category}</Text>
                <Text>{item.item_description}</Text>
                {isOrderedItem && (
                    <View style={styles.orderedItemContainer}>
                        <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveFromOrder(item.item_id)}
                        >
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {!isOrderedItem && (
                    <TouchableOpacity onPress={() => handleAddToOrder(item)}>
                        <Text style={styles.addButton}>Add to Order</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>cafeteria Menu</Text>
            <FlatList
                data={[...menuData, 'separator', ...order]}
                renderItem={renderItem}
                keyExtractor={(item, index) => item === 'separator' ? 'separator' : `${index}-${item.item_id}`}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity onPress={submitOrder} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit Order</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 10,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    itemContainer: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    itemName: {
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        margin: 20,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addButton: {
        color: '#007bff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    orderedItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    quantityText: {
        fontWeight: 'bold',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        padding: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    separator: {
        paddingVertical: 10,
    },
    orderedTitle: {
        fontWeight: 'bold',
    },
});

export default Cafeteria_user;