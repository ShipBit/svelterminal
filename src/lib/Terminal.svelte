<script lang="ts">
	import Typewriter from 'svelte-typewriter';
	import { history } from '$stores/history';
	import { HELP_COMMAND, CLEAR_COMMAND, type Command } from '$data/commands';

	export let welcome = '';
	export let host = '';
	export let commands: Command[];

	let input: HTMLInputElement;
	let historyIndex = $history.length;
	let isTyping = true;
	let output: string[] = [];

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
		const prompt = formData.get('command')?.toString();

		if (!prompt || /^[ ]+$/.test(prompt)) {
			return;
		}

		if ($history[$history.length - 1] !== prompt) {
			$history[$history.length] = prompt;
			historyIndex = $history.length;
		}

		const promptParts = prompt.split(' ');
		const commandPart = promptParts[0];
		const args = promptParts.slice(1);

		const command = allCommands.find(
			(command) =>
				command.command === commandPart || command.aliases?.some((alias) => alias === commandPart)
		);

		if (command?.execute) {
			if (args?.length === (command.arguments?.length || 0)) {
				print(prompt, 'success');
				command.execute(...args);
			} else {
				print(prompt, 'error');
				print(`usage: ${prompt} ${command.arguments?.map((arg) => `[${arg}]`).join(' ')})`);
			}
		} else {
			print(prompt, 'error');
			print('command not found');
		}
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

	function print(text: string, type?: 'error' | 'success') {
		let textClass = '';
		if (type === 'error') {
			textClass = 'text-red-500';
		} else if (type === 'success') {
			textClass = 'text-green-500';
		}

		output = [...output, `<p class="flex-1 whitespace-pre ${textClass}">${text}</p>`];
	}

	const internalCommands: Command[] = [
		{
			...HELP_COMMAND,
			execute: () => {
				print('Available commands:');
				print(
					allCommands
						.map((command) => {
							let line = ` ${command.command}`;
							if (command.aliases) {
								line += ` <span class="text-gray-400">${command.aliases.join(',')}</span>`;
							}
							line = line.padEnd(55, ' ');
							line += ` - ${command.description}`;
							return line;
						})
						.join('<br />')
				);
			}
		},
		{
			...CLEAR_COMMAND,
			execute: () => {
				output = [];
			}
		}
	];

	$: prompt = host.length ? `${host}:~$` : '$';
	$: allCommands = [...internalCommands, ...commands];
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
				{#if welcome}
					<p class="flex-1 items-center">{welcome}</p>
				{/if}
				<p class="flex-1 items-center">Type 'help' to show a list of all commands</p>
			</div>
		</Typewriter>

		<!-- Output -->
		{#each output as block}
			{@html block}
		{/each}

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
