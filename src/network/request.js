import axios from 'axios';

export default function request(option) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: '/api',
      timeout: 60 * 60 * 1000
    });

    instance(option)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
