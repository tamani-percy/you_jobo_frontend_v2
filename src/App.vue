<template>
  <UApp>
    <div class="bg-default" data-vaul-drawer-wrapper>
      <TheHeader>
        <template #content>
          <RouterView/>
        </template>
      </TheHeader>
    </div>


  </UApp>
</template>

<script setup lang="ts">
import {useEventSource} from "@/composables/useEventSource.ts";

useEventSource()
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

number-flow-vue {
  margin-left: .0625em;
  font-weight: bold;
  font-size: 3rem;
}
</style>