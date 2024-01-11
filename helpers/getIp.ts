import axios from 'axios';

export async function getPublicIp() {
  const response = await axios.get('https://api.ipify.org?format=json');
  return response.data.ip;
  
}
