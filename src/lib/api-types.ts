export type ApiLog = {
  id: string
  timestamp: string
  ip: string
  ua: string
  path: string
  status: 'success' | 'rejected' | 'error'
  textLength: number
  errorMsg?: string
}
