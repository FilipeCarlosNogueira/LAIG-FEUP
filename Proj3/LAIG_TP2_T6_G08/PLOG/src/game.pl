/*
* Inicial Board game.
*/
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

/* 
* Predicados responsáveis pelas iterações do jogo ao longo do mesmo. Primeiro é verificado
* se o jogo já acabou (algum nave já aterrou em alguma base), caso nao tenha acabado,
* é feito o display do tabuleiro, a quem pertence o turno e é chamado o predicado
* responsável pela jogada do jogador em questão. De seguida, recurssivamente, é passado
* o turno ao outro jogador
* @params:
*   - B: board
*   - P: jogador
*/
game_loop(B, _):-
    game_over(B).

game_loop(B, _):-
    game_over(B).

game_loop(B, P):-
    display_game(B, P), 
    write_turn(P), 
    move(B, B1, P),
    ( P =:= 1 -> game_loop(B1, 2) 
    ; game_loop(B1, 1) 
    ).

/*
* Predicado chamado para verificar se algum jogador venceu o jogo. Caso tenha acontecido,
* por sua vez, é chamado o predicado responsável pelo menu de game over consoante o jogador
* que tenha vencido a partida
* @params:
*   - B: board
*/
game_over(B):-
    end_game_A(B),
    game_over_menu(1).

game_over(B):-
    end_game_B(B),
    game_over_menu(2).

/*
* Predicados responsáveis pela lógica concreta da verificação da vitória do jogador A.
* Com auxílio de outro predicado, obtém a linha da base do jogador B e verifica se 
* alguma nave conseguiu lá chegar (1, 2 e 3 são as representações internas das naves), ou seja,
* se algum valor da lista é o valor representativo de alguma nave
* @params:
*   - B: board
*/
end_game_A(B):-
    get_B_base_row(B, BRow),
    any_member([1,2,3], BRow).
/*
* Idem mas no que toca à vitória do jogador B 
*/
end_game_B(B):-
    get_A_base_row(B, BRow),
    any_member([1,2,3], BRow).

/*
* Predicado responsável por efetuar uma jogada do jogador em questão. Inicialmente, chama um predicado que
* pede ao jogador as coordenadas da peça a mexer. De seguida, consoante o nível da nave que escolheu,
* é dito ao jogador na interface o número de movimentos que pode fazer. Depois chama-se o predicado onde
* o jogador realiza, de facto, o seu movimento desejado. No entanto, antes, é inicializado a lista onde se
* guardará todos os movimentos a realizar pelo jogador de forma a impedir o mesmo de fazer backtracking durante
* o seu turno. Depois disto, é verifiado se o movimento é válido e, caso seja, avança-se para a segunda parte do move 
* (onde ocorre, ou não, o encadeamento de de jogadas). Caso o move falhe, por o movimento ser inválido, 
* é apresentada uma mensagem no ecrã e pede-se novamente um movimento ao jogador
* @params:
*   - Board: tabuleiro
*   - NewBoard: novo tabuleiro (tabuleiro pós turno)
*   - P: jogador
*/
move(Board, NewBoard, P):-
    get_piece_coords(X1, Y1, Board, P),
    display_number_of_moves_allowed(X1, Y1, Board),
    get_cell(X1, Y1, Board, C1),
    BackTrackingList = [],
    get_destination_coords(0, X1, Y1, X2, Y2, Board, P, C1, BackTrackingList, BackTrackingList_new),
    get_cell(X2, Y2, Board, C2),
    valid_move(X1, Y1, X2, Y2, C1, C2, P, Board),
    move2(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, BackTrackingList_new).

move(Board, NewBoard, P):-
    write('Invalid move!'),
    display_game(Board, P),
    move(Board, NewBoard, P).

/*
* Segunda parte do movimento do jogador. No primeiro predicado move2, é verificado se a célula destino da nave
* já la contém uma nave. Caso contenha, o utilizador terá que realizar um dos dois possíveis encadeamentos, sendo
* que é pedida a escolha ao jogador. De seguida, chama-se o predicado chain_move que leverá então a cabo o encadeamento
* escolhido. Caso o destino não tenha uma nave, a nave aterra na respetiva casa e é actualizado o tabuleiro.
* @params:
*   - X1: Abcissa da casa inicial da nave
    - Y1: Ordenada da casa inicial da nave
    - X2: Abcissa da casa destino da nave
    - Y2: Ordenada da casa destino da nave
    - C1: Valor na casa inicial da nave (~ nível da nave escolhida pelo jogador)
    - C2: Valor na casa final da nave
    - P: jogador
    - Board: tabuleiro atual
    - NewBoard: novo tabuleiro (tabuleiro pós turno)
    - BackTrackingList: lista com movimentos realizados pelo jogador
*/
move2(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, BackTrackingList):-
    cell_with_ship(C2),
    get_chain_move(Choice),
    chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList).

move2(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, BackTrackingList):-
    change_cell(X1, Y1, Board, AuxBoard, C2),
    change_cell(X2, Y2, AuxBoard, NewBoard, C1).

/*
* Se o jogador escolheu a opção 1 na interface, quando requisitado input do mesmo no que toca ao
* encadeamento a realizar, o jogador decidiu então realizar um re-program coordinates. É então
* mostrado ao jogador o número de casas a mexer assim como os possíveis destinos finais. Depois é
* chamado um predicado de forma a pedir ao utilizador o destino final, sendo este verificado com o
* predicado valid_chain_move. Caso seja válido, é actualizado o novo tabuleiro. Caso não seja, este predicado
* falha e é repetido o processo até o utilizador escolher um destino válido.
* @params:
*   - X1: Abcissa da casa inicial da nave
    - Y1: Ordenada da casa inicial da nave
    - X2: Abcissa da casa destino (antes do chain move) da nave
    - Y2: Ordenada da casa destino (antes do chain move) da nave
    - C1: Valor na casa inicial da nave (~ nível da nave escolhida pelo jogador)
    - C2: Valor na casa destino (antes do chain move) da nave 
    - P: jogador
    - Board: tabuleiro atual
    - NewBoard: novo tabuleiro (tabuleiro pós turno)
    - BackTrackingList: lista com movimentos realizados pelo jogador
*/
chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList):-
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

/*
* Caso a choice seja 2, o utilizador decidiu então fazer um rocket boost. É disponibilizado o 
* número de movimentos possíveis ao jogador, de seguida obtém-se o destino
* escolhido pelo mesmo. Depois de obtida o valor na célula escolhida como destino,
* é verificado a validade do movimento. Caso seja válido, o predicado continua. Caso não esteja
* uma nave no destino, a nave é então colocada na respetiva casa e é actualizado o tabuleiro. Mas,
* caso esteja uma nave na célula destino, o rocket boost, ao contrário do reprogram coordinates,
* permite continuar a fazer chain moves. É então assim chamado novamente o move2, onde é dada 
* continuação à jogada do jogador.
*/
chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList):-
    Choice =:= 2,
    display_number_of_moves_allowed(X2, Y2, Board),
    get_destination_coords(1, X2, Y2, X3, Y3, Board, P, C2, BackTrackingList, BackTrackingList_new),
    get_cell(X3, Y3, Board, C3),
    valid_chain_move(X1, Y1, X2, Y2, X3, Y3, C1, C2, C3, P, Board, Choice),
    ( not(cell_with_ship(C3)) ->
    change_cell(X1, Y1, Board, AuxBoard, C3),
    change_cell(X3, Y3, AuxBoard, NewBoard, C1)
    ; move2(X1, Y1, X3, Y3, C1, C3, P, Board, NewBoard, BackTrackingList)  
    ).

chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList):-
   chain_move(X1, Y1, X2, Y2, C1, C2, P, Board, NewBoard, Choice, BackTrackingList).

/*
* Verifica, visto que não é permitido movimentos na diagonal neste jogo, a se Manhattan Distance
* entre dois pontos com é igual ao valor passado como argumento em C. Isto com o intuito de saber
* se uma nave tem o nível necessário para chegar a uma certa célula.
* @Params:
*   - X1: Abcissa da casa inicial da nave
    - Y1: Ordenada da casa inicial da nave
    - X2: Abcissa da casa destino da nave
    - Y2: Ordenada da casa destino da nave
    - C: nível da nave em questão
*/
dest_cell_in_reach(X1, Y1, X2, Y2, C):-
    C =:= abs(X2-X1) + abs(Y2-Y1).

/*
* Predicado intermédio que verifica o jogador dado como argumento e chama o respetivo predicado com o intuito de
* calcular se o valor em X é a homerow do jogador P
* @Params:
    - X: linha homerow do jogador P
    - B: board/tabuleiro
    - P: jogador
*/
home_row_check(X, B, P):-
    P =:= 1,
    home_row_check_A(X, B, P, 1).

home_row_check(X, B, P):-
    P =:= 2,
    home_row_check_B(X, B, P, 6).

/*
* Verifica se X é a abcissa da homerow do jogador A. Usando I como counter, começa-se no topo do tabuleiro e
* verifica-se se a linha tem alguma casa diferente de zero, ou seja, com uma nave. Caso não tenha, é incrementado o valor
* da linha e verifica-se há alguma nave na seguinte. Isto até chegar à linha X em que, caso não tenha havido naves nenhumas
* nas linhas anteriores e houver naves na linha X, confirma-se que esta é a homerow do jogador A.
* @params:
    - X: linha que vai ser testada se é a homerow do jogador P
    - B: tabuleiro
    - P: jogador
    - I: counter das linhas
*/
home_row_check_A(X, B, P, I):-
    I<X,
    nth0(I, B, Row),
    not(any_member([1,2,3], Row)),
    I1 is I+1,
    home_row_check_A(X, B, P, I1).

home_row_check_A(X, B, P, I):-
    not(I<X),
    I1 is I-1,
    nth0(I1, B, Row),
    not(any_member([1,2,3], Row)).

/*
* Semelhante ao predicado home_row_check_A, mas aplica-se para o jogador B. Mesmo algoritmo, sendo a única diferença
* que o counter (I) começa na última linha, sendo que verifica as homerows de baixo para cima até chegar a X.
*/
home_row_check_B(X, B, P, I):-
    I>X,
    nth0(I, B, Row),
    not(any_member([1,2,3], Row)),
    I1 is I-1,
    home_row_check_B(X, B, P, I1).

home_row_check_B(X, B, P, I):-
    not(I>X),
    I1 is I+1,
    nth0(I1, B, Row),
    not(any_member([1,2,3], Row)).

/*
* Predicado que verifica se um move inicial é válido. Verifica se a célula escolhida como incial contém uma nave,
* verifica se esta pertence à homerow do jogador, confirma que a nave tem nível suficiente para chegar à casa destino
* e verifica também se a casa destino não é a base do próprio jogador, de forma a impedir que se perca de propósito.
* Única diferença entre os dois predicados é o cálculo, ou não, dos valores das casas. Isto pois este predicado é usado
* em outros predicados cujo valor destas casas já é calculado, sendo mais eficiente re-utilizar os valores.
* @params:
*   - X1: Abcissa da casa inicial da nave
    - Y1: Ordenada da casa inicial da nave
    - X2: Abcissa da casa destino da nave
    - Y2: Ordenada da casa destino da nave
    - C1: Valor da casa inicial da nave
    - C2: Valor da casa destino da nave
    - P: jogador
    - B: tabuleiro
*/
valid_move(X1, Y1, X2, Y2, C1, C2, P, B):-
    cell_with_ship(C1),
    home_row_check(X1, B, P),
    dest_cell_in_reach(X1, Y1, X2, Y2, C1),
    not(is_base(X2, P)).

valid_move(X1, Y1, X2, Y2, P, B):-
    get_cell(X1, Y1, B, C1),
    get_cell(X2, Y2, B, C2),
    cell_with_ship(C1),
    home_row_check(X1, B, P),
    not(is_base(X2, P)),
    dest_cell_in_reach(X1, Y1, X2, Y2, C1).

/*
* Predicado que calcula todos os possíveis movimentos válidos de um certo jogador.
* @params:
    - B: tabuleiro
    - P: jogador
    - MoveList: lista com as combinações casas inicio-destino válidos para o jogador P
*/
valid_moves(B, P, MoveList):-
    findall([X1, Y1, X2, Y2], valid_move(X1, Y1, X2, Y2, P, B), MoveList).

/*
* Predicado que verifica se um encadeamento, tendo em conta a célula inicial, intermédia e final, é válido
* ou não. Caso choice==1, ou seja, o jogador ter escolhido um reprogram coordinates. Neste caso, verifica
* se a célula final está alcancável tendo em conta o valor da nave escolhida e, depois, confirmma também
* que a nave cujas coordenadas estão a ser reprogramadas não aterra nem numa casa com outra nave num em
* uma base, seja do próprio jogador seja do adversário. Novamente, um predicado com os valores das casas
* já calculados e outro não em prol de eficiência.
* @params:
*   - X1: Abcissa da casa inicial da nave
    - Y1: Ordenada da casa inicial da nave
    - X2: Abcissa da casa intermédia da nave (onde começou o chain move)
    - Y2: Ordenada da casa intermédia da nave (onde começou o chain move)
    - C1: Valor da casa inicial da nave (nível da nave escolhida)
    - C2: Valor da casa destino da nave (nível da nave onde se aterreu da primeira vez)
    - P: jogador
    - B: tabuleiro
    - Choice: chain action escolhida pelo jogador
*/
valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice):-
    Choice =:= 1,
    get_cell(X1, Y1, B, C1),
    get_cell(X3, Y3, B, C3),
    dest_cell_in_reach(X2, Y2, X3, Y3, C1),
    not(cell_with_ship(C3)),
    not(is_base(X3, 1)),
    not(is_base(X3, 2)).

valid_chain_move(X1, Y1, X2, Y2, X3, Y3, C1, C2, C3, P, B, Choice):-
    Choice =:= 1,
    dest_cell_in_reach(X2, Y2, X3, Y3, C1),
    not(cell_with_ship(C3)),
    not(is_base(X3, 1)),
    not(is_base(X3, 2)).

valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice):-
    Choice =:= 2,
    get_cell(X2, Y2, B, C2),
    get_cell(X3, Y3, B, C3),
    dest_cell_in_reach(X2, Y2, X3, Y3, C2),
    not(is_base(X3, P)). 

valid_chain_move(X1, Y1, X2, Y2, X3, Y3, C1, C2, C3, P, B, Choice):-
    Choice =:= 2,
    dest_cell_in_reach(X2, Y2, X3, Y3, C2),
    not(is_base(X3, P)).

/*
*
*/
valid_chain_moves(X1, Y1, X2, Y2, P, B, MoveList):-
    Choice1 is 1,
    Choice2 is 2,
    findall([X3, Y3], valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice1), MoveList1),
    findall([X3, Y3], valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice2), MoveList2),
    append(MoveList1, MoveList2, MoveList).

valid_chain_moves(X1, Y1, X2, Y2, P, B, MoveList, Choice):-
    Choice =:= 1,
    findall([X3, Y3], valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice), MoveList).

valid_chain_moves(X1, Y1, X2, Y2, P, B, MoveList, Choice):-
    Choice =:= 2,
    findall([X3, Y3], valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice), MoveList).

is_base(X, 1):-
    X=:=0.

is_base(X, 2):-
    X=:=7.


