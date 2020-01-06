any_member([H|_], L):-
    member(H, L).

any_member([_|T], L):-
    any_member(T, L).

not(Goal):-
    \+ Goal.

unpack_move_list(List, X1, Y1, X2, Y2):-
    nth0(0, List, X1),
    nth0(1, List, Y1),
    nth0(2, List, X2),
    nth0(3, List, Y2).

unpack_chain_move_list(List, X3, Y3):-
    nth0(0, List, X3),
    nth0(1, List, Y3).

user_input(Input, Min, Max):-
    catch(read(Input),_Err,fail),
    integer(Input),
    between(Min, Max, Input).
  
user_input(Input, Min, Max):-
    nl,
    write('Invalid Input. Retry:'),
    nl,
    nl,
    user_input(Input, Min, Max).
