import Svg, { Circle, Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const SettingsIcon = ({
  size = 22,
  color = '#E4F2F0',
  strokeWidth = 1.8,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M4 7h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M4 12h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M4 17h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx={8} cy={7} r={2.4} stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Circle cx={15} cy={12} r={2.4} stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Circle cx={10} cy={17} r={2.4} stroke={color} strokeWidth={strokeWidth} fill="none" />
  </Svg>
);

export const ShareIcon = ({
  size = 20,
  color = '#E4F2F0',
  strokeWidth = 1.8,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7 11.5 12 6l5 5.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 6v12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path
      d="M5 20h14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BookmarkIcon = ({
  size = 20,
  color = '#E4F2F0',
  strokeWidth = 1.8,
  fill = 'none',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7 3.5h10c.83 0 1.5.67 1.5 1.5v15l-6.5-3.2L5.5 20V5c0-.83.67-1.5 1.5-1.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </Svg>
);
