import { Slider, Stack, Typography, useTheme } from '@mui/material';
interface ISlider {
  value: number[];
  minValue: number;
  maxValue: number;
  step: number;
  handleSliderChange: (event: any) => void;
}

const CustomSlider = ({ value, minValue, maxValue, step, handleSliderChange }: ISlider) => {
  const theme = useTheme();
  return (
    <Stack sx={{ width: '100%', mt: 3 }} alignItems="start">
      <Typography color="secondary">Adjust years on map</Typography>
      <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between">
        <Stack alignItems="center">
          <Typography>Min</Typography>
          {minValue == 0 ? '' : <Typography>{minValue}</Typography>}
        </Stack>
        <Stack alignItems="center">
          <Typography>Max</Typography>
          {maxValue == 0 ? '' : <Typography>{maxValue}</Typography>}
        </Stack>
      </Stack>
      {maxValue == 0 ? (
        ''
      ) : (
        <Slider
          value={value}
          min={minValue}
          max={maxValue}
          step={step}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          sx={{
            color: theme.palette.primary[700]/*'#1e98d7'*/,
            '.MuiSlider-thumb': {
              backgroundColor: theme.palette.common.white,
              width: theme.spacing(3.75),
              height: theme.spacing(3.75),
              border: 'none!important'
            },
            '.MuiSlider-track': {
              height: theme.spacing(0.75)
            },
            '.MuiSlider-thumb::before': {
              boxShadow: '4px 5px 5px 1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
            }
          }}
        />
      )}
    </Stack>
  );
};

export default CustomSlider;
