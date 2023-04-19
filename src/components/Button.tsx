import { Button, type ButtonProps } from '@mui/material';

const CustomButton = ({ variant, sx, children }: ButtonProps) => {
  return (
    <Button variant={variant} sx={sx}>
      {children}
    </Button>
  );
};

export default CustomButton;
