<template>
	<div class="prose dark:prose-dark mb-14">
		<Title>
			Katie Nordberg's Blog
			<template v-slot:description>A blog about all of my interesting projects!</template>
		</Title>
	</div>
	<!-- Separator -->
	<div class="w-32 bg-gray-400 h-[1px] mb-16"></div>
	<PostList />
	<!-- Push page down a little bit -->
	<div class="h-32"></div>
</template>

<script setup>
import { useHead } from '@vueuse/head';

useHead({
	title: 'Katie Nordberg',
	meta: [{ name: 'description', content: 'A blog about all of my interesting projects!' }]
});
</script>

<route>
{
	meta: {
		layout: "home"
	}
}
</route>
