import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import GameOverModal from './GameOverModal';
import { GamePlayWrapper, CanvasContainer, UIOverlay } from './styled/Wrapper';
import RaindropPool from '../utils/RaindropPool';

const GamePlay = ({ playerName, onGameEnd, onBackToStart }) => {

  
  const [gameState, setGameState] = useState({
    phase: 'playing',
    playerName: playerName,
    score: 0,
    isGameOver: false,
    isPaused: false,
    difficulty: 1,
    raindropCount: 0,
    survivedTime: 0 // 생존 시간 (초 단위)
  });
  
  // 충돌 이펙트 상태
  const [collisionEffect, setCollisionEffect] = useState({
    active: false,
    x: 0,
    y: 0,
    particles: []
  });
  
  // 게임 오버 모달 상태
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  
  const [player, setPlayer] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 30,
    speed: 50, // 풀스크린에 맞게 속도 증가
    color: '#4CAF50',
    width: 30,
    height: 30,
    isMoving: false,
    lastDirection: null
  });


  const [raindrops, setRaindrops] = useState([]);
  const gameLoopRef = useRef();
  const lastRaindropTime = useRef(0);
  const canvasRef = useRef(null); // Canvas ref 추가
  
  // Object Pooling을 위한 RaindropPool 인스턴스 (성능 최적화)
  const raindropPoolRef = useRef(new RaindropPool(150)); // 150개 초기 풀 크기

  // 게임 설정 계산 메모이제이션 (성능 최적화)
  const gameConfig = useMemo(() => {
    const survivalTime = gameState.survivedTime;
    const timeDifficulty = Math.min(Math.floor(survivalTime / 5) + 1, 20);
    
    // 물방울 생성 간격 계산
    const baseInterval = 400;
    const difficultyReduction = timeDifficulty * 25;
    const exponentialReduction = Math.pow(timeDifficulty, 1.4) * 12;
    const spawnInterval = Math.max(baseInterval - difficultyReduction - exponentialReduction, 50);
    
    // 동시 생성 물방울 개수
    const spawnCount = Math.min(1 + Math.floor(timeDifficulty / 4), 4);
    
    return {
      timeDifficulty,
      spawnInterval,
      spawnCount,
      survivalTime
    };
  }, [gameState.survivedTime]);

  // 활성 물방울 필터링 메모이제이션
  const activeRaindrops = useMemo(() => {
    return raindrops.filter(drop => drop.y < window.innerHeight + 50);
  }, [raindrops]);

  
  // 파티클 생성 함수 (useCallback으로 최적화)
  const createParticles = useCallback((x, y) => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: Math.random(),
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10, // 랜덤 x 속도
        vy: (Math.random() - 0.5) * 10, // 랜덤 y 속도
        life: 1.0, // 생명력 (1.0에서 0.0으로 감소)
        size: Math.random() * 8 + 4, // 랜덤 크기
        color: `hsl(${Math.random() * 60 + 15}, 100%, 60%)` // 주황/빨강 계열
      });
    }
    return particles;
  }, []);
  
  // 충돌 이펙트 시작 함수 (useCallback으로 최적화)
  const startCollisionEffect = useCallback((playerX, playerY) => {
    const particles = createParticles(playerX + 20, playerY + 20); // 플레이어 중심
    
    setCollisionEffect({
      active: true,
      x: playerX,
      y: playerY,
      particles: particles
    });
    
    // 이펙트 자동 종료 (2초 후)
    setTimeout(() => {
      setCollisionEffect(prev => ({ ...prev, active: false, particles: [] }));
    }, 2000);
  }, [createParticles]);

  // 초공격적 충돌 감지 함수 (useCallback으로 최적화)
  const checkCollision = useCallback((player, drop) => {
    // 플레이어와 물방울의 중심점 계산
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const dropCenterX = drop.x + (drop.size || 15) / 2;
    const dropCenterY = drop.y + (drop.size || 15) / 2;
    
    // 두 원의 중심점 간 거리 계산
    const deltaX = playerCenterX - dropCenterX;
    const deltaY = playerCenterY - dropCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // 초공격적 충돌 감지 (반지름 합의 150%)
    const playerRadius = player.width / 2;
    const dropRadius = (drop.size || 15) / 2;
    const aggressiveMultiplier = 1.5; // 150% 범위로 충돌 감지
    const radiusSum = (playerRadius + dropRadius) * aggressiveMultiplier;
    
    // 충돌 감지
    const isColliding = distance <= radiusSum;
    
    // 충돌 시에만 로그 출력
    if (isColliding) {
      console.log('[GamePlay] 💥 충돌 감지!', {
        distance: distance.toFixed(1),
        threshold: radiusSum.toFixed(1)
      });
    }
    
    return isColliding;
  }, []);

  // 충돌 감지 및 게임 오버 처리 (useCallback으로 최적화)
  const handleCollisions = useCallback(() => {
    for (let i = 0; i < activeRaindrops.length; i++) {
      const drop = activeRaindrops[i];
      if (checkCollision(player, drop)) {
        // 충돌 이팩트 시작
        startCollisionEffect(player.x, player.y);
        
        // 게임 종료 처리
        const finalScore = gameState.score;
        
        setGameState(prev => ({
          ...prev,
          isGameOver: true,
          phase: 'ended'
        }));
        
        // 충돌 이펙트 후 모달 표시 (즉시 페이지 전환하지 않음)
        setTimeout(() => {
          setShowGameOverModal(true);
        }, 100); // 상태 업데이트 후 모달 표시
        
        return true; // 충돌 발생
      }
    }
    return false; // 충돌 없음
  }, [activeRaindrops, player, checkCollision, startCollisionEffect, gameState.score]);

  // 플레이어 이동 핸들러 - 부드러운 보간 이동
  const handlePlayerMove = useCallback((newX, newY) => {
    setPlayer(prev => {
      // 풀스크린 경계 체크
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const targetX = Math.max(0, Math.min(screenWidth - prev.width, newX));
      const targetY = Math.max(0, Math.min(screenHeight - prev.height, newY));
      
      // 부드러운 이동을 위한 보간 (lerp) 적용
      const lerpFactor = 0.35; // 보간 강도 증가 (빠른 이동)
      const smoothX = prev.x + (targetX - prev.x) * lerpFactor;
      const smoothY = prev.y + (targetY - prev.y) * lerpFactor;
      
      // 이동 상태 확인 (더 민감하게)
      const isMoving = Math.abs(targetX - prev.x) > 1 || Math.abs(targetY - prev.y) > 1;
      
      // 이동 방향 결정
      let lastDirection = prev.lastDirection;
      if (isMoving) {
        const deltaX = targetX - prev.x;
        const deltaY = targetY - prev.y;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          lastDirection = deltaX > 0 ? 'right' : 'left';
        } else {
          lastDirection = deltaY > 0 ? 'down' : 'up';
        }
      }
      
      return {
        ...prev,
        x: smoothX,
        y: smoothY,
        isMoving,
        lastDirection
      };
    });
  }, []);

  // 충돌 이팩트 업데이트 함수
  const updateCollisionEffect = useCallback((updatedEffect) => {
    setCollisionEffect(updatedEffect);
  }, []);

  // 생존 시간 기반 공격적 물방울 속도 계산
  const calculateRaindropSpeed = (survivedTime, difficulty) => {
    const baseSpeed = 3; // 기본 속도
    const timeMultiplier = Math.min(survivedTime * 0.3, 15); // 시간당 0.3씩 증가, 최대 +15
    const difficultyBonus = difficulty * 0.8; // 난이도당 0.8씩 증가
    const exponentialBonus = Math.pow(survivedTime / 10, 1.2) * 2; // 지수적 증가
    const randomVariation = Math.random() * 2; // 0-2 랜덤 변화
    
    const finalSpeed = baseSpeed + timeMultiplier + difficultyBonus + exponentialBonus + randomVariation;
    return Math.min(finalSpeed, 25); // 최대 속도 25로 제한
  };

  // 생존 시간 기반 물방울 크기 계산
  const calculateRaindropSize = (survivedTime) => {
    const baseSize = 15; // 기본 크기
    const timeVariation = Math.sin(survivedTime * 0.5) * 5; // 사인 파동으로 변화
    const randomSize = Math.random() * 15; // 0-15 랜덤 변화
    const occasionalLarge = Math.random() < 0.1 ? Math.random() * 20 : 0; // 10% 확률로 큰 물방울
    
    const finalSize = baseSize + timeVariation + randomSize + occasionalLarge;
    return Math.max(Math.min(finalSize, 40), 10); // 10-40px 범위
  };

  // 물방울 생성 함수 (Object Pooling 적용)
  const createRaindrop = useCallback(() => {
    const screenWidth = window.innerWidth;
    const x = Math.random() * (screenWidth - 40);
    const y = -20;
    const size = calculateRaindropSize(gameState.survivedTime);
    const speed = calculateRaindropSpeed(gameState.survivedTime, gameState.difficulty);
    const color = `hsl(${200 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`;
    
    // Object Pool에서 물방울 가져오기
    const pooledRaindrop = raindropPoolRef.current.getDroplet(x, y, size, speed, color);
    
    return pooledRaindrop;
  }, [gameState.survivedTime, gameState.difficulty]);

  // 물방울 위치 업데이트 함수 (Object Pooling 적용)
  const updateRaindrops = useCallback(() => {
    const screenBottom = window.innerHeight;
    let reachedBottomCount = 0;
    
    // Object Pool의 filterAndRelease 메서드 사용
    const activeDrops = raindropPoolRef.current.filterAndRelease(drop => {
      // 물방울 위치 업데이트
      drop.y += drop.speed;
      
      // 바닥에 닿았는지 확인
      if (drop.y >= screenBottom) {
        reachedBottomCount++;
        return false; // 풀로 반환
      }
      
      return true; // 계속 유지
    });
    
    // 바닥에 닿은 물방울이 있으면 점수 업데이트
    if (reachedBottomCount > 0) {
      setGameState(prevState => ({
        ...prevState,
        score: prevState.score + reachedBottomCount
      }));
    }
    
    // React 상태 업데이트
    setRaindrops(activeDrops);
  }, []);

  // 게임 루프
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const gameLoop = (currentTime) => {
      // 메모이제이션된 게임 설정 사용 (성능 최적화)
      const { timeDifficulty, spawnInterval, spawnCount } = gameConfig;
      
      // 추가 밀도 보너스 계산
      const densityBonus = Math.min(gameConfig.survivalTime * 2, 100);
      const finalInterval = Math.max(spawnInterval - densityBonus, 30);
      
      if (currentTime - lastRaindropTime.current > finalInterval) {
        // Object Pooling을 사용한 물방울 생성
        for (let i = 0; i < spawnCount; i++) {
          createRaindrop(); // 이미 Pool에 추가됨
        }
        
        // Pool에서 활성 물방울 가져오기
        setRaindrops(raindropPoolRef.current.getActiveDroplets());
        lastRaindropTime.current = currentTime;
        
        // 게임 상태 업데이트
        setGameState(prevState => ({
          ...prevState,
          raindropCount: prevState.raindropCount + spawnCount,
          difficulty: timeDifficulty
        }));
        

      }
      
      // 물방울 위치 업데이트
      updateRaindrops();
      
      // 충돌 감지
      if (!gameState.isGameOver) {
        handleCollisions();
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, gameConfig, handleCollisions]);

  // 게임 시작 조건 확인 및 초기 상태 설정
  useEffect(() => {
    if (gameState.phase === 'playing' && !gameState.isGameOver && !gameState.isPaused) {
      // 초기 상태 설정 (필요시)
      if (gameState.score !== 0 || gameState.survivedTime !== 0) {
        setGameState(prev => ({
          ...prev,
          score: 0,
          survivedTime: 0,
          raindropCount: 0,
          difficulty: 1
        }));
      }
    }
  }, [gameState.phase, gameState.isGameOver]);

  // 생존 시간 추적 시스템 (무제한 게임)
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused || gameState.phase !== 'playing') {
      return;
    }

    const survivalTimer = setInterval(() => {
      setGameState(prev => {
        const newSurvivedTime = prev.survivedTime + 1;
        

        
        return { 
          ...prev,
          survivedTime: newSurvivedTime
        };
      });
    }, 1000);

    return () => {
      clearInterval(survivalTimer);
    };
  }, [gameState.isGameOver, gameState.isPaused, gameState.phase, gameState.difficulty]);
  
  // 모달 핸들러 함수들
  const handleModalRestart = () => {

    setShowGameOverModal(false);
    
    // 게임 상태 초기화
    setGameState({
      phase: 'playing',
      playerName: playerName,
      score: 0,
      isGameOver: false,
      isPaused: false,
      difficulty: 1,
      raindropCount: 0,
      survivedTime: 0
    });
    
    // 플레이어 위치 초기화 - 풀스크린 중앙
    setPlayer(prev => ({
      ...prev,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      isMoving: false,
      lastDirection: null
    }));
    
    // Object Pool 정리 및 물방울 초기화
    raindropPoolRef.current.cleanup();
    setRaindrops([]);
    
    // 충돌 이펙트 초기화
    setCollisionEffect({
      active: false,
      x: 0,
      y: 0,
      particles: []
    });
  };
  
  const handleModalBackToStart = () => {

    setShowGameOverModal(false);
    onBackToStart(); // 시작 화면으로 직접 전환
  };

  return (
    <GamePlayWrapper>
      <CanvasContainer>
        <GameCanvas
          canvasRef={canvasRef}
          gameState={gameState}
          player={player}
          raindrops={raindrops}
          onPlayerMove={handlePlayerMove}
          collisionEffect={collisionEffect}
          onCollisionEffectUpdate={updateCollisionEffect}
          width={window.innerWidth}
          height={window.innerHeight}
        />
        <UIOverlay>
          <GameUI 
            playerName={playerName}
            survivedTime={gameState.survivedTime}
            score={gameState.score}
          />
        </UIOverlay>
      </CanvasContainer>
      
      {/* 게임 오버 모달 */}
      <GameOverModal
        isVisible={showGameOverModal}
        playerName={gameState.playerName}
        score={gameState.score}
        survivedTime={gameState.survivedTime}
        onRestart={handleModalRestart}
        onBackToStart={handleModalBackToStart}
      />
    </GamePlayWrapper>
  );
};

export default GamePlay;
