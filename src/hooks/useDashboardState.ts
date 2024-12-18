import { useContext } from 'react';
import { AppContext } from 'contexts/AppContext';

// ==============================|| CONFIG - HOOKS  ||============================== //

const useDashboardState = () => useContext(AppContext);

export default useDashboardState;
