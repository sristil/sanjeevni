import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import DoctorsScreen from './screens/DoctorsScreen';
import RecordsScreen from './screens/RecordsScreen';
import RemindersScreen from './screens/RemindersScreen';
import ChatbotScreen from './screens/ChatbotScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Doctors') {
              iconName = focused ? 'medical' : 'medical-outline';
            } else if (route.name === 'Records') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Reminders') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Sanjeevni' }}
        />
        <Tab.Screen name="Doctors" component={DoctorsScreen} />
        <Tab.Screen name="Records" component={RecordsScreen} />
        <Tab.Screen name="Reminders" component={RemindersScreen} />
        <Tab.Screen name="Chat" component={ChatbotScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}