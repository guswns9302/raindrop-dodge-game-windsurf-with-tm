import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Title, Subtitle, Text, Button, ButtonGroup, ScoreDisplay, ScoreLabel, ScoreValue } from './styled/UI';

// 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// 모달 오버레이
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${props => props.theme.zIndex.modal};
  animation: ${fadeIn} 0.3s ease-out;
`;

// 모달 컨테이너
const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: ${props => props.theme.spacing['2xl']};
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: ${slideUp} 0.4s ease-out;
  position: relative;
  
  ${props => props.theme.media?.mobile} {
    padding: ${props => props.theme.spacing.xl};
    max-width: 95%;
  }
`;

// 게임 오버 제목
const GameOverTitle = styled(Title)`
  color: ${props => props.theme.colors.status.error};
  margin-bottom: ${props => props.theme.spacing.lg};
  animation: ${pulse} 2s ease-in-out infinite;
  text-shadow: 2px 2px 4px rgba(231, 76, 60, 0.3);
`;

// 점수 컨테이너
const ScoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${props => props.theme.spacing.xl} 0;
`;

// 메시지 컨테이너
const MessageContainer = styled.div`
  text-align: center;
  margin: ${props => props.theme.spacing.lg} 0;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

// 통계 그리드
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} 0;
  
  ${props => props.theme.media?.mobile} {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const GameOverModal = ({ 
  isVisible, 
  playerName, 
  score, 
  survivedTime,
  onRestart, 
  onBackToStart 
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // 충돌 이펙트를 충분히 보여준 후 모달 표시
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1500); // 1.5초 후 모달 표시
      
      return () => clearTimeout(timer);
    } else {
      setShowModal(false);
    }
  }, [isVisible]);

  const getScoreMessage = () => {
    if (score >= 100) return '🏆 전설적인 피하기 능력이네요!';
    if (score >= 80) return '🥇 완벽한 피하기 실력이에요!';
    if (score >= 60) return '🥈 훌륭한 물방울 피하기!';
    if (score >= 40) return '🥉 좋은 반사신경이에요!';
    if (score >= 20) return '👍 괜찮은 시작이에요!';
    if (score >= 10) return '🚀 연습이 필요해요!';
    return '💪 다시 도전해보세요!';
  };

  const getGameEndReason = () => {
    return `💥 물방울과 충돌했습니다! ${survivedTime}초 동안 버텨내셨네요!`;
  };

  if (!showModal) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
      <ModalContainer>
        <GameOverTitle>🎮 게임 종료!</GameOverTitle>
        
        <Subtitle>{playerName}님의 결과</Subtitle>
        
        <MessageContainer>
          <Text align="center" style={{ margin: 0, fontWeight: 'bold' }}>
            {getGameEndReason()}
          </Text>
        </MessageContainer>
        
        <ScoreContainer>
          <ScoreDisplay style={{ minWidth: '150px' }}>
            <ScoreLabel>최종 점수</ScoreLabel>
            <ScoreValue style={{ fontSize: '2rem' }}>{score}점</ScoreValue>
          </ScoreDisplay>
        </ScoreContainer>
        
        <StatsGrid>
          <StatItem>
            <StatLabel>🕰️ 생존 시간</StatLabel>
            <StatValue style={{ fontSize: '1.5rem', color: '#4ECDC4' }}>{survivedTime}초</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>🎆 피한 물방울</StatLabel>
            <StatValue style={{ fontSize: '1.5rem', color: '#FF6B6B' }}>{score}개</StatValue>
          </StatItem>
        </StatsGrid>
        
        <MessageContainer>
          <Text align="center" style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
            {getScoreMessage()}
          </Text>
        </MessageContainer>
        
        <ButtonGroup style={{ marginTop: '2rem' }}>
          <Button onClick={onRestart}>
            🔄 다시 하기
          </Button>
          <Button variant="secondary" onClick={onBackToStart}>
            🏠 처음으로
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default GameOverModal;
