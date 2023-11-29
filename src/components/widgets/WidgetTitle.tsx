import { Typography, useTheme } from '@mui/material';
import NextLink from 'next/link';
import { WidgetTitles } from 'data/constants';

type WidgetTitleProps = {
  widgetType: string;
  isDetailsPage?: boolean;
};

const WidgetTitle = ({ widgetType, isDetailsPage }: WidgetTitleProps) => {
  const theme = useTheme();
  return (
    <>
      {isDetailsPage ? (
        <Typography variant="h3" sx={{ color: theme.palette.mode === 'light' ? theme.palette.primary[700]/*'#1e98d7'*/ : theme.palette.common.white }}>
          {WidgetTitles[widgetType]}
        </Typography>
      ) : (
        <NextLink href={`/widget-details/${widgetType}`}>
          <Typography 
            variant="h3" 
            sx = {{ 
              color: theme.palette.mode === 'light' ? theme.palette.primary[700]/*'#1e98d7'*/ : theme.palette.common.white, 
              cursor: 'pointer', 
              '&:hover': {color: theme.palette.primary.main} 
              }}
          >
            {WidgetTitles[widgetType]}
          </Typography>
        </NextLink>
      )}
    </>
  );
};

export default WidgetTitle;
