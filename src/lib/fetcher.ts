export const fetchGet = async <T>(url: string): Promise<T> => {
  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      return res.json() as Promise<{ code: number; data: T; message: string }>
    })
    .then(data => {
      if (data?.code !== 0) {
        throw new Error(`服务器请求失败: ${data.code} ${data.message}`)
      }
      return data.data
    })
}

export const fetchPost = async <T>(url: string, data: T) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      return res.json() as Promise<{ code: number; data: T; message: string }>
    })
    .then(data => {
      if (data?.code !== 0) {
        throw new Error(`服务器请求失败: ${data.code} ${data.message}`)
      }
      return data.data
    })
}
