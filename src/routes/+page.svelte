<script lang="ts">
	import Terminal from '$lib/Terminal.svelte';
	import type { Command } from '$data/commands';

	const commands: Command[] = [];
</script>

<div class="grid p-16">
	<Terminal {commands} welcome="Welcome to Svelterminal!" />
</div>
