import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, Button, StyleSheet} from 'react-native';

const DebugExample = () => {
  const [data, setData] = useState([]);

  const [count, setCount] = useState(0);

  const url = 'https://jsonplaceholder.typicode.com/posts';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Interval active');
      setCount(prev => prev + 1);
    }, 1000);

    return () => {
      console.log('Clearing interval');
      clearInterval(interval);
    };
  }, [count]); // Start interval only once

  const renderItem = useCallback(({item}) => {
    return <Text style={styles.item}>{item.title}</Text>;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter: {count}</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        initialNumToRender={10}
      />
      <Button title="Log count" onPress={() => console.log(count)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 20, marginBottom: 10},
  loading: {fontSize: 18, textAlign: 'center', marginTop: 20},
  item: {fontSize: 16, marginBottom: 8},
});

export default React.memo(DebugExample);
