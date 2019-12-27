board_setup(B, P):-
    startBoard(B),
    P is 1.

/*
* Reads coords of chosen piece.
* @param X1, Y1
*/
get_piece_coords(X1, Y1, Board, P):-
    nl,
    write(' > Select your ship [ X. ; Y. ]:'),
    nl,
    %write(' > X: \n'),
    user_input(X1, 0, 7),
    %nl,
    %write(' > Y: \n'),
    user_input(Y1, 0, 5),
    /* Verifies if the piece belong to the home row. */
    get_cell(X1, Y1, Board, C1),
    cell_with_ship(C1),
    home_row_check(X1, Board, P).

get_piece_coords(X1, Y1, Board, P):-
    write(' !!! Invalid cell. Try again:'),
    nl,
    nl,
    get_piece_coords(X1, Y1, Board, P).
    

/*
* Get funtion to list containing all possible destinations with the current piece.
* @param X, Y, P, B, MoveList
*/
get_piece_possible_destinations(X, Y, P, B, MoveList):-
    findall([X_dest, Y_dest], valid_move(X, Y, X_dest, Y_dest, P, B), MoveList).


/* ----------------------------------------------------------------- */
/*
* Reads coords of chosen destination. 
* @param X2, Y2
*/

/* CellValue = 1 */
get_destination_coords(Chain_move, X1, Y1, X2, Y2, Board, Player, CellValue, BackTrackingList, BackTrackingList_new):-
    CellValue =:= 1,
    display_destination_coords_instructions(1),
    /* Iteration 1 */
    user_input(Move1, 1, 4),
    increment_move(X3, Y3, Move1),
    X2 is X1+X3,
    Y2 is Y1+Y3,
    validate_increment_move(X2, Y2),
    validate_BackTracking_list(BackTrackingList, X1, Y1, X2, Y2),
    append(BackTrackingList, [[X1, Y1, X2, Y2]], BackTrackingList_new).
    
/* CellValue = 2 */
get_destination_coords(Chain_move, X1, Y1, X2, Y2, Board, Player, CellValue, BackTrackingList, BackTrackingList_new):-
    CellValue =:= 2,
    display_destination_coords_instructions(1),
    /* Iteration 1 */
    user_input(Move1, 1, 4),
    increment_move(X3, Y3, Move1),
    X4 is X1+X3,
    Y4 is Y1+Y3,
    validate_increment_move(X4, Y4),
    get_cell(X4, Y4, Board, C4),
    C4 =< 0,
    validate_BackTracking_list(BackTrackingList, X1, Y1, X4, Y4),
    append(BackTrackingList, [[X1, Y1, X4, Y4]], BackTrackingList_aux1),
    display_increment_move(Chain_move, X1, Y1, X4, Y4, Board, Player),
    /* Iteration 2 */
    nl, nl, write(' > Moves left: 1. Select your move: '), nl,
    user_input(Move2, 1, 4),
    increment_move(X5, Y5, Move2),
    X2 is X4+X5,
    Y2 is Y4+Y5,
    validate_increment_move(X2, Y2),
    validate_BackTracking_list(BackTrackingList, X4, Y4, X2, Y2),
    append(BackTrackingList_aux1, [[X4, Y4, X2, Y2]], BackTrackingList_new).

/* CellValue = 3 */
get_destination_coords(Chain_move, X1, Y1, X2, Y2, Board, Player, CellValue, BackTrackingList, BackTrackingList_new):-
    CellValue =:= 3,
    display_destination_coords_instructions(1),
    /* Iteration 1 */
    user_input(Move1, 1, 4),
    increment_move(X3, Y3, Move1),
    X4 is X1+X3,
    Y4 is Y1+Y3,
    validate_increment_move(X4, Y4),
    get_cell(X4, Y4, Board, C1),
    C1 =< 0,
    validate_BackTracking_list(BackTrackingList, X1, Y1, X4, Y4),
    append(BackTrackingList, [[X1, Y1, X4, Y4]], BackTrackingList_aux1),
    display_increment_move(Chain_move, X1, Y1, X4, Y4, Board, Player),
    /* Iteration 2 */
    nl, nl, write(' > Moves left: 2. Select your move: '), nl,
    user_input(Move2, 1, 4),
    increment_move(X5, Y5, Move2),
    X6 is X4+X5,
    Y6 is Y4+Y5,
    validate_increment_move(X6, Y6),
    get_cell(X6, Y6, Board, C2),
    C2 =< 0,
    validate_BackTracking_list(BackTrackingList, X4, Y4, X6, Y6),
    append(BackTrackingList_aux1, [[X4, Y4, X6, Y6]], BackTrackingList_aux2),
    display_increment_move(Chain_move, X1, Y1, X6, Y6, Board, Player),
    /* Iteration 3 */
    nl, nl, write(' > Moves left: 1. Select your move: '), nl,
    user_input(Move3, 1, 4),
    increment_move(X7, Y7, Move3),
    X2 is X6+X7,
    Y2 is Y6+Y7,
    validate_increment_move(X2, Y2),
    validate_BackTracking_list(BackTrackingList, X6, Y6, X2, Y2),
    append(BackTrackingList_aux2, [[X6, Y6, X2, Y2]], BackTrackingList_new).

get_destination_coords(X2, Y2):-
    nl,
    write(' > Select your destination [ X. ; Y.]:'),
    nl,
    %write(' > X: \n'),
    user_input(X2, 0, 7),
    %nl,
    %write(' > Y: \n'),
    user_input(Y2, 0, 5).

/* UP */
increment_move(X, Y, Move):-
    Move =:= 1,
    X is 0-1,
    Y is 0.
/* DOWN */
increment_move(X, Y, Move):-
    Move =:= 2,
    X is 0+1,
    Y is 0.
/* LEFT */
increment_move(X, Y, Move):-
    Move =:= 3,
    X is 0,
    Y is 0-1.
/* RIGHT */
increment_move(X, Y, Move):-
    Move =:= 4,
    X is 0,
    Y is 0+1.

validate_increment_move(X, Y):-
    X >= 0, X =< 7,
    Y >= 0, Y =< 5.

validate_BackTracking_list(BackTrackingList, X1, Y1, X2, Y2):-
    length(BackTrackingList, Length),
    Length =:= 0.
    
validate_BackTracking_list(BackTrackingList, X1, Y1, X2, Y2):-
    not(member([X1, Y1, X2, Y2], BackTrackingList)),
    not(member([X2, Y2, X1, Y1], BackTrackingList)).

/* ----------------------------------------------------------------- */

/*
* Get funtion for chain move choise.
* @param Choise
*/
get_chain_move(Choise):-
    nl,
    write(' > Select your desired chain action:'),
    nl,  
    write('   - 1: Re-program coordinates'),
    nl, 
    write('   - 2: Rocket Boost'),
    nl, 
    user_input(Choise, 1, 2).

get_chain_move_coords(X3, Y3):-
    nl,
    write(' > Chain action destination [ X. ; Y. ]:'),
    nl,
    user_input(X3, 0, 7),
    user_input(Y3, 0, 5).

/*
* Parses the value in the current board to 'CellValue'
* @param X, Y, Board, CellValue
*/
get_cell(X, Y, Board, CellValue):-
    nth0(X, Board, AuxRow),
    nth0(Y, AuxRow, CellValue).

/*
* Verifies if the coords chosen contains a valid piece.
* @param C
*/
cell_with_ship(C):-
    C>0.
/*
* Verifies if the coords chosen for the destination represents a empty cell.
* @param C
*/
empty_cell(C):-
    C=:=0.

/*
*
*/
replace(0, NewC, [_|T], [NewC|T]).
replace(Y, NewC, [H|T], [H|R]):- 
    Y1 is Y-1, 
    replace(Y1, NewC, T, R).

/*
* Get funtion to the base rows of the board.
* @param B, BRow
*/
get_B_base_row(B, BRow):-
    nth0(7, B, BRow).

get_A_base_row(B, BRow):-
    nth0(0, B, BRow).


/*
*
*/
change_cell(X, Y, Board, NewBoard, CellValue):-
    get_to_row(X, Y, CellValue, Board, NewBoard).


/*
* Get funtions for the board rows excluding the base rows.
* @param X, Y, NewC, [H|T], [H1|R]
*/
get_to_row(X, Y, NewC, [H|T], [H1|R]):-  
    X is 0,
    replace(Y, NewC, H, H1),
    T = R.

get_to_row(X, Y, NewC, [H|T], [H|R]):-  
    X1 is X-1, 
    get_to_row(X1, Y, NewC, T, R).