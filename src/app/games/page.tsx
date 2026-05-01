'use client'

import Link from 'next/link'
import Footer from '../../components/Footer'
import VisitorCounter from '../../components/VisitorCounter'
import AdPlaceholder from '../../components/AdPlaceholder'

interface Game {
  id: string
  emoji: string
  name: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

const games: Game[] = [
  {
    id: 'bingo',
    emoji: '🎯',
    name: 'Paper Bingo',
    description: 'Mark academic buzzwords as you read papers and get Bingo!',
    difficulty: 'Easy',
  },
  {
    id: 'quiz',
    emoji: '🔬',
    name: 'Citation Guesser',
    description: 'Guess if a quote is from a real paper or AI-generated!',
    difficulty: 'Medium',
  },
  {
    id: 'reviewer',
    emoji: '📝',
    name: 'Reviewer 2 Simulator',
    description: 'Survive the peer review process and get your paper accepted!',
    difficulty: 'Hard',
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-success/20 text-success'
    case 'Medium':
      return 'bg-warning/20 text-warning'
    case 'Hard':
      return 'bg-error/20 text-error'
    default:
      return 'bg-text-secondary/20 text-text-secondary'
  }
}

export default function GamesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </Link>
            <Link href="/" className="text-lg font-bold text-text hover:text-primary transition-colors">
              SummarizeAI
            </Link>
          </div>
          <VisitorCounter />
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
            🎮 Academic Games
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Take a break from research and have fun with these academic-themed games!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{game.emoji}</div>
              <h2 className="text-xl font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                {game.name}
              </h2>
              <p className="text-text-secondary text-sm mb-4">{game.description}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                {game.difficulty}
              </div>
            </Link>
          ))}
        </div>

        <AdPlaceholder />
      </main>

      <Footer />
    </div>
  )
}
