type Option = {
  body: object
  headers?: object
  opts?: string | object | number
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

const api = async (url: string, options: Option) => {
  const { body, headers, ...opts } = options
  const requestBody = JSON.stringify(body)
  const response = await fetch(url, {
    body: requestBody,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...opts,
  })
  const result = await response.json()
  return { status: response.status, ...result, url }
}

export default api
