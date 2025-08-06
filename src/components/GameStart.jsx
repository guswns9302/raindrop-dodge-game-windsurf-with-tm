import React, { useState } from 'react';
import { Card } from './styled/Wrapper';
import { CardContent, Title, Subtitle, FormGroup, Label, Input, Button, ErrorMessage, Text, HighlightText } from './styled/UI';

const GameStart = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 이름 유효성 검사 (최소 1자, 최대 20자)
    if (playerName.trim().length === 0) {
      setError('플레이어 이름을 입력해주세요.');
      return;
    }
    
    if (playerName.trim().length > 20) {
      setError('이름은 20자 이하로 입력해주세요.');
      return;
    }
    
    setError('');
    onStartGame(playerName.trim());
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  return (
    <Card>
      <CardContent>
        <Title>🌧️ 물방울 피하기 게임</Title>
        <Subtitle>하늘에서 떨어지는 물방울을 피하며 최대한 오래 버텔보세요!</Subtitle>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FormGroup>
            <Label htmlFor="playerName">플레이어 이름:</Label>
            <Input
              type="text"
              id="playerName"
              value={playerName}
              onChange={handleNameChange}
              placeholder="이름을 입력하세요 (1-20자)"
              hasError={!!error}
              maxLength={20}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>
          
          <Button type="submit" disabled={!playerName.trim()}>
            게임 시작
          </Button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'left', width: '100%' }}>
          <Subtitle as="h3">🎮 게임 방법</Subtitle>
          <Text>
            • <HighlightText>키보드 방향키 또는 WASD</HighlightText>로 플레이어를 움직이세요<br/>
            • 떨어지는 <HighlightText>물방울을 피하세요</HighlightText><br/>
            • <HighlightText>물방울에 맞으면 게임 종료!</HighlightText><br/>
            • 바닥에 닿은 물방울 1개당 <HighlightText>1점</HighlightText> 획득<br/>
            • 시간이 지날수록 난이도가 올라갑니다
          </Text>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStart;
