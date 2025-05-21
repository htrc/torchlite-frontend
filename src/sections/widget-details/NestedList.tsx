import { useState } from 'react';

// material-ui
import { Collapse, List, ListItem, ListItemButton, ListItemText, Link } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { WidgetInfoLinks } from 'data/constants';

// ==============================|| LIST - NESTED ||============================== //

const NestedList = ({ widgetType }: { widgetType: string }) => {
  const [open, setOpen] = useState('');

  const handleClick = (page: string) => {
    setOpen(open !== page ? page : '');
  };

  return (
    <MainCard content={false}>
      <List sx={{ p: 0 }}>
        <ListItem disablePadding divider>
          <ListItemButton onClick={() => handleClick('sample')}>
            <ListItemText primary="Widget Documentation" />
            {open === 'sample' ? (
              <DownOutlined style={{ fontSize: '0.75rem' }} rev={undefined} />
            ) : (
              <UpOutlined style={{ fontSize: '0.75rem' }} rev={undefined} />
            )}
          </ListItemButton>
        </ListItem>
        <Collapse in={open === 'sample'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ bgcolor: 'secondary.100' }}>
            <ListItemButton sx={{ pl: 5 }}>
              <ListItemText>
                <Link href={WidgetInfoLinks[widgetType]?.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </Link>
              </ListItemText>
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }}>
              <ListItemText>
                <Link href={WidgetInfoLinks[widgetType]?.lib} target="_blank" rel="noopener noreferrer">
                  External Libraries
                </Link>
              </ListItemText>
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </MainCard>
  );
};

export default NestedList;
