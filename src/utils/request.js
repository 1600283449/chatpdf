import axios from 'axios'
// create an axios instance
const service = axios.create({
  // baseURL: "https://dev-admin.soulsmint.com/api", // 服务器
  baseURL: "http://13.56.250.54:1234",
  timeout: 100000 // request timeout
})



export default service