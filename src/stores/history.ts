import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

const STORAGE_KEY = 'svelterminal.history';

const historyStored = browser && window.localStorage.getItem(STORAGE_KEY);

export const history: Writable<string[]> = writable(historyStored ? JSON.parse(historyStored) : []);

history.subscribe((history) => {
	if (browser) {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	}
});
