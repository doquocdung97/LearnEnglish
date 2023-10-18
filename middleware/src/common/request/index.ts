import axios from 'axios'

const instance = axios.create()

instance.interceptors.request.use((config) => {
    config.headers['request-startTime'] = process.hrtime()
    return config
})

instance.interceptors.response.use((response) => {
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))
    response.headers['request-duration'] = milliseconds
    return response
})

export default instance