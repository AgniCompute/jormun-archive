# ARCHIVE 04: JÖRMUN

I built this project because I wanted to explore what happens when you combine creative web design with lightweight engineering. A lot of modern websites that feature creature animations or 3D effects rely on heavy WebGL libraries. While those tools are great, they often come with massive bundle sizes, slow load times, and battery drain. 

For me, technology is most exciting when it feels accessible to anyone. I wanted to see if I could create a living deep sea leviathan experience on a standard 2D canvas that runs smoothly on almost any device. It taught me a lot about finding the right balance between ambitious visuals and practical performance.

## Why I Built It This Way

When you look at interactive web design today, there are usually two extremes. On one side, you have standard flat websites that load instantly but feel static. On the other side, you have full 3D interactive experiences that look incredible, but they make your laptop fan spin up immediately.

I feel like there is a sweet spot in the middle that people do not explore enough. 

Can you make something look cinematic and dynamic without asking the user to download tens of megabytes of 3D assets? It really depends on how you approach the problem. Instead of loading an entire 3D model, I used 2.5D spline kinematics. The dragon is made of repeating modular scale segments that calculate their position and rotation along smooth Bezier curves in real time. 

That approach allows me to keep the entire build lightweight while maintaining over 120 frames per second. Most importantly, it means someone on an older phone or laptop can still enjoy the motion without lag.

## What It Does

- Continuous 2.5D Motion: The body coils infinitely through the typography using a continuous conveyor loop. Instead of an awkward jump when the loop resets, each scale segment smoothly fades behind the neck collar.
- Living Biological Roar: The creature is not just a looping video or a static image. You can click anywhere to trigger a roar sequence, complete with an anticipation inhale, glowing cyan photophores, and a natural jaw snap.
- Trench Floor Archive: Scrolling down takes you to an editorial hadal dossier at minus 9,820 meters. It includes an interactive specimen lightbox, a live acoustic sonar visualizer, and an oscilloscope tracking benthic pulses.
- Procedural Audio: The hydrophone sounds are synthesized using the native Web Audio API, so there are no heavy audio files to stream. There is also a dedicated sound toggle right at the top so anyone who finds the low hum distracting can turn it off anytime.

## What This Project Taught Me

Building this project taught me that great design is not just about showing off fancy effects. It is about how those effects make the user feel. 

When you spend hours adjusting the curve of a spline or the timing of a jaw snap, you realize that small details matter. If the movement is even slightly too fast or rigid, the creature looks mechanical. When you slow it down and add a subtle swimming cadence, people suddenly perceive it as a living creature. 

I am passionate about learning how to use code to spark curiosity. When someone opens a webpage and pauses for a second because something unexpected caught their attention, that is the kind of impact I want to create.

## Tech Stack

I kept the stack minimal on purpose:

- Vanilla JavaScript (ES6+): Custom spline kinematics, physics calculations, and Web Audio synthesizers.
- HTML5 Canvas 2D: Hardware accelerated rendering for the serpent body.
- Tailwind CSS: Clean layout structure and responsive containers.
- GSAP: Smooth camera tweens and depth transitions between sections.

No complex build setups, no npm installs, and no external framework overhead.

## How to Run It Locally

If you want to run this project on your machine, it takes just a couple of steps.

1. Clone this repository:
```bash
git clone https://github.com/AgniCompute/jormun-archive.git
cd jormun-archive
```

2. Start any local web server:
```bash
# Using Python
python -m http.server 8080

# Or using Node
npx serve -l 8080
```

3. Open your browser and go to `http://localhost:8080/`.

## Deploying to GitHub Pages

If you fork this project or push it to your own GitHub account, you can host it for free:

1. Go to your repository settings on GitHub.
2. Click on the Pages tab on the left menu.
3. Under Build and deployment, set the branch to main and the folder to root.
4. Click Save, and GitHub will deploy your site in about a minute.

## Motion Engineering Guide

I wrote a detailed technical breakdown in MOTION_ENGINEERING.md. It covers the cubic Bezier spline math, the tangent formulas, and how the modular conveyor loop works. If you want to use these motion techniques in your own art or interactive projects, feel free to read through it and copy the starter code.

## License

MIT License. You are free to use the code, experiment with it, and build your own ideas.
