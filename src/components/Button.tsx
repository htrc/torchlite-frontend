import { Button, type ButtonProps } from '@mui/material';

const CustomButton = ({ variant, onClick, disabled, sx, children }: ButtonProps) => {
  return (
    <Button variant={variant} disabled={disabled} sx={sx} onClick={onClick}>
      {children}
    </Button>
  );
};

export default CustomButton;
