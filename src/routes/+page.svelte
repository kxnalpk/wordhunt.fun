<script context="module">
    import words from '../words.json';
    import timertimer from '../lib/+timer.svelte'
</script>

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let gameStarted: boolean = false;
    let randomString: string = '';
    let message: string = "Press 'Enter' to start the game";
    let userInput: string = '';
    let result: string = '';
    let isMobile: boolean;
    let showInput: boolean = false;

    function getRandomWord(): string {
        const randomWordIndex = Math.floor(Math.random() * words.length);
        return words[randomWordIndex];
    }

    function String(word: string, length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            if (i === length / 2) {
                const randomCaseWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                result += randomCaseWord;
            } else {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
        }
        return result;
    }

    const timer = timertimer();

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {

            if (!gameStarted) {
                startGame();
            } else {
                checkUserInput();
            }
        }
    }

    onMount(() => {
        isMobile = window.innerWidth < 600;
        localStorage.removeItem('hiddenWord');
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    onDestroy(() => {
        localStorage.removeItem('hiddenWord');
    });

    function startGame() {
        timer.StartTimer();
        gameStarted = true;
        const word = getRandomWord();
        randomString = String(word, 60);
        message = '';
        userInput = '';
        result = '';
        showInput = true;
        localStorage.setItem('hiddenWord', word.toLowerCase());
        console.log(word.toLowerCase());
    }

    function checkUserInput() {
        const trimmedUserInput = userInput.trim().toLowerCase();
        const hiddenWord = localStorage.getItem('hiddenWord');

        if (trimmedUserInput === hiddenWord) {
            result = 'Correct!';
            localStorage.removeItem('hiddenWord');
            startGame();
        } else if (trimmedUserInput === '') {
            return;
        } else {
            result = 'Wrong!';
        }
    }
</script>

<svelte:head>
    <title>WordHunt</title>
    <meta name="description" content="Challenge your eyes and hunt for words within sentences that do not contain any spaces between them." />
</svelte:head>

<main class="flex flex-col items-center justify-center h-[100svh] gap-6">
    <div class="text-white">{timer.timer}</div>
    <div class="bg-[#30343E] w-full sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] p-4 text-white overflow-hidden">
        {#if message}
            <div class="break-words text-center">
                {message}
                {#if isMobile}
                    <button on:click={startGame} class="text-blue-500 underline">(Enter)</button>
                {/if}
            </div>
        {:else}
            <div class="break-words text-center">
                {randomString}
            </div>
        {/if}
    </div>

    {#if showInput}
        <input class="focus:border-[#3f4358] focus:outline-none text-white bg-[#30343E] w-full sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] p-4 overflow-hidden" type="text" bind:value={userInput} placeholder="Type the hidden word" on:keydown={handleKeyDown} />
        {#if result}
            <p class="{result === 'Correct!' ? 'text-green-500' : 'text-red-500'}">{result}</p>
        {/if}
    {/if}
</main>