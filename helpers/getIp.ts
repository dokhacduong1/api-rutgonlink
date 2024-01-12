import axios from 'axios';

export async function getPublicIpV6() {
  const response = await axios.get('https://api.ip.sb/ip');
  return response.data;
  
}
