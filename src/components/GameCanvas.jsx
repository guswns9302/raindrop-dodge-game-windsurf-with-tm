import React, { useRef, useEffect, useCallback, useState } from 'react';

const GameCanvas = ({ 
  canvasRef: externalCanvasRef, 
  gameState, 
  player, 
  raindrops, 
  onPlayerMove, 
  collisionEffect, 
  onCollisionEffectUpdate,
  width,
  height 
}) => {
  // 외부에서 전달받은 canvasRef 사용, 없으면 내부 ref 생성
  const canvasRef = externalCanvasRef || useRef(null);
  const animationIdRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // Canvas 초기 설정 및 속성 설정
  useEffect(() => {
    console.log('[GameCanvas] 🎨 Canvas 초기화 시작');
    const canvas = canvasRef.current;
    
    if (!canvas) {
      console.error('[GameCanvas] ❌ Canvas 레퍼런스를 찾을 수 없습니다');
      return;
    }

    // 풀스크린 Canvas 크기 설정
    const CANVAS_WIDTH = window.innerWidth;
    const CANVAS_HEIGHT = window.innerHeight;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    console.log(`[GameCanvas] ✅ 풀스크린 Canvas 크기 설정 완료: ${CANVAS_WIDTH}x${CANVAS_HEIGHT}`);
    
    // Canvas 컨텍스트 확인
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('[GameCanvas] ❌ 2D 컨텍스트를 가져올 수 없습니다');
      return;
    }
    
    console.log('[GameCanvas] ✅ 2D 컨텍스트 초기화 완료');
    
    // Canvas 스타일 설정
    canvas.style.imageRendering = 'pixelated'; // 픽셀 아트 스타일
    canvas.style.cursor = 'none'; // 마우스 커서 숨김
    
    // 화면 크기 변경 시 캔버스 크기 재조정
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      console.log(`[GameCanvas] 🔄 화면 크기 변경: ${newWidth}x${newHeight}`);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 캔버스 컨텍스트 초기화 및 설정
  const initializeCanvasContext = useCallback(() => {
    console.log('[GameCanvas] 🔧 캔버스 컨텍스트 초기화 시작');
    const canvas = canvasRef.current;
    
    if (!canvas) {
      console.error('[GameCanvas] ❌ 캔버스 컨텍스트 초기화 실패: Canvas 레퍼런스 없음');
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('[GameCanvas] ❌ 2D 컨텍스트 가져오기 실패');
      return null;
    }

    // 컨텍스트 기본 설정
    ctx.imageSmoothingEnabled = false; // 픽셀 아트를 위한 스무딩 비활성화
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    console.log('[GameCanvas] ✅ 캔버스 컨텍스트 초기화 완료');
    return ctx;
  }, []);

  // 렌더링 함수
  const render = useCallback((ctx) => {
    if (!ctx) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Canvas 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 그리기 (그라데이션 하늘)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // 하늘색
    gradient.addColorStop(1, '#E0F6FF'); // 연한 하늘색
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 플레이어 그리기 (향상된 비주얼 효과)
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    
    // 플레이어 그림자
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(player.x + 3, player.y + 3, player.width, player.height, 8);
    ctx.fill();
    
    // 플레이어 메인 모양 (그라데이션)
    const playerGradient = ctx.createRadialGradient(
      playerCenterX - 5, playerCenterY - 5, 0,
      playerCenterX, playerCenterY, player.width / 2
    );
    playerGradient.addColorStop(0, player.color || '#FF6B6B');
    playerGradient.addColorStop(1, player.borderColor || '#FF4757');
    
    ctx.fillStyle = playerGradient;
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.width, player.height, 8);
    ctx.fill();
    
    // 플레이어 테두리
    ctx.strokeStyle = player.borderColor || '#FF4757';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 플레이어 하이라이트
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.roundRect(player.x + 5, player.y + 5, player.width - 10, player.height / 3, 4);
    ctx.fill();
    
    // 이동 상태 표시 (이동 중이면 반짝이는 효과)
    if (player.isMoving) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(player.x - 2, player.y - 2, player.width + 4, player.height + 4);
      ctx.setLineDash([]); // 대시 리셋
    }
    
    // 물방울 그리기
    raindrops.forEach((drop, index) => {
      ctx.fillStyle = '#4ECDC4'; // 청록색
      ctx.beginPath();
      ctx.ellipse(drop.x + drop.width/2, drop.y + drop.height/2, 
                  drop.width/2, drop.height/2, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // 물방울 하이라이트
      ctx.fillStyle = '#A8E6CF';
      ctx.beginPath();
      ctx.ellipse(drop.x + drop.width/3, drop.y + drop.height/3, 
                  drop.width/6, drop.height/6, 0, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // 충돌 이펙트 파티클 렌더링
    if (collisionEffect && collisionEffect.active && collisionEffect.particles.length > 0) {
      collisionEffect.particles.forEach(particle => {
        if (particle.life > 0) {
          ctx.save();
          
          // 파티클 투명도 설정 (생명력에 따라)
          ctx.globalAlpha = particle.life;
          
          // 파티클 색상 및 그리기
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
          ctx.fill();
          
          // 파티클 글로우 효과
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          
          ctx.restore();
        }
      });
    }
    
    // 충돌 시 화면 흔들림 효과
    if (collisionEffect && collisionEffect.active) {
      const shakeIntensity = 5;
      const shakeX = (Math.random() - 0.5) * shakeIntensity;
      const shakeY = (Math.random() - 0.5) * shakeIntensity;
      
      ctx.save();
      ctx.translate(shakeX, shakeY);
      
      // 폭발 원형 효과
      const explosionRadius = 50;
      const explosionGradient = ctx.createRadialGradient(
        collisionEffect.x + 20, collisionEffect.y + 20, 0,
        collisionEffect.x + 20, collisionEffect.y + 20, explosionRadius
      );
      explosionGradient.addColorStop(0, 'rgba(255, 100, 100, 0.8)');
      explosionGradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.4)');
      explosionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = explosionGradient;
      ctx.beginPath();
      ctx.arc(collisionEffect.x + 20, collisionEffect.y + 20, explosionRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }, [player, raindrops, collisionEffect]);
  
  // 파티클 애니메이션 업데이트
  useEffect(() => {
    if (!collisionEffect || !collisionEffect.active || collisionEffect.particles.length === 0) {
      return;
    }
    
    const updateParticles = () => {
      onCollisionEffectUpdate(prev => {
        if (!prev.active) return prev;
        
        const updatedParticles = prev.particles.map(particle => ({
          ...particle,
          x: particle.x + particle.vx, // 위치 업데이트
          y: particle.y + particle.vy,
          vx: particle.vx * 0.98, // 마찰 효과
          vy: particle.vy * 0.98 + 0.2, // 중력 효과
          life: particle.life - 0.02 // 생명력 감소
        })).filter(particle => particle.life > 0); // 생명력이 0 이하인 파티클 제거
        
        return {
          ...prev,
          particles: updatedParticles
        };
      });
    };
    
    const particleInterval = setInterval(updateParticles, 16); // 60fps
    
    return () => clearInterval(particleInterval);
  }, [collisionEffect.active, onCollisionEffectUpdate]);

  // requestAnimationFrame 기반 게임 루프
  useEffect(() => {
    console.log('[GameCanvas] 🎬 requestAnimationFrame 게임 루프 시작');
    const ctx = initializeCanvasContext();
    if (!ctx) return;

    let frameCount = 0;
    let lastTime = 0;
    let fps = 0;

    const gameLoop = (currentTime) => {
      // FPS 계산
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= 1000) { // 1초마다 FPS 업데이트
        fps = Math.round((frameCount * 1000) / deltaTime);
        console.log(`[GameCanvas] 📊 FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }
      frameCount++;

      // 렌더링 수행
      render(ctx);

      // FPS 표시 (디버그용)
      if (fps > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 80, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`FPS: ${fps}`, 15, 28);
      }

      // 다음 프레임 예약
      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    // 게임 루프 시작
    animationIdRef.current = requestAnimationFrame(gameLoop);
    console.log('[GameCanvas] ✅ 게임 루프 시작됨');

    // 정리 함수 (cleanup)
    return () => {
      if (animationIdRef.current) {
        console.log('[GameCanvas] 🗑️ 게임 루프 정리 시작');
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
        console.log('[GameCanvas] ✅ 게임 루프 정리 완료');
      }
    };
  }, [initializeCanvasContext, render]);

  // 게임 상태 변경 시 렌더링 업데이트
  useEffect(() => {
    console.log('[GameCanvas] 🔄 게임 상태 변경 감지 - 플레이어/물방울 업데이트');
  }, [player, raindrops]);

  // 캔버스 오프셋 계산 및 업데이트
  const updateCanvasOffset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const newOffset = { x: rect.left, y: rect.top };
    
    console.log('[GameCanvas] 📐 캔버스 오프셋 업데이트:', newOffset);
    setCanvasOffset(newOffset);
  }, []);

  // 캔버스 오프셋 초기화 및 리사이즈 이벤트 처리
  useEffect(() => {
    console.log('[GameCanvas] 🔧 캔버스 오프셋 이벤트 리스너 설정');
    
    // 초기 오프셋 계산
    updateCanvasOffset();
    
    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', updateCanvasOffset);
    window.addEventListener('scroll', updateCanvasOffset);
    
    return () => {
      console.log('[GameCanvas] 🗑️ 캔버스 오프셋 이벤트 리스너 정리');
      window.removeEventListener('resize', updateCanvasOffset);
      window.removeEventListener('scroll', updateCanvasOffset);
    };
  }, [updateCanvasOffset]);

  // 키보드 전용 조작 - 마우스 이동 비활성화
  // 마우스 이동 핸들러 제거됨 (키보드 방향키로만 조작)

  // 키보드 이벤트 핸들러 (향상된 버전)
  useEffect(() => {
    console.log('[GameCanvas] ⌨️ 키보드 이벤트 리스너 설정');
    
    const pressedKeys = new Set();
    let animationFrame = null;
    
    const handleKeyDown = (e) => {
      // 게임 중이 아니면 무시
      if (gameState.isGameOver || gameState.isPaused) return;
      
      const key = e.key.toLowerCase();
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        pressedKeys.add(key);
        
        if (!animationFrame) {
          updatePlayerPosition();
        }
      }
    };
    
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      pressedKeys.delete(key);
      
      if (pressedKeys.size === 0) {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
        
        // 이동 중지 상태는 GamePlay에서 처리
        console.log('[GameCanvas] ⏹️ 키보드 이동 중지');
      }
    };
    
    const updatePlayerPosition = () => {
      const canvas = canvasRef.current;
      if (!canvas || pressedKeys.size === 0 || !onPlayerMove) {
        animationFrame = null;
        return;
      }
      
      let deltaX = 0;
      let deltaY = 0;
      const baseSpeed = player.speed || 8; // 풀스크린에 맞는 속도
      
      // 동시 입력 처리 (대각선 이동 가능)
      if (pressedKeys.has('w') || pressedKeys.has('arrowup')) deltaY -= baseSpeed;
      if (pressedKeys.has('s') || pressedKeys.has('arrowdown')) deltaY += baseSpeed;
      if (pressedKeys.has('a') || pressedKeys.has('arrowleft')) deltaX -= baseSpeed;
      if (pressedKeys.has('d') || pressedKeys.has('arrowright')) deltaX += baseSpeed;
      
      // 대각선 이동 시 속도 보정 (피타고라스 정리)
      if (deltaX !== 0 && deltaY !== 0) {
        const diagonal = Math.sqrt(2);
        deltaX /= diagonal;
        deltaY /= diagonal;
      }
      
      // 풀스크린 경계 처리
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const newX = Math.max(0, Math.min(screenWidth - player.width, player.x + deltaX));
      const newY = Math.max(0, Math.min(screenHeight - player.height, player.y + deltaY));
      
      // 이동이 있을 때만 onPlayerMove 호출
      if (Math.abs(newX - player.x) > 0.1 || Math.abs(newY - player.y) > 0.1) {
        onPlayerMove(newX, newY);
        console.log(`[GameCanvas] 🎮 키보드 이동: (${newX.toFixed(1)}, ${newY.toFixed(1)})`);
      }
      
      animationFrame = requestAnimationFrame(updatePlayerPosition);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      console.log('[GameCanvas] 🗑️ 키보드 이벤트 리스너 정리');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [onPlayerMove, gameState.isGameOver, gameState.isPaused, player.speed, player.x, player.y, player.width]);

  // 게임 렌더링 루프
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = () => {
      // 캠버스 지우기
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 배경 그라디언트
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#98D8E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 물방울 렌더링
      raindrops.forEach(raindrop => {
        ctx.fillStyle = raindrop.color || '#4ECDC4';
        ctx.beginPath();
        ctx.arc(raindrop.x, raindrop.y, raindrop.size || 15, 0, Math.PI * 2);
        ctx.fill();
        
        // 물방울 하이라이트
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(raindrop.x - 3, raindrop.y - 3, (raindrop.size || 15) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // 플레이어 렌더링
      if (player) {
        ctx.fillStyle = player.color || '#4CAF50';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // 플레이어 테두리
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 플레이어 눈
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2 - 5, player.y + player.height/2 - 3, 3, 0, Math.PI * 2);
        ctx.arc(player.x + player.width/2 + 5, player.y + player.height/2 - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2 - 5, player.y + player.height/2 - 3, 1, 0, Math.PI * 2);
        ctx.arc(player.x + player.width/2 + 5, player.y + player.height/2 - 3, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 충돌 이펙트 렌더링
      if (collisionEffect && collisionEffect.active && collisionEffect.particles) {
        collisionEffect.particles.forEach(particle => {
          if (particle.life > 0) {
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
        
        // 폭발 이펙트
        if (collisionEffect.explosionRadius > 0) {
          ctx.save();
          ctx.globalAlpha = 0.3;
          const explosionGradient = ctx.createRadialGradient(
            collisionEffect.x, collisionEffect.y, 0,
            collisionEffect.x, collisionEffect.y, collisionEffect.explosionRadius
          );
          explosionGradient.addColorStop(0, '#FF6B6B');
          explosionGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = explosionGradient;
          ctx.beginPath();
          ctx.arc(collisionEffect.x, collisionEffect.y, collisionEffect.explosionRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      
      if (!gameState.isGameOver) {
        requestAnimationFrame(render);
      }
    };
    
    render();
  }, [player, raindrops, collisionEffect, gameState.isGameOver]);

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'none',
          display: 'block'
        }}
      />
    </div>
  );
};

export default GameCanvas;
