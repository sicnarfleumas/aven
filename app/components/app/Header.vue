<script setup lang="ts">
const { data: items } = await useMenu('main-menu')
const appConfig = useAppConfig()
</script>

<template>
  <UHeader title="AVEN">
    <template #toggle="{ open, toggle }">
      <UButton
        color="neutral"
        variant="ghost"
        :aria-label="open ? $t('header.close') : $t('header.open')"
        :icon="open ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
        @click="toggle"
      />
    </template>

    <template #left>
      <AppLogo />
    </template>

    <UNavigationMenu
      :items="items ?? []"
    />

    <template #body>
      <UNavigationMenu
        :items="items ?? []"
        orientation="vertical"
      />
    </template>

    <template #right>
      <SearchModal />

      <AccountMenu />

      <AppLocaleSelect>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-languages"
          :aria-label="$t('localization.title')"
        />
      </AppLocaleSelect>

      <CartModal />
    </template>
  </UHeader>
</template>
