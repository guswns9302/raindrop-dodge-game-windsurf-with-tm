import styled from 'styled-components';
import { media } from '../../theme';

// 메인 앱 래퍼 - 풀스크린
export const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.game.sky} 0%, ${props => props.theme.colors.game.skyLight} 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.text.primary};
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
`;

// 게임 컨테이너 - 중앙 배치
export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

// 카드 스타일 컨테이너 - 중앙 배치
export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: ${props => props.theme.spacing['2xl']};
  width: 90vw;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  
  ${media.mobile} {
    width: 95vw;
    max-width: none;
    padding: ${props => props.theme.spacing.xl};
    max-height: 90vh;
  }
`;

// 게임 플레이 래퍼 - 풀스크린
export const GamePlayWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.game.sky} 0%, ${props => props.theme.colors.game.skyLight} 100%);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
`;

// 캔버스 컨테이너 - 풀스크린
export const CanvasContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  border: none;
  border-radius: 0;
  overflow: hidden;
  background: linear-gradient(180deg, ${props => props.theme.colors.game.sky} 0%, ${props => props.theme.colors.game.skyLight} 100%);
  box-shadow: none;
`;

// UI 오버레이 - 풀스크린
export const UIOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
  
  > * {
    pointer-events: auto;
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

// 플렉스 컨테이너
export const FlexContainer = styled.div`
  display: flex;
  justify-content: ${props => props.justify || 'center'};
  align-items: ${props => props.align || 'center'};
  gap: ${props => props.gap || props.theme.spacing.md};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  ${media.tablet} {
    flex-direction: ${props => props.tabletDirection || props.direction || 'column'};
    gap: ${props => props.tabletGap || props.theme.spacing.sm};
  }
  
  ${media.mobile} {
    flex-direction: ${props => props.mobileDirection || 'column'};
    gap: ${props => props.mobileGap || props.theme.spacing.sm};
  }
`;

// 그리드 컨테이너
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(250px, 1fr))'};
  gap: ${props => props.gap || props.theme.spacing.lg};
  width: 100%;
  
  ${media.tablet} {
    grid-template-columns: ${props => props.tabletColumns || '1fr'};
    gap: ${props => props.tabletGap || props.theme.spacing.md};
  }
  
  ${media.mobile} {
    grid-template-columns: ${props => props.mobileColumns || '1fr'};
    gap: ${props => props.mobileGap || props.theme.spacing.sm};
  }
`;
