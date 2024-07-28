// Wildcard
const ANY = new WildcardItem();

// Colours
const BLACK = new PatternItem(new Colour(0, 0, 0));
const WHITE = new PatternItem(new Colour(255, 255, 255));
const RED = new PatternItem(new Colour(255, 0, 0));
const GREEN = new PatternItem(new Colour(0, 255, 0));
const BLUE = new PatternItem(new Colour(0, 0, 255));
const YELLOW = new PatternItem(new Colour(0, 255, 255));

// ----------------
// ----- MAZE -----
// ----------------
const MAZE_START = new PatternRule(1, 1, new LocationPredicate(new GridLocation(3, 1), new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([RED], new Dimensions(1, 1))), "MAZE_START");
const WALL_BUILDER = new PatternRule(2, -1, new Predicate(new Pattern([RED, BLACK, BLACK], new Dimensions(3, 1))), new PatternAction(new Pattern([WHITE, WHITE, RED], new Dimensions(3, 1))), "WALL_BUILDER");
const MAZE_SOLVER = new PatternRule(3, -1, new Predicate(new Pattern([RED, WHITE, WHITE], new Dimensions(3, 1))), new PatternAction(new Pattern([GREEN, GREEN, RED], new Dimensions(3, 1))), "MAZE_SOLVER");

const maze = 
    new SequentialRuleGroup([
        MAZE_START,
        WALL_BUILDER,
        MAZE_SOLVER,
    ]);

// ---------------
// ----- Art -----
// ---------------
const ART_START = new PatternRule(1, 1, new LocationPredicate(new GridLocation(1, 1), new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([RED], new Dimensions(1, 1))), "ART_START");
const GRID_BUILDER = new PatternRule(2, -1, new Predicate(new Pattern([RED, BLACK, BLACK], new Dimensions(3, 1))), new PatternAction(new Pattern([RED, BLACK, RED], new Dimensions(3, 1))), "GRID_BUILDER");
const ART_PATTERN_1 = new PatternRule(3, -1, new Predicate(new Pattern([RED, BLACK, RED, BLACK, BLACK, BLACK, RED, BLACK, RED], new Dimensions(3, 3))), new PatternAction(new Pattern([GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN], new Dimensions(3, 3))), "ART_PATTERN_1");
const ART_PATTERN_2 = new PatternRule(4, -1, new Predicate(new Pattern([RED, BLACK, RED, BLACK, RED, BLACK, BLACK, BLACK, BLACK, BLACK, RED, BLACK, RED, BLACK, RED], new Dimensions(5, 3))), new PatternAction(new Pattern([BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE], new Dimensions(5, 3))), "ART_PATTERN_2");
const ART_PATTERN_3 = new PatternRule(5, -1, new Predicate(new Pattern([RED, BLACK, RED, BLACK, BLACK, BLACK, RED, BLACK, RED, BLACK, BLACK, BLACK, RED, BLACK, RED], new Dimensions(3, 5))), new PatternAction(new Pattern([YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW], new Dimensions(3, 5))), "ART_PATTERN_3");
const ART_PATTERN_4 = new PatternRule(6, -1, new Predicate(new Pattern([RED, BLACK, RED, BLACK, RED, BLACK, BLACK, BLACK, BLACK, BLACK, RED, BLACK, RED, BLACK, RED, BLACK, BLACK, BLACK, BLACK, BLACK, RED, BLACK, RED, BLACK, RED], new Dimensions(5, 5))), new PatternAction(new Pattern([WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE], new Dimensions(5, 5))), "ART_PATTERN_4");

const art =
    new SequentialRuleGroup([
        ART_START,
        GRID_BUILDER,
        new RoundRobinRuleGroup([
            ART_PATTERN_1,
            ART_PATTERN_2,
            ART_PATTERN_3,
            ART_PATTERN_4,
        ])
    ]);

// -------------------
// ----- SOKOBAN -----
// -------------------
const SOKOBAN_START = new PatternRule(1, 3, new Predicate(new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([RED], new Dimensions(1, 1))), "SOKOBAN_START");
const STARTING_BLOCKS = new PatternRule(2, 200, new Predicate(new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([GREEN], new Dimensions(1, 1))), "STARTING_BLOCKS");
const BLOCK_PUSH = new PatternRule(3, -1, new Predicate(new Pattern([RED, GREEN, BLACK], new Dimensions(3, 1))), new PatternAction(new Pattern([BLACK, RED, GREEN], new Dimensions(3, 1))), "BLOCK_PUSH");
const BLANK_MOVE = new PatternRule(3, -1, new Predicate(new Pattern([RED, BLACK], new Dimensions(2, 1))), new PatternAction(new Pattern([BLACK, RED], new Dimensions(2, 1))), "BLANK_MOVE");

const sokoban = 
    new SequentialRuleGroup([
        SOKOBAN_START,
        STARTING_BLOCKS,
        BLOCK_PUSH,
        BLANK_MOVE,
    ]);


// ---------------
// ----- MAP -----
// ---------------
const MAP_START = new PatternRule(1, 3, new Predicate(new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([RED], new Dimensions(1, 1))), "SOKOBAN_START");

const map = 
    new SequentialRuleGroup([
        MAP_START,
    ]);

// ---------------------------------------
// ---------------------------------------

const simulation = new Simulation();
// simulation.start(maze);
simulation.start(art);
// simulation.start(sokoban);
// simulation.start(map);