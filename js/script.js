(() => {

// Gameboard {} > gameboard []
// Players () > player {}
// Game {}

function start(){
    sets
}

const btnRestart = document.querySelector('.restart');
const resultDisplay_screen = document.querySelector('.result');

const icon = ('AI' == true) ? 'account': 'robot' ;

const GameData = {
    player1: Player("Player 1", 'cross'),
    player2: Player("Player 2", 'nought'),
    winningCombination: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6],
    ]
}


btnRestart.addEventListener('click', start);

// function start(){
//     const container = document.querySelector('.container');
//     const boxes = document.querySelectorAll('.box');
//     resultDisplay_screen.style.display = 'none';
//     GameData.activeSymbol = 'cross';
//     GameData.gameBoard = [];
//     GameData.winner = '';

//     boxes.forEach(box => box.addEventListener('click', play));

//     container.innerHTML = '';

//     for(let i = 0; i < 9; i++){
//         const box = document.createElement('div');
//         box.className = "box";
//         box.setAttribute('data-id', i);
//         box.addEventListener('click', play);
//         container.appendChild(box);
//     }


// }

function Player(name, symbol, AI = false){
    return { name, symbol, AI};
}

function render(e){
    const icon = document.createElement('span');
    const symbol = (GameData.activeSymbol == 'cross') ? 'close' : 'circle-outline';
    icon.className = `mdi mdi-${symbol}`;
    e.appendChild(icon);
}

function findWinner(){
    const gB = GameData.gameBoard;
    let winnerSymbol, winnerCombination;
    
    GameData.winningCombination.forEach(wC => {
        
        if(
            (gB[wC[0]] != undefined) && 
            (gB[wC[0]] == gB[wC[1]]) && 
            (gB[wC[1]] == gB[wC[2]]) ){
                
                winnerSymbol = gB[wC[0]];
                winnerCombination = wC;
            };
            
        })
        
            if(!gB.includes(undefined) && gB.length == 9 && winnerSymbol == undefined){
                showResult('Draw!')
                return;
            }
    return {winnerSymbol, winnerCombination};

}

function announceWinner(winner){
    if(winner.winnerSymbol != undefined){
        const playerName = (winner.winnerSymbol == 'cross') ? GameData.player1.name : GameData.player2.name;
        GameData.winner = winner.winnerSymbol;
        showResult(playerName);
    }
}

function showResult(result){
    const resultDisplay = document.querySelector('.result h2');
    const str = (result == "Draw!") ? "Draw!" : `${result.toUpperCase()} Won!` ;
    resultDisplay.textContent = str;
    resultDisplay_screen.style.display = 'flex';
}

function changePlayer(){
    const player1_profile = document.querySelector('.player-1');
    const player2_profile = document.querySelector('.player-2');

    if(GameData.activeSymbol == GameData.player1.symbol){
        GameData.activeSymbol = GameData.player2.symbol;
        player1_profile.classList.remove('active');
        player2_profile.classList.add('active');
    }else{
        GameData.activeSymbol = GameData.player1.symbol;
        player2_profile.classList.remove('active');
        player1_profile.classList.add('active');
     }

}

function updateGameData(index){
    GameData.gameBoard[index] = GameData.activeSymbol;
}

function play(e){
    if(GameData.winner) return;
    render(e.target)
    updateGameData(e.target.getAttribute('data-id'));
    announceWinner(findWinner());
    e.target.removeEventListener(e.type, play);
    changePlayer();
}

start();
})();

