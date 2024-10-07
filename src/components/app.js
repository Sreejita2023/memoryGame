import React, { Component ,useEffect} from "react";
import "../assets/css/app.css";
import Card from "./card";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHeart,
  faSpa,
  faAnchor,
  faCube,
  faDice,
  faBicycle,
  faLeaf
} from "@fortawesome/free-solid-svg-icons";
library.add(faHeart, faSpa, faAnchor, faCube, faDice, faBicycle, faLeaf);

class App extends Component {
  constructor(props) {
    super(props);

    this.cardsToPopulate = [
      "heart",
      "anchor",
      "cube",
      "leaf",
      "dice",
      "bicycle",
      "heart",
      "anchor",
      "cube",
      "leaf",
      "dice",
      "bicycle"
    ];
    this.cards = [...this.cardsToPopulate];

    this.state = {
      cardRevealStates: new Array(this.cards.length).fill(false),
      numberOfAttempts: 0,
      numberOfClicks: 0,
      gamesPlayed: 1,
      accuracy: 0,
      highScores: []
    };
    // console.log(this.state.cardRevealStates);

    this.handleClick = this.handleClick.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.addNumberOfClicks = this.addNumberOfClicks.bind(this);
    this._addHighScore = this._addHighScore.bind(this);
  }


  _addHighScore() {
    this.setState({
      highScores: [...this.state.highScores, this.state.numberOfAttempts].sort()
    })
    console.log("this is the accuracy ",this.state.accuracy)
    this.startNewGame()
  }
  

  render() {
    const { numberOfAttempts, gamesPlayed, accuracy } = this.state;
    return (
      <div className="App">
        <div >
          <p id="gameStats">
            <span className="stat">Games Played: {gamesPlayed}</span>
            <span className="stat">Attempts: {numberOfAttempts}</span>
            <span className="stat">Accuracy: {accuracy}%</span>
          </p>
          <div className="gamecomplete">
            <p id="gc" />
          </div>

          <div id="gameArea">{this.renderCards()}</div>
          <div id="buttondiv">
            <button className="startGame-btn" onClick={this.startNewGame}>
              Start New Game
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  hideCards(onSetState = () => {}) {
    setTimeout(() => {
      this.setState(
        {
          cardRevealStates: new Array(this.cards.length).fill(false)
        },
        onSetState()
      );
    }, 500);
  }
  removeMatches(match) {
    this.hideCards(() => {
      this.cards = this.removeMatchedCardsFromList(match);
    });
  }

  isMatch(cardsArr) {
    return cardsArr.every((val, i, arr) => val === arr[0]);
  }

  getRevealedCards() {
    return this.cards.filter((_, i) => this.state.cardRevealStates[i]);
  }

  removeMatchedCardsFromList(match) {
    return this.cards.filter(card => card !== match);
  }

  addNumberOfAttempts() {
    this.setState(prevState => ({
      numberOfAttempts: prevState.numberOfAttempts + 1
    }));
  }

  checkForMatch() {
    const revealedCards = this.getRevealedCards();
    if (revealedCards.length === 2) {
      if (this.isMatch(revealedCards)) {
        this.removeMatches(revealedCards[0]);
      }
      if(this.cards.length == 2){
        console.log("acuracy",this.state.accuracy)
      }
      this.hideCards(() => {
        this.updateAccuracy();

        if (this.cards.length === 0) {
          console.log("Game Complete in " + this.state.numberOfAttempts + " Attempts");
          document.getElementById("gc").innerHTML =
              "Game Complete in " + this.state.numberOfAttempts + " Attempts";
          document.getElementById("buttondiv").style.display = "none";
 
          const result=this.state.accuracy>50?"win":"lose";
          this.updateSoloResults(result)
          // Add a delay before starting a new game
          // setTimeout(() => {
          //     this.startNewGame();  // Automatically start a new game
          //     document.getElementById("buttondiv").style.display = "block";  // Show the button again for manual restarts
          //     document.getElementById("gc").innerHTML = "";  // Clear the completion message
          // }, 2000);  // Delay for 1 second before restarting the game
      }
      });
    }
  }

  handleClick(index) {
    const newRevealStates = this.state.cardRevealStates;
    newRevealStates[index] = true;
    //cards actively flipped counter 
    let cardsFlipped = 0;
    
    //adds how many active cards flipped there are
    newRevealStates.forEach(function(el) {
      if (el === true) {
        cardsFlipped++;
      } else {
        return;
      }
    });

    //checks if only two cards are flipped
    if (cardsFlipped < 3) {
      //if only 2 are flipped it continues on
      this.setState({
        cardRevealStates: newRevealStates
      });

      this.checkForMatch();

      this.addNumberOfClicks();
    } else {
      //if more then two are it returns and doesn't let you flip another
      return;
    }

    
  }

  addNumberOfClicks() {
    const { numberOfClicks } = this.state;
    const clicks = numberOfClicks + 1;
    const attempts = Math.floor(clicks / 2);
    this.setState({
      numberOfClicks: clicks,
      numberOfAttempts: attempts
    });
  }


 updateSoloResults = async (result) => {
    try {
      // The data to be sent in the body of the request
      const data = {
        email: "test@gmail.com", // Replace with actual player email
      };
      console.log(data);

      // Make a POST request to the backend API using fetch
      const response = await fetch(
        "https://gamemateserver-ezf2bagbgbhrdcdt.westindia-01.azurewebsites.net/updateSoloResults",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@gmail.com",
            result: result,
          }),
        }
      );

      // Check if the response is successful
      if (response.ok) {
        console.log("Match result updated successfully.");

        // Redirect to home page after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          window.location.href = `/`;
        }, 3000);
      } else {
        // Handle HTTP errors by logging the status and statusText
        console.error(`Failed to update match result: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      // Handle fetch or network errors
      console.error("Error while updating match result:", error);
    }
  };

  updateAccuracy() {
    const { numberOfClicks } = this.state;
    const clicks = numberOfClicks + 1;
    const attempts = Math.floor(clicks / 2);
    const originalCardsLength = this.cardsToPopulate.length;
    const currentCardsLength = this.cards.length;
    const revealedCards = Math.ceil(
      (originalCardsLength - currentCardsLength) / 2
    );
    const accuracy = Math.floor(
      revealedCards ? (revealedCards / attempts) * 100 : 0
    );

    this.setState({
      accuracy: accuracy
    });
  }

  renderCards() {
    return this.cards.map((icon, index) => (
      <Card
        key={`${icon}-${index}`}
        clickCallback={this.handleClick}
        index={index}
        icon={icon}
        display={this.state.cardRevealStates[index]}
      />
    ));
  }

  startNewGame() {
    const { gamesPlayed } = this.state;
    this.cards = [...this.cardsToPopulate];
    this.setState({
      cardRevealStates: new Array(this.cards.length).fill(false),
      gamesPlayed: gamesPlayed + 1,
      accuracy: 0,
      numberOfAttempts: 0,
      numberOfClicks: 0
    });
  }
}

export default App;