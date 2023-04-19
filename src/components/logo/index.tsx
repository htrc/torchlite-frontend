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
}

const LogoSection = ({sx, to }: Props) => (
  <NextLink href={!to ? APP_DEFAULT_PATH : to} passHref>
    <ButtonBase disableRipple sx={sx}>
      {'TORCHLITE'}
    </ButtonBase>
  </NextLink>
);

export default LogoSection;
