

//form Manipulation and saving players
const Form = (() => {
    const welcome_model = document.querySelector('.welcome-model');

    //player 1
    const p1 = (() => { 
        const p1 = welcome_model.querySelector('.p1');
        const ai_check = p1.querySelector('input[type=checkbox]');
        const form = p1.querySelector('form');
        p1.querySelector('[type=text]').focus();
        ai_check.addEventListener('change', change_AI);
        form.addEventListener('submit', savePlayer);
        return p1;
        })();

    //player 2
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

    //modify form for AI if (AI checked)
    const p1_bot = convertForm(p1);
    const p2_bot = convertForm(p2);

    //AI checked event
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

    //form modification function for AI
    function convertForm(playerForm){
        const userIcon = playerForm.querySelector('h2 span');
        const div = playerForm.querySelector('.input-AI');
        const difficulty = playerForm.querySelector('.difficulty');
        difficulty.remove();
    
        //closer to keep the nodes saved even if removed from DOM
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

    //Save Player in Player Object
    function savePlayer(e){
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const ai = form.AI.checked;
        
        const difficulty = (ai) ? form.difficulty.value : "";

        Players.setPlayer(name, ai, difficulty);

        saved();
    }


    //after save player 1, open form for player 2
    //after save player 2, setup game up
    function saved(){
        if(Players.getPlayer(1) != undefined) {
            welcome_model.closest('.welcome').remove();
            setTimeout(() => {
                GameBoard.setup();
                Game.setup();
            }, 0);
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

    //player factory
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

    //make easy document.create (including bulk create)
    const createElements = (...elementName) => {
        const result = [];
        elementName.forEach(e => result.push(document.createElement(e)));
        if(result.length == 1) return result[0];
        return result;
    }

    //make easy add Attribute (including bulk)
    const addAttributes = (qualifiedName, ...pairsOfNodeClass) => {
        pairsOfNodeClass.forEach(e => {
            e[0].setAttribute(qualifiedName, e[1]);
        })
    }

    //check winner and return true if won with winning combination
    const checkWinner = (player, board) => {
        const gB = board || gameBoard;
        let result = false;
        let winnerCombination;
        winningCombination.forEach(wC => {
            
            if(
                (gB[wC[0]] == player) && 
                (gB[wC[1]] == player) && 
                (gB[wC[2]] == player) ){
                    result = true;
                    winnerCombination = wC;
                }
                
            })
    return {result, winnerCombination};
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
            box.addEventListener('click', Game.human_play);
            container.appendChild(box);
        }

        //setup gameData
        gameBoard.length = 0;
        winner = '';
    }

    const update_gameBoard = (index, symbol) => {
        gameBoard[index] = symbol;
    }

    const emptySlots = () => ArtificialIntelligence.emptySlots(gameBoard);

    const get_board = (() => {
        return gameBoard
    })();

    return{setup, update_gameBoard, emptySlots, checkWinner, get_board}
})();

const Game = (() => {
    let activePlayer;
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let winnerAnnounced = false;

    //render markers to the UI
    const render = (element) => {
        const icon = document.createElement('span');
        const symbol = (activePlayer == 'X') ? 'close' : 'circle-outline';
        icon.className = `mdi mdi-${symbol}`;
        element.appendChild(icon);
    }

    const updateWinSlots = (wC) => {

        let t = 0 ;
        wC.forEach(i => {
            t += 500;
            sleep(t).then(() => {
                document.querySelector(`.box-${i}`).classList.add('selected');
            })
        })
    }

    //show result upon call
    const showResult = result => {
        const resultDisplay = document.querySelector('.result');
        const resultDisplayModel = resultDisplay.querySelector('.result-model');
        const msg = resultDisplay.querySelector('h2');
        const button = resultDisplay.querySelector('button');
        const str = (result == "Draw!") ? "Draw!" : `${result.toUpperCase()} Won!` ;
        msg.textContent = str;
        document.querySelector('.result').style.zIndex = '1'
        setTimeout(() => {
            resultDisplayModel.classList.remove('translateY130');
        }, 0);
        button.addEventListener('click', replay)
    }


    //call showResult() if won or draw else call changePlayer()
    const announceWinner = () => {
        const winner = GameBoard.checkWinner(activePlayer);
        const availSpots = ArtificialIntelligence.emptySlots(GameBoard.get_board);

        //Won
        if(winner.result){
            const playerName = (activePlayer == 'X') ? Players.getPlayer(0).playerName : Players.getPlayer(1).playerName;
            winnerAnnounced = true;
            updateWinSlots(winner.winnerCombination);
            sleep(2500).then(() => showResult(playerName));
            return;
        }
        
        //Draw
        if(availSpots.length === 0) {
            showResult('Draw!');
            return;
        } 
        changePlayer();
    }

    //change player upon call and call ai_play
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
         
        sleep(1000).then(() => ai_play());
    }

    //if current player is ai make move
    const ai_play = () => {
        const emptySlots = GameBoard.emptySlots();
        // if(GameBoard.getWinner()) return;
        if(emptySlots.length == 0) return;
            const active = (activePlayer == 'X') ? Players.getPlayer(0) : Players.getPlayer(1);
            if(active.ai){
                const ai_choice = ArtificialIntelligence.getChoice(active.difficulty, activePlayer);
                const target = document.querySelector(`.box-${ai_choice}`);
                
                play({target, type: 'click'});
                
            }
    }
    
    //if current player not ai, make move upon event
    const human_play = (event) => {
        const ai = (activePlayer == 'X') ? Players.getPlayer(0).ai : Players.getPlayer(1).ai;
        if(!ai){
            play(event);
        }
    }
    
    //make move upon call
    const play = (event) => {
        if(winnerAnnounced) return;
        event.target.removeEventListener(event.type, human_play);
        render(event.target)
        GameBoard.update_gameBoard(event.target.getAttribute('data-id'), activePlayer);
        announceWinner();

    }

    //setup default value and call ai_play;
    const setup = () => {
        activePlayer = 'X'
        winnerAnnounced = false;
        ai_play();
    }

    //reset the marks to replay the game
    const replay = (event) => {
        const resultDisplay = document.querySelector('.result .result-model');
        resultDisplay.classList.add('translateY130')
        GameBoard.setup();
        setup();
        event.target.removeEventListener(event.type, replay);
        setTimeout(() => {
            document.querySelector('.result').style.zIndex = '-1'
        }, 300);
    }

    return {setup, human_play}
})();


const ArtificialIntelligence = (() => {

    const getRandom = (max=Number, min=0) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const emptySlots = (board) => {
        const result = [];
        for (let i = 0; i < 9; i++){
            if(!board[i]){
                result.push(i);
                }
        }
        return result;
    }
  
    const minimax = (player) => {
  
    //define constant values
        const newBoard = GameBoard.get_board;
        const activePlayer = player;
        const opponent = (player == 'X') ? 'O' : 'X';
    

//Help from https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
        const logic = (newBoard, player) => {
        
        //available spots
        let availSpots = emptySlots(newBoard);
        
        // checks for the terminal states such as win, lose, and tie and returning a value accordingly
        if (GameBoard.checkWinner(activePlayer, newBoard).result){
        
            return {score:1};
        }
        else if (GameBoard.checkWinner(opponent, newBoard).result){

          return {score:-1};
        }
        else if (availSpots.length === 0){

        return {score:0};
      }
    
    // an array to collect all the objects
      let moves = [];
    
      // loop through available spots
      for (let i = 0; i < availSpots.length; i++){
        //create an object for each and store the index of that spot that was stored as a number in the object's index key
        let move = {};
        move.index = availSpots[i];
    
        // set the empty spot to the current player
        newBoard[availSpots[i]] = player;
    
        
    
        //if collect the score resulted from calling minimax on the opponent of the current player
        if (player == activePlayer){
          let result = logic(newBoard, opponent);
        //   console.log(result);
          move.score = result.score;
        }
        else{
          let result = logic(newBoard, activePlayer);
          move.score = result.score;
        }
    
        //reset the spot to empty
        delete newBoard[availSpots[i]];
    
        // push the object to the array
        moves.push(move);
      }
    // if it is the computer's turn loop over the moves and choose the move with the highest score
      let bestMove;
      if(player === activePlayer){
        let bestScore = -10;
        for(let i = 0; i < moves.length; i++){
          if(moves[i].score > bestScore){
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }else{
    
    // else loop over the moves and choose the move with the lowest score
        let bestScore = 10;
        for(let i = 0; i < moves.length; i++){
          if(moves[i].score < bestScore){
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
    
    // return the chosen move (object) from the array to the higher depth
    
      return moves[bestMove];
    }

    // return the final move (object)
    return logic(newBoard, player);
  }


    //as name suggest easy choice
    const easy = () => {
        const board = GameBoard.get_board;
        return (() => {
            const num = getRandom(8);
            if(emptySlots(board).includes(num)){
                return num;
            }else{
                return easy();
            }
        })();
    }

    //same as name suggest hard choice
    const hard = (activePlayer) => {
        const ai_move = minimax(activePlayer);
        return ai_move.index;
    }


    //export Choice
    const getChoice = (difficulty, activePlayer) => {

        switch(difficulty){
            case '2': return hard(activePlayer);
            case '1': return easy();
            default: alert('something went wrong');
        }

    }

  
  return {getChoice, emptySlots}
  })()