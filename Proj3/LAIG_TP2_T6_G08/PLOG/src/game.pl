startBoard([
        [-1 , -1 , -1 , -1 , -1 , -1 ],
        [ 3 ,  2 ,  1 ,  3 ,  1 ,  2 ],
        [ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
        [ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
        [ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
        [ 0 ,  0 ,  0 ,  0 ,  0 ,  0 ],
        [ 1 ,  3 ,  2 ,  2 ,  3 ,  1 ],
        [-2 , -2 , -2 , -2 , -2 , -2 ]
        ]).

game_loop(B, _) :- game_over(B).
game_loop(B, _) :- game_over(B).
game_loop(B, P) :- display_game(B, P), write_turn(P), move(B, B1, P), ( P =:= 1 -> game_loop(B1, 2) ; game_loop(B1, 1) ).

game_over(B) :- end_game_A(B), game_over_menu(1).
game_over(B) :- end_game_B(B), game_over_menu(2).
end_game_A(B) :- get_B_base_row(B, BRow), any_member([1,2,3], BRow).
end_game_B(B) :- get_A_base_row(B, BRow), any_member([1,2,3], BRow).

move(Board, NewBoard, P) :-
    get_piece_coords(X1, Y1, Board, P),
    display_number_of_moves_allowed(X1, Y1, Board),
    get_cell(X1, Y1, Board, C1),
    BackTrackingList = [],
    get_destination_coords(0, X1, Y1, X2, Y2, Board, P, C1, BackTrackingList, BackTrackingList_new),
    get_cell(X2, Y2, Board, C2),
    valid_move(X1, Y1, X2, Y2, C1, C2, P, Board),
    move2(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, BackTrackingList_new).
move(Board, NewBoard, P) :- 
    write('Invalid move!'), 
    display_game(Board, P), 
    move(Board, NewBoard, P).

move2(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, BackTrackingList) :-
    cell_with_ship(C2),
    get_chain_move(Choice),
    chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList).

move2(X1, Y1, X2, Y2, C1, C2, _, Board, NewBoard, _) :-
    change_cell(X1, Y1, Board, AuxBoard, C2),
    change_cell(X2, Y2, AuxBoard, NewBoard, C1).

chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, _) :-
    Choice =:= 1,
    display_number_of_moves_allowed(X1, Y1, Board),
    valid_chain_moves(X1, Y1, X2, Y2, P, Board, DestList, 1),
    display_piece_possible_destinations(DestList),
    get_chain_move_coords(X3, Y3),
    get_cell(X3, Y3, Board, C3),
    valid_chain_move(X1, Y1, X2, Y2, X3, Y3, C1, C2, C3, P, Board, Choice),
    change_cell(X1, Y1, Board, AuxBoard, C3),
    change_cell(X2, Y2, AuxBoard, AuxBoard2, C1),
    change_cell(X3, Y3, AuxBoard2, NewBoard, C2).

chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList) :-
    Choice =:= 2,
    display_number_of_moves_allowed(X2, Y2, Board),
    get_destination_coords(1, X2, Y2, X3, Y3, Board, P, C2, BackTrackingList, _),
    get_cell(X3, Y3, Board, C3),
    valid_chain_move(X1, Y1, X2, Y2, X3, Y3, C1, C2, C3, P, Board, Choice),
    ( not(cell_with_ship(C3)) -> change_cell(X1, Y1, Board, AuxBoard, C3), change_cell(X3, Y3, AuxBoard, NewBoard, C1); move2(X1, Y1, X3, Y3, C1, C3, P, Board, NewBoard, BackTrackingList) ).

chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList) :- chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList).

dest_cell_in_reach(X1, Y1, X2, Y2, C) :- C >= abs(X2-X1) + abs(Y2-Y1).


home_row_check(X, B, 1) :- home_row_check_A(X, B, 1, 1).
home_row_check(X, B, 2) :- home_row_check_B(X, B, 2, 6).

home_row_check_A(X, B, P, I) :- I<X, nth0(I, B, Row), not(any_member([1,2,3], Row)), I1 is I+1, home_row_check_A(X, B, P, I1).
home_row_check_A(X, B, _, I) :- not(I<X), I1 is I-1, nth0(I1, B, Row), not(any_member([1,2,3], Row)).

home_row_check_B(X, B, P, I) :- I>X, nth0(I, B, Row), not(any_member([1,2,3], Row)), I1 is I-1, home_row_check_B(X, B, P, I1).
home_row_check_B(X, B, _, I) :- not(I>X), I1 is I+1, nth0(I1, B, Row), not(any_member([1,2,3], Row)).


valid_move(X1, Y1, X2, Y2, C1, _, P, B) :- cell_with_ship(C1), home_row_check(X1, B, P), dest_cell_in_reach(X1, Y1, X2, Y2, C1), not(is_base(X2, P)).
valid_move(X1, Y1, X2, Y2, P, B) :- get_cell(X1, Y1, B, C1), cell_with_ship(C1), home_row_check(X1, B, P), dest_cell_in_reach(X1, Y1, X2, Y2, C1).

valid_moves(B, P, MoveList) :- findall([X1, Y1, X2, Y2], valid_move(X1, Y1, X2, Y2, P, B), MoveList).

valid_chain_move(X1, Y1, X2, Y2, X3, Y3, _, B, 1) :- get_cell(X1, Y1, B, C1), get_cell(X3, Y3, B, C3), dest_cell_in_reach(X2, Y2, X3, Y3, C1), not(cell_with_ship(C3)), not(is_base(X3, 1)), not(is_base(X3, 2)).
valid_chain_move(_, _, X2, Y2, X3, Y3, C1, _, C3, _, _, 1) :- dest_cell_in_reach(X2, Y2, X3, Y3, C1), not(cell_with_ship(C3)), not(is_base(X3, 1)), not(is_base(X3, 2)).
valid_chain_move(_, _, X2, Y2, X3, Y3, P, B, 2) :- get_cell(X2, Y2, B, C2), dest_cell_in_reach(X2, Y2, X3, Y3, C2), not(is_base(X3, P)). 
valid_chain_move(_, _, X2, Y2, X3, Y3, _, C2, _, P, _, 2) :- dest_cell_in_reach(X2, Y2, X3, Y3, C2), not(is_base(X3, P)).

valid_chain_moves(X1, Y1, X2, Y2, P, B, MoveList) :- findall([X3, Y3], valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, 1), MoveList1), findall([X3, Y3], valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, 2), MoveList2), append(MoveList1, MoveList2, MoveList).
valid_chain_moves(X1, Y1, X2, Y2, P, B, MoveList, 1) :- findall([X3, Y3], valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice), MoveList).
valid_chain_moves(X1, Y1, X2, Y2, P, B, MoveList, 2) :- findall([X3, Y3], valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice), MoveList).

is_base(0, 1).
is_base(7, 2).


