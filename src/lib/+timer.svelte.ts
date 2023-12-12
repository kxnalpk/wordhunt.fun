export default function Timer() {
    let timer = $state(0)

    let running = $state(false)

    $effect(() => {
        if (running) {
            setInterval(() => {
                timer++
            }, 1000)
        }
    })

    function StartTimer() {
        running = true;
    }

    return {
        get timer() { return timer },
        StartTimer
    }
}