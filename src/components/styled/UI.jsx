import styled from 'styled-components';
import { media } from '../../theme';

// 제목 컴포넌트들
export const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${props => props.theme.spacing.xl} 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  ${media.tablet} {
    font-size: ${props => props.theme.fontSizes['3xl']};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  ${media.mobile} {
    font-size: ${props => props.theme.fontSizes['2xl']};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

export const Subtitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  
  ${media.mobile} {
    font-size: ${props => props.theme.fontSizes.lg};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

// 버튼 컴포넌트들
export const Button = styled.button`
  background: ${props => {
    if (props.variant === 'secondary') return props.theme.colors.secondary;
    if (props.variant === 'accent') return props.theme.colors.accent;
    return props.theme.colors.primary;
  }};
  color: ${props => props.theme.colors.text.light};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.md};
  min-width: 120px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
    filter: brightness(1.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  ${media.mobile} {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.fontSizes.md};
    min-width: 100px;
  }
`;

// 입력 필드
export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !['hasError'].includes(prop),
})`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.hasError ? props.theme.colors.status.error : props.theme.colors.text.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.lg};
  font-family: ${props => props.theme.fonts.primary};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text.primary};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  ${media.mobile} {
    font-size: ${props => props.theme.fontSizes.md};
    padding: ${props => props.theme.spacing.sm};
  }
`;

// 라벨
export const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

// 에러 메시지
export const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.status.error};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: ${props => props.theme.spacing.sm};
  text-align: center;
`;

// 폼 그룹
export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  width: 100%;
`;

// 점수 표시 컴포넌트들
export const ScoreDisplay = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
  min-width: 120px;
  
  ${media.mobile} {
    min-width: 100px;
    padding: ${props => props.theme.spacing.sm};
  }
`;

export const ScoreLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ScoreValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  
  ${media.mobile} {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

// 게임 상태 표시
export const GameStatus = styled.div`
  background: ${props => {
    if (props.status === 'warning') return props.theme.colors.status.warning;
    if (props.status === 'error') return props.theme.colors.status.error;
    if (props.status === 'success') return props.theme.colors.status.success;
    return props.theme.colors.status.info;
  }};
  color: ${props => props.theme.colors.text.light};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.sm};
`;

// 텍스트 컴포넌트들
export const Text = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.6;
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  text-align: ${props => props.align || 'left'};
  
  ${media.mobile} {
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

export const HighlightText = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

// 카드 내용
export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  
  ${media.mobile} {
    gap: ${props => props.theme.spacing.md};
  }
`;

// 버튼 그룹
export const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  
  ${media.mobile} {
    gap: ${props => props.theme.spacing.sm};
    flex-direction: column;
    width: 100%;
    
    ${Button} {
      width: 100%;
    }
  }
`;

// 게임 UI 컴포넌트들
export const PlayerNameDisplay = styled.div`
  background: rgba(255, 255, 255, 0.9);
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.md};
  box-shadow: ${props => props.theme.shadows.sm};
  backdrop-filter: blur(10px);
  
  ${media.mobile} {
    font-size: ${props => props.theme.fontSizes.sm};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  }
`;

export const TimerDisplay = styled.div`
  background: ${props => {
    if (props.timeLeft <= 10) return 'rgba(255, 107, 107, 0.9)';
    if (props.timeLeft <= 20) return 'rgba(255, 193, 7, 0.9)';
    return 'rgba(76, 175, 80, 0.9)';
  }};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.lg};
  text-align: center;
  box-shadow: ${props => props.theme.shadows.md};
  backdrop-filter: blur(10px);
  min-width: 120px;
  
  ${media.mobile} {
    font-size: ${props => props.theme.fontSizes.md};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    min-width: 100px;
  }
`;
