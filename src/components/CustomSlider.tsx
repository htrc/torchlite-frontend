import { Slider, Stack, Typography } from '@mui/material';

interface ISlider {
  value: number[];
  minValue: number;
  maxValue: number;
  handleSliderChange: (event: any) => void;
}

const CustomSlider = ({ value, minValue, maxValue, handleSliderChange }: ISlider) => {
  return (
    <Stack sx={{ width: '100%' }} alignItems="center">
      <Typography color="secondary">Adjust years on map</Typography>
      <Stack sx={{ width: '50%' }} direction="row" justifyContent="space-between">
        <Stack alignItems="center">
          <Typography>Min</Typography>
          <Typography>{minValue}</Typography>
        </Stack>
        <Stack alignItems="center">
          <Typography>Max</Typography>
          <Typography>{maxValue}</Typography>
        </Stack>
      </Stack>
      <Slider
        value={value}
        min={minValue}
        max={maxValue}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        sx={{
          width: '50%',
          color: '#1e98d7',
          '.MuiSlider-thumb': {
            color: 'white',
            width: '30px',
            height: '30px',
            border: 'none!important'
          },
          '.MuiSlider-track': {
            height: '6px'
          },
          '.MuiSlider-thumb::before': {
            boxShadow: '4px 5px 5px 1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
          }
        }}
      />
    </Stack>
  );
};

export default CustomSlider;
