/* Meridia's real geography, traced off the Cursed Scroll 6 map spread (pages 2-3 of the PDF,
   stitched into one image). Coordinates live in a 1000 x 709 space, which is the exact aspect of
   that stitched spread — `public/meridia-map.png` is the same art as a white-on-transparent layer,
   so a pin at (x, y) here sits precisely on top of the book's own numbered badge.

   PINS were read off the rendered spread with a coordinate grid overlaid on it. DISTRICTS are
   hand-traced from the book's dashed district boundaries — close, but deliberately treated as
   highlight zones rather than exact borders, since the printed dashed lines are the real edges
   and they stay visible underneath. */

export const MAP_W = 1000;
export const MAP_H = 709;

/* The stitched spread carries the PDF's own page margins, so the city sits in the middle of a lot
   of empty paper. This is the city's bounding box inside that space — the map view crops to it
   without changing any coordinate below, since the art and the overlay scale together. */
export const CITY_BOX = { x: 128, y: 8, w: 782, h: 694 };

// location number -> [x, y] on the spread
export const MAP_PINS = {
  1: [261, 281], 2: [346, 330], 3: [353, 230], 4: [402, 327], 5: [409, 238], 6: [352, 268],
  7: [690, 483], 8: [543, 412], 9: [630, 432], 10: [464, 474], 11: [410, 434], 12: [542, 497],
  13: [657, 332], 14: [790, 345], 15: [707, 240], 16: [843, 250], 17: [751, 238], 18: [874, 310],
  19: [450, 279], 20: [450, 208], 21: [577, 230], 22: [562, 331], 23: [535, 312], 24: [570, 180],
  25: [255, 403], 26: [178, 445], 27: [252, 464], 28: [293, 408], 29: [240, 352], 30: [196, 318],
  31: [383, 594], 32: [411, 537], 33: [710, 597], 34: [537, 578], 35: [633, 605], 36: [688, 547],
  37: [367, 134], 38: [222, 165], 39: [427, 97], 40: [196, 256], 41: [450, 50], 42: [485, 110],
  43: [545, 90], 44: [662, 82], 45: [826, 145], 46: [802, 103], 47: [757, 90], 48: [605, 118],
  49: [705, 93], 50: [635, 55],
};

/* District highlight zones. Silvertop is the hook along the north and down the west side;
   Montmar Castle is the island in the middle; High Harbor is the walled quarter on the water. */
export const MAP_DISTRICTS = {
  sil: [[300, 68], [420, 30], [530, 28], [566, 38], [562, 140], [470, 155], [390, 170], [300, 178],
        [240, 182], [206, 215], [194, 262], [198, 300], [168, 298], [160, 240], [180, 180], [230, 148], [262, 105]],
  roo: [[570, 30], [660, 28], [750, 38], [840, 55], [856, 95], [852, 150], [800, 168], [720, 165],
        [650, 155], [590, 148], [568, 110]],
  ged: [[255, 178], [330, 178], [400, 172], [435, 185], [440, 250], [438, 300], [430, 345],
        [370, 358], [310, 362], [272, 350], [250, 305], [238, 252], [228, 208]],
  mon: [[438, 186], [490, 172], [560, 168], [620, 175], [652, 200], [658, 250], [650, 300],
        [640, 340], [600, 356], [540, 352], [490, 340], [450, 320], [438, 270]],
  hig: [[662, 198], [730, 205], [800, 215], [855, 230], [885, 270], [890, 310], [862, 360],
        [800, 400], [750, 425], [700, 428], [668, 400], [655, 350], [652, 280], [655, 230]],
  nin: [[196, 300], [252, 307], [280, 350], [312, 398], [316, 445], [296, 500], [262, 545],
        [222, 548], [188, 515], [163, 462], [152, 400], [156, 345], [170, 312]],
  gut: [[395, 400], [450, 395], [520, 398], [600, 402], [665, 408], [700, 428], [710, 470],
        [700, 510], [660, 532], [580, 538], [500, 535], [430, 530], [392, 505], [380, 455]],
  ril: [[350, 545], [420, 532], [500, 537], [580, 540], [660, 535], [710, 545], [750, 570],
        [748, 610], [710, 650], [640, 672], [560, 678], [480, 670], [410, 640], [362, 600], [342, 570]],
};

export const polyPoints = (pts) => pts.map(([x, y]) => `${x},${y}`).join(" ");
