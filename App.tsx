import React, {useState} from 'react';
import {Button, View} from 'react-native';
import LargeDataApp from './screens/LargeDataApp';
import DebugExample from './screens/DebugExample';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'DebugExample':
        return <DebugExample />;
      case 'LargeDataApp':
        return <LargeDataApp />;
      default:
        return (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginBottom: 10}}>
              <Button
                title="Go to Debug Example"
                onPress={() => setCurrentScreen('DebugExample')}
              />
            </View>
            <View>
              <Button
                title="Go to Large Data Example"
                onPress={() => setCurrentScreen('LargeDataApp')}
              />
            </View>
          </View>
        );
    }
  };

  return <View style={{flex: 1}}>{renderScreen()}</View>;
};

export default App;
