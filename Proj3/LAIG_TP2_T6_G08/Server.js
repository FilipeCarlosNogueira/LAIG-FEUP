let server = {
    __request: function(requestString, onSuccess, onError, port) {
        let requestPort = port || 8081;
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
        request.onload = function(data) { onSuccess(data); };
        request.onerror = onError || function(){ console.log('Error waiting for response'); };
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    },
    request: function(requestString, handleReply) {			 
        this.__request(requestString, handleReply);
    },
    gameOver_req: function(board, reply){
        let request = 'game_over(' + JSON.stringify(board) + ')';
        if(board != null) {
            this.request(request, reply);
        }
    },
    possibleMoves_req: function(x, y, player, board, reply){
        let requestString = 'get_piece_possible_destinations('
        + JSON.stringify(x) + ','
        + JSON.stringify(y) + ','
        + JSON.stringify(player) + ','
        + JSON.stringify(board)
        + ')';

        this.request(requestString, reply);
    },
    validMove_req: function(board, fromX, fromY, toX, toY, player, reply){
        let requestString = 'valid_move('
        + JSON.stringify(board) + ','
        + JSON.stringify(fromX) + ',' + JSON.stringify(fromY) + ','
        + JSON.stringify(toX) + ',' + JSON.stringify(toY) + ','
        + JSON.stringify(player)
        + ')';

        this.request(requestString, reply);
    },
    makeMove_req: function(board, fromX, fromY, toX, toY, reply){
        let requestString = 'make_move('
        + JSON.stringify(fromX) + ',' + JSON.stringify(fromY) + ','
        + JSON.stringify(toX) + ',' + JSON.stringify(toY) + ','
        + JSON.stringify(board)
        + ')';

        this.request(requestString, reply);
    },
    // choice = 1 -> reprogram coords
    // choice = 2 -> rocket boost
    validChain_req: function(board, X1, Y1, X2, Y2, X3, Y3, player, choice, reply){
        let requestString = 'valid_chain_move('
        + JSON.stringify(X1) + ',' + JSON.stringify(Y1) + ','
        + JSON.stringify(X2) + ',' + JSON.stringify(Y2) + ','
        + JSON.stringify(X3) + ',' + JSON.stringify(Y3) + ','
        + JSON.stringify(choice) + ','
        + JSON.stringify(player) + ','
        + JSON.stringify(board) + ','
        + ')';

        this.request(requestString, reply);
    },
    possibleChain_req: function(board, X1, Y1, X2, Y2, player, reply){
        let requestString = 'get_valid_chain_move('
        + JSON.stringify(X1) + ',' + JSON.stringify(Y1) + ','
        + JSON.stringify(X2) + ',' + JSON.stringify(Y2) + ','
        + JSON.stringify(player) + ','
        + JSON.stringify(board) + ','
        + ')';

        this.request(requestString, reply);
    },
    // !!! NOT SURE IF WRITE AND PRINT WORKS !!!
    CPUMove_req: function(board, player, reply){
        let requestString = 'cpu_move('
        + JSON.stringify(board) + ','
        + JSON.stringify(player) + ','
        + ')';

        this.request(requestString, reply);
    }
};