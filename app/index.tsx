import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to dashboard, NOT emergency
  return <Redirect href="/(tabs)" />;
}