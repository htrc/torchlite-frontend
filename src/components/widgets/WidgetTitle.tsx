import { Typography } from '@mui/material';
import NextLink from 'next/link';
import { WidgetTitles } from 'data/constants';

type WidgetTitleProps = {
  widgetType: string;
  isDetailsPage?: boolean;
};

const WidgetTitle = ({ widgetType, isDetailsPage }: WidgetTitleProps) => {
  return (
    <>
      {isDetailsPage ? (
        <Typography variant="h3" sx={{ color: '#1e98d7' }}>
          {WidgetTitles[widgetType]}
        </Typography>
      ) : (
        <NextLink href={`/widget-details/${widgetType}`}>
          <Typography variant="h3" sx={{ color: '#1e98d7', cursor: 'pointer' }}>
            {WidgetTitles[widgetType]}
          </Typography>
        </NextLink>
      )}
    </>
  );
};

export default WidgetTitle;
