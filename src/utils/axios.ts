import axios from 'axios';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// const axiosServices = axios.create({ baseURL: env('BASE_API_URI') });

const axiosServices = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_API_URI });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.status === 'error' || error.message !== null) {
      const { message } = error;
      dispatch(
        openSnackbar({
          open: true,
          message: message || 'Wrong Services',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false,
          transition: 'Grow'
        })
      );
    }
    return Promise.reject((error.response && {data: error.response.data, status: error.response.status}) || 'Wrong Services');
  }
);

export default axiosServices;
