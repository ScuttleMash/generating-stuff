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
const MAZE_STARTER = new PatternRule(1, 1, new Predicate(new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([RED], new Dimensions(1, 1))));
const WALL_BUILDER = new PatternRule(2, -1, new Predicate(new Pattern([RED, BLACK, BLACK], new Dimensions(3, 1))), new PatternAction(new Pattern([WHITE, WHITE, RED], new Dimensions(3, 1))));
const MAZE_SOLVER = new PatternRule(3, -1, new Predicate(new Pattern([RED, WHITE, WHITE], new Dimensions(3, 1))), new PatternAction(new Pattern([GREEN, GREEN, RED], new Dimensions(3, 1))));

const maze = 
    new SequentialRuleGroup([
        MAZE_STARTER,
        WALL_BUILDER,
        MAZE_SOLVER,
    ]);

// ---------------
// ----- Art -----
// ---------------
const ART_STARTER = new PatternRule(1, 1, new Predicate(new Pattern([BLACK], new Dimensions(1, 1))), new PatternAction(new Pattern([RED], new Dimensions(1, 1))));
const GRID_BUILDER = new PatternRule(2, -1, new Predicate(new Pattern([RED, BLACK, BLACK], new Dimensions(3, 1))), new PatternAction(new Pattern([RED, BLACK, RED], new Dimensions(3, 1))));
const ART_PATTERN_1 = new PatternRule(3, -1, new Predicate(new Pattern([RED, BLACK, RED, BLACK, BLACK, BLACK, RED, BLACK, RED], new Dimensions(3, 3))), new PatternAction(new Pattern([GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN], new Dimensions(3, 3))));
const ART_PATTERN_2 = new PatternRule(4, -1, new Predicate(new Pattern([RED, BLACK, RED, BLACK, RED, BLACK, BLACK, BLACK, BLACK, BLACK, RED, BLACK, RED, BLACK, RED], new Dimensions(5, 3))), new PatternAction(new Pattern([BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE], new Dimensions(5, 3))));
const ART_PATTERN_3 = new PatternRule(5, -1, new Predicate(new Pattern([RED, BLACK, RED, BLACK, BLACK, BLACK, RED, BLACK, RED, BLACK, BLACK, BLACK, RED, BLACK, RED], new Dimensions(3, 5))), new PatternAction(new Pattern([YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW, YELLOW], new Dimensions(3, 5))));
const ART_PATTERN_4 = new PatternRule(6, -1, new Predicate(new Pattern([RED, BLACK, RED, BLACK, RED, BLACK, BLACK, BLACK, BLACK, BLACK, RED, BLACK, RED, BLACK, RED, BLACK, BLACK, BLACK, BLACK, BLACK, RED, BLACK, RED, BLACK, RED], new Dimensions(5, 5))), new PatternAction(new Pattern([WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE], new Dimensions(5, 5))));

const art =
    new SequentialRuleGroup([
        ART_STARTER,
        GRID_BUILDER,
        new RoundRobinRuleGroup([
            ART_PATTERN_1,
            ART_PATTERN_2,
            ART_PATTERN_3,
            ART_PATTERN_4,
        ])
    ]);

// ---------------------------------------
// ---------------------------------------

const simulation = new Simulation();
simulation.start(maze);
