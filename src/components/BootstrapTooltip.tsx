import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

export const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
  }
}));
