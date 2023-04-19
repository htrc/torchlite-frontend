// third-party
import { FormattedMessage } from 'react-intl';

// project import
// import { useSelector } from 'store';

// assets
import { DashboardOutlined, GoldOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

const icons = {
  dashboardOutlined: DashboardOutlined,
  goldOutlined: GoldOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const DashboardMenu: NavItemType = {
  id: 'dashboard',
  title: <FormattedMessage id="dashboard" />,
  icon: icons.dashboardOutlined,
  type: 'navigation',
  url: '/dashboard'
};

export default DashboardMenu;
