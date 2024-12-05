<script>
	import Purger from '../components/purger.svelte';
</script>

<svelte:head>
	<title>traQ の OGP キャッシュ消す君</title>
	<meta name="description" content="traQ の OGP キャッシュを消します。それだけ" />
</svelte:head>

<div class="space-y-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold">traQ の OGP キャッシュ消す君</h1>
		<div class="text-gray-500">
			<p>URLを入力して消すボタンを押してください。</p>
			<p>消した後、新しいメッセージが投稿されてから反映されます</p>
		</div>
	</div>

	<div>
		<Purger />
	</div>
</div>
