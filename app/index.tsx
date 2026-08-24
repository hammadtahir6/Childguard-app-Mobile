import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to app, NOT emergency
  return <Redirect href="/(tabs)" />;
}
