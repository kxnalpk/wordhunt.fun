export default function Timer() {
    let timer = $state(0);
    let intervalId: number | null = null;

    let running = $state(false);

    $effect(() => {
        if (running) {
            intervalId = setInterval(() => {
                timer++;
            }, 1000);
        }

        return () => {
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
        };
    });

    function StartTimer() {
        running = true;
    }

    function StopTimer() {
        running = false;
    }

    return {
        get timer() {
            return timer;
        },
        StartTimer,
        StopTimer,
    };
}
