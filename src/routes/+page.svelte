<script lang="ts">
	import Terminal from '$lib/Terminal.svelte';
	import type { Command } from '$data/commands';

	const commands: Command[] = [];
</script>

<div class="flex flex-col items-center p-16">
	<div class="w-1/2">
		<Terminal {commands} welcome="Welcome to Svelterminal!" heightClass="h-72" />
	</div>
</div>
