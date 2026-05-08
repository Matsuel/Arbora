import React from 'react';
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import Welcome from '../welcome';

export default function TabLayout() {

  const user = undefined;

  if (!user) {
    return <Welcome />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      {/* <NativeTabs.Trigger name="settings">
        <Icon sf="gear" drawable="custom_settings_drawable" />
        <Label>Settings</Label>
      </NativeTabs.Trigger> */}
    </NativeTabs>
  );
}
