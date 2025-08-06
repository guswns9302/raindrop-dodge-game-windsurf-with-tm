import React from 'react';
import { Card } from './styled/Wrapper';
import { CardContent, Title, Subtitle, Text, HighlightText, Button, ButtonGroup, ScoreDisplay, ScoreLabel, ScoreValue } from './styled/UI';

const GameResult = ({ playerName, score, onRestart, onBackToStart }) => {
  const getScoreMessage = (score) => {
    if (score >= 25) return '훌륭해요! ';
    if (score >= 20) return '잘했어요! ';
    if (score >= 15) return '좋아요! ';
    if (score >= 10) return '괜찮아요! ';
    return '다시 도전해보세요! ';
  };

  return (
    <Card>
      <CardContent>
        <Title> 게임 종료!</Title>
        <Subtitle>{playerName}님의 결과</Subtitle>
        
        <ScoreDisplay>
          <ScoreLabel>최종 점수</ScoreLabel>
          <ScoreValue>{score}점</ScoreValue>
        </ScoreDisplay>
        
        <Text align="center">
          {getScoreMessage()}
        </Text>
        
        <ButtonGroup>
          <Button onClick={onRestart}>
            다시 하기
          </Button>
          <Button variant="secondary" onClick={onBackToStart}>
            처음으로
          </Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
};

export default GameResult;
