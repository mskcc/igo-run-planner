import axios from 'axios';
import { BACKEND } from '../configs/config.js';

// // Check for authorization error
// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (error.response) {
//       error.payload = error.response.data;
//       if (error.response.status === 401) {
//         // Automatically redirect client to the login page
//         window.location.href = `${AUTH_URL}/${HOME_PAGE_PATH}`;
//       }
//     }
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

const parseResp = (resp) => {
  const data = resp.data || {};
  const contents = data.data || {};
  return contents;
};

export function getRuns(refresh) {
  return axios
    .get(`${BACKEND}/api/runs/runs?refresh=${refresh}`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Runs: ' + error.message);
    });
}

export function plan() {
  return axios
    .get(`${BACKEND}/api/runs/plan`)
    .then(parseResp)
    .catch((error) => {
      console.error('Unable to get Get Plans: ' + error.message);
    });
}
