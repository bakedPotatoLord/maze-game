import { makeSquareNodeMap } from './helpers'
import Node from './Node'
import rdfs from './rdfs'

export default class Maze {
	// declare canvas vars
	private cw: number
	private ch: number
	private blocksize: number
	/* a map [width=> nodemap]*/
	private static readonly nodemaps = new Map(
		LevelSelect.levelMap.map((el) => [el.w, makeSquareNodeMap(el.w, el.h, 20)]))
	// declare graph algorithm vars
	nodes: Node[][]
	flatNodes: Node[]
	startingNode: Node
	endingNode?: Node

	constructor(numW = 20, numH = 20, blocksize = 20) {
		this.cw = numW * blocksize
		this.ch = numH * blocksize
		this.blocksize = blocksize;

		(this.flatNodes = (this.nodes = Maze.nodemaps.get(this.cw))
			.flat())
			.forEach(el => el.reset());

		//create start and end nodes
		(this.startingNode = this.nodes[0][0])
			.isStartingNode = true;
		(this.endingNode = this.nodes.at(-1).at(-1))
			.isEndingNode = true;

		//do the grunt work
		rdfs(this.flatNodes, this.nodes, this.startingNode, this.blocksize)
		this.setNodeWalls(this.flatNodes)
		//generate imageData
		this.generate()
		console.log("maze constructed successfully")
	}

	reset(numW = 20, numH = 20, blocksize = 20) {
		this.cw = numW * blocksize
		this.ch = numH * blocksize
		this.blocksize = blocksize

		this.flatNodes = (this.nodes = Maze.nodemaps.get(this.cw))
			.flat()
		this.flatNodes.forEach(n => n.reset());
		//create start and end nodes
		(this.startingNode = this.nodes[0][0])
			.isStartingNode = true;
		(this.endingNode = this.nodes.at(-1).at(-1))
			.isEndingNode = true;

		//do the grunt work
		rdfs(this.flatNodes, this.nodes, this.startingNode, this.blocksize)
		this.setNodeWalls(this.flatNodes)
		this.generate()
	}

	private generate() {
		const c = document.createElement('canvas')
		c.hidden = true
		document.body.appendChild(c)
		const ctx = c.getContext('2d') ?? <never>undefined

		c.width = this.cw
		c.height = this.ch

		ctx.fillStyle = 'white'
		ctx.clearRect(0, 0, this.cw, this.ch)
		ctx.strokeStyle = 'purple'
		ctx.lineWidth = 3
		ctx.fillRect(0, 0, this.cw, this.ch)
		//draw all nodes
		this.flatNodes.forEach(el => el.draw(ctx, this.blocksize))

		GlobalState.imageData = ctx.getImageData(0, 0, this.cw, this.ch)
		document.body.removeChild(c)
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.canvas.width = this.cw
		ctx.canvas.height = this.ch
		ctx.putImageData(GlobalState.imageData, 0, 0)
	}

	setNodeWalls(nodes: Node[]) {
		for (let n of nodes) {
			if (n.walls) {
				n.walls.left = (n.wallsTo?.filter(no => no.x == n.x - this.blocksize && no.y == n.y)?.length ?? 0) > 0 || n.x == this.blocksize / 2
				n.walls.right = (n?.wallsTo?.filter(no => no.x == n.x + this.blocksize && no.y == n.y)?.length ?? 0) > 0 || n.x == this.cw - this.blocksize / 2
				n.walls.top = (n?.wallsTo?.filter(no => no.x == n.x && no.y == n.y - this.blocksize)?.length ?? 0) > 0 || n.y == this.blocksize / 2
				n.walls.bottom = (n?.wallsTo?.filter(no => no.x == n.x && no.y == n.y + this.blocksize)?.length ?? 0) > 0 || n.y == this.ch - this.blocksize / 2
			} else {
				n.walls = {
					left: (n.wallsTo?.filter(no => no.x == n.x - this.blocksize && no.y == n.y)?.length ?? 0) > 0 || n.x == this.blocksize / 2,
					right: (n?.wallsTo?.filter(no => no.x == n.x + this.blocksize && no.y == n.y)?.length ?? 0) > 0 || n.x == this.cw - this.blocksize / 2,
					top: (n?.wallsTo?.filter(no => no.x == n.x && no.y == n.y - this.blocksize)?.length ?? 0) > 0 || n.y == this.blocksize / 2,
					bottom: (n?.wallsTo?.filter(no => no.x == n.x && no.y == n.y + this.blocksize)?.length ?? 0) > 0 || n.y == this.ch - this.blocksize / 2,
				}
			}
		}
	}
}