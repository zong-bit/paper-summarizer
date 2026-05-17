'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResendMsg('')
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      if (error) {
        setResendMsg('发送失败：' + error.message)
      } else {
        setResendMsg('✅ 确认邮件已重新发送，请检查邮箱')
      }
    } catch (err: any) {
      setResendMsg('发送失败，请稍后重试')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white">Paper Summarizer</span>
          </Link>
        </div>

        {/* Signup card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">创建账号</h1>
            <p className="text-slate-400 text-sm">获取无限次总结和 Pro 功能</p>
          </div>

          {success ? (
            <div className="text-center space-y-5 py-4">
              <div className="text-5xl">📧</div>
              <h2 className="text-xl font-bold text-white">注册成功！请查收确认邮件</h2>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-left space-y-2 text-sm">
                <p className="text-slate-300">📌 完成注册只需两步：</p>
                <ol className="text-slate-400 space-y-1 list-decimal list-inside">
                  <li>打开 <strong className="text-slate-200">{email}</strong> 的收件箱</li>
                  <li>点击确认邮件中的链接完成验证</li>
                </ol>
                <p className="text-slate-500 text-xs mt-2">⏳ 如果没找到，请检查垃圾邮件文件夹</p>
              </div>

              {resendMsg && (
                <p className={resendMsg.startsWith('✅') ? 'text-green-400 text-sm' : 'text-yellow-400 text-sm'}>{resendMsg}</p>
              )}

              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? '发送中...' : '🔄 重新发送确认邮件'}
              </button>

              <Link
                href="/login"
                className="inline-block w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors text-sm"
              >
                前往登录
              </Link>

              <p className="text-slate-500 text-xs">
                已有账号？{' '}
                <Link href="/login" className="text-blue-400 hover:underline">
                  直接登录
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="您的名称（可选）"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 个字符"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
              >
                {loading ? '创建中...' : '创建账号'}
              </button>
            </form>
          )}

          <div className="text-center text-sm text-slate-500">
            已有账号？{' '}
            <Link href="/login" className="text-blue-400 hover:underline font-medium">
              登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
