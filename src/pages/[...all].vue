<route>
	{
		meta: {
			layout: "empty"
		}
	}
</route>
<template>
	<!-- 404 page -->
	<main
		class="min-h-screen bg-cover bg-top sm:bg-top"
		style="
			background-image: url('https://images.unsplash.com/photo-1742077414023-45a81fd63736?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
		"
	>
		<div class="max-w-7xl mx-auto px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-64">
			<!-- <p class="text-sm font-semibold text-black text-opacity-50 uppercase tracking-wide">404 error</p> -->
			<h1 class="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">404 - The page you're looking for doesn't seem to exist!</h1>
			<!-- <p class="mt-2 text-lg font-medium text-black text-opacity-50">It looks like the page you’re looking for doesn't exist.</p> -->
			<div class="mt-6">
				<router-link
					:to="{ name: 'index' }"
					class="
						inline-flex
						items-center
						px-4
						py-2
						border border-transparent
						text-sm
						font-medium
						rounded-md
						text-black text-opacity-75
						bg-white bg-opacity-75
						sm:bg-opacity-25 sm:hover:bg-opacity-50
					"
				>
					Go Home
				</router-link>
			</div>
		</div>
	</main>
</template>
