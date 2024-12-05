<script lang="ts">
	import { getAuthToken } from '$lib/auth';

	let url = '';
	let loading = false;
	let result: { success: boolean; url: string } | null = null;

	const handleSubmit = async () => {
		if (!url) return;
		const token = getAuthToken();
		if (!token) return;

		loading = true;
		const res = await fetch(`https://q.trap.jp/api/v3/ogp/cache?url=${encodeURIComponent(url)}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` }
		});

		loading = false;
		result = {
			success: res.ok,
			url
		};
	};
</script>

<div>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="flex flex-col gap-1">
			<label for="url-input" class="text-sm font-bold text-gray-600">キャッシュを消すURL</label>
			<input
				type="url"
				id="url-input"
				class="rounded-sm border px-2 py-1"
				placeholder="https://trap.jp/post/xxxx"
				bind:value={url}
			/>
			<button
				type="submit"
				disabled={loading}
				class="mt-2 rounded-sm bg-orange-500 px-2 py-1 font-bold text-white transition-colors hover:bg-orange-600"
			>
				{#if loading}
					<div class="flex justify-center p-0.5" aria-label="読み込み中">
						<div
							class="size-5 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
					</div>
				{:else}
					消す
				{/if}
			</button>
			{#if result}
				<div>
					{#if result.success}
						<div class="font-bold text-green-500">
							正しくキャッシュを削除しました: <a href={result.url}>{result.url}</a>
						</div>
					{:else if result.url}
						<div class="font-bold text-red-500">
							キャッシュの削除に失敗しました: <a href={result.url}>{result.url}</a>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</form>
</div>
