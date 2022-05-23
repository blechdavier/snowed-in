import { Entity } from './Entity';
import { Entities, EntityData } from '../../../global/Entity';
import { World } from '../World';
import { Tree } from './TileEntity';

export class Drone extends Entity {

    destinationX: number;
    destinationY: number;
    level: number;
    maxVelocity: number;
    radius: number;
    xVel: number = 0;

    constructor(entityId: string, x: number, y: number, level: number) {
        super(Entities.Drone, entityId);
        this.x = x;
        this.y = y;
        this.destinationX = 0;
        this.destinationY = y;
        this.level = level;
        this.maxVelocity = level;
        this.radius = level*40;
        this.radius = this.radius*this.radius;
    }

    getData(): EntityData {
        return {
            type: Entities.Drone,
            data: {
                level: this.level,
                x: this.x,
                y: this.y,
                xVel: this.xVel
            },
        };
    }

    tick(world: World) {
        //console.log("started drone tick")
        if (!(this.x === this.destinationX && this.y === this.destinationY)) {
            const d = Math.sqrt((this.destinationX - this.x) * (this.destinationX - this.x) + (this.destinationY - this.y) * (this.destinationY - this.y));
            if (d > this.maxVelocity) {
                //console.log("1changing x: "+(this.maxVelocity*(this.destinationX-this.x)/d)+", changing y: "+(this.maxVelocity*(this.destinationY-this.y)/d));
                this.xVel = this.maxVelocity * (this.destinationX - this.x) / d
                this.x += this.maxVelocity * (this.destinationX - this.x) / d;
                this.y += this.maxVelocity * (this.destinationY - this.y) / d;
            }
            else {
                //console.log("2changing x: "+(this.destinationX-this.x)+", changing y: "+(this.destinationY-this.y));
                this.xVel = (this.destinationX - this.x)
                this.x = this.destinationX
                this.y = this.destinationY
            }
        }
        else {
            this.xVel = 0;
            const destinationTile = world.tiles[Math.floor(this.destinationY)*world.width+Math.floor(this.destinationX)];
            if(typeof destinationTile === "string" && Object.keys(world.tileEntities).includes(destinationTile) && world.tileEntities[destinationTile] instanceof Tree) {
                //console.log("pretending to cut tree")
            }
            else {
                let isTree = false;
                let closestTreeDistanceSquared: number = Infinity;
                for(let tree of Object.values(world.tileEntities)) {
                    let d = distSquared(tree.x, tree.y, this.x, this.y);
                    if (d < closestTreeDistanceSquared && d <= this.radius) {
                        closestTreeDistanceSquared = d;
                        let closestTree = tree;
                        isTree = true;
                        this.destinationX = closestTree.x + closestTree.width / 2;
                        this.destinationY = closestTree.y + closestTree.height / 2;
                    }
                }

                if(!isTree) {
                    //console.log("there are no trees in radius")
                }
                
            }
        }
        //console.log(this.xVel)
    }
}


function distSquared(x1: number, y1: number, x2: number, y2: number) {
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)
}