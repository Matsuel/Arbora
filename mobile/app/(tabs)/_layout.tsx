import React, { useEffect } from 'react';
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import Welcome from '../welcome';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';

export default function TabLayout() {

  const { user, isLoading } = useAuth();

  console.log("User in TabLayout:", user);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Supabase session:", session);
    };

    checkSession();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Welcome />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Synthèse</Label>
        <Icon sf="rectangle.3.group.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="market">
        <Label>Marché</Label>
        <Icon sf="chart.line.uptrend.xyaxis" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profil</Label>
        <Icon sf="gear" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
