<script context="module">
    // Import statements
    import words from "../words.json";
    import Timer from "../lib/+timer.svelte";
</script>

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly, scale } from 'svelte/transition';

    // State variables
    let gameStarted = false;
    let randomString = "";
    let message = "Press 'Enter' to start the game";
    let userInput = "";
    let result = "";
    let isMobile = false;
    let showInput = false;

    // New state variable for localStorage availability
    let isLocalStorageAvailable = true;

    // Countdown variables
    let countdown = 3;
    let isCountdown = false;

    // Game configuration
    let questionsCounter = 0;
    const maxQuestions = 3;

    // Timer instance
    const timer = Timer();

    // Utility function to check localStorage access
    function checkLocalStorageAccess() {
        try {
            localStorage.setItem("test", "test");
            localStorage.removeItem("test");
            return true;
        } catch (e) {
            return false;
        }
    }

    // Fetch a random word from the imported list
    function getRandomWord(): string {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }

    // Generate a random string embedding a word
    function embedWordInString(word: string, length: number): string {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const embedPosition = Math.floor(Math.random() * (length - word.length));
        const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

        for (let i = 0; i < length; i++) {
            if (i === embedPosition) {
                result += formattedWord;
                i += word.length - 1;
            } else {
                const charIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(charIndex);
            }
        }
        return result;
    }

    // Initialize countdown for game start
    function startCountdown() {
        message = "";
        isCountdown = true;
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown === 0) {
                clearInterval(countdownInterval);
                isCountdown = false;
                startGame();
            }
        }, 1000);
    }

    // Handle key events for game control
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            if (!gameStarted && !isCountdown) {
                startCountdown();
            } else if (gameStarted) {
                checkUserInput();
            }
        }
    }

    // Lifecycle hooks for adding/removing event listeners
    onMount(() => {
        isLocalStorageAvailable = checkLocalStorageAccess();
        isMobile = window.innerWidth < 769;
        if (!isMobile && isLocalStorageAvailable) {
            document.addEventListener("keydown", handleKeyDown);
        }
    });

    onDestroy(() => {
        if (isLocalStorageAvailable) {
            localStorage.removeItem("hiddenWord");
        }
        if (!isMobile && isLocalStorageAvailable) {
            document.removeEventListener("keydown", handleKeyDown);
        }
    });

    // Start the game by setting up the word and timer
    function startGame() {
        if (questionsCounter < maxQuestions) {
            timer.StartTimer();
            gameStarted = true;
            const word = getRandomWord();
            randomString = embedWordInString(word, 60);
            userInput = "";
            result = "";
            showInput = true;
            console.log('This isn\'t a bug, it\'s some help for you in the form of Easter Egg 🧌' + `\nRandom Word: ${word}`)
            if (isLocalStorageAvailable) {
                localStorage.setItem("hiddenWord", word.toLowerCase());
            }
            questionsCounter++;
        } else {
            finishGame();
        }
    }

    // Check user input against the hidden word
    function checkUserInput() {
        if (isLocalStorageAvailable) {
            const trimmedInput = userInput.trim().toLowerCase();
            const hiddenWord = localStorage.getItem("hiddenWord");
            if (trimmedInput === hiddenWord) {
                result = "Correct!";
                localStorage.removeItem("hiddenWord");
                timer.StopTimer();
                startGame();
            } else if (trimmedInput !== "") {
                result = "Wrong!";
            }
        }
    }

    // Finalize game and display results
    function finishGame() {
        showInput = false;
        timer.StopTimer();
        message = `You answered ${maxQuestions} questions in ${timer.timer} seconds.`;
    }
</script>

<svelte:head>
    <title>WordHunt</title>
    <meta name="description" content="Challenge your eyes and hunt for words within sentences that do not contain any spaces between them."/>
</svelte:head>

<main class="flex flex-col items-center justify-center h-[100svh] gap-6 overflow-hidden">
    {#if isLocalStorageAvailable}
        {#if !isCountdown}
            <div class="bg-[#30343E] w-full sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] p-4 text-white overflow-hidden">
                {#if message}
                    <div class="break-words text-center" in:fade={{ duration: 500 }}>
                        {message}
                        {#if isMobile && !gameStarted && !isCountdown}
                            <button on:click={startCountdown} class="start-button">(Start)</button>
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
    {:else}
        <div class="text-center p-4">
            <p>You have to enable localStorage in your browser settings to use this app.</p>
        </div>
    {/if}
</main>