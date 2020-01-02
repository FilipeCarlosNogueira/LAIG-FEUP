function getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess;

    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(requestString, handleReply) {			 
    // Make Request
    getPrologRequest(requestString, handleReply);
}

function gameOver(b, reply){
    let request = 'gameOver(' + JSON.stringify(b) + ')';

    makeRequest(request, reply);
}

function getPiecePossibleDestinations(x, y, player, board, reply){
    let requestString = 'get_piece_possible_destinations('
    + JSON.stringify(x) + ','
    + JSON.stringify(y) + ','
    + JSON.stringify(player) + ','
    + JSON.stringify(board)
    + ')';

    makeRequest(requestString, reply);
}

function validMove(board, fromX, fromY, toX, toY, player, reply){
    let requestString = 'valid_move('
    + JSON.stringify(board) + ','
    + JSON.stringify(fromX) + ',' + JSON.stringify(fromY) + ','
    + JSON.stringify(toX) + ',' + JSON.stringify(toY) + ','
    + JSON.stringify(player)
    + ')';

    makeRequest(requestString, reply);
}

function makeMove(board, fromX, fromY, toX, toY, reply){
    let requestString = 'make_move('
    + JSON.stringify(fromX) + ',' + JSON.stringify(fromY) + ','
    + JSON.stringify(toX) + ',' + JSON.stringify(toY) + ','
    + JSON.stringify(board)
    + ')';

    makeRequest(requestString, reply);
}

// choice = 1 -> reprogram coords
// choice = 2 -> rocket boost
function validChainMove(board, X1, Y1, X2, Y2, X3, Y3, player, choice, reply){
    let requestString = 'valid_chain_move('
    + JSON.stringify(X1) + ',' + JSON.stringify(Y1) + ','
    + JSON.stringify(X2) + ',' + JSON.stringify(Y2) + ','
    + JSON.stringify(X3) + ',' + JSON.stringify(Y3) + ','
    + JSON.stringify(choice) + ','
    + JSON.stringify(player) + ','
    + JSON.stringify(board) + ','
    + ')';

    makeRequest(requestString, reply);
}

function getValidChainMove(board, X1, Y1, X2, Y2, player, reply){
    let requestString = 'get_valid_chain_move('
    + JSON.stringify(X1) + ',' + JSON.stringify(Y1) + ','
    + JSON.stringify(X2) + ',' + JSON.stringify(Y2) + ','
    + JSON.stringify(player) + ','
    + JSON.stringify(board) + ','
    + ')';

    makeRequest(requestString, reply);
}

// !!! NOT SURE IF WRITE AND PRINT WORKS !!!
function cpuMove(board, player, reply){
    let requestString = 'cpu_move('
    + JSON.stringify(board) + ','
    + JSON.stringify(player) + ','
    + ')';

    makeRequest(requestString, reply);
}
