<script lang="ts">
	import Typewriter from 'svelte-typewriter';
	import { history } from '$stores/history';

	export let host = '';

	let input: HTMLInputElement;
	let isTyping = true;
	let historyIndex = $history.length;

	function focus(element: HTMLElement) {
		element?.focus();
	}

	function handleDoneWriting() {
		isTyping = false;
		setTimeout(() => {
			input.focus();
		});
	}

	function handleSubmit(e: SubmitEvent) {
		const formData = new FormData(e.target as HTMLFormElement);
		const command = formData.get('command')?.toString();

		if (!command || /^[ ]+$/.test(command) || $history[$history.length - 1] === command) {
			return;
		}

		$history[$history.length] = command;
		historyIndex = $history.length;

		console.log(command);
	}

	function handleKeyUp(e: KeyboardEvent) {
		switch (e.code) {
			case 'Enter':
				e.preventDefault();
				input.value = '';
				return false;
			case 'ArrowUp':
				if (historyIndex > 0) {
					historyIndex--;
					input.value = $history[historyIndex];
				}
				break;
			case 'ArrowDown':
				if (historyIndex < $history.length - 1) {
					historyIndex++;
					input.value = $history[historyIndex];
				} else {
					historyIndex = $history.length;
					input.value = '';
				}
				break;
		}
	}

	$: prompt = host.length ? `${host}:~$` : '$';
</script>

<div class="w-full">
	<!-- Window -->
	<div
		class="flex flex-col space-y-4 px-5 pt-4 pb-6 text-gray-100 text-sm font-mono subpixel-antialiased
                bg-gray-800 rounded-lg leading-normal shadow-lg overflow-hidden"
	>
		<!-- Window Toolbar (Apple Buttons) -->
		<!-- <div class="flex space-x-2">
			<div class="h-3 w-3 bg-red-500 rounded-full" />
			<div class="h-3 w-3 bg-orange-300 rounded-full" />
			<div class="h-3 w-3 bg-green-500 rounded-full" />
		</div> -->

		<!-- Intro Text -->
		<Typewriter mode="cascade" on:done={handleDoneWriting}>
			<div class="flex flex-col">
				<p class="flex-1 items-center">Welcome to Svelterminal!</p>
			</div>
		</Typewriter>

		<!-- Prompt -->
		<form class="flex space-x-2" on:submit|preventDefault={handleSubmit}>
			<!-- Host -->
			<span class="text-green-400">{prompt}</span>

			<!-- Input -->
			<input
				class="flex-1 bg-transparent outline-none caret-green-400 care"
				type="text"
				name="command"
				disabled={isTyping}
				bind:this={input}
				use:focus
				on:keyup|preventDefault={handleKeyUp}
			/>
		</form>
	</div>
</div>

<style>
	:root {
		--cursor-color: #fff;
	}
</style>
