/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export async function login(email, password) {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/v1/users/login',
      data: { email, password },
    });

    if (res.data.status === 'succes') {
      showAlert('Succes', 'Logged in Succefully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8080/api/v1/users/logout',
    });
    if (res.data.status === 'succes') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Please try again later');
  }
};
