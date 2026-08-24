import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { isLoggedIn } = useAuthStore();
  
  // If logged in, go to dashboard. Otherwise, show onboarding.
  return <Redirect href={isLoggedIn ? "/(tabs)" : "/onboarding"} />;
}