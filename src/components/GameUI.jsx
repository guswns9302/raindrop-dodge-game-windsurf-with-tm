import React from 'react';
import { FlexContainer } from './styled/Wrapper';
import { ScoreDisplay, TimerDisplay, PlayerNameDisplay } from './styled/UI';

const GameUI = ({ playerName, survivedTime, score }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      right: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      zIndex: 100,
      pointerEvents: 'none'
    }}>
      <PlayerNameDisplay style={{ pointerEvents: 'auto' }}>
        플레이어: {playerName}
      </PlayerNameDisplay>
      
      <FlexContainer direction="column" align="center" gap="10px" style={{ pointerEvents: 'auto' }}>
        <TimerDisplay timeLeft={null}>
          생존 시간: {survivedTime}초
        </TimerDisplay>
        <ScoreDisplay>
          점수: {score}
        </ScoreDisplay>
      </FlexContainer>
      
      {/* 키보드 조작 안내 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        pointerEvents: 'auto'
      }}>
        방향키 또는 WASD로 이동하세요
      </div>
    </div>
  );
};

export default GameUI;
