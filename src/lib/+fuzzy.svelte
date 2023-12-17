<script>
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';

  const transform = tweened('translateX(-10%) translateY(-10%)', {
    duration: 200,
    easing: linear
  });

  transform.subscribe(value => {
    if (value === 'translateX(10%) translateY(10%)') {
      transform.set('translateX(-10%) translateY(-10%)');
    } else {
      transform.set('translateX(10%) translateY(10%)');
    }
  });
</script>

<div class="pointer-events-none absolute -inset-[100%] opacity-[15%]"
     style="background-image: url('https://www.hover.dev/black-noise.png'); transform: {$transform};">
</div>
