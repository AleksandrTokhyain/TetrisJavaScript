const KEYS = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
}

const wsUrl = 'ws://34.91.128.107:8080'

let tetris
window.onload = () => {
  document.onclick = () => document.body.requestFullscreen()

  const tetrisContainer = document.getElementById('tetris')
  const configureTetris = tetris => {
    tetris.onGameOver = () => { document.getElementById('game-over').style.display = 'block' }
    tetris.onInfoChage = info => {
      document.querySelectorAll('[class^="piece--next"]')
        .forEach(element => {element.className = `piece--next--${info.nextPieceType}`})
      document.getElementsByClassName('__tetris-container')[0]
        .dataset.infoText = `Level ${info.level}  ::  Score ${info.score}`
    }
    return tetris
  }
  tetris = configureTetris(new WebTetrisClient(tetrisContainer, wsUrl))
  tetris.onError = () => {
    tetris = configureTetris(new WebTetris(tetrisContainer))
    tetris.start()
  }

  const addButtonPressEvent = (element, action) => {
    const keyPress = (target, action) => {
      action()

      let interval
      const timeout = setTimeout(() => {
        document.getElementById('tetris').classList.add('key-press')
        interval = setInterval(() => action(), 50)
      }, 250)
      target.onmouseup = target.ontouchend = () => {
        document.getElementById('tetris').classList.remove('key-press')
        clearInterval(interval)
        clearTimeout(timeout)
        target.onmouseup = target.ontouchend = null
      }
    }
    element.ontouchstart = element.onmousedown = event => {
      event.preventDefault()
      keyPress(event.target, action)
    }
  }
  addButtonPressEvent(document.getElementsByClassName('control--left')[0], () => tetris.movePieceLeft())
  addButtonPressEvent(document.getElementsByClassName('control--down')[0], () => tetris.movePieceDown())
  addButtonPressEvent(document.getElementsByClassName('control--right')[0], () => tetris.movePieceRight())
  addButtonPressEvent(document.getElementsByClassName('control--action')[0], () => tetris.rotatePiece())

  document.onkeydown = event => {
    switch (event.keyCode) {
      case KEYS.UP:
        tetris.rotatePiece()
        break
      case KEYS.DOWN:
        tetris.movePieceDown()
        break
      case KEYS.LEFT:
        tetris.movePieceLeft()
        break
      case KEYS.RIGHT:
        tetris.movePieceRight()
        break
    }
  }
}
