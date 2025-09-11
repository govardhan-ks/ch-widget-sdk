<template>
  <div v-if="platform.context && platform.theme" :style="containerStyle">
    <div :style="cardStyle">
      <div :style="headerStyle">
        <img
          :src="platform.context.user?.avatarUrl"
          :alt="platform.context.user?.name"
          :style="avatarStyle"
        />
        <div>
          <div style="font-weight: 600">{{ platform.context.user?.name }}</div>
          <div :style="mutedStyle">{{ platform.context.user?.email }}</div>
        </div>
        <div style="margin-left: auto">
          <span :style="badgeStyle">{{ platform.context.user?.role }}</span>
        </div>
      </div>

      <div :style="{ marginTop: platform.theme.spacingLg }">
        <div :style="{ fontSize: '14px', color: platform.theme.colorMuted }">
          Organization
        </div>
        <div
          :style="{
            display: 'flex',
            gap: platform.theme.spacingMd,
            alignItems: 'center',
            marginTop: platform.theme.spacingSm,
          }"
        >
          <div style="font-weight: 600">{{ platform.context.org?.name }}</div>
          <span :style="badgeStyle">{{ platform.context.org?.plan }}</span>
        </div>
      </div>

      <div
        :style="{
          marginTop: platform.theme.spacingLg,
          display: 'flex',
          gap: platform.theme.spacingMd,
        }"
      >
        <button :style="buttonStyle" @click="makeApiCall">Make API Call</button>
        <a
          href="#"
          :style="{
            alignSelf: 'center',
            color: platform.theme.colorMuted,
            textDecoration: 'underline',
          }"
          >Learn more</a
        >
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePlatform } from 'widget-sdk-vue';

const platform: any = usePlatform();

const containerStyle = computed(() => ({
  fontFamily: platform.theme?.fontFamily || 'sans-serif',
  padding: platform.theme?.spacingLg || '16px',
  color: platform.theme?.colorText,
}));
const cardStyle = computed(() => ({
  background: platform.theme?.colorSurface,
  borderRadius: platform.theme?.borderRadius,
  border: '1px solid #e5e7eb',
  padding: platform.theme?.spacingLg,
}));
const headerStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: platform.theme?.spacingMd,
}));
const avatarStyle = computed(() => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
}));
const mutedStyle = computed(() => ({ color: platform.theme?.colorMuted }));
const badgeStyle = computed(() => ({
  display: 'inline-block',
  background: platform.theme?.colorPrimary,
  color: platform.theme?.colorPrimaryText,
  borderRadius: '9999px',
  padding: '2px 8px',
  fontSize: '12px',
}));
const buttonStyle = computed(() => ({
  height: platform.theme?.button?.height || '36px',
  padding: `0 ${platform.theme?.button?.paddingInline || '12px'}`,
  background: platform.theme?.colorPrimary,
  color: platform.theme?.colorPrimaryText,
  border: 'none',
  borderRadius: platform.theme?.borderRadius,
  cursor: 'pointer',
}));

const makeApiCall = async () => {
  try {
    const response = await platform.apiRequest({
      url: '/api/users',
      method: 'POST',
      data: { userId: '123' },
    });
  } catch (error) {}
};
</script>

<style>
button {
  padding: 8px 12px;
}
</style>
