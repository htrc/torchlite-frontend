import { useMemo } from 'react';
import { ScaleLinear } from 'd3';
import { useTheme } from '@mui/material';

type AxisBottomProps = {
  xScale: ScaleLinear<number, number>;
  numberOfTicks: number;
  pixelsPerTick: number;
};

// tick length
const TICK_LENGTH = 6;

export const AxisBottom = ({ xScale, numberOfTicks, pixelsPerTick }: AxisBottomProps) => {
  const theme = useTheme();
  const range = xScale.range();

  const ticks = useMemo(() => {
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);
    return xScale.ticks(numberOfTicks > 10 ? numberOfTicksTarget : numberOfTicks).map((value) => ({
      value,
      xOffset: xScale(value)
    }));
  }, [pixelsPerTick, numberOfTicks, range, xScale]);

  return (
    <>
      <path d={['M', range[0], 0, 'L', range[1], 0].join(' ')} fill="none" stroke="currentColor" />
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(20px)'
            }}
            fill={theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};

