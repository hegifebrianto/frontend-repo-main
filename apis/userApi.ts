import axios from 'axios';
import { User } from '../entities/user'

export const UserAPI = {
  fetchUser: async (uid: string, token: string) => {
    return axios.get(`http://localhost:3000/api/v1/fetch-user-data/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  updateUser: async (userData: User, token: string) => {
    console.log(token, 'token');
    return axios.put(
      'http://localhost:3000/api/v1/update-user-data',
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

  }
};
