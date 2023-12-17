<script context="module">
    import words from "../words.json";
    import Timer from "../lib/+timer.svelte";
</script>

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly, scale } from 'svelte/transition';

    let gameStarted: boolean = false;
    let randomString: string = "";
    let message: string = "Press 'Enter' to start the game";
    let userInput: string = "";
    let result: string = "";
    let isMobile: boolean;
    let showInput: boolean = false;

    let countdown: number = 3;
    let isCountdown: boolean = false;

    let questionsCounter: number = 0;
    const maxQuestions: number = 3;

    const timer = Timer();

    function getRandomWord(): string {
        const randomWordIndex = Math.floor(Math.random() * words.length);
        return words[randomWordIndex];
    }

    function String(word: string, length: number): string {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const randomPosition = Math.floor(Math.random() * (length - word.length));
        const randomCaseWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

        for (let i = 0; i < length; i++) {
            if (i === randomPosition) {
                result += randomCaseWord;
                i += word.length - 1; // Skip ahead by the length of the word
            } else {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
        }
        return result;
    }

    function startCountdown() {
        message = "";
        isCountdown = true;
        const countdownInterval = setInterval(() => {
            countdown -= 1;
            if (countdown === 0) {
                clearInterval(countdownInterval);
                isCountdown = false;
                startGame();
            }
        }, 1000);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            if (!gameStarted && !isCountdown) {
                startCountdown();
            } else if (gameStarted) {
                checkUserInput();
            }
        }
    }

    onMount(() => {
        isMobile = window.innerWidth < 600;
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    });

    onDestroy(() => {
        localStorage.removeItem("hiddenWord");
    });

    function startGame() {
        if (questionsCounter < maxQuestions) {
            timer.StartTimer();
            gameStarted = true;
            const word = getRandomWord();
            randomString = String(word, 60);
            userInput = "";
            result = "";
            showInput = true;
            localStorage.setItem("hiddenWord", word.toLowerCase());
            console.log(word.toLowerCase());
            questionsCounter++;
        } else {
            showInput = false;
            timer.StopTimer();
            message = `You answered ${maxQuestions} questions in ${timer.timer} seconds.`;
        }
    }

    function checkUserInput() {
        const trimmedUserInput = userInput.trim().toLowerCase();
        const hiddenWord = localStorage.getItem("hiddenWord");

        if (trimmedUserInput === hiddenWord) {
            result = "Correct!";
            localStorage.removeItem("hiddenWord");
            timer.StopTimer();
            startGame();
        } else if (trimmedUserInput === "") {
            return;
        } else {
            result = "Wrong!";
        }
    }
</script>

<svelte:head>
    <title>WordHunt</title>
    <meta name="description" content="Challenge your eyes and hunt for words within sentences that do not contain any spaces between them."/>
</svelte:head>

<main class="flex flex-col items-center justify-center h-[100svh] gap-6 overflow-hidden">
    {#if !isCountdown}
        <div class="bg-[#30343E] w-full sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] p-4 text-white overflow-hidden">
            {#if message}
                <div class="break-words text-center" in:fade={{ duration: 500 }}>
                    {message}
                    {#if isMobile}
                        <button on:click={startGame} class="text-blue-500" in:fade={{ duration: 500 }}>(Enter)</button>
                    {/if}
                </div>
            {:else}
                <div class="break-words text-center">
                    {randomString}
                </div>
            {/if}
        </div>
    {/if}

    {#if showInput}
        <input
            class="focus:border-[#3f4358] focus:outline-none text-white bg-[#30343E] w-full sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] p-4 overflow-hidden"
            type="text"
            bind:value={userInput}
            placeholder="Type the hidden word"
            on:keydown={handleKeyDown}
            in:fly={{ x: 200, duration: 100 }}
        />
        {#if result}
            <p
                class={result === "Correct!" ? "text-green-500" : "text-red-500"}
                in:scale={{ start: 0.5, duration: 300 }}
            >
                {result}
            </p>
        {/if}
    {/if}

    {#if isCountdown}
        <p class="text-8xl font-bold text-white">
            {countdown}
        </p>
    {/if}
</main>