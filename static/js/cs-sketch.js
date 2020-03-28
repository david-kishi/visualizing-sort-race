// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference

// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas = {
    cell_size: 20,
    wid: 40,
    hgt: 40
}; // JS Global var, w canvas size info.

var g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
var g_frame_mod = 20; // Update ever 'mod' frames.
var g_stop = 0; // Go by default.

// Array of 24 Sample Inputs
var inputs = [
    ["0", "5", "A", "6", "2", "7", "B", "2", "B", "6", "0", "3"],
    ["0", "6", "5", "6", "6", "7", "1", "0", "4", "0", "B", "A"],
    ["0", "6", "8", "4", "B", "8", "9", "3", "5", "7", "5", "4"],
    ["0", "7", "9", "A", "2", "1", "8", "3", "4", "B", "6", "5"],
    ["0", "9", "4", "8", "7", "8", "6", "2", "2", "6", "1", "6"],
    ["1", "A", "B", "3", "4", "7", "9", "0", "5", "2", "8", "6"],
    ["2", "8", "6", "1", "0", "3", "4", "2", "7", "8", "5", "9"],
    ["3", "0", "5", "3", "0", "4", "7", "8", "6", "A", "2", "1"],
    ["3", "2", "8", "4", "7", "6", "5", "1", "0", "B", "A", "9"],
    ["3", "4", "2", "7", "5", "6", "1", "8", "9", "0", "B", "A"],
    ["4", "1", "B", "3", "8", "2", "6", "2", "1", "9", "8", "5"],
    ["4", "6", "3", "7", "9", "0", "1", "5", "B", "8", "A", "2"],
    ["5", "3", "5", "1", "A", "3", "3", "A", "9", "9", "B", "B"],
    ["5", "9", "3", "4", "7", "9", "0", "8", "8", "A", "1", "5"],
    ["5", "9", "A", "2", "2", "A", "4", "4", "A", "3", "9", "4"],
    ["7", "1", "9", "2", "0", "6", "8", "B", "3", "4", "5", "A"],
    ["7", "2", "B", "3", "A", "5", "4", "1", "6", "9", "8", "0"],
    ["8", "1", "A", "3", "9", "2", "0", "1", "0", "A", "9", "1"],
    ["8", "9", "4", "0", "A", "5", "2", "B", "1", "6", "3", "7"],
    ["A", "6", "9", "3", "5", "4", "2", "B", "7", "0", "1", "8"],
    ["A", "9", "4", "2", "5", "B", "1", "6", "8", "7", "3", "0"],
    ["A", "A", "0", "2", "3", "B", "7", "2", "3", "5", "6", "4"],
    ["B", "4", "0", "1", "6", "3", "8", "A", "2", "9", "7", "5"],
    ["B", "5", "8", "6", "1", "7", "9", "2", "A", "4", "0", "3"]
];

// Select a random sample input
var running_input = inputs[Math.floor(Math.random() * 24)];
var converted_input = convertHexDec(running_input, "hex2dec");

// TODO Merge Sort Object
var merge_Obj = {
    finish: false
}

// TODO Quick Sort Object
var quick_Obj = {
    finish: false
}

// Gold's Pore Object
var gold_Obj = {
    arr: converted_input,
    finish: false,
    s_pos: 0,
    generation: 1
}

// Convert Function
// Variables - source, hex2dec or dec2hex
function convertHexDec(arr, type) {
    let temp = [...arr];

    switch (type) {
        case "hex2dec": // Convert hex to dec
            for (let i = 0; i < arr.length; i++) {
                temp[i] = parseInt(arr[i], 16);
            }
            break;

        case "dec2hex": // Convert dec to hex
            for (let i = 0; i < arr.length; i++) {
                temp[i] = arr[i].toString(16).toUpperCase();
            }
            break;

        default:
            break;
    }

    // return array of chars
    return temp;
}

function setup() // P5 Setup Fcn
{
    // Create grid
    let sz = g_canvas.cell_size;
    let width = sz * g_canvas.wid; // Our 'canvas' uses cells of given size, not 1x1 pixels.
    let height = sz * g_canvas.hgt;
    createCanvas(width, height).parent("demoCanvas"); // Make a P5 canvas.
    background(0);
    draw_grid(20, 50, 'white');

    // Set font and font size
    textFont('Courier');
    textSize(15);
    textAlign(CENTER, CENTER);
    fill(255, 255, 255);

    // Add name of algorithm above each column
    text("Merge Sort", 120, 10);
    text("Quick Sort", 400, 10);
    text("Gold's Pore Sort", 680, 10);

    // Populate first row with randomly selected sample input
    for (let i = 0; i < 12; i++) {
        // Merge Sort
        fill(converted_input[i] * 100, converted_input[i] * 10, converted_input[i] * 10);
        square(20 * i, 20, 20);
        fill(255, 255, 255);
        text(running_input[i], (20 * i) + 10, 30);

        // Quick Sort
        fill(converted_input[i], converted_input[i] * 25, converted_input[i] * 15);
        square((20 * i) + 280, 20, 20);
        fill(255, 255, 255);
        text(running_input[i], (20 * i) + 290, 30);

        // Gold Pore Sort
        fill(converted_input[i] * 10, converted_input[i] * 10, converted_input[i] * 100);
        square((20 * i) + 560, 20, 20);
        fill(255, 255, 255);
        text(running_input[i], (20 * i) + 570, 30);
    }
}

function gold_stepper(gold_Obj) {
    if (!gold_Obj.finish) {
        gold_Obj.generation++;
        var swap = false;

        // Traverse through array and run swaps
        for (let i = gold_Obj.s_pos; i < 12 - gold_Obj.s_pos; i++) {
            if (gold_Obj.arr[i + 1] < gold_Obj.arr[i]) {
                let b = gold_Obj.arr[i + 1];
                gold_Obj.arr[i + 1] = gold_Obj.arr[i];
                gold_Obj.arr[i] = b;
                swap = true;
            }
            i++;
        }

        // Swap starting position
        if (gold_Obj.s_pos == 1) {
            gold_Obj.s_pos = 0;
        } else {
            gold_Obj.s_pos = 1;
        }

        // Check finish flag
        if (!swap) {
            gold_Obj.finish = true;
        }

        // Populate row
        let temp = convertHexDec(gold_Obj.arr, "dec2hex");
        for (let i = 0; i < 12; i++) {
            fill(gold_Obj.arr[i] * 10, gold_Obj.arr[i] * 10, gold_Obj.arr[i] * 100);
            square((20 * i) + 560, (20 * gold_Obj.generation), 20);
            fill(255, 255, 255);
            text(temp[i], (20 * i) + 570, (20 * gold_Obj.generation) + 10);
        }
    }
}

function draw_update() // Update our display.
{
    gold_stepper(gold_Obj);
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