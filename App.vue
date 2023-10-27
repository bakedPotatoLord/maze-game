<template>
  <div class="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import "~/assets/style.css"
import Player from "~/utils/Player";
import Maze from "~/utils/Maze";
import type Node from "~/utils/Node";
import GlobalState from "~/utils/GlobalState";

enum scene {
  welcome,
  levelSelect,
  game,
}

let currScene = scene.welcome;
let canvas = ref<HTMLCanvasElement | null>(null);

const err = (): never => {
  throw new Error();
};

let cw = 1200;
let ch = 800;
const blocksize = 20;
const numW = () => cw / blocksize;
const numH = () => ch / blocksize;

useSeoMeta({
  title: "Maze Game",
  ogTitle: "Maze Game",
  description: "Maze Game",
  ogDescription: "Maze Game",
})

onMounted(async () => {
  let c = canvas.value ?? err();
  let ctx = c.getContext("2d") ?? err();
  ctx.fillStyle = "black";
  c.addEventListener("click", () => {
    c.requestFullscreen();
  });
  const keys: any = {};
  const levelSelect = new LevelSelect();
  const welcomeMaze = new Maze(numW(), numH(), blocksize);
  let welcomeSolution: Node[] | null;

  let keyHandle: NodeJS.Timeout;

  const maze = new Maze(numW(), numH(), blocksize);
  let n = maze.nodes;
  const player = new Player(blocksize / 2, blocksize / 2, 8);
  const popup = new  Popup();
  await setupWelcome();
  requestAnimationFrame(draw);

  async function draw() {
    
    if (currScene == scene.game) {
      maze.draw(ctx);
      player.draw(ctx);
    } else if (currScene == scene.levelSelect) {
      ctx.save();
      ctx.scale(2, 2);
      ctx.fillStyle = "#2e2e2e";
      ctx.fillRect(0, 0, c.width, c.height);

      levelSelect.draw(ctx);
      ctx.restore();
    } else if (currScene == scene.welcome) {
      await new Promise((r) => setTimeout(r, 20));

      welcomeMaze.reset(cw / 20, ch / 20, blocksize);
      welcomeMaze.draw(ctx);
      welcomeSolution = await bfs(
        welcomeMaze.startingNode,
        <Node>welcomeMaze.endingNode,
        welcomeMaze.nodes,
        blocksize,
        ctx,
        true,
        0
      );
      if (GlobalState.leaveWelcome) {
        setupLevelSelect();
        requestAnimationFrame(draw);
        return;
      }
      welcomeMaze.draw(ctx);
      ctx.lineWidth = GlobalState.traceWidth;
      for (let prev of <Node[]>welcomeSolution?.reverse()) {
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        if (prev.parent) ctx.lineTo(prev.parent.x, prev.parent.y);
        ctx.stroke();
        await new Promise((r) => setTimeout(r, 20));
        if (GlobalState.leaveWelcome) {
          setupLevelSelect();
          requestAnimationFrame(draw);
          return;
        }
      }
    }
    popup.draw(ctx,cw,ch);   
    requestAnimationFrame(draw);
  }

  async function setupWelcome() {
    c.width = cw;
    c.height = ch;
  }

  function setupLevelSelect() {
    c.width =cw = 1200;
    c.height =ch = 800;
  }

  function setupGame(w: number, h: number) {
    c.width =cw = w;
    c.height =ch = h;
    maze.reset(cw / blocksize, ch / blocksize, blocksize);
    n = maze.nodes;
    player.reset();
    currScene = scene.game;
  }

  function keyHandler() {
    if (currScene == scene.game) {
      player.erase(ctx);
      const walls =
        n[(player.x - 10) / blocksize][(player.y - 10) / blocksize].walls;
      if ((keys["w"] || keys["ArrowUp"]) && !walls?.top) player.y -= 20;
      if ((keys["s"] || keys["ArrowDown"]) && !walls?.bottom) player.y += 20;
      if ((keys["a"] || keys["ArrowLeft"]) && !walls?.left) player.x -= 20;
      if ((keys["d"] || keys["ArrowRight"]) && !walls?.right) player.x += 20;
      player.draw(ctx);
    }

  }

  window.addEventListener("keydown", (e) => {
    const up = ["w", "ArrowUp"],
      down = ["s", "ArrowDown"],
      left = ["a", "ArrowLeft"],
      right = ["d", "ArrowRight"];
    e.preventDefault();
    if (currScene == scene.welcome) {
    } else if (currScene == scene.levelSelect) {
      if (up.includes(e.key)) levelSelect.moveUp();
      else if (down.includes(e.key)) levelSelect.moveDown();
      else if (left.includes(e.key)) levelSelect.moveLeft();
      else if (right.includes(e.key)) levelSelect.moveRight();
      else if (e.key == " ") {
        const l = levelSelect.getLevel();
        setupGame(l.w, l.h);
      }else if (e.key == "Escape") {
        popup.hidden = !popup.hidden;
      } 
    } else if (currScene == scene.game) {
      if (e.key == " ") {
        setupLevelSelect();
        currScene = scene.levelSelect;
        return;
      }else if (e.key == "Escape") {
        popup.hidden = !popup.hidden;
        return;
      }
      keys[e.key] = true;
      keyHandler();
      setTimeout(() => {
        clearInterval(keyHandle);
        keyHandle = setInterval(keyHandler, 1000);
      }, 150);
    }
  });

  window.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (currScene == scene.welcome) {
      GlobalState.leaveWelcome = true;
      currScene = scene.levelSelect;
    } else if (currScene == scene.game) {
      keys[e.key] = false;
      clearInterval(keyHandle);
    }
  });
});
</script>

<style>
canvas {
  border: 4px solid black;
}
</style>
