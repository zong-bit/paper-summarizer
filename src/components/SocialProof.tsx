'use client'

import { useTranslation } from '@/i18n/provider'

const INSTITUTIONS = [
  { name: 'MIT', color: 'from-red-500 to-red-700' },
  { name: 'Stanford', color: 'from-red-700 to-red-900' },
  { name: 'Oxford', color: 'from-blue-600 to-blue-800' },
  { name: 'Cambridge', color: 'from-purple-600 to-purple-800' },
  { name: 'Tsinghua', color: 'from-blue-500 to-blue-700' },
  { name: 'Peking', color: 'from-red-600 to-red-800' },
]

const AVATAR_COLORS = [
  'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400',
  'bg-yellow-400', 'bg-pink-400', 'bg-indigo-400', 'bg-teal-400',
]

export default function SocialProof() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Community header */}
      <div className="text-center space-y-3">
        <p className="text-text-secondary text-lg">
          🌍 {t('social.joinCommunity')}
        </p>

        {/* Avatar stack */}
        <div className="flex justify-center -space-x-3">
          {AVATAR_COLORS.map((color, i) => (
            <div
              key={i}
              className={`w-10 h-10 ${color} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md`}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold shadow-md">
            +5k
          </div>
        </div>
      </div>

      {/* Trusted by */}
      <div className="text-center">
        <p className="text-text-secondary text-sm mb-3">
          {t('social.trustedBy')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {INSTITUTIONS.map((inst) => (
            <div
              key={inst.name}
              className={`bg-gradient-to-r ${inst.color} text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm`}
            >
              {inst.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
