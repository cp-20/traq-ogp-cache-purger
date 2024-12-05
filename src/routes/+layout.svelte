<script lang="ts">
	import '../app.css';
	import { getAuthToken, handleAuthCallback, requestAuth } from '$lib/auth';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!getAuthToken()) {
			try {
				await handleAuthCallback();
			} catch (err) {
				location.href = requestAuth();
			}
		}
	});

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<div class="m-auto min-h-screen max-w-2xl bg-white px-8 py-8 max-md:px-4">
		{@render children()}
	</div>
</div>
