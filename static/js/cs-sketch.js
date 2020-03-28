// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference

// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas = {
    cell_size: 20,
    wid: 40,
    hgt: 144
}; // JS Global var, w canvas size info.

var g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
var g_frame_mod = 20; // Update ever 'mod' frames.
var g_stop = 0; // Go by default.
var generation = 1;

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

// Convert Function for Hex2Dec and Dec2Hex
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

// Select a random sample input
var running_input = inputs[Math.floor(Math.random() * 24)];
var converted_input = convertHexDec(running_input, "hex2dec");

// Merge Step Object Stack Class
class _merge_stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        this.items.pop();
    }

    next() {
        return this.items[this.items.length - 1];
    }

    print() {
        console.log("_______________STACK_____________");
        for (let i = 0; i < this.items.length; i++) {
            console.log(this.items[i].step);
        }
    }
}

// Initiate Merge Step Object Stack
var merge_stack = new _merge_stack();

// Merge Object Class
class _mergeObj {
    constructor(arr, par, step, s_pos) {
        this.arr = arr;
        this.left = [];
        this.right = [];
        this.parent = par;
        this.finish = false;
        this.step = step;
        this.s_pos = s_pos;
    }
}

// TODO Quick Sort Object
var quickObj = {
    finish: false
}

// Gold's Pore Object
var goldObj = {
    arr: [...converted_input],
    finish: false,
    s_pos: 0,
    generation: 1
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

    // Merge Sort Initiation
    merge_stack.push(new _mergeObj(converted_input, null, "GP", 0));
    merge_stack.push(new _mergeObj(converted_input.slice(6, 12), merge_stack.items[0], "R", 6));
    merge_stack.push(new _mergeObj(converted_input.slice(0, 6), merge_stack.items[0], "L", 0));

    // TODO Quick Sort Initiation
}

function merge_sort(Larr, Rarr) {
    var arr = [];
    var Rcount = 0;

    for (let i = 0; i < Larr.length; i++) {
        for (let j = Rcount; j < Rarr.length; j++) {
            if (Larr[i] <= Rarr[j]) {
                break;
            } else {
                arr.push(Rarr[j]);
                Rcount++;
            }
        }
        arr.push(Larr[i]);
    }

    if (Rcount < Rarr.length) {
        for (let k = Rcount; k < Rarr.length; k++) {
            arr.push(Rarr[k]);
        }
    }

    return arr;
}

function merge_stepper(merge_stack) {
    var current = merge_stack.next();

    if (!current.finish) {
        switch (current.step) {
            case "L":
                // Print left
                let tempL = convertHexDec(current.arr, "dec2hex");
                for (let i = 0; i < current.arr.length; i++) {
                    fill(current.arr[i] * 100, current.arr[i] * 10, current.arr[i] * 10);
                    square((20 * i) + (current.s_pos * 20), 20 * generation, 20);
                    fill(255, 255, 255);
                    text(tempL[i], (20 * i) + (current.s_pos * 20) + 10, (20 * generation) + 10);
                }

                if (current.arr.length == 1) {
                    current.parent.left = [...current.arr];
                    merge_stack.pop();
                } else {
                    // Get split bounds
                    let leftUBound = Math.ceil(current.arr.length / 2);
                    let rightLBound = leftUBound;

                    // Pop Current
                    merge_stack.pop();

                    // Push GLU LEFT
                    merge_stack.push(new _mergeObj([], current.parent, "GL", current.s_pos));

                    // Push RIGHT
                    merge_stack.push(new _mergeObj(current.arr.slice(rightLBound, current.arr.length), merge_stack.next(), "R", current.s_pos + rightLBound));

                    // Push LEFT
                    merge_stack.push(new _mergeObj(current.arr.slice(0, leftUBound), merge_stack.items[merge_stack.items.length - 2], "L", current.s_pos));
                }
                break;

            case "R":
                // Print right
                let tempR = convertHexDec(current.arr, "dec2hex");
                for (let i = 0; i < current.arr.length; i++) {
                    fill(current.arr[i] * 100, current.arr[i] * 10, current.arr[i] * 10);
                    square((20 * i) + (current.s_pos * 20), 20 * generation, 20);
                    fill(255, 255, 255);
                    text(tempR[i], (20 * i) + (current.s_pos * 20) + 10, (20 * generation) + 10);
                }

                if (current.arr.length == 1) {
                    current.parent.right = [...current.arr];
                    merge_stack.pop();
                } else {
                    // Get split bounds
                    let leftUBound = Math.ceil(current.arr.length / 2);
                    let rightLBound = leftUBound;

                    // Pop Current
                    merge_stack.pop();

                    // Push GLU LEFT
                    merge_stack.push(new _mergeObj([], current.parent, "GR", current.s_pos));

                    // Push RIGHT
                    merge_stack.push(new _mergeObj(current.arr.slice(rightLBound, current.arr.length), merge_stack.next(), "R", current.s_pos + rightLBound));

                    // Push LEFT
                    merge_stack.push(new _mergeObj(current.arr.slice(0, leftUBound), merge_stack.items[merge_stack.items.length - 2], "L", current.s_pos));
                }
                break;

            case "GL":
                console.log("GL");
                console.log(current.s_pos);
                let tempGL = merge_sort(current.left, current.right);
                current.parent.left = tempGL;
                merge_stack.pop();

                // Convert to Hex for printing
                tempGL = convertHexDec(tempGL, "dec2hex");
                console.log(tempGL);
                // Print Glue Left
                for (let i = 0; i < tempGL.length; i++) {
                    fill(current.parent.left[i] * 100, current.parent.left[i] * 10, current.parent.left[i] * 10);
                    square((20 * i) + (current.s_pos * 20), 20 * generation, 20);
                    fill(255, 255, 255);
                    text(tempGL[i], (20 * i) + (current.s_pos * 20) + 10, (20 * generation) + 10);
                }
                break;

            case "GR":
                let tempGR = merge_sort(current.left, current.right);
                current.parent.right = tempGR;
                merge_stack.pop();

                // Convert to Hex for printing
                tempGR = convertHexDec(tempGR, "dec2hex");

                // Print Glue Right
                for (let i = 0; i < tempGR.length; i++) {
                    fill(current.parent.right[i] * 100, current.parent.right[i] * 10, current.parent.right[i] * 10);
                    square((20 * i) + (current.s_pos * 20), 20 * generation, 20);
                    fill(255, 255, 255);
                    text(tempGR[i], (20 * i) + (current.s_pos * 20) + 10, (20 * generation) + 10);
                }

                break;

            case "GP":
                let tempGP = merge_sort(current.left, current.right);
                current.arr = tempGP;
                current.finish = true;

                // Convert to Hex for printing
                tempGP = convertHexDec(tempGP, "dec2hex");

                // Print final result
                for (let i = 0; i < tempGP.length; i++) {
                    fill(current.arr[i] * 100, current.arr[i] * 10, current.arr[i] * 10);
                    square(20 * i, 20 * generation, 20);
                    fill(255, 255, 255);
                    text(tempGP[i], (20 * i) + 10, (20 * generation) + 10);
                }
                break;
        }
    }
}

function gold_stepper(goldObj) {
    if (!goldObj.finish) {
        var swap = false;

        // Traverse through array and run swaps
        for (let i = goldObj.s_pos; i < 12 - goldObj.s_pos; i++) {
            if (goldObj.arr[i + 1] < goldObj.arr[i]) {
                let b = goldObj.arr[i + 1];
                goldObj.arr[i + 1] = goldObj.arr[i];
                goldObj.arr[i] = b;
                swap = true;
            }
            i++;
        }

        // Swap starting position
        if (goldObj.s_pos == 1) {
            goldObj.s_pos = 0;
        } else {
            goldObj.s_pos = 1;
        }

        // Check finish flag
        if (!swap) {
            goldObj.finish = true;
        }

        // Populate row
        let temp = convertHexDec(goldObj.arr, "dec2hex");
        for (let i = 0; i < 12; i++) {
            fill(goldObj.arr[i] * 10, goldObj.arr[i] * 10, goldObj.arr[i] * 100);
            square((20 * i) + 560, (20 * generation), 20);
            fill(255, 255, 255);
            text(temp[i], (20 * i) + 570, (20 * generation) + 10);
        }
    }
}

function draw_update() // Update our display.
{
    generation++;
    merge_stepper(merge_stack);
    gold_stepper(goldObj);
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