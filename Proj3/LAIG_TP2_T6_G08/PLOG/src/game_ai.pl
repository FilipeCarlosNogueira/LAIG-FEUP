game_loop(B, P, _):-
    end_game_A(B),
    game_over_menu(1).

game_loop(B, P, _):-
    end_game_B(B),
    game_over_menu(2).

game_loop(B, P, 1):- 
    display_game(B, P),
    nl,
    ( P =:= 1 ->
      move(B, B1, P),
      game_loop(B1, 2, 1)
    ; cpu_move(B, B1, 2),
      game_loop(B1, 1, 1)
    ).

game_loop(B, P, 2):-
    display_game(B, P),
    ( P =:= 1 ->
      cpu_move(B, B1, 1),
      game_loop(B1, 2, 2)
    ; cpu_move(B, B1, 2),
      game_loop(B1, 1, 2)
    ).

cpu_move(Board, NewBoard, P):-
    valid_moves(Board, P, MoveList),
    length(MoveList, MoveListLenght),
    random(0, MoveListLenght, RandMove),
    nth0(RandMove, MoveList, Move),
    nl,
    nl,
    write(' - CPU MOVE: '),
    print(Move),
    nl,
    unpack_move_list(Move, X1, Y1, X2, Y2),
    get_cell(X1, Y1, Board, C1),
    get_cell(X2, Y2, Board, C2),
    cpu_move2(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard).

cpu_move2(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard):-
    cell_with_ship(C2),
    random(1, 3, RandomInt),
    cpu_chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, RandomInt).

cpu_move2(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard):-
    change_cell(X1, Y1, Board, AuxBoard, C2),
    change_cell(X2, Y2, AuxBoard, NewBoard, C1).

cpu_chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice):-
    Choice =:= 1,
    write(' - CPU: reprogram coordinates.'),
    valid_chain_moves(X1, Y1, X2, Y2, P, Board, MoveList, Choice),
    length(MoveList, MoveListLenght),
    random(0, MoveListLenght, RandMove),
    nth0(RandMove, MoveList, Move),
    nl,
    write(' - CPU MOVE: '),
    print(Move),
    nl,
    unpack_chain_move_list(Move, X3, Y3),
    get_cell(X3, Y3, Board, C3),
    change_cell(X1, Y1, Board, AuxBoard, C3),
    change_cell(X2, Y2, AuxBoard, AuxBoard2, C1),
    change_cell(X3, Y3, AuxBoard2, NewBoard, C2).

cpu_chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice):-
    Choice =:= 2,
    write(' - CPU: rocket boost.'),
    valid_chain_moves(X1, Y1, X2, Y2, P, Board, MoveList, Choice),
    length(MoveList, MoveListLenght),
    random(0, MoveListLenght, RandMove),
    nth0(RandMove, MoveList, Move),
    nl,
    write(' - CPU MOVE: '),
    print(Move),
    nl,
    unpack_chain_move_list(Move, X3, Y3),
    get_cell(X3, Y3, Board, C3),
    ( not(cell_with_ship(C3)) ->
      change_cell(X1, Y1, Board, AuxBoard, C3),
      change_cell(X3, Y3, AuxBoard, NewBoard, C1)
    ; cpu_move2(X1, Y1, X3, Y3, C1, C3, P, Board, NewBoard)  
    ).

    


    
