// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference

// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas = {
    cell_size: 10,
    wid: 41,
    hgt: 41
}; // JS Global var, w canvas size info.

var g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
var g_frame_mod = 1; // Update ever 'mod' frames.
var g_stop = 0; // Go by default.

// 3-D Rule Index
var rule_index = [
    [
        // 0,0,0 & 0,0,1
        [false, true],
        // 0,1,0 & 0,1,1
        [true, false]
    ],
    [
        // 1,0,0 & 1,0,1
        [true, false],
        // 1,1,0 & 1,1,1
        [false, true]
    ]
]

function setup() // P5 Setup Fcn
{
    let sz = g_canvas.cell_size;
    let width = sz * g_canvas.wid; // Our 'canvas' uses cells of given size, not 1x1 pixels.
    let height = sz * g_canvas.hgt;
    createCanvas(width, height).parent("demoCanvas"); // Make a P5 canvas.
    background(0);
    draw_grid(10, 50, 'black');

    // Initiate generation 0
    fill(765);
    stroke(765);
    rect((int(g_canvas.wid / 2) * g_canvas.cell_size) + 0.75, 0.75, g_canvas.cell_size - 1.5, g_canvas.cell_size - 1.5);

}

var g_bot = {
    x: 0,
    y: 1,
};

var g_box = {
    t: 1,
    hgt: g_canvas.hgt,
    l: 1,
    wid: g_canvas.wid
};

function move_bot() {
    let dx = 1;

    let x = (dx + g_bot.x + g_box.wid) % g_box.wid; // Move-x.  Ensure positive b4 mod.
    let y = g_bot.y;

    // if bot reaches end of row, increment y to move bot to next row
    if (x == 0) {
        y += 1;
        if (y > g_box.hgt) { // if y is greater than box height, end
            g_stop = !g_stop;
        } else {
            g_bot.y = y;
        }
    }

    g_bot.x = x; // Update bot x.

}

function draw_bot() // Convert bot pox to grid pos & draw bot.
{
    let sz = g_canvas.cell_size;
    let sz2 = sz / 2;
    let x = 0.75 + g_bot.x * sz; // Set x one pixel inside the sz-by-sz cell.
    let y = 0.75 + g_bot.y * sz;
    let big = sz - 1.5; // Stay inside cell walls.

    // family of cells from prev gen; 0=white / 1=black
    let left = me = right = 0;
    let pix = 765; // white

    // Peek into family of cells in previous generation
    // Left
    if (g_bot.x == 0) {
        left = 0;
    } else {
        let lColors = get(x + sz2 - sz - 0.75, y + sz2 - sz - 0.75);
        pix = lColors[0] + lColors[1] + lColors[2];
        if (pix == 765) {
            left = 1;
        }
    }

    // Me
    let mColors = get(x + sz2 - 0.75, y + sz2 - sz - 0.75);
    pix = mColors[0] + mColors[1] + mColors[2];
    if (pix == 765) {
        me = 1;
    }

    // Right
    if (g_bot.x == g_box.wid - 1) {
        right = 0;
    } else {
        let rColors = get(x + sz2 + sz - 0.75, y + sz2 - sz - 0.75);
        pix = rColors[0] + rColors[1] + rColors[2];
        if (pix == 765) {
            right = 1;
        }
    }

    // Determine stroke and fill based on rule_index
    if (rule_index[left][me][right]) {
        fill('white');
        stroke('white');
    } else {
        fill(0);
        stroke(0);
    }

    // Paint the cell.
    rect(x, y, big, big);
}

function draw_update() // Update our display.
{
    draw_bot();
    move_bot();
}

function draw() // P5 Frame Re-draw Fcn, Called for Every Frame.
{
    ++g_frame_cnt;
    if (0 == g_frame_cnt % g_frame_mod) {
        if (!g_stop) draw_update();
    }
}

function keyPressed() {
    g_stop = !g_stop;
}