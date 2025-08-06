# 🌧️ Raindrop Dodge Game

> **React로 만든 스릴 넘치는 물방울 피하기 브라우저 게임**

[![Live Demo](https://img.shields.io/badge/🎮_Live_Demo-Play_Now-blue?style=for-the-badge)](https://raindrop-dodge-game.windsurf.build)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=flat&logo=styled-components&logoColor=white)](https://styled-components.com/)

## 🎮 게임 소개

하늘에서 떨어지는 물방울들을 피하며 최대한 오래 생존하는 스킬 기반 아케이드 게임입니다!

### ✨ 주요 특징

- 🎯 **정확한 충돌 감지**: 시각적 겹침과 일치하는 공정한 판정
- 🌊 **부드러운 플레이어 이동**: 보간 기술로 자연스러운 조작감
- 📈 **동적 난이도 증가**: 시간에 따른 기하급수적 도전 증가
- 🎨 **반응형 풀스크린 UI**: 모든 화면 크기에 최적화
- ⏱️ **무제한 게임플레이**: 생존 시간 추적 시스템
- 💥 **시각적 효과**: 충돌 시 파티클 이펙트

## 🕹️ 게임 플레이

### 조작법
- **이동**: 화살표 키 또는 WASD
- **목표**: 물방울과 충돌하지 않고 최대한 오래 생존

### 점수 시스템
- 바닥에 닿은 물방울 1개당 1점
- 생존 시간도 기록됩니다

### 난이도 시스템
- **초반 (0-10초)**: 여유로운 시작
- **중반 (10-20초)**: 속도와 빈도 급증
- **후반 (20-30초)**: 매우 빠른 물방울들
- **극후반 (30초+)**: 거의 불가능한 수준!

## 🛠️ 기술 스택

- **Frontend**: React 18 + Vite
- **Styling**: styled-components
- **Graphics**: HTML5 Canvas API
- **Deployment**: Netlify
- **State Management**: React Hooks

## 🚀 로컬 개발

### 설치
```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/raindrop-dodge-game.git
cd raindrop-dodge-game

# 의존성 설치
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── GameCanvas.jsx      # 게임 렌더링 엔진
│   ├── GamePlay.jsx        # 메인 게임 로직
│   ├── GameStart.jsx       # 시작 화면
│   ├── GameOverModal.jsx   # 게임 오버 UI
│   ├── GameResult.jsx      # 결과 화면
│   ├── GameUI.jsx          # 게임 중 UI
│   └── styled/             # 스타일 컴포넌트
├── GlobalStyle.js          # 전역 스타일
├── theme.js               # 테마 설정
└── main.jsx               # 앱 진입점
```

## 🎯 게임 개발 하이라이트

### 고급 충돌 감지
```javascript
// 150% 범위로 공격적 충돌 감지
const aggressiveMultiplier = 1.5;
const radiusSum = (playerRadius + dropRadius) * aggressiveMultiplier;
const isColliding = distance <= radiusSum;
```

### 부드러운 플레이어 이동
```javascript
// 보간(lerp)을 통한 자연스러운 움직임
const lerpFactor = 0.35;
const smoothX = prev.x + (targetX - prev.x) * lerpFactor;
```

### 동적 난이도 스케일링
```javascript
// 시간 기반 지수적 난이도 증가
const timeDifficulty = Math.min(Math.floor(survivedTime / 5) + 1, 20);
const spawnCount = Math.min(1 + Math.floor(timeDifficulty / 4), 4);
```

## 🌐 배포

이 게임은 Netlify에 배포되어 있습니다:
**[🎮 지금 플레이하기](https://raindrop-dodge-game.windsurf.build)**

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**물방울 피하기 게임**은 React와 Canvas API를 활용한 브라우저 게임 개발 프로젝트입니다.

---

⭐ 이 프로젝트가 마음에 드셨다면 별표를 눌러주세요!
