import { useState } from 'react';

// material-ui
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { DownOutlined, LayoutOutlined, RadiusUprightOutlined, SettingOutlined, UpOutlined } from '@ant-design/icons';

// ==============================|| LIST - NESTED ||============================== //

const NestedList = () => {
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
            {open === 'sample' ? <DownOutlined style={{ fontSize: '0.75rem' }} /> : <UpOutlined style={{ fontSize: '0.75rem' }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={open === 'sample'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ bgcolor: 'secondary.100' }}>
            <ListItemButton sx={{ pl: 5 }}>
              <ListItemText primary="GitHub" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 5 }}>
              <ListItemText primary="External Libraries" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Results Insights" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Export as Jupyter Notebook" />
          </ListItemButton>
        </ListItem>
      </List>
    </MainCard>
  );
};

export default NestedList;
