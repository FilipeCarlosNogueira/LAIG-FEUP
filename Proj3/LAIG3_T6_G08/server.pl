:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),

		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),

		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),

		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.

close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),

	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),

	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).

read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

:-use_module('PLOG/xero_g.pl').

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

parse_input(quit, goodbye).

/* start */
parse_input(start_board, [B, P]) :- board_setup(B, P).

/* game over */
parse_input(game_over(B), 1) :- end_game_A(B).
parse_input(game_over(B), 2) :- end_game_B(B).
parse_input(game_over(B), 3).

/* home row check */
parse_input(homeRowCheck(X, B, Player), 1):-
	home_row_check(X, B, Player).

parse_input(homeRowCheck(X, B, Player), 0).


/* piece possible destinations */
parse_input(get_piece_possible_destinations(X, Y, P, B), MoveList) :- get_piece_possible_destinations(X, Y, P, B, MoveList).
parse_input(get_piece_possible_destinations(X, Y, P, B), []).

/* Increment move */
parse_input(increment_move(Moves, X1, Y1, X_increment, Y_increment, BackTrackingList), BackTrackingList_new) :-
	Moves =:= 1,
	/* Iteration */
    X2 is X1+X_increment,
    Y2 is Y1+Y_increment,
    validate_increment_move(X2, Y2),
    validate_BackTracking_list(BackTrackingList, X1, Y1, X2, Y2),
    append(BackTrackingList, [[X1, Y1, X2, Y2]], BackTrackingList_new).

parse_input(increment_move(Moves, X1, Y1, X_increment, Y_increment, BackTrackingList), BackTrackingList_aux) :-
	Moves > 1,
	/* Iteration */
    X4 is X1+X_increment,
    Y4 is Y1+Y_increment,
    validate_increment_move(X4, Y4),
    get_cell(X4, Y4, Board, C1),
    C1 =< 0,
    validate_BackTracking_list(BackTrackingList, X1, Y1, X4, Y4),
    append(BackTrackingList, [[X1, Y1, X4, Y4]], BackTrackingList_aux).

parse_input(increment_move(Moves, X1, Y1, X_increment, Y_increment, BackTrackingList), []).

/* apply increment move */
parse_input(apply_increment_move(Chain_move, X1, Y1, X2, Y2, Board), AuxBoard2) :-
	Chain_move =:= 0,
    get_cell(X1, Y1, Board, C1),
    change_cell(X1, Y1, Board, AuxBoard, 0),
    change_cell(X2, Y2, AuxBoard, AuxBoard2, C1).

parse_input(apply_increment_move(Chain_move, X1, Y1, X2, Y2, Board), AuxBoard2) :-
	Chain_move =:= 1,
    get_cell(X1, Y1, Board, C1),
    change_cell(X1, Y1, Board, AuxBoard, C1),
    change_cell(X2, Y2, AuxBoard, AuxBoard2, C1).

parse_input(apply_increment_move(Chain_move, X1, Y1, X2, Y2, Board), []).

/* check valid move */
parse_input(valid_move(Board, X1, Y1, X2, Y2, P), 1) :- valid_move(X1, Y1, X2, Y2, P, Board).
parse_input(valid_move(Board, X1, Y1, X2, Y2, P), 0).

/* make move */
parse_input(make_move(X1, Y1, X2, Y2, Board), NewBoard) :-
	get_cell(X1, Y1, Board, C1),
	get_cell(X2, Y2, Board, C2),
	change_cell(X1, Y1, Board, AuxBoard, C2),
  	change_cell(X2, Y2, AuxBoard, NewBoard, C1).

/* valid chain move */
parse_input(valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice), 1) :- valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice).
parse_input(valid_chain_move(X1, Y1, X2, Y2, X3, Y3, P, B, Choice), 0).

/* get valid chain moves */
parse_input(get_valid_chain_moves(X1, Y1, X2, Y2, P, B), MoveList) :- valid_chain_moves(X1, Y1, X2, Y2, P, B, MoveList).

/* CPU move */
parse_input(cpu_move(Board, P), NewBoard) :- cpu_move(Board, NewBoard, P).
