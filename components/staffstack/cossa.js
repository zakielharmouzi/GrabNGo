import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../supabase/supabase';

const Cossa = ({ navigation }) => {
    const [proxyData, setProxyData] = useState([]);

    useFocusEffect(
        
        React.useCallback(() => {
            const get_menu = async () => {
                const { data, error } = await supabase.from('restaurants').select('*');

                if (error) {
                    console.log('Error fetching data:', error);
                    // Handle the error appropriately
                    return;
                }

                // Process the data
                if (data) {
                    setProxyData(data);
                }
            };

            get_menu();

            return () => {
                // Any cleanup would go here
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Proxy</Text>
            {proxyData.map((item) => (
                <View key={item.item_id}>
                    <Text>{item.item_category}</Text>
                    <Text>{item.item_description}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    image: {
        width: 300,
        height: 200,
        marginVertical: 20,
    },
});

export default Cossa;
