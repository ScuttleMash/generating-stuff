// Wildcards
const ANY = new PatternItem(new Colour(-1, -1, -1), 1);

// Colours
const BLACK = new PatternItem(new Colour(0, 0, 0));
const WHITE = new PatternItem(new Colour(255, 255, 255));
const RED = new PatternItem(new Colour(255, 0, 0));
const GREEN = new PatternItem(new Colour(0, 255, 0));
const BLUE = new PatternItem(new Colour(0, 0, 255));

// Flora
const LEAVES = new PatternItem(new Colour(0, 100, 0));
const RED_LEAVES = new PatternItem(new Colour(200, 200, 0));
const TREE_TRUNK = new PatternItem(new Colour(88, 57, 39));
const GRASS = new PatternItem(new Colour(126, 200, 80));

// --------------
// --- FOREST ---
// --------------
const BLACK_CELL = new Pattern([BLACK], new Dimensions(1, 1));
const GRASS_CELL = new Pattern([GRASS], new Dimensions(1, 1));

const TREE_SPAWN = new Pattern([
    ANY, ANY, ANY,
    BLACK, BLACK, BLACK,
    BLACK, BLACK, BLACK,
], new Dimensions(3, 3));

const TREE_SPAWNED = new Pattern([
    ANY, LEAVES, ANY,
    LEAVES, LEAVES, LEAVES,
    GRASS, TREE_TRUNK, GRASS,
], new Dimensions(3, 3));

const TREE_GROW_2 = new Pattern([
    ANY, BLACK, ANY,
    ANY, LEAVES, ANY,
    LEAVES, LEAVES, LEAVES,
    ANY, TREE_TRUNK, ANY,
], new Dimensions(3, 4));

const TREE_GROWN_2 = new Pattern([
    ANY, LEAVES, ANY,
    LEAVES, LEAVES, LEAVES,
    LEAVES, TREE_TRUNK, LEAVES,
    ANY, TREE_TRUNK, ANY,
], new Dimensions(3, 4));

const TREE_GROW_3 = new Pattern([
    ANY, ANY, ANY, ANY, ANY, 
    ANY, GRASS, LEAVES, GRASS, ANY, 
    ANY, LEAVES, LEAVES, LEAVES, ANY, 
    ANY, LEAVES, TREE_TRUNK, LEAVES, ANY, 
    ANY, GRASS, TREE_TRUNK, GRASS, ANY, 
], new Dimensions(5, 5));

const TREE_GROWN_3 = new Pattern([
    ANY, RED_LEAVES, RED_LEAVES, RED_LEAVES, ANY, 
    RED_LEAVES, RED_LEAVES, RED_LEAVES, RED_LEAVES, RED_LEAVES, 
    RED_LEAVES, RED_LEAVES, RED_LEAVES, RED_LEAVES, RED_LEAVES, 
    ANY, RED_LEAVES, TREE_TRUNK, RED_LEAVES, ANY, 
    ANY, ANY, TREE_TRUNK, ANY, ANY, 
], new Dimensions(5, 5));

const forest = 
    new RoundRobinRuleGroup([
        new PatternRule(1, new Predicate(TREE_SPAWN), new PatternAction(TREE_SPAWNED)),
        new PatternRule(2, new Predicate(TREE_GROW_2), new PatternAction(TREE_GROWN_2)),
        new PatternRule(3, new Predicate(TREE_GROW_3), new PatternAction(TREE_GROWN_3)),
        new PatternRule(4, new Predicate(BLACK_CELL), new PatternAction(GRASS_CELL)),
    ]);

// ----------------
// ----- MAZE -----
// ----------------
const MAZE_STARTER = new PatternRule(1, 1, new Predicate(new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([RED], new Dimensions(1, 1))));
const WALL_BUILDER = new PatternRule(2, -1, new Predicate(new Pattern([RED, BLACK, BLACK], new Dimensions(3, 1))), new PatternAction(new Pattern([WHITE, WHITE, RED], new Dimensions(3, 1))));
const MAZE_SOLVER = new PatternRule(3, -1, new Predicate(new Pattern([RED, WHITE, WHITE], new Dimensions(3, 1))), new PatternAction(new Pattern([GREEN, GREEN, RED], new Dimensions(3, 1))));

const maze = 
    new SequentialRuleGroup([
        MAZE_STARTER,
        WALL_BUILDER,
        MAZE_SOLVER,
    ]);


// ----------------
// ---- BLOCKS ----
// ----------------
const BLOCK = new PatternRule(1, 5, new Predicate(new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([RED], new Dimensions(1, 1))));

const blocks = 
    new SequentialRuleGroup([
        BLOCK,
    ]);

// ---------------------------------------
// --- Pick: forest, maze, blocks, ... ---
// ---------------------------------------

const simulation = new Simulation();
simulation.start(maze);
