import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, Button, StyleSheet, FlatList} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

const PAGE_SIZE = 10;

const LargeDataApp = () => {
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // const url = 'https://api.example.com/large-datase'; not work
  // const url = 'https://jsonplaceholder.typicode.com/comments'; fot test pagination

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/comments',
        );
        const json = await response.json();
        if (!isCancelled) setData(json);
        setVisibleData(json.slice(0, PAGE_SIZE));
        setHasMore(json.length > PAGE_SIZE);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextData = data.slice(0, nextPage * PAGE_SIZE);

    setVisibleData(nextData);
    setPage(nextPage);
    setHasMore(data.length > nextPage * PAGE_SIZE);
  };

  // const processData = () => {
  //   setIsProcessing(true);
  //   // Heavy computation performed on the main thread
  //   const sortedData = data.sort((a, b) => b.value - a.value);
  //   const aggregatedData = sortedData.slice(0, 10).map(item => ({
  //     label: item.name,
  //     value: item.value,
  //   }));
  //   setChartData(aggregatedData);
  //   setIsProcessing(false);
  // };

  const processData = async () => {
    setIsProcessing(true);

    const sortedData = [...data].sort((a, b) => b.value - a.value);

    const chunkSize = 1000;
    const aggregatedData = [];
    let currentIndex = 0;

    const processOfChunk = async () => {
      for (
        let i = currentIndex;
        i < Math.min(currentIndex + chunkSize, sortedData.length);
        i++
      ) {
        aggregatedData.push({
          label: sortedData[i].name,
          value: sortedData[i].value,
        });
      }

      currentIndex += chunkSize;

      if (currentIndex < sortedData.length) {
        setTimeout(processChunk, 0);
      } else {
        setChartData(aggregatedData.slice(0, 10));
        setIsProcessing(false);
      }
    };

    processOfChunk();
  };

  const chartDataMemoization = useMemo(() => {
    return {
      labels: chartData.map(item => item.label),
      datasets: [{data: chartData.map(item => item.value)}],
    };
  }, [chartData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Visualization</Text>
      <Button title="Process Data" onPress={processData} />
      {isProcessing && <Text>Processing...</Text>}
      <BarChart
        data={chartDataMemoization}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: 'gray',
          backgroundGradientTo: '#e8e8e8',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />
      <FlatList
        data={visibleData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <Text>{item.name}</Text>}
        initialNumToRender={PAGE_SIZE}
        ListFooterComponent={
          hasMore && (
            <Button
              title="Load More"
              onPress={loadMoreData}
              style={styles.loadMore}
            />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 24, marginBottom: 16},
  chart: {marginVertical: 16},
  loadMore: {marginVertical: 16},
});

export default React.memo(LargeDataApp);
