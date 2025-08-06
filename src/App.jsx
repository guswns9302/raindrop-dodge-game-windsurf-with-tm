import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import GameStart from './components/GameStart'
import GamePlay from './components/GamePlay'
import GameResult from './components/GameResult'
import { AppWrapper, GameContainer } from './components/styled/Wrapper'
import { GlobalStyle } from './GlobalStyle'
import { theme } from './theme'

function App() {
  const [gamePhase, setGamePhase] = useState('start') // 'start', 'playing', 'result'
  const [playerName, setPlayerName] = useState('')
  const [finalScore, setFinalScore] = useState(0)

  const handleStartGame = (name) => {
    setPlayerName(name)
    setGamePhase('playing')
  }

  const handleGameEnd = (score) => {
    setFinalScore(score)
    setGamePhase('result')
  }

  const handleRestart = () => {
    setFinalScore(0)
    setGamePhase('playing')
  }

  const handleBackToStart = () => {
    setPlayerName('')
    setFinalScore(0)
    setGamePhase('start')
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppWrapper>
        <GameContainer>
          {gamePhase === 'start' && (
            <GameStart onStartGame={handleStartGame} />
          )}
          
          {gamePhase === 'playing' && (
            <GamePlay 
              playerName={playerName}
              onGameEnd={handleGameEnd}
              onBackToStart={handleBackToStart}
            />
          )}
          
          {gamePhase === 'result' && (
            <GameResult 
              playerName={playerName}
              score={finalScore}
              onRestart={handleRestart}
              onBackToStart={handleBackToStart}
            />
          )}
        </GameContainer>
      </AppWrapper>
    </ThemeProvider>
  )
}

export default App
