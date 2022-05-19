// const GameBoard = () => {
//     const gameBoard = [];
// }
// Players () > player {}
// Game {}

const Form = (() => {
    const welcome_model = document.querySelector('.welcome-model');

    const p1 = (() => { 
        const p1 = welcome_model.querySelector('.p1');
        const ai_check = p1.querySelector('input[type=checkbox]');
        const form = p1.querySelector('form');
        p1.querySelector('[type=text]').focus();
        ai_check.addEventListener('change', change_AI);
        form.addEventListener('submit', savePlayer);
        return p1;
        })();

    const p2 = (() => {
        const p2 = p1.cloneNode(true);
        const ai_check = p2.querySelector('input[type=checkbox]');
        const userSymbol = p2.querySelector('h4 span');
        const form = p2.querySelector('form');
        const button = p2.querySelector('button');
        p2.className = 'p2 translateX100';
        ai_check.setAttribute('data-id', 2)
        ai_check.addEventListener('change', change_AI);
        userSymbol.className = 'mdi mdi-circle-outline';
        button.textContent = 'Save & Play';
        form.addEventListener('submit', savePlayer);
        return p2;
    })();

    const p1_bot = convertForm(p1);
    const p2_bot = convertForm(p2);

    function change_AI(e){
        const checked   = e.target.checked;
        const id        = e.target.getAttribute('data-id')
            if(id == 1){
                (checked) ? p1_bot(true) : p1_bot(false);
            }else if(id == 2){
                (checked) ? p2_bot(true) : p2_bot(false);
            }else{
                alert('something went wrong');
            }
    }

    function convertForm(playerForm){
        const userIcon = playerForm.querySelector('h2 span');
        const div = playerForm.querySelector('.input-AI');
        const difficulty = playerForm.querySelector('.difficulty');
        difficulty.remove();
    
        const showHide = show => {
            if(show){
                div.appendChild(difficulty);
                userIcon.className = 'mdi mdi-robot mdi-48px';
            }else{
                userIcon.className = 'mdi mdi-account mdi-48px';
                difficulty.remove();
            }
        }
        return showHide;
    }

    function savePlayer(e){
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const ai = form.AI.checked;
        
        const difficulty = (ai) ? form.difficulty.value : "";

        Players.setPlayer(name, ai, difficulty);

        saved();
    }

    function saved(){
        if(Players.getPlayer(1) != undefined) {
            welcome_model.closest('.welcome').remove();
            GameBoard.setup();
            Game.setup();
            return
        };
        welcome_model.append(p2);
        setTimeout(() => {
            p2.classList.remove('translateX100');
            p1.classList.add('translateX-100');
            setTimeout(() => {
                p1.remove();
                p2.querySelector('[type=text]').focus();
            }, 300);
        }, 0);

    }
})();

const Players = (() => {
    let id = 1;
    const player = [];

    const setPlayer = (name, ai, difficulty) => {
        if(player.length > 1){
            alert('something went wrong');
            return;
        };
        const playerName = name || `Player ${id}`;
        player.push({id, playerName, ai, difficulty});
        id++;
    }

    const getPlayer = i => player[i];

    return{ setPlayer, getPlayer }
})();

const GameBoard = (() => {
    const gameBoard = [];
    let winner;
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6],
    ]

    const createElements = (...elementName) => {
        const result = [];
        elementName.forEach(e => result.push(document.createElement(e)));
        if(result.length == 1) return result[0];
        return result;
    }

    const addAttributes = (qualifiedName, ...pairsOfNodeClass) => {
        pairsOfNodeClass.forEach(e => {
            e[0].setAttribute(qualifiedName, e[1]);
        })
    }

    const setWinner = symbol => winner = symbol;


    const findWinner = () => {
        const gB = gameBoard;
        let winnerSymbol, winnerCombination;
        let draw = false;
        winningCombination.forEach(wC => {
            
            if(
                (gB[wC[0]] != undefined) && 
                (gB[wC[0]] == gB[wC[1]]) && 
                (gB[wC[1]] == gB[wC[2]]) ){
                    
                    winnerSymbol = gB[wC[0]];
                    winnerCombination = wC;
                    setWinner(winnerSymbol);
                };
                
            })
            
                if(!gB.includes(undefined) && gB.length == 9 && winnerSymbol == undefined){
                    draw = true;
                    // return;
                }
        return {winnerSymbol, winnerCombination, draw};
    
    }

    const setup = () => {

        //setup header
        const users = document.querySelector('.header .users');
        const getIcon = i => (Players.getPlayer(i).ai) ? 'mdi-robot' : 'mdi-account';
        const [
            player_1, icon_p1, name_p1, 
            player_2, icon_p2, name_p2
        ]  = createElements(
            'div', 'span', 'span', 
            'div', 'span', 'span'
            );

        addAttributes('class',
            [player_1, 'user player-1 active'], [icon_p1, `mdi ${getIcon(0)}`], [name_p1, 'player-name'],
            [player_2, 'user player-2'], [icon_p2, `mdi ${getIcon(1)}`], [name_p2, 'player-name']
            );

        name_p1.textContent = Players.getPlayer(0).playerName;
        name_p2.textContent = Players.getPlayer(1).playerName;
            
        player_1.append(icon_p1, name_p1);
        player_2.append(icon_p2, name_p2);

        users.innerHTML = '';
        users.append(player_1, player_2);

        //setup main board

        const container = document.querySelector('.container');
        container.innerHTML = '';

        for(let i = 0; i < 9; i++){
            const box = createElements('div');
            addAttributes('class', [box, `box box-${i}`]);
            addAttributes('data-id', [box, i]);
            box.addEventListener('click', Game.play);
            container.appendChild(box);
        }

        //setup gameData
        gameBoard.length = 0;
        winner = '';
    }

    const update_gameBoard = (index, symbol) => {
        gameBoard[index] = symbol;
    }

    const getWinner = () => {
        return winner
    }; 

    const emptySlots = () => {
        const result = [];
        for (let i = 0; i < 9; i++){
            if(!gameBoard[i]){
                result.push(i);
            }
        }
        return result
    };    

    return{setup, update_gameBoard, getWinner, findWinner, emptySlots}
})();

const Game = (() => {
    let activePlayer;

    const getRandom = (max=Number, min=0) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    const render = (element) => {
        const icon = document.createElement('span');
        const symbol = (activePlayer == 'X') ? 'close' : 'circle-outline';
        icon.className = `mdi mdi-${symbol}`;
        element.appendChild(icon);
    }

    const showResult = result => {
        const resultDisplay = document.querySelector('.result');
        const msg = resultDisplay.querySelector('h2');
        const button = resultDisplay.querySelector('button');
        const str = (result == "Draw!") ? "Draw!" : `${result.toUpperCase()} Won!` ;
        msg.textContent = str;
        resultDisplay.style.display = 'flex';
        button.addEventListener('click', () => {
            resultDisplay.style.display = 'none';
            setup();
            GameBoard.setup();
        })
    }


    const announceWinner = () => {
        const winner = GameBoard.findWinner();
        if(winner.draw) {
            showResult('Draw!');
            return;
        } 
        if(winner.winnerSymbol != undefined){
            const playerName = (winner.winnerSymbol == 'X') ? Players.getPlayer(0).playerName : Players.getPlayer(1).playerName;
            showResult(playerName);
            return;
        }
    }

    const changePlayer = () => {
        const player1_profile = document.querySelector('.player-1');
        const player2_profile = document.querySelector('.player-2');
    
        if(activePlayer == 'X'){
            activePlayer = 'O';
            player1_profile.classList.remove('active');
            player2_profile.classList.add('active');
        }else{
            activePlayer = 'X';
            player2_profile.classList.remove('active');
            player1_profile.classList.add('active');
         }

         ai_play();
    }

    const ai_play = () => {
        if(GameBoard.getWinner()) return;
        setTimeout(() => {
            const ai = (activePlayer == 'X') ? Players.getPlayer(0).ai : Players.getPlayer(1).ai;
            if(ai){
                const randomNum = () => {
                    const random = getRandom(8);
                    if(GameBoard.emptySlots().includes(random)){
                        return random;
                    }else{
                        return randomNum();
                    }
                };
                const target = document.querySelector(`.box-${randomNum()}`);
                play({target});
            }
        }, 500);
    }
    
    

    const play = (event) => {
        if(GameBoard.getWinner()) return;
        render(event.target)
        GameBoard.update_gameBoard(event.target.getAttribute('data-id'), activePlayer);
        event.target.removeEventListener(event.type, play);
        announceWinner();
        changePlayer();
        // console.log(event)
        // console.log(event.target)

    }

    const setup = () => {
        activePlayer = 'X'
        ai_play();
    }
    return {setup, play}
})();
