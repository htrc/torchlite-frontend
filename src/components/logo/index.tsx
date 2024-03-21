import NextLink from 'next/link';

// material-ui
import { ButtonBase } from '@mui/material';
import { SxProps } from '@mui/system';

// project import
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  sx?: SxProps;
  to?: string;
  isIcon?: boolean;
}

const LogoSection = ({ sx, to, isIcon }: Props) => (
  <NextLink href={!to ? APP_DEFAULT_PATH : to} passHref>
    <ButtonBase disableRipple sx={sx}>
      {isIcon ? 'T' : 'TORCHLITE'}
    </ButtonBase>
  </NextLink>
);

export default LogoSection;
