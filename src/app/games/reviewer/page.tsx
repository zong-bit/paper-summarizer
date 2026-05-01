'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Footer'
import VisitorCounter from '../../../components/VisitorCounter'

interface ReviewResponse {
  text: string
  impact: number
}

const reviewComments = [
  'The literature review is insufficient.',
  'The sample size is too small for meaningful conclusions.',
  'The methodology section lacks reproducibility details.',
  'The statistical analysis is inappropriate for this type of data.',
  'The figures are low resolution and difficult to interpret.',
  'The claims made in the abstract are not supported by the results.',
  'The authors should discuss the limitations more thoroughly.',
  'The novel contribution of this work is unclear.',
  'The related work section fails to cite several important papers.',
  'The experimental setup needs more detailed description.',
  'The conclusions are too speculative given the evidence.',
  'The writing quality needs significant improvement.',
  'The dataset used is not publicly available.',
  'The benchmark comparisons are incomplete.',
  'The paper lacks a clear research question.',
]

const responses: ReviewResponse[] = [
  { text: 'Thank you for your valuable feedback. We will address these concerns.', impact: 15 },
  { text: 'We respectfully disagree with the reviewer interpretation.', impact: 5 },
  { text: 'The reviewer clearly did not read our paper carefully.', impact: -10 },
  { text: 'This comment is beyond the scope of our current work.', impact: 0 },
]

const randomEvents = [
  'Editor reminds: deadline in 2 days',
  'Co-author quit the project',
  'Funding renewal denied',
  'Reviewer 1 gave positive feedback',
  'New competing paper appeared on arXiv',
  'Experimental results could not be reproduced',
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

type GameState = 'playing' | 'accepted' | 'rejected'

export default function ReviewerPage() {
  const [acceptanceProbability, setAcceptanceProbability] = useState(50)
  const [currentComment, setCurrentComment] = useState('')
  const [roundCount, setRoundCount] = useState(0)
  const [gameState, setGameState] = useState<GameState>('playing')
  const [lastEvent, setLastEvent] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<string | null>(null)

  useEffect(() => {
    initGame()
  }, [])

  const initGame = () => {
    setAcceptanceProbability(50)
    setRoundCount(0)
    setGameState('playing')
    setLastEvent(null)
    setLastResponse(null)
    setCurrentComment(reviewComments[Math.floor(Math.random() * reviewComments.length)])
  }

  const handleResponse = (response: ReviewResponse) => {
    if (gameState !== 'playing') return

    const newProbability = Math.max(0, Math.min(100, acceptanceProbability + response.impact))
    setAcceptanceProbability(newProbability)
    setRoundCount((prev) => prev + 1)
    setLastResponse(response.text)

    if (newProbability >= 100) {
      setGameState('accepted')
      return
    }
    if (newProbability <= 0) {
      setGameState('rejected')
      return
    }

    if (roundCount + 1 > 0 && (roundCount + 1) % 3 === 0) {
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)]
      setLastEvent(event)
      if (event.includes('positive') || event.includes('reminds')) {
        setAcceptanceProbability((prev) => Math.min(100, prev + 5))
      } else {
        setAcceptanceProbability((prev) => Math.max(0, prev - 10))
      }
    }

    const remainingComments = reviewComments.filter((c) => c !== currentComment)
    const shuffled = shuffleArray(remainingComments)
    setCurrentComment(shuffled[0] || reviewComments[Math.floor(Math.random() * reviewComments.length)])
  }

  const getProgressColor = () => {
    if (acceptanceProbability >= 70) return 'bg-success'
    if (acceptanceProbability >= 40) return 'bg-warning'
    return 'bg-error'
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="border-b border-border bg-bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <span className="text-text-secondary">/ Games / Reviewer 2</span>
          </div>
          <VisitorCounter />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">📝 Reviewer 2 Simulator</h1>
          <p className="text-text-secondary">Survive the peer review process!</p>
          <div className="mt-4 text-lg">
            <span className="text-text-secondary">Round: </span>
            <span className="text-primary font-bold">{roundCount}</span>
          </div>
        </div>

        {gameState === 'playing' && (
          <>
            <div className="bg-bg-card border border-border rounded-2xl p-6 mb-6">
              <div className="text-sm text-text-secondary mb-2">Acceptance Probability</div>
              <div className="w-full bg-bg rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${getProgressColor()}`}
                  style={{ width: `${acceptanceProbability}%` }}
                />
              </div>
              <div className="text-center text-2xl font-bold text-text">
                {acceptanceProbability}%
              </div>
            </div>

            {lastEvent && (
              <div className="bg-warning/20 border border-warning/50 rounded-xl p-4 mb-6 text-warning text-center">
                ⚠️ {lastEvent}
              </div>
            )}

            {lastResponse && (
              <div className="bg-primary/20 border border-primary/50 rounded-xl p-4 mb-6">
                <div className="text-sm text-primary mb-1">Your Response:</div>
                <p className="text-text">{lastResponse}</p>
              </div>
            )}

            <div className="bg-bg-card border border-border rounded-2xl p-6 mb-6">
              <div className="text-sm text-text-secondary mb-2">Reviewer Comment</div>
              <blockquote className="text-lg text-text italic bg-bg p-4 rounded-xl">
                "{currentComment}"
              </blockquote>
            </div>

            <div className="space-y-3">
              {responses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(response)}
                  className="w-full p-4 bg-bg-card border border-border rounded-xl text-left hover:border-primary/50 hover:bg-bg-hover transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-text">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-text">{response.text}</span>
                    </div>
                    <span className={`text-sm font-medium ${response.impact > 0 ? 'text-success' : response.impact < 0 ? 'text-error' : 'text-text-secondary'}`}>
                      {response.impact > 0 ? '+' : ''}{response.impact}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {gameState === 'accepted' && (
          <div className="text-center space-y-6">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-success">Accepted!</h2>
            <p className="text-text-secondary">Your paper has been accepted! Congratulations!</p>
            <div className="text-4xl animate-pulse">🎊🎊🎊</div>
          </div>
        )}

        {gameState === 'rejected' && (
          <div className="text-center space-y-6">
            <div className="text-6xl">💀</div>
            <h2 className="text-3xl font-bold text-error">Rejected</h2>
            <p className="text-text-secondary">Reviewer 2 was particularly harsh today.</p>
            <p className="text-text-secondary/70">Better luck next time!</p>
          </div>
        )}

        {(gameState === 'accepted' || gameState === 'rejected') && (
          <div className="text-center mt-8">
            <button
              onClick={initGame}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
            >
              New Game
            </button>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link href="/games" className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border hover:bg-bg-hover text-text rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Games
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
