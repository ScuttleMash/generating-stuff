// Wildcard
const ANY = new WildcardItem();

// Colours
const BLACK = new PatternItem(new Colour(0, 0, 0));
const GRAY = new PatternItem(new Colour(50, 50, 50));
const WHITE = new PatternItem(new Colour(255, 255, 255));
const RED = new PatternItem(new Colour(255, 0, 0));
const GREEN = new PatternItem(new Colour(0, 255, 0));
const BLUE = new PatternItem(new Colour(0, 0, 255));
const YELLOW = new PatternItem(new Colour(0, 255, 255));

// ----------------
// ----- MAZE -----
// ----------------
const MAZE_START = new LimitedRule(1, new FixedLocationPredicate(new GridLocation(1, 1), new SingleCellPattern(BLACK)), new Action(new SingleCellPattern(RED)));
const MAZE_BUILD_WALL = new Rule(new Predicate(new LinePattern([RED, BLACK, BLACK])), new Action(new LinePattern([WHITE, WHITE, RED])));
const MAZE_TRACK_BACK = new Rule(new Predicate(new LinePattern([RED, WHITE, WHITE])), new Action(new LinePattern([GREEN, GREEN, RED])));

const maze = 
    new SequentialRuleGroup([
        MAZE_START,
        MAZE_BUILD_WALL,
        MAZE_TRACK_BACK,
    ]);

// ---------------
// ----- Art -----
// ---------------
const ART_START = new LimitedRule(1, new FixedLocationPredicate(new GridLocation(1, 1), new SingleCellPattern(BLACK)), new Action(new SingleCellPattern(RED)));
const ART_BUILD_GRID = new Rule(new Predicate(new LinePattern([RED, BLACK, BLACK])), new Action(new LinePattern([RED, BLACK, RED])));
const ART_PATTERN_1 = new Rule(new Predicate(new Pattern([RED, BLACK, RED, 
                                                          BLACK, BLACK, BLACK, 
                                                          RED, BLACK, RED], new Dimensions(3, 3))), 
                               new Action(new ColourBlockPattern(GREEN, new Dimensions(3, 3))));
const ART_PATTERN_2 = new Rule(new Predicate(new Pattern([RED, BLACK, RED, BLACK, RED, 
                                                          BLACK, BLACK, BLACK, BLACK, BLACK, 
                                                          RED, BLACK, RED, BLACK, RED], new Dimensions(5, 3))), 
                               new Action(new ColourBlockPattern(BLUE, new Dimensions(5, 3))));
const ART_PATTERN_3 = new Rule(new Predicate(new Pattern([RED, BLACK, RED, 
                                                          BLACK, BLACK, BLACK, 
                                                          RED, BLACK, RED, 
                                                          BLACK, BLACK, BLACK, 
                                                          RED, BLACK, RED], new Dimensions(3, 5))), 
                               new Action(new ColourBlockPattern(YELLOW, new Dimensions(3, 5))));
const ART_PATTERN_4 = new Rule(new Predicate(new Pattern([RED, BLACK, RED, BLACK, RED, 
                                                          BLACK, BLACK, BLACK, BLACK, BLACK, 
                                                          RED, BLACK, RED, BLACK, RED, 
                                                          BLACK, BLACK, BLACK, BLACK, BLACK, 
                                                          RED, BLACK, RED, BLACK, RED], new Dimensions(5, 5))), 
                               new Action(new ColourBlockPattern(WHITE, new Dimensions(5, 5))));

const art =
    new SequentialRuleGroup([
        ART_START,
        ART_BUILD_GRID,
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
const SOKOBAN_START = new LimitedRule(3, new Predicate(new SingleCellPattern(BLACK)), new Action(new SingleCellPattern(RED)));
const SOKOBAN_START_2 = new LimitedRule(400, new Predicate(new SingleCellPattern(BLACK)), new Action(new SingleCellPattern(GREEN)));
const SOKOBAN_PUSH_BLOCK = new Rule(new Predicate(new LinePattern([RED, GREEN, BLACK])), new Action(new LinePattern([BLACK, RED, GREEN])));
const SOKOBAN_MOVE_PUSHER = new Rule(new Predicate(new LinePattern([RED, BLACK])), new Action(new LinePattern([BLACK, RED])));

const sokoban = 
    new SequentialRuleGroup([
        SOKOBAN_START,
        SOKOBAN_START_2,
        SOKOBAN_PUSH_BLOCK,
        SOKOBAN_MOVE_PUSHER,
    ]);


// ------------------
// ----- PACMAN -----
// ------------------
const PACMAN_START = new LimitedRule(1, new FixedLocationPredicate(new GridLocation(1, 1), new SingleCellPattern(BLACK)), new Action(new SingleCellPattern(GRAY)));
const PACMAN_CREATE_GRID = new Rule(new Predicate(new LinePattern([GRAY, BLACK, BLACK])), new Action(new LinePattern([GRAY, BLACK, GRAY])));
const PACMAN_SPAWN_PACMAN = new LimitedRule(1, new FixedLocationPredicate(new GridLocation(1, 1), new SingleCellPattern(BLACK)), new Action(new SingleCellPattern(YELLOW)));
const PACMAN_SPAWN_GHOST = new LimitedRule(3, new Predicate(new SingleCellPattern(BLACK)), new Action(new SingleCellPattern(RED)));
const PACMAN_ADD_DOTS = new LimitedRule(10, new Predicate(new SingleCellPattern(BLACK)), new Action(new SingleCellPattern(WHITE)));
// const PACMAN_CHECK_VICTORY = 
const PACMAN_CHECK_DEATH = new Rule(new Predicate(new LinePattern([YELLOW, RED])), new Action(new LinePattern([RED, BLACK])));
const PACMAN_CONSUME_DOT = new Rule(new Predicate(new LinePattern([YELLOW, WHITE])), new Action(new LinePattern([BLACK, YELLOW])));
const PACMAN_MOVE_PACMAN = new Rule(new Predicate(new LinePattern([YELLOW, BLACK])), new Action(new LinePattern([BLACK, YELLOW])));
const PACMAN_MOVE_GHOST = new Rule(new Predicate(new LinePattern([RED, BLACK])), new Action(new LinePattern([BLACK, RED])));

const pacman = 
    new SequentialRuleGroup([
        PACMAN_START,
        PACMAN_CREATE_GRID,
        PACMAN_SPAWN_PACMAN,
        PACMAN_SPAWN_GHOST,
        PACMAN_ADD_DOTS,
        PACMAN_CHECK_DEATH,
        PACMAN_CONSUME_DOT,
        new RoundRobinRuleGroup([
            PACMAN_MOVE_PACMAN,
            PACMAN_MOVE_GHOST
        ])
    ]);

// ---------------------------------------
// ---------------------------------------
// console.profile();
const simulation = new Simulation();
// simulation.start(maze);
// simulation.start(art);
// simulation.start(sokoban);
simulation.start(pacman);
// setTimeout(() => {
    // console.profileEnd();
// }, 20000);
