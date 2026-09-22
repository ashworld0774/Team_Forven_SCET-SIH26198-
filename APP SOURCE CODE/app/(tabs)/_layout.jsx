import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { display: 'none' }, // Footer completely hidden
    }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="chatbot" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="about" />
    </Tabs>
  );
}