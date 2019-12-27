menu:-
    display_menu,
    write(' > Choose your option: '),
    nl,
    user_input(Option, 1, 4),
    process_menu_input(Option).

process_menu_input(1):-
    start_game(1).

process_menu_input(2):-
    start_game(2).

process_menu_input(3):-
    start_game(3).

process_menu_input(4).

start_game(Option):-
    Option =:= 1,
    board_setup(B, P),
    game_loop(B, P).

start_game(Option):-
    Option =:= 2,
    board_setup(B, P),
    game_loop(B, P, 1).

start_game(Option):-
    Option =:= 3,
    board_setup(B, P),
    game_loop(B, P, 2).

display_menu:-
    nl,nl,
    write(' _______________________________________________________________________ '),nl,
    write('|                                                                       |'),nl,
    write('|                                                                       |'),nl,
    write('|        ##     ## ######## ########   #######           ######         |'),nl,
    write('|         ##   ##  ##       ##     ## ##     ##         ##    ##        |'),nl,
    write('|          ## ##   ##       ##     ## ##     ##         ##              |'),nl,
    write('|           ###    ######   ########  ##     ## ####### ##   ####       |'),nl,
    write('|         ##   ##  ##       ##    ##  ##     ##         ##    ##        |'),nl,
    write('|        ##     ## ######## ##     ##  #######           ######         |'),nl,
    write('|                                                                       |'),nl,
    write('|       /\\                                                              |'),nl,
    write('|      |==|                1. Player vs Player                          |'),nl,
    write('|     /____\\                                                            |'),nl,
    write('|     |    |               2. Player vs CPU                             |'),nl,
    write('|     |    |                                                            |'),nl,
	write('|    /| |  |\\              3. CPU vs CPU                                |'),nl,
    write('|   / | |  | \\                                                          |'),nl,
    write('|  /__|_|__|__\\            4. Exit                                      |'),nl,
    write('|     /_\\/_\\                                                            |'),nl,
    write('|     ######                                                            |'),nl,
    write('|____########___________________________________________________________|'),nl,nl,nl.       


game_over_menu(P):-
    display_gameover_screen(P),
    write(' > Choose your option: '),
    nl,
    user_input(Option, 1, 2),
    process_gameover_input(Option).

process_gameover_input(1):-
    play.

process_gameover_input(2).

display_gameover_screen(1):-
    nl,nl,
    write(' _______________________________________________________________________ '),nl,
    write('|                                                                       |'),nl,
    write('|          ____                         ___                 _           |'),nl,
    write('|         / ___| __ _ _ __ ___   ___   / _ \\__   _____ _ __| |          |'),nl,
    write('|        | |  _ / _` | \'_ ` _ \\ / _ \\ | | | \\ \\ / / _ \\ \'__| |          |'),nl,
    write('|        | |_| | (_| | | | | | |  __/ | |_| |\\ V /  __/ |  |_|          |'),nl,
    write('|         \\____|\\__,_|_| |_| |_|\\___|  \\___/  \\_/ \\___|_|  (_)          |'),nl,
    write('|                                                                       |'),nl,
    write('|                      -----> PLAYER A WON <------                      |'),nl,
    write('|                                                                       |'),nl,
    write('|       /\\                                                              |'),nl,
    write('|      |==|                1. Play Again                                |'),nl,
    write('|     /____\\                                                            |'),nl,
    write('|     |    |               2. Exit                                      |'),nl,
    write('|     |    |                                                            |'),nl,
    write('|    /| |  |\\                                                           |'),nl,
    write('|   / | |  | \\                                                          |'),nl,
    write('|  /__|_|__|__\\                                                         |'),nl,
    write('|     /_\\/_\\                                                            |'),nl,
    write('|     ######                                                            |'),nl,
    write('|____########___________________________________________________________|'),nl,nl,nl.

display_gameover_screen(2):-
    nl,nl,
    write(' _______________________________________________________________________ '),nl,
    write('|                                                                       |'),nl,
    write('|          ____                         ___                 _           |'),nl,
    write('|         / ___| __ _ _ __ ___   ___   / _ \\__   _____ _ __| |          |'),nl,
    write('|        | |  _ / _` | \'_ ` _ \\ / _ \\ | | | \\ \\ / / _ \\ \'__| |          |'),nl,
    write('|        | |_| | (_| | | | | | |  __/ | |_| |\\ V /  __/ |  |_|          |'),nl,
    write('|         \\____|\\__,_|_| |_| |_|\\___|  \\___/  \\_/ \\___|_|  (_)          |'),nl,
    write('|                                                                       |'),nl,
    write('|                      -----> PLAYER B WON <------                      |'),nl,
    write('|                                                                       |'),nl,
    write('|       /\\                                                              |'),nl,
    write('|      |==|                1. Play Again                                |'),nl,
    write('|     /____\\                                                            |'),nl,
    write('|     |    |               2. Exit                                      |'),nl,
    write('|     |    |                                                            |'),nl,
    write('|    /| |  |\\                                                           |'),nl,
    write('|   / | |  | \\                                                          |'),nl,
    write('|  /__|_|__|__\\                                                         |'),nl,
    write('|     /_\\/_\\                                                            |'),nl,
    write('|     ######                                                            |'),nl,
    write('|____########___________________________________________________________|'),nl,nl,nl.









                                                    


