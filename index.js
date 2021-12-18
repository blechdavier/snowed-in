let world = [];

function setup() {
    resizeCanvas(windowWidth, windowHeight, WEBGL);
    for(let i = 0; i<512; i++) {
        world.push([]);
        for(let j = 0; j<511; j++) {
            world[world.length-1].push(  j  <  100+100*noise(i/100)  );
        }
        world[world.length-1].push(true);
    }
}

function draw() {
    background(100, 200, 255);
    renderTiles();
    //renderEntities();

}

function renderTiles() {
    // fill(200, 240, 255);
    // noStroke();
    // console.log("frame");
    // for(let i = 0; i<world.length; i++) {
    //     for(let j = 0; j<world[i].length; j++) {
    //         if(world[i][j]) {
    //             rect(i*16, height-j*16, 16);
    //         }
    //     }
    // }

    shader(tileShader);

    rect();
}