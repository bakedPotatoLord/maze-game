export const TAU = 2* Math.PI
import Node, { nodeHash } from "./Node"

export function makeSquareNodeMap(cw:number,ch:number,blockSize:number){
  let arr:Node[][] = new Array(cw/blockSize)
  .fill(undefined)
  .map(()=>Array(ch/blockSize))

  const numW = cw/blockSize
  const numH = ch/blockSize
  for(let i=0;i<numW;i++){
    for(let j=0;j<numH;j++){
      arr[i][j] = new Node(i*blockSize+10,j*blockSize+10)
    }
  }
  return arr
}


