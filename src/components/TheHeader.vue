<script setup lang="ts">
import {computed, ref} from 'vue'
import type {NavigationMenuItem, SidebarProps} from '@nuxt/ui'
import {useRoute} from "vue-router";

defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()

const route = useRoute()

const open = ref(true)

const navMenuItems = computed<NavigationMenuItem[]>(() => [
  [
    {
      label: 'Dashboard',
      icon: 'i-lucide-circle-gauge',
      to: '/',
      active: route.path.endsWith("/")
    },
    {
      label: 'Job Applications',
      icon: route.path === "/job-applications" ? "i-lucide-folder-open" : "i-lucide-folder",
      to: '/job-applications',
      active: route.path.startsWith('/job-applications')
    },
    {
      label: 'Companies',
      icon: 'i-lucide-building',
      to: '/companies',
      active: route.path.startsWith('/companies')
    },
    {
      label: 'Contact Persons',
      icon: 'i-lucide-users-round',
      to: '/contact-persons',
      active: route.path.startsWith('/contact-persons')
    },
    {
      label: 'Documents',
      icon: 'i-lucide-circle-gauge',
      to: '/documents',
      active: route.path.startsWith('/documents')
    },
    {
      label: 'Interviews',
      icon: route.path === "/interviews" ? "i-lucide-volume-2" : "i-lucide-volume",
      to: '/interviews',
      active: route.path.startsWith('/interviews')
    },
    {
      label: 'Notes',
      icon: route.path === "/notes" ? "i-lucide-notebook-pen" : "i-lucide-notebook",
      to: '/notes',
      active: route.path.startsWith('/notes')
    },
  ],
  [
    {
      label: 'AI Analyses',
      icon: "i-lucide-sparkle",
      children: [
        {
          label: 'Resume/CV & Job Matches',
          icon: route.path === "/resume-cv-job-matches" ? "i-lucide-file-text" : "i-lucide-file",
          to: '/resume-cv-job-matches',
          active: route.path.startsWith('/resume-cv-job-matches')
        },
        {
          label: 'Notes Analyses',
          icon: route.path === "/notes-analyses" ? "i-lucide-notebook-pen" : "i-lucide-notebook",
          to: '/notes-analyses',
          active: route.path.startsWith('/notes-analyses')
        },
        {
          label: 'Pre-Interview Preparations',
          icon: "i-lucide-target",
          to: '/pre-interview-preparations',
          active: route.path.startsWith('/pre-interview-preparations')
        },
        {
          label: 'Post-Interview Reflections',
          icon: "i-lucide-refresh-cw",
          to: '/post-interview-reflections',
          active: route.path.startsWith('/post-interview-reflections')
        },
        {
          label: 'Interview Pattern Analyses',
          icon: "i-lucide-chart-column-stacked",
          to: '/interview-pattern-analyses',
          active: route.path.startsWith('/interview-pattern-analyses')
        },
      ]
    },
  ]
])

const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);

  const crumbs = [{label: "Dashboard", to: "/"}];

  let cumulativePath = "";
  segments.forEach((segment) => {
    cumulativePath += `/${segment}`;
    crumbs.push({
      label: segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      to: cumulativePath,
    });
  });

  return crumbs;
});

</script>

<template>
  <div
      class="flex flex-1"
      :class="[
      variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
      side === 'right' && 'flex-row-reverse'
    ]"
  >
    <USidebar
        v-model:open="open"
        :variant="variant"
        collapsible="icon"
        :side="side"
        :ui="{
        container: 'h-full'
      }"
    >
      <template #header>
        <div class="inline-flex gap-2 items-center">
          <img src="/gifs/you_jobo.gif" alt="" class="w-10 h-10 rounded-full hover:shadow-lg">
          <h1 class="font-bold">YOU JOBO</h1>
        </div>
      </template>

      <UNavigationMenu
          tooltip
          :items="navMenuItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 ',
              linkLabel: 'text-wrap'
          }"
      />
      <template #footer>
        <UColorModeButton/>
      </template>

    </USidebar>


    <div
        class="flex h-screen w-full flex flex-col overflow-hidden relative lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default"
    >
      <div
          class="h-(--ui-header-height) sticky top-0 z-10 flex items-center px-4 bg-default"
          :class="[
          variant !== 'floating' && 'border-b border-default',
          side === 'right' && 'justify-end'
        ]"
      >
        <UButton
            :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'"
            color="neutral"
            variant="ghost"
            aria-label="Toggle sidebar"
            @click="open = !open"
        />
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <UBreadcrumb :items="breadcrumbs" class="mb-10"/>
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
