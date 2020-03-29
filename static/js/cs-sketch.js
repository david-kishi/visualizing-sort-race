// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference

// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas = {
    cell_size: 20,
    wid: 40,
    hgt: 80
}; // JS Global var, w canvas size info.

var g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
var g_frame_mod = 1; // Update ever 'mod' frames.
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
        this.arr = [...arr];
        this.left = [];
        this.right = [];
        this.parent = par;
        this.finish = false;
        this.step = step;
        this.s_pos = s_pos;
    }
}

// Quick Sort Step Object Stack Class
class _quick_sort_stack {
    constructor() {
        this.items = [];
        this.sorted_arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.sorted_count = 0;
        this.finish = false;
    }

    sort_fill(num, pos) {
        this.sorted_arr[pos] = num;
        this.sorted_count++;
        if (this.sorted_count == 12) {
            this.finish = true;
        }
        return this.finish;
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
        console.log("__________QUICK STACK_____________");
        for (let i = 0; i < this.items.length; i++) {
            console.log(this.items[i]);
        }
    }
}

// Initiate Quick Sort Step Object Stack
var quick_stack = new _quick_sort_stack();

// Quick Sort Object
class _quickObj {
    constructor(arr, s_pos) {
        this.arr = [...arr];
        this.s_pos = s_pos;
    }
}

// Gold's Pore Object
class _goldObj {
    constructor(arr, s_pos, pos) {
        this.arr = [...arr];
        this.s_pos = s_pos;
        this.pos = pos;
        this.finish = false;
        this.swap = false;
    }
}

// Initiate Gold Pore Object
var goldObj = new _goldObj(converted_input, 0, 0);

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

    // Quick Sort Initiation
    quick_stack.push(new _quickObj(converted_input, 0));
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
                let tempGL = merge_sort(current.left, current.right);
                current.parent.left = tempGL;
                merge_stack.pop();

                // Convert to Hex for printing
                tempGL = convertHexDec(tempGL, "dec2hex");
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

function quick_stepper(quick_stack) {
    if (!quick_stack.finish) {
        var current = quick_stack.next();

        // Print array
        // Convert dec to hex for printing
        let temp = convertHexDec(current.arr, "dec2hex");

        // Print current
        for (let i = 0; i < temp.length; i++) {
            if (i == j) {
                fill('cyan');
            } else {
                fill(current.arr[i], current.arr[i] * 25, current.arr[i] * 15);
            }
            square((20 * (i + current.s_pos)) + 280, 20 * (3 * generation - 4) - 20, 20);
            fill(255, 255, 255);
            text(temp[i], (20 * (i + current.s_pos)) + 290, 20 * (3 * generation - 4) - 10);
        }

        // Check if array is only 1 variable
        if (current.arr.length == 1) {
            // Add variable to master array and check if finished
            quick_stack.sort_fill(current.arr[0], current.s_pos);
            fill('cyan');
            square((20 * current.s_pos) + 280, 20 * (3 * generation - 4), 20);
            fill(255, 255, 255);
            text(current.arr[0].toString(16).toUpperCase(), (20 * current.s_pos) + 290, 20 * (3 * generation - 4) + 10);

            quick_stack.pop();
        } else {
            var pivot = current.arr[0];
            var i = 1;
            var j = current.arr.length - 1;

            for (i; i <= j; i++) {
                if (pivot < current.arr[i]) {
                    for (j; j >= i; j--) {
                        if (current.arr[j] <= pivot) {
                            // Perform swap
                            let temp = current.arr[j];
                            current.arr[j] = current.arr[i];
                            current.arr[i] = temp;

                            // Print swap with random matching color
                            colorR = Math.floor(Math.random() * 255);
                            colorG = Math.floor(Math.random() * 255);
                            colorB = Math.floor(Math.random() * 255);
                            fill(colorR, colorG, colorB);
                            square((20 * (i + current.s_pos)) + 280, 20 * (3 * generation - 4), 20);
                            fill(255, 255, 255);
                            text(current.arr[i].toString(16).toUpperCase(), (20 * (i + current.s_pos)) + 290, 20 * (3 * generation - 4) + 10);
                            fill(colorR, colorG, colorB);
                            square((20 * (j + current.s_pos)) + 280, 20 * (3 * generation - 4), 20);
                            fill(255, 255, 255);
                            text(current.arr[j].toString(16).toUpperCase(), (20 * (j + current.s_pos)) + 290, 20 * (3 * generation - 4) + 10);

                            break;
                        }
                    }
                }
            }

            // Swap pivot with last location
            let temp = current.arr[0];
            current.arr[0] = current.arr[j];
            current.arr[j] = temp;

            // Convert dec to hex for printing
            temp = convertHexDec(current.arr, "dec2hex");

            // Print result
            for (let k = 0; k < temp.length; k++) {
                if (k == j) {
                    fill('cyan');
                } else {
                    fill(current.arr[k], current.arr[k] * 25, current.arr[k] * 15);
                }
                square((20 * (k + current.s_pos)) + 280, 20 * (3 * generation - 4) + 20, 20);
                fill(255, 255, 255);
                text(temp[k], (20 * (k + current.s_pos)) + 290, 20 * (3 * generation - 4) + 30);
            }

            // Add variable to master array
            quick_stack.sort_fill(pivot, current.s_pos + j);

            // Make left and right objects and add to stack
            quick_stack.pop();
            if (!quick_stack.finish) {

                if (j != current.arr.length && j + 1 != current.arr.length) {
                    quick_stack.push(new _quickObj(current.arr.slice(j + 1, current.arr.length), current.s_pos + j + 1));
                }

                if (j != 0) {
                    quick_stack.push(new _quickObj(current.arr.slice(0, j), current.s_pos));
                }

            }
        }

        // Check if finished
        if (quick_stack.finish) {
            // Convert dec to hex for printing
            let temp = convertHexDec(quick_stack.sorted_arr, "dec2hex");

            // Print final result
            for (let i = 0; i < temp.length; i++) {
                fill(quick_stack.sorted_arr[i], quick_stack.sorted_arr[i] * 25, quick_stack.sorted_arr[i] * 15);
                square((20 * i) + 280, 20 * (3 * generation - 4) + 40, 20);
                fill(255, 255, 255);
                text(temp[i], (20 * i) + 290, 20 * (3 * generation - 4) + 50);
            }
        }
    }
}

function gold_stepper(goldObj) {
    if (!goldObj.finish) {
        // Swap
        if (goldObj.arr[goldObj.pos] > goldObj.arr[goldObj.pos + 1]) {
            let temp = goldObj.arr[goldObj.pos + 1];
            goldObj.arr[goldObj.pos + 1] = goldObj.arr[goldObj.pos];
            goldObj.arr[goldObj.pos] = temp;
            goldObj.swap = true;
        }

        console.log(`${goldObj.arr[goldObj.pos]} - ${goldObj.arr[goldObj.pos + 1]}`)

        // Print the two values
        fill(goldObj.arr[goldObj.pos] * 10, goldObj.arr[goldObj.pos] * 10, goldObj.arr[goldObj.pos] * 100);
        square((20 * goldObj.pos) + 560, (20 * generation), 20);
        fill(255, 255, 255);
        text(goldObj.arr[goldObj.pos].toString(16).toUpperCase(), (20 * goldObj.pos) + 570, (20 * generation) + 10);

        fill(goldObj.arr[goldObj.pos + 1] * 10, goldObj.arr[goldObj.pos + 1] * 10, goldObj.arr[goldObj.pos + 1] * 100);
        square((20 * (goldObj.pos + 1)) + 560, (20 * generation), 20);
        fill(255, 255, 255);
        text(goldObj.arr[goldObj.pos + 1].toString(16).toUpperCase(), (20 * (goldObj.pos + 1)) + 570, (20 * generation) + 10);

        // Check if reached end.
        if (goldObj.pos + 2 == goldObj.arr.length || goldObj.pos + 2 == goldObj.arr.length - 1) {
            // Check swap flag
            if (!goldObj.swap) {
                goldObj.finish = true;
                // Print entire array
                let temp = convertHexDec(goldObj.arr, "dec2hex");
                for (let i = 0; i < 12; i++) {
                    fill(goldObj.arr[i] * 10, goldObj.arr[i] * 10, goldObj.arr[i] * 100);
                    square((20 * i) + 560, (20 * generation), 20);
                    fill(255, 255, 255);
                    text(temp[i], (20 * i) + 570, (20 * generation) + 10);
                }
            } else if (!goldObj.s_pos) {
                goldObj.swap = false;
                goldObj.s_pos = goldObj.pos = 1;
            } else {
                goldObj.swap = false;
                goldObj.s_pos = goldObj.pos = 0;
            }
        } else {
            goldObj.pos += 2;
        }
    }
}

function draw_update() // Update our display.
{
    generation++;
    quick_stepper(quick_stack);
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