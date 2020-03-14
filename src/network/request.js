import axios from 'axios'
export function request(config){
  //1.创建axios的实例
  const instance = axios.create({
    baseURL:'http://123.207.32.32:8000',
    timeout:5000
  })

  //2.axios的拦截器
  //2.1请求拦截
  instance.interceptors.request.use(config=>{
    return config
  },err=>{

  })
  //2.2响应拦截
  instance.interceptors.response.use(res=>{
    return res.data
  },err=>{
    console.log('来到了response拦截failure中');
    console.log(err);
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break
        case 401:
          err.message = '未授权的访问'
          break
      }
    }
    return err
  })

  //3.发送真正的网络请求
  return instance(config)
  // instance(option).then(res => {
  //   resolve(res)
  // }).catch(err => {
  //   reject(err)
  // })
}