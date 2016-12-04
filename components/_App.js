import { render } from 'react-dom';
import React, { Component } from 'react';
import 'react-fastclick';
import mainStyle from '../styles/main.sass';
import classnames from 'classnames';

const WORD = {
  RED: 'أحمر',
  BLUE: 'أزرق',
  GREEN: 'أخضر',
  YELLOW: 'أصفر',
  WHITE: 'أبيض',
  BLACK: 'أسود',
}

const COLOR = {
  RED: '#F44336',
  BLUE: '#2196F3',
  GREEN: '#4CAF50',
  YELLOW: '#FFEB3B',
  WHITE: '#fff',
  BLACK: '#000',
}

const data =  [
  {
    code: 1,
    word: WORD.RED,
    color: COLOR.RED,
  },
  {
    code: 2,
    word: WORD.BLUE,
    color: COLOR.BLUE,
  },
  {
    code: 3,
    word: WORD.GREEN,
    color: COLOR.GREEN,
  },
  {
    code: 4,
    word: WORD.YELLOW,
    color: COLOR.YELLOW,
  },
  {
    code: 5,
    word: WORD.WHITE,
    color: COLOR.WHITE,
  },
  {
    code: 6,
    word: WORD.BLACK,
    color: COLOR.BLACK,
  },
]

window.data = data;
class _App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      topItem: {code: 0, word: '', color: ''},
      botItem: {code: 0, word: '', color: ''},
      time: 20,
      timeToDisplay: 0,
      tries: -1,
      score: 0,
      correctTries: 0,
      popped: true,
      bammed: false,
      correct: true,
      gameOn: false,
      gameoverOn: false,
      mainMenuOn: true,
      rulesOn: false,
      highestScore: 0,
    }
  }

  componentDidMount() {
    setInterval(()=>{
      if(this.state.time <= 0 && !this.state.mainMenuOn && !this.state.gameoverOn) {
        this.setState({
          gameOn: false,
          gameoverOn: true,
          mainMenuOn: false,
          timeToDisplay: 0,
          score: (this.state.correctTries + this.state.timeToDisplay) * 10
        })
      }else{
        this.setState({time: this.state.time-1})
      }
    }, 1000)
    let localHighestScore = localStorage.getItem('hs') ? parseInt(localStorage.getItem('hs')) : 0;
    this.setState({highestScore: localHighestScore},()=>{
      this._nextItem();
    })
  }

  _nextItem() {
    let topIndex = Math.floor(Math.random(data.length)*10) % 5;
    let botWordIndex = Math.floor(Math.random(data.length)*10) % 5;
    let botColorIndex = Math.floor(Math.random(data.length)*10) % 5;
    this.setState({
      topItem: data[topIndex],
      botItem: {
        code: data[botColorIndex].code,
        color: data[botColorIndex].color,
        word: data[botWordIndex].word
      },
      popped: true,
      tries: this.state.tries + 1
    }, ()=>{
      setTimeout(()=>{
        this.setState({popped: false});
      }, 300)
    })
  }

  _reset() {
    this.setState({
      topItem: {code: 0, word: '', color: ''},
      botItem: {code: 0, word: '', color: ''},
      time: 20,
      timeToDisplay: 0,
      tries: -1,
      score: 0,
      correctTries: 0,
      popped: true,
      bammed: false,
      correct: true,
      gameOn: true,
      gameoverOn: false,
      mainMenuOn: false,
    },()=>{
      this._nextItem();
    })
  }

  submit(answer){
    if(this.state.time > 0 && this.state.tries < 9){

    if(!this.state.popped){
      //verifying answer
      if(answer) {
        if(this.state.topItem.code == this.state.botItem.code){
          this.setState({
            correctTries: this.state.correctTries + 1,
            correct: true,
          })
        }else {
          this.setState({
            correct: false,
          })
        }
      } else {
        if(this.state.topItem.code != this.state.botItem.code){
          this.setState({
            correctTries: this.state.correctTries + 1,
            correct: true,
          })
        }else {
          this.setState({
            correct: false,
          })
        }
      }

      //stamping
      this.setState({
        bammed: true,
      }, ()=>{
        setTimeout(()=>{
          this.setState({bammed: false});
        }, 200)
      })

      setTimeout(()=>{
          this._nextItem();
      }, 300)

    }
  } else {
    console.log('else')
    this.setState({
      gameOn: false,
      gameoverOn: true,
      mainMenuOn: false,
      timeToDisplay: this.state.time,
      score: (this.state.correctTries + this.state.timeToDisplay) * 10
    }, ()=>{
      let localHighestScore = localStorage.getItem('hs') ? parseInt(localStorage.getItem('hs')) : 0;
      if(this.state.score > localHighestScore) {
        localStorage.setItem('hs', this.state.score);
        this.setState({
          highestScore: this.state.score
        })
      }
    })
  }
  }

  playAgain = () => {
    this._reset();
    this.setState({
      gameOn: true,
      gameoverOn: false,
      mainMenuOn: false,
    })
  }

  goHome = () => {
    this.setState({
      gameOn: true,
      gameoverOn: false,
      mainMenuOn: true,
    })
  }

  showRules = () =>{
    this.setState({
      rulesOn: true
    })
  }

  hideRules = () => {
    this.setState({
      rulesOn: false
    })
  }

  render() {
    return(
      <div class="root">
        <div class={classnames({
          "main-menu": true,
          "on": this.state.mainMenuOn,
        })}>
          <div class="main-container">
            <div class={classnames({
              "rules": true,
              "on": this.state.rulesOn
            })}>
              <div class="rules-text">
                تكون الإجابة بنعم صحيحة إذا كان معني الكلمة في الصندوق الأول موافقة للون الكلمة في الصندوق الثاني
              </div>
              <a href="#" class="close-rules"
                onClick={this.hideRules}>&times;</a>
            </div>
            <div class="highest-score">
              <div class="title">أفضل نتيجة</div>
              <div class="value">{this.state.highestScore}</div>
            </div>
            <div class="rules-container">
              <a href="#" class="rules-button"
                onClick={this.showRules}
              >القواعد</a>
            </div>
            <a href="#" class="start"
              onClick={this.playAgain}
            ><i class="material-icons">play_circle_filled</i></a>
          </div>
        </div>
        <div class={classnames({
          "gameover": true,
          "on": this.state.gameoverOn,
        })}>
          <div class="info-container">
          <div class="score">
            <div class="title">النتيجة</div>
            <div class="value">{this.state.score}</div>
          </div>
            <div class="tries">
              <div class="title">محاولات صحيحة</div>
              <div class="value">{this.state.tries+1}/{this.state.correctTries}</div>
            </div>
            <div class="time">
              <div class="title">مدة اللعب بالثانية</div>
              <div class="value">{20 - this.state.timeToDisplay}</div>
            </div>
          </div>
          <div class="gameover-controlls">
            <a href="#" class="play button" onClick={this.playAgain}>
              <i class="material-icons">refresh</i>
            </a>
            <a href="#" class="return button" onClick={this.goHome}>
              <i class="material-icons">account_balance</i>
            </a>
          </div>
        </div>
        <div class="game-area">
          <div class="game-menu">
          <div class="time">الوقت:{this.state.time}</div>
          <div class="tries">المحاولات:10/{this.state.tries}</div>

          </div>
          <div class="game-subject">
            <div class="subject-container">
              <div class={classnames({
                "stamp-container": true,
              })}>
                <div class={classnames({
                  "stamp": true,
                  "correct": this.state.correct,
                  "bammed": this.state.bammed,
                })}>{this.state.correct ? 'صحيح' : 'خطأ'}</div>
              </div>
              <div class={classnames({
                "top-box": true,
                "popped": this.state.popped,
              })}
                dangerouslySetInnerHTML={{__html: this.state.topItem.word}}
              ></div>
              <div class={classnames({
                "bot-box": true,
                "popped": this.state.popped,
              })}
                style={{color: this.state.botItem.color}}
                >{this.state.botItem.word}</div>
            </div>
          </div>
          <div class="game-controlls">
          <a href="#" class="no-button" onClick={this.submit.bind(this, false)}>لا</a>
            <a href="#" class="yes-button" onClick={this.submit.bind(this, true)}>نعم</a>
          </div>
        </div>
      </div>
    )
  }

}

render(<_App/>, document.getElementById('app'));
