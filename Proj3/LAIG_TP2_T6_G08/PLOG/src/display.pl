% Avaliação Intercalar PLOG
% Game: Xero-G
% by Afonso Mendonça & Filipe Nogueira
% example of possible board at mid game
midBoard([
    [-1 , -1 , -1 , -1 , -1 , -1 ],
    [ 0 ,  2 ,  1 ,  3 ,  1 ,  0 ],
    [ 3 ,  0 ,  3 ,  0 ,  0 ,  0 ],
    [ 0 ,  0 ,  0 ,  0 ,  0 ,  2 ],
    [ 0 ,  0 ,  2 ,  0 ,  0 ,  0 ],
    [ 0 ,  0 ,  0 ,  1 ,  0 ,  0 ],
    [ 0 ,  3 ,  0 ,  2 ,  3 ,  1 ],
    [-2 , -2 , -2 , -2 , -2 , -2 ] 
    ]).

% example of possible board at end game (player B win    )
endBoard([
    [-1 , -1 ,  2 ,  3 , -1 , -1 ],
    [ 0 ,  0 ,  1 ,  0 ,  0 ,  2 ],
    [ 3 ,  0 ,  0 ,  3 ,  1 ,  0 ],
    [ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
    [ 1 ,  0 ,  3 ,  0 ,  0 ,  1 ],
    [ 0 ,  2 ,  0 ,  0 ,  0 ,  0 ],
    [ 0 ,  0 ,  0 ,  0 ,  2 ,  0 ],
    [-2 , -2 , -2 , -2 , -2,  -2 ]
    ]).

display_startBoard:-
    startBoard(B),
    display_game(B, -1).

display_midBoard:-
    midBoard(B),
    display_game(B, -2).

display_endBoard:-
    endBoard(B),
    display_game(B, -1).


/* -------- STARTS HERE -------- */



/*
* Main funtion to display the board game.
* @param B, P
*/
display_game(B, P):-
    P =:= 1,
    nl,
    write('---------------------------------------------'),
    nl,
    nl,
    write('      0     1     2     3     4     5 \n'),
    write('   +-----+-----+-----+-----+-----+-----+'),
    member(X, [6, 5, 4, 3, 2, 1]),
    home_row_check(X, B, P),
    display_matrix(B, 0, X).

display_game(B, P):-
    nl,
    write('---------------------------------------------'),
    nl,
    nl,
    write('      0     1     2     3     4     5 \n'),
    write('   +-----+-----+-----+-----+-----+-----+'),
    member(X, [1,2,3,4,5,6]),
    home_row_check(X, B, P),
    display_matrix(B, 0, X).

/*
* Displays player's turn.
* @param P
*/
display_player(P):-
    P =:= 2,
    write('Player 2').

display_player(P):- 
    write('Player 1').

/*
* 
* @param [H|T], Nrow
*/
display_matrix([], _, _).
display_matrix([H|T], Nrow, Homerow):-
    Homerow=:=Nrow,
    write('\n '),
    write(Nrow),
    write(' | '),
    Nrow1 is Nrow+1,
    display_row(H, Nrow1),
    write(' <-- This is your home-row'),
    nl,
    write('   +-----+-----+-----+-----+-----+-----+'),
    display_matrix(T, Nrow1, Homerow).

display_matrix([H|T], Nrow, Homerow):-
    write('\n '),
    write(Nrow),
    write(' | '),
    Nrow1 is Nrow+1,
    display_row(H, Nrow1),
    nl,
    write('   +-----+-----+-----+-----+-----+-----+'),
    display_matrix(T, Nrow1, Homerow).

/*
* Displays the cell values of each row.
* @param [H|T], Nrow
*/
display_row([], Nrow).
display_row([H|T], Nrow):-
    display_cell(H),
    write(' | '),
    display_row(T, Nrow).

/*
* Displays the cell value.
* @param 'value'
*/
display_cell(-1):- write(' A ').
display_cell(-2):- write(' B ').
display_cell(0):- write('   ').
display_cell(1):- write(' o ').
display_cell(2):- write('-o-').
display_cell(3):- write('|0|').

write_turn(1):-
    nl,
    nl,
    write( '---> TURN: '),
    write('A'),
    nl,
    nl.

write_turn(2):-
    nl,
    nl,
    write( '---> TURN: '),
    write('B'),
    nl,
    nl.

display_piece_possible_destinations(MoveList):-
    nl,
    write(' - Possible destinations: '),
    %nl, 
    write(MoveList),
    nl.

/*
* Displays number of moves allowed for the piece.
* @param X, Y, Board
*/
display_number_of_moves_allowed(X, Y, Board):-
    get_cell(X, Y, Board, CellValue),
    nl,
    write(' - Number of moves allowed: '),
    write(CellValue).

display_destination_coords_instructions(1):-
    nl,
    write(' > Possible moves - 1:Up, 2: Down, 3: Left, 4: Right'),
    nl,
    write(' > Select your move: '),
    nl.

display_increment_move(Chain_move, X1, Y1, X2, Y2, Board, Player):-
    Chain_move =:= 0,
    get_cell(X1, Y1, Board, C1),
    change_cell(X1, Y1, Board, AuxBoard, 0),
    change_cell(X2, Y2, AuxBoard, AuxBoard2, C1),
    display_game(AuxBoard2, Player).

display_increment_move(Chain_move, X1, Y1, X2, Y2, Board, Player):-
    Chain_move =:= 1,
    get_cell(X1, Y1, Board, C1),
    change_cell(X1, Y1, Board, AuxBoard, C1),
    change_cell(X2, Y2, AuxBoard, AuxBoard2, C1),
    display_game(AuxBoard2, Player).  

