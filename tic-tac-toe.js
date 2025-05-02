function gameBoard() {
  let board = [];
  let rows = 3;
  let columns = 3;

  // Create the game board array
  for (let i = 0; i < rows; i++) {
    board.push([]); // push blank arrays
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell()); //push values taken from cell object
    }
  }
  // get a specific cell
  const getCell = (rowIndex, colIndex) => board[rowIndex][colIndex];

  // place player's marker
  const placeMarker = (rows, cols, marker) => {
    const cell = getCell(rows, cols);
    if (cell.getValue() === "0") {
      return cell.addValue(marker);
    }
  };

  const getEmptyCells = () => {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const value = getCell(row, col).getValue();
        if (value === "0") {
          return true;
        }
      }
    }
    return false;
  };
  const getBoard = () => board;

  return { placeMarker, getCell, getBoard, getEmptyCells };
}

function Cell() {
  let value = "0";

  const addValue = (player) => {
    value = player;
  };
  const getValue = () => value;
  return { addValue, getValue };
}

function gameManager(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
  humanChosenMarker
) {
  const board = gameBoard();
  const players = [
    {
      name: playerOneName,
      token: humanChosenMarker,
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];
  let roundsInfo = {
    playerOneScore: 0,
    playerTwoScore: 0,
    maxRound: 3,
    currentRound: 0,
  };
  let isGameOver = false;

  players[1].token = humanChosenMarker === "O" ? "X" : "O"; // to change 2nd player's marker based on first player's choice

  const isGameStillActive = () => {
    if (isGameOver) {
      alert("Game has already ended. No further actions allowed.");
      return false;
    }
    return true;
  };

  let currentPlayer = players[0];

  const convertToCellNumber = (rowIndex, columnIndex) => {
    return rowIndex * 3 + columnIndex + 1;
  };
  const getPlayersInfo = (index) => players[index];
  const getRoundsInfo = () => roundsInfo;

  // to make player's move
  function makeMoveAt(row, col) {
    if (board.getCell(row, col).getValue() === "0") {
      board.placeMarker(row, col, currentPlayer.token);
      let cell = convertToCellNumber(row, col);
      return {
        success: true,
        message: `Marker placed successfully at cell no. ${cell}`,
        playerName: "Human",
      };
    }
    return { error: true, message: "Cell is already occupied." };
  }

  function updateScore(winningToken) {
    const winner = players.find((player) => player.token === winningToken); // find player that matches winning token

    if (!winner) {
      return { message: "Error: Invalid token." };
    }
    if (winner === players[0]) {
      roundsInfo.playerOneScore++;
    } else if (winner === players[1]) {
      roundsInfo.playerTwoScore++;
    }
    const message = `${winner.name} with token ${winningToken} wins round no. ${
      getRoundsInfo().currentRound + 1
    }.`;
    // stores are the winner info
    const outcomeDetails = {
      winnerName: winner.name,
      outcome: "win",
      winningMessage: message,
      winningToken: winner.token,
    };

    return outcomeDetails;
  }
  // prints the board in console
  function printBoard() {
    const boardArray = board.getBoard();
    return boardArray
      .map((row) => row.map((col) => col.getValue()).join("|"))
      .join("\n-----\n");
  }
  // checks if the first value of cell is empty or null
  const checkLine = (cells) => {
    if (cells[0] === 0 || cells[0] === null || cells[0] === undefined) {
      return false; // then return false
    }
    return cells.every((cell) => cell === cells[0]); // return true if every cell has the same value as the first cell
  };
  // checks the winner or tie

  function checkWinner() {
    const localBoard = board.getBoard();
    const size = localBoard.length;

    const checkWinningToken = (cells) => {
      const firstCell = cells[0].getValue();
      if (firstCell === "0") return null;
      if (checkLine(cells.map((cell) => cell.getValue()))) {
        // uses check line to check if every cell have same value
        return firstCell;
      }
      return null;
    };

    const checkRows = () => {
      for (let i = 0; i < 3; i++) {
        const winningToken = checkWinningToken(localBoard[i]); // uses check winning to check winner in rows
        if (winningToken) {
          const winningMessage = updateScore(winningToken);
          return winningMessage;
        }
      }
      return null;
    };
    const checkColumns = () => {
      for (let j = 0; j < 3; j++) {
        const column = localBoard.map((row) => row[j]);
        const winningToken = checkWinningToken(column); // uses check winning to check winner in columns
        if (winningToken) {
          const winningMessage = updateScore(winningToken);
          return winningMessage;
        }
      }

      return null;
    };
    const checkDiagonals = () => {
      const mainDiagonal = localBoard.map((row, index) => row[index]);
      const antiDiagonal = localBoard.map(
        (row, index) => row[size - 1 - index]
      );
      const mainDiagonalWinner = checkWinningToken(mainDiagonal);
      if (mainDiagonalWinner) {
        const winningMessage = updateScore(mainDiagonalWinner);
        return winningMessage;
      }

      const antiDiagonalWinner = checkWinningToken(antiDiagonal);
      if (antiDiagonalWinner) {
        const winningMessage = updateScore(antiDiagonalWinner);
        return winningMessage;
      }
      return null;
    };
    const checkTie = () => {
      let isTie = true;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (localBoard[i][j].getValue() === "0") {
            isTie = false;
            break;
          }
        }
        if (!isTie) break;
      }
      return isTie ? "tie" : null;
    };
    return (
      checkRows() ||
      checkColumns() ||
      checkDiagonals() ||
      checkTie() ||
      "New round begins"
    );
  }
  function validations() {
    const playersValidation = () => {
      if (!players[0].name || !players[0].token) {
        console.log("Player 1 name or token is missing.");
        return false;
      }
      if (!players[1].name || !players[1].token) {
        console.log("Player 2 name or token is missing.");
        return false;
      }
      return true;
    };
    const boardValidation = () => {
      let boardArray = board.getBoard();
      if (boardArray.length !== 3 || !Array.isArray(boardArray)) {
        console.log("Board must contain a 3 x 3 grid.");
        return false;
      }
      for (let row of boardArray) {
        if (!Array.isArray(row) || row.length !== 3) {
          console.log("Each row of board must contain 3 cells.");
          return false;
        }
        for (let cell of row) {
          if (
            cell.getValue() !== "0" &&
            cell.getValue() !== players[0].token &&
            cell.getValue() !== players[1].token
          ) {
            console.log("Board cells must be initialized with '0', 'X' or 'O'");
            return false;
          }
        }
      }
      return true;
    };
    return { playersValidation, boardValidation };
  }
  // places ai token
  function placeAiToken() {
    const emptyCells = board.getEmptyCells();
    let foundEmptyCell = false;
    if (!emptyCells) {
      return {
        moveMade: false,
        message: "Board is full. Cannot place ai token.",
      };
    }
    while (!foundEmptyCell) {
      // if found empty cells is false
      const randomRow = Math.floor(Math.random() * 3);
      const randomCol = Math.floor(Math.random() * 3);
      if (board.getCell(randomRow, randomCol).getValue() === "0") {
        const cell = convertToCellNumber(randomRow, randomCol);
        board.placeMarker(randomRow, randomCol, currentPlayer.token);
        foundEmptyCell = true;
        return {
          moveMade: true,
          playerName: "A.I",
          row: randomRow,
          column: randomCol,
          token: currentPlayer.token,
          message: `AI token is placed at Cell No. ${cell}`,
        };
      }
    }
  }

  function logWinner() {
    if (roundsInfo.currentRound >= roundsInfo.maxRound) {
      isGameOver = true;
      if (roundsInfo.playerOneScore > roundsInfo.playerTwoScore) {
        return {
          finalMatchOver: true,
          finalMatchResult: "win",
          finalMatchWinner: players[0].name,
          winnerScores: roundsInfo.playerOneScore,
        };
      } else if (roundsInfo.playerOneScore === roundsInfo.playerTwoScore) {
        return {
          finalMatchOver: true,
          finalMatchResult: "tie",
          finalMatchMessage: "Both players got the same score! It's a draw",
        };
      } else {
        return {
          finalMatchOver: true,
          finalMatchResult: "win",
          finalMatchWinner: players[1].name,
          winnerScores: roundsInfo.playerTwoScore,
        };
      }
    }
  }

  function resetGame() {
    const resetBoardArray = () => {
      const resetBoardArray = board.getBoard();
      resetBoardArray.forEach((row) =>
        row.forEach((cell) => {
          if (cell.getValue() !== "0") {
            cell.addValue("0");
          }
        })
      );
    };
    const resetScores = () => {
      roundsInfo.playerOneScore = 0;
      roundsInfo.playerTwoScore = 0;
    };
    const resetPlayers = () => {
      currentPlayer = players[0];
    };
    const resetAllRounds = () => {
      roundsInfo.currentRound = 0;
    };
    const resetAll = () => {
      isGameOver = false;
      resetBoardArray();
      resetAllRounds();
      resetPlayers();
      resetScores();
    };
    return { resetBoardArray, resetAll, resetPlayers };
  }

  // to switch the players
  function playerSwitching() {
    if (currentPlayer === players[0]) {
      currentPlayer = players[1];
    } else {
      currentPlayer = players[0];
    }
  }
  const getCurrentPlayer = () => currentPlayer; // to get current player
  return {
    printBoard,
    resetGame,
    playerSwitching,
    logWinner,
    validations,
    updateScore,
    checkWinner,
    makeMoveAt,
    currentPlayer,
    getPlayersInfo,
    getRoundsInfo,
    getCurrentPlayer,
    isGameStillActive,
    placeAiToken,
  };
}

// for a bridge between game manager and ui control
function gameControl() {
  let manager = null;
  let isAiMode = false;

  function initializeGame(playerOneName, playerTwoName, humanChosenMarker) {
    let name1 = playerOneName === "" ? "Mark" : playerOneName;
    let name2 = playerTwoName === "" ? "Jake" : playerTwoName;

    if (isAiMode) {
      name2 = "A.I";
    }
    manager = gameManager(name1, name2, humanChosenMarker);

    const gameStateValidations = manager.validations();
    if (
      !gameStateValidations.playersValidation() ||
      !gameStateValidations.boardValidation()
    ) {
      console.log(
        "Invalid game state. Please check the players or board configuration."
      );
      return false;
    }
    return true;
  }

  function logTurn() {
    if (!manager) {
      return {
        turnSwitch: false,
        message: "Game not ready",
      };
    }

    return {
      turnSwitch: true,
      currentToken: manager.getCurrentPlayer().token,
      currentName: manager.getCurrentPlayer().name,
      message: `This is ${manager.getCurrentPlayer().name}'s turn`,
    };
  }
  const checkUserInputs = (rowIndex, colIndex) => {
    if (rowIndex < 0 || rowIndex > 2 || colIndex < 0 || colIndex > 2) {
      console.log("Value is out of bounds");
      return false;
    }
    return true;
  };

  const logResult = (result) => {
    if (!manager) {
      return { roundEnded: false, message: "Game not initialized." };
    }

    if (
      result === "tie" ||
      (typeof result === "object" &&
        result !== null &&
        result.outcome === "win")
    ) {
      manager.getRoundsInfo().currentRound++;
      if (isAiMode) {
        manager.resetGame().resetPlayers(); // reset to first player if ai mode is on
      }
      displayScores();
      manager.resetGame().resetBoardArray(); // reset the board array
      const gameEnd = manager.logWinner(); // log winner
      if (result === "tie") {
        return {
          roundEnded: true,
          outcome: "tie",
          message: "It's a tie. No one wins.",
          gameEndData: gameEnd,
        };
      } else {
        return {
          roundEnded: true,
          outcome: "win",
          winnerName: result.winnerName,
          winningMessage: result.winningMessage,
          gameEndData: gameEnd,
        };
      }
    } else {
      logTurn();
      manager.playerSwitching();
      return { roundEnded: false };
    }
  };
  const getFinalScoresData = () => {
    if (!manager) return null;
    const scores = manager.getRoundsInfo();
    return {
      playerOneScores: scores.playerOneScore,
      playerTwoScores: scores.playerTwoScore,
    };
  };
  const getAiState = () => isAiMode;
  const setAiState = (boolean) => (isAiMode = boolean);

  const performAiMove = () => {
    return manager.placeAiToken();
  };

  // to place token
  const placeTokenAt = (rowIndex, columnIndex) => {
    if (!manager) {
      return {
        success: false,
        message: "Game not started yet",
      };
    }
    let checkInputs = checkUserInputs(rowIndex, columnIndex);
    if (!checkInputs) return "Please do valid moves";
    if (!manager.isGameStillActive()) {
      alert("Refresh to start again");
      return {
        success: false,
        message: "Refresh to play again.",
      };
    }
    let moveResult = manager.makeMoveAt(rowIndex, columnIndex);
    const currentPlayer = manager.getCurrentPlayer();
    const gameResultData = {
      success: true,
      token: currentPlayer.token,
      name: currentPlayer.name,
      row: rowIndex,
      col: columnIndex,
      roundInfo: manager.getRoundsInfo(),
      message1: "Good Game Btw.",
      message2: "Good Move!",
      errorMessage: "Cell is already occupied",
    };
    if (moveResult.success) {
      const result = manager.checkWinner();
      const outcomeInfoHuman = logResult(result);
      let aiMoveMade = false;
      let aiMoveDetailsForUI = null;
      let finalOutcomeForUI = outcomeInfoHuman;
      if (isAiMode && !outcomeInfoHuman.roundEnded) {
        const aiPlacementAttempt = performAiMove();
        if (aiPlacementAttempt.moveMade) {
          aiMoveMade = true;
          aiMoveDetailsForUI = aiPlacementAttempt;
          const aiCheckResult = manager.checkWinner();
          const outcomeInfoAI = logResult(aiCheckResult);
          finalOutcomeForUI = outcomeInfoAI;
        } else {
          console.log("AI could not move.");
        }
      }

      return {
        success: true,
        token: gameResultData.token,
        name: gameResultData.name,
        aiMoveMade: aiMoveMade,
        aiMoveDetails: aiMoveDetailsForUI,
        roundEndInfo: finalOutcomeForUI.roundEnded,
        gameOutcome: finalOutcomeForUI.outcome,
        winnerName: finalOutcomeForUI.winnerName,
        winMessage: finalOutcomeForUI.winningMessage,
        tieMessage: finalOutcomeForUI.message,
        gameOverData: finalOutcomeForUI.gameEndData,
      };
    } else {
      return { success: false, message: moveResult.message };
    }
  };

  const resetForNewMatch = () => manager.resetGame().resetAll();
  const displayScores = () => {
    const scoreMessage = `Round ${manager.getRoundsInfo().currentRound} scores:
      ${manager.getPlayersInfo(0).name} score: ${
      manager.getRoundsInfo().playerOneScore
    }0
      ${manager.getPlayersInfo(1).name} score: ${
      manager.getRoundsInfo().playerTwoScore
    }0`;
    return { scoreMessage };
  };

  return {
    logTurn,
    placeTokenAt,
    initializeGame,
    displayScores,
    resetForNewMatch,
    getFinalScoresData,
    getAiState,
    setAiState,
  };
}
function uiHandler() {
  const controller = gameControl();
  // ui elements references
  const uiElements = [
    {
      startPage: document.querySelector(".start-page"),
      startBtn: document.querySelector(".start-button"),
    },
    {
      choosingForm: document.querySelector(".choosing-form"),
      pvpBtn: document.querySelector(".pvp"),
      aiBtn: document.querySelector(".ai-mode"),
      aiCard: document.querySelector(".ai-card"),
      xMarkerBtn: document.querySelector(".x-marker"),
      oMarkerBtn: document.querySelector(".o-marker"),
      playerCards: document.querySelector(".player-cards"),
      firstPlayerDiv: document.querySelector("#first-player"),
      secondPlayerDiv: document.querySelector("#second-player"),
      formCards: document.querySelector(".form-cards"),
      playerIcon: document.querySelectorAll(".player-icon"),
      formAvatars: document.querySelectorAll(".player-avatar"),
      icons: document.querySelectorAll(".choice-icons"),
      actionBtns: document.querySelector(".action-buttons"),
      cancelBtn: document.querySelector(".cancel-btn"),
      startBtn: document.querySelector(".start-btn"),
    },
    {
      gameUi: document.querySelector(".game-ui"),
      firstPlayerCard: document.querySelector(".player1-card"),
      secondPlayerCard: document.querySelector(".player2-card"),
      player1Icon: document.querySelector(".player1-icon"),
      player2Icon: document.querySelector(".player2-icon"),
      iconImage: document.querySelectorAll(".game-avatar"),
      player1Marker: document.querySelector(".player1-marker"),
      player2Marker: document.querySelector(".player2-marker"),
      player1Name: document.querySelector(".player1-name"),
      player2Name: document.querySelector(".player2-name"),
      player1Points: document.querySelector(".player1-points"),
      player2Points: document.querySelector(".player2-points"),
      player1Card: document.querySelector(".player1-card"),
      player2Card: document.querySelector(".player2-card"),
      markerBtn: document.querySelectorAll(".marker-btn"),
    },
  ];

  const getUiElements = (index) => uiElements[index] || uiElements;

  const formInfo = {
    setMarker: false,
    setGameMode: false,
    setName: function () {
      // checks if name is checked
      const formInput1 = document.querySelector(".player-input-1").value;
      const formInput2 = document.querySelector(".player-input-2").value;
      const pvpBtn = getUiElements(1).pvpBtn;
      if (pvpBtn.classList.contains("mode-selected")) {
        if (formInput1.trim() === "") {
          return false;
        }
        if (formInput2.trim() === "") {
          return false;
        }
      } else {
        if (formInput1.trim() === "") {
          return false;
        }
      }
      return true;
    },
  };

  const formChecks = () => {
    const nameCheck = formInfo.setName();
    if (!formInfo.setMarker) {
      alert("Marker is not selected.");
      return false;
    } else if (!formInfo.setGameMode) {
      alert("Game mode not selected.");
      return false;
    } else if (!nameCheck) {
      alert(
        "One or more players name is not set. Hover over it to input your name."
      );
      return false;
    } else {
      return true;
    }
  };
  const ui = getUiElements(0);
  const gameUiContainer = getUiElements(2).gameUi;
  const startDiv = ui.startPage;
  const formDiv = getUiElements(1).choosingForm;
  const showGameUi = () => {
    gameUiContainer.classList.add("show-game");
    formDiv.classList.remove("active");
    startDiv.classList.add("hide-start-page");
    alert(
      "This game will consist of 3 rounds and the winner will be decided at the end of these three rounds."
    );
  };
  function formSettings() {
    const startBtn = ui.startBtn;
    const cancelBtn = getUiElements(1).cancelBtn;
    const oBtn = getUiElements(1).oMarkerBtn;
    const xBtn = getUiElements(1).xMarkerBtn;
    const pvpBtn = getUiElements(1).pvpBtn;
    const aiBtn = getUiElements(1).aiBtn;
    const playerIconDiv = getUiElements(1).playerIcon;
    const iconSpan = getUiElements(1).icons;
    const secondPlayerCard = getUiElements(1).secondPlayerDiv;
    const aiCardDiv = getUiElements(1).aiCard;
    const actionBtns = getUiElements(1).actionBtns;
    const formCardsContainer = getUiElements(1).formCards;

    const showForm = () => {
      startDiv.classList.add("hide-start-page");
      formDiv.classList.add("active");
    };

    const hideForm = () => {
      setTimeout(() => {
        formDiv.classList.remove("active");
        formCardsContainer.classList.remove("show-cards");
        pvpBtn.classList.remove("mode-selected");
        actionBtns.classList.remove("new-margin");
      }, 10);
      startDiv.classList.remove("hide-start-page");
    };

    const selectedMarkerStyling = (button) => {
      button.classList.toggle("selected");
      if (button === xBtn) {
        oBtn.classList.remove("selected");
      } else {
        xBtn.classList.remove("selected");
      }
      formInfo.setMarker = true;
    };
    // shows ai card
    const showAiCard = () => {
      aiBtn.classList.toggle("mode-selected");
      controller.setAiState(true);
      if (aiBtn.classList.contains("mode-selected")) {
        formCardsContainer.classList.add("show-cards");
        actionBtns.classList.add("new-margin");
        aiCardDiv.classList.add("show-ai");
        secondPlayerCard.classList.add("hide-card");
      } else {
        formCardsContainer.classList.remove("show-cards");
        actionBtns.classList.remove("new-margin");
        aiCardDiv.classList.remove("show-ai");
        secondPlayerCard.classList.remove("hide-card");
      }
      if (pvpBtn.classList.contains("mode-selected")) {
        pvpBtn.classList.remove("mode-selected");
      }
    };

    const showCards = () => {
      // shows player cards
      pvpBtn.classList.toggle("mode-selected");
      controller.setAiState(false);
      if (pvpBtn.classList.contains("mode-selected")) {
        formCardsContainer.classList.add("show-cards");
        actionBtns.classList.add("new-margin");
        aiCardDiv.classList.remove("show-ai");
        secondPlayerCard.classList.remove("hide-card");
      } else {
        formCardsContainer.classList.remove("show-cards");
        actionBtns.classList.remove("new-margin");
        aiCardDiv.classList.remove("show-ai");
        secondPlayerCard.classList.remove("hide-card");
      }
      if (aiBtn.classList.contains("mode-selected")) {
        aiBtn.classList.remove("mode-selected");
      }
    };
    const showIconsContainer = (buttons) => {
      // show icons container when hovered
      buttons.forEach((button) => {
        const iconBox = button.querySelector(".icon-box");
        button.addEventListener("mouseenter", () => {
          iconBox.classList.add("show-box");
        });
        button.addEventListener("mouseleave", () => {
          iconBox.classList.remove("show-box");
        });
      });
    };

    const handleIconSelection = (icons) => {
      const player1 = getUiElements(1).firstPlayerDiv;
      const player2 = getUiElements(1).secondPlayerDiv;
      let selectedImage = null;
      icons.forEach((icon) => {
        icon.addEventListener("click", () => {
          icons.forEach((i) => i.classList.remove("icon-selected"));
          icon.classList.add("icon-selected");
          const image = icon.querySelector("img");
          selectedImage = image.src;
          if (player1.contains(icon)) {
            player1.querySelector(".player-avatar").src = selectedImage;
          } else {
            player2.querySelector(".player-avatar").src = selectedImage;
          }
        });
      });
    };
    const addEventListeners = () => {
      startBtn.addEventListener("click", showForm);
      cancelBtn.addEventListener("click", hideForm);
      pvpBtn.addEventListener("click", () => {
        formInfo.setGameMode = true;
        showCards();
      });
      aiBtn.addEventListener("click", () => {
        formInfo.setGameMode = true;
        showAiCard();
      });

      showIconsContainer(playerIconDiv);
      handleIconSelection(iconSpan);

      xBtn.addEventListener("click", () => {
        selectedMarkerStyling(xBtn);
      });
      oBtn.addEventListener("click", () => {
        selectedMarkerStyling(oBtn);
      });
    };
    addEventListeners();
  }
  // handle the main game ui
  function gameHandler() {
    const player1Score = getUiElements(2).player1Points;
    const player2Score = getUiElements(2).player2Points;
    const iconImages = getUiElements(2).iconImage;
    const player1NameDiv = getUiElements(2).player1Name;
    const player2NameDiv = getUiElements(2).player2Name;
    const aiBtn = getUiElements(1).aiBtn;
    const firstPlayerMarker = getUiElements(2).player1Marker;
    const secondPlayerMarker = getUiElements(2).player2Marker;
    const firstPlayerDiv = getUiElements(2).firstPlayerCard;
    const secondPlayerDiv = getUiElements(2).secondPlayerCard;
    const spans = document.querySelectorAll(".marker-span");
    const markerBtns = getUiElements(2).markerBtn;
    const startBtn = getUiElements(1).startBtn;

    const setPlayerNames = () => {
      const formInput1 = document.querySelector(".player-input-1").value;
      const formInput2 = document.querySelector(".player-input-2").value;
      let name1, name2;

      if (formInput1.trim() === "") {
        name1 = "Mark";
      } else {
        name1 = formInput1;
        //formInfo.setName = true;
      }
      if (formInput2.trim() === "") {
        name2 = "Jake";
      } else {
        name2 = formInput2;
        // formInfo.setName = true;
      }
      if (aiBtn.classList.contains("mode-selected")) {
        player1NameDiv.textContent = name1;
        player2NameDiv.textContent = "A.I";
        //controller.getAiState() = true;
      } else {
        player1NameDiv.textContent = name1;
        player2NameDiv.textContent = name2;
      }
    };

    const setPlayerMarkers = () => {
      const xMarkerBtn = getUiElements(1).xMarkerBtn;
      const oMarkerBtn = getUiElements(1).oMarkerBtn;
      if (xMarkerBtn.classList.contains("selected")) {
        firstPlayerMarker.textContent = "X";
        firstPlayerMarker.style.color = "#3a7c85";
        secondPlayerMarker.textContent = "O";
        secondPlayerMarker.style.color = "#9c8e7c";
        return "X";
      } else if (oMarkerBtn.classList.contains("selected")) {
        firstPlayerMarker.textContent = "O";
        firstPlayerMarker.style.color = "#9c8e7c";
        secondPlayerMarker.textContent = "X";
        secondPlayerMarker.style.color = "#3a7c85";
        return "O";
      }
    };
    const setPlayerIcons = () => {
      const card1 = getUiElements(2).firstPlayerCard;
      const card2 = getUiElements(2).secondPlayerCard;
      const formImages = getUiElements(1).formAvatars;
      iconImages.forEach((image) => {
        if (card1.contains(image)) {
          image.src = formImages[0].src;
        } else if (card2.contains(image)) {
          image.src = aiBtn.classList.contains("mode-selected")
            ? "player-icons-pack/ai.png"
            : formImages[1].src;
        }
      });
    };

    // visually highlight the current player
    const turnIndicator = () => {
      const activePlayer = controller.logTurn().currentName;

      if (activePlayer === player1NameDiv.textContent) {
        firstPlayerDiv.classList.add("active-player1");
        secondPlayerDiv.classList.remove("active-player2");
      } else if (activePlayer === player2NameDiv.textContent) {
        secondPlayerDiv.classList.add("active-player2");
        firstPlayerDiv.classList.remove("active-player1");
      }
    };
    const showScores = () => {
      const scoreInfo = controller.displayScores();
      const playerScores = controller.getFinalScoresData();
      alert(scoreInfo.scoreMessage);
      player1Score.textContent = `${playerScores.playerOneScores}0 points`;
      player2Score.textContent = `${playerScores.playerTwoScores}0 points`;
    };
    const showWinner = (result) => {
      setTimeout(() => {
        if (result.roundEndInfo) {
          spans.forEach((span) => {
            span.textContent = "";
          });
          if (result.gameOutcome === "tie") {
            alert(result.tieMessage);
          } else {
            alert(result.winMessage);
          }
          showScores();
          if (result.gameOverData && result.gameOverData.finalMatchOver) {
            showGameEndData(result);
          }
        }
      }, 300);
    };
    const showFinalGameWinner = (result) => {
      const finalGameData = result.gameOverData;
      if (
        finalGameData.finalMatchResult === "win" ||
        finalGameData.finalMatchResult === "tie"
      ) {
        if (finalGameData.finalMatchWinner === player1NameDiv.textContent) {
          alert(
            `${finalGameData.finalMatchWinner} wins the game with scores ${finalGameData.winnerScores}0`
          );
        } else if (
          finalGameData.finalMatchWinner === player2NameDiv.textContent
        ) {
          alert(
            `${finalGameData.finalMatchWinner} wins the game with scores ${finalGameData.winnerScores}0`
          );
        } else {
          alert(finalGameData.finalMatchMessage);
        }
      }
    };
    const showFinalScores = (result) => {
      let userResponse = confirm("Game Over! Do you want to play again ?");

      if (userResponse) {
        controller.resetForNewMatch();
        alert("The game has been reset. Starting a new match");
        if (controller.getAiState()) {
          controller.setAiState(true);
        }
        player1Score.textContent = "00 points";
        player2Score.textContent = "00 points";
      } else {
        result.gameOver = true;
        alert(`The final accumulated scores are:
        ${player1NameDiv.textContent} score: ${
          controller.getFinalScoresData().playerOneScores
        }0 points.
        ${player2NameDiv.textContent} score: ${
          controller.getFinalScoresData().playerTwoScores
        }0 points.`);
      }
    };
    const showGameEndData = (result) => {
      showFinalGameWinner(result);
      showFinalScores(result);
    };
    //places ai token in ui
    const aiTokenPlacer = (result) => {
      if (result.aiMoveMade) {
        const aiMoveDetails = result.aiMoveDetails;
        const aiRow = aiMoveDetails.row;
        const aiCol = aiMoveDetails.column;
        const aiToken = aiMoveDetails.token;
        const targetButtonNumber = aiRow * 3 + aiCol + 1;
        const targetButtonClass = `btn-${targetButtonNumber}`;

        const aiTargetButton = document.querySelector(`.${targetButtonClass}`);

        secondPlayerDiv.classList.add("active-player2");
        if (aiTargetButton) {
          const insideSpanForAI = aiTargetButton.querySelector(".marker-span");

          if (insideSpanForAI) {
            setTimeout(() => {
              insideSpanForAI.textContent = aiToken;
              insideSpanForAI.style.color =
                aiToken === "O" ? "#9c8e7c" : "#3a7c85";
              // for visual highlighting purposes in case of ai
              if (!result.roundEndInfo) {
                // if round isn't ended
                setTimeout(() => {
                  firstPlayerDiv.classList.add("active-player1");
                  secondPlayerDiv.classList.remove("active-player2");
                }, 500);
              } else {
                setTimeout(() => {
                  showWinner(result);
                  setTimeout(() => {
                    firstPlayerDiv.classList.add("active-player1");
                    secondPlayerDiv.classList.remove("active-player2");
                  });
                });
              }
            }, 700);
          } else {
            console.error(
              "Could not find span inside AI target button:",
              aiTargetButton
            );
          }
        } else {
          console.error(
            "Could not find AI target button element with class:",
            targetButtonClass
          );
        }
      }
    };
    // places marker in ui
    const markerPlacer = () => {
      // gets the button classes
      const getElementsClass = (element) => {
        for (let i = 0; i <= 9; i++) {
          if (element.classList.contains(`btn-${i}`)) return `Button-${i}`;
        }
      };
      const coordMap = {
        "Button-1": [0, 0],
        "Button-2": [0, 1],
        "Button-3": [0, 2],
        "Button-4": [1, 0],
        "Button-5": [1, 1],
        "Button-6": [1, 2],
        "Button-7": [2, 0],
        "Button-8": [2, 1],
        "Button-9": [2, 2],
      };

      const getCoordinates = (btn) => coordMap[getElementsClass(btn)]; // get co ordinates to match with board array

      markerBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const coords = getCoordinates(btn);
          const result = controller.placeTokenAt(coords[0], coords[1]);
          const insideSpan = btn.querySelector(".marker-span");
          if (result.success) {
            insideSpan.textContent = result.token;
            insideSpan.style.color =
              insideSpan.textContent === "X" ? "#3a7c85" : "#9c8e7c";
            if (result.roundEndInfo && !result.aiMoveMade) {
              setTimeout(() => {
                showWinner(result);
              }, 300);
            }
            turnIndicator();
            setTimeout(() => {
              aiTokenPlacer(result);
            }, 400);
          } else {
            return;
          }
        });
      });
    };

    const startGame = () => {
      const formInput1 = document.querySelector(".player-input-1").value;
      const formInput2 = document.querySelector(".player-input-2").value;
      const chosenMarker = setPlayerMarkers();
      let gameStart = controller.initializeGame(
        formInput1,
        formInput2,
        chosenMarker
      );
      if (gameStart) {
        setPlayerNames();
        setPlayerIcons();
        turnIndicator();
        setPlayerMarkers();
        markerPlacer();
      } else {
        alert(
          "Failed to initialize game. Please check configuration or console."
        );
      }
    };

    startBtn.addEventListener("click", () => {
      const checks = formChecks();
      if (checks) {
        showGameUi();
        startGame();
      } else {
        return;
      }
    });
  }
  formSettings();
  gameHandler();
  return { getUiElements };
}
uiHandler();
