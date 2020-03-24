// Draw a grid
function draw_grid(rminor, rmajor, rstroke) {
    stroke(rstroke);
    let sz = g_canvas.cell_size;
    let width = g_canvas.wid * sz;
    let height = g_canvas.hgt * sz
    let line_wgt = 0.25;
    for (var ix = 0; ix < width; ix += rminor) {
        if (ix != 0) {
            strokeWeight(line_wgt);
            line(ix, 0, ix, height);
            strokeWeight(1);
        }
    }
    for (var iy = 0; iy < height; iy += rminor) {
        if (iy != 0) {
            strokeWeight(line_wgt);
            line(0, iy, width, iy);
            strokeWeight(1);
        }
    }
}