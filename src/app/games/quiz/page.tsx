'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Footer'
import VisitorCounter from '../../../components/VisitorCounter'

interface Question {
  quote: string
  isReal: boolean
  explanation: string
}

const questions: Question[] = [
  {
    quote: 'Our study demonstrates that machine learning models achieve 95% accuracy in detecting fraudulent transactions.',
    isReal: true,
    explanation: 'ML fraud detection is a common research topic with high accuracy claims.',
  },
  {
    quote: 'We developed a quantum algorithm that can predict stock prices with 100% accuracy using only two qubits.',
    isReal: false,
    explanation: '100% accuracy is unrealistic, especially with just 2 qubits.',
  },
  {
    quote: 'The proposed framework reduces computational overhead by 40% while maintaining comparable performance.',
    isReal: true,
    explanation: 'Efficiency improvements are common claims in ML papers.',
  },
  {
    quote: 'Our experiments show that adding cinnamon to coffee improves neural network convergence by 300%.',
    isReal: false,
    explanation: 'Cinnamon has no scientific basis for improving ML convergence.',
  },
  {
    quote: 'Transfer learning significantly reduces the amount of labeled data required for effective model training.',
    isReal: true,
    explanation: 'This is a well-established benefit of transfer learning.',
  },
  {
    quote: 'We found that plants grow better when exposed to WiFi signals, suggesting a new form of plant-machine communication.',
    isReal: false,
    explanation: 'WiFi signals do not promote plant growth.',
  },
  {
    quote: 'Attention mechanisms have become a fundamental building block in modern natural language processing systems.',
    isReal: true,
    explanation: 'Attention is core to transformers and modern NLP.',
  },
  {
    quote: 'Our survey of 5 participants reveals that 100% of humans prefer AI-generated art over Picasso.',
    isReal: false,
    explanation: 'Sample size of 5 is too small for meaningful claims.',
  },
  {
    quote: 'Graph neural networks show promising results in molecular property prediction tasks.',
    isReal: true,
    explanation: 'GNNs are widely used in chemistry and molecular biology.',
  },
  {
    quote: 'We trained a neural network to detect sarcasm in text using only emoji embeddings and achieved 99% precision.',
    isReal: false,
    explanation: '99% precision for sarcasm detection is unrealistic with only emoji embeddings.',
  },
  {
    quote: 'Ensemble methods typically outperform individual classifiers in complex classification tasks.',
    isReal: true,
    explanation: 'Ensemble methods like Random Forests are known for better performance.',
  },
  {
    quote: 'Our research proves that eating pizza while debugging increases code quality by exactly 47.3%.',
    isReal: false,
    explanation: 'Pizza cannot be scientifically proven to improve code quality by a specific percentage.',
  },
  {
    quote: 'The transformer architecture has largely replaced RNNs in sequence-to-sequence tasks.',
    isReal: true,
    explanation: 'Transformers have become the standard for NLP tasks.',
  },
  {
    quote: 'Deep learning requires significantly more data than traditional machine learning approaches for equivalent performance.',
    isReal: true,
    explanation: 'Deep learning models typically need more data to generalize well.',
  },
  {
    quote: 'We discovered that rearranging molecules by color improves drug discovery efficiency by 500%.',
    isReal: false,
    explanation: 'Molecular color has no relation to drug discovery efficiency.',
  },
  {
    quote: 'Cross-validation helps reduce overfitting in machine learning models.',
    isReal: true,
    explanation: 'Cross-validation is a standard technique to prevent overfitting.',
  },
  {
    quote: 'Our study with n=1 demonstrates that wearing mismatched socks doubles programming productivity.',
    isReal: false,
    explanation: 'A sample size of 1 is not statistically valid.',
  },
  {
    quote: 'Reinforcement learning has achieved superhuman performance in complex game environments like Go and StarCraft.',
    isReal: true,
    explanation: 'AlphaGo and AlphaStar achieved superhuman performance.',
  },
  {
    quote: 'Backpropagation was invented specifically for training neural networks with multiple hidden layers.',
    isReal: true,
    explanation: 'Backpropagation is the standard training algorithm for deep networks.',
  },
  {
    quote: 'We found that cats trained on ImageNet achieve 90% accuracy in identifying laser pointer dots.',
    isReal: false,
    explanation: 'Cats cannot be trained on ImageNet datasets.',
  },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)

  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    setShuffledQuestions(shuffleArray(questions))
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnsweredCount(0)
  }

  const handleAnswer = (answer: boolean) => {
    if (showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    setAnsweredCount((prev) => prev + 1)

    const currentQuestion = shuffledQuestions[currentIndex]
    if (answer === currentQuestion.isReal) {
      setScore((prev) => prev + 10)
    } else {
      setScore((prev) => Math.max(0, prev - 5))
    }
  }

  const nextQuestion = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const currentQuestion = shuffledQuestions[currentIndex]
  const isCorrect = selectedAnswer === currentQuestion?.isReal
  const progress = ((answeredCount) / questions.length) * 100

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
            <span className="text-text-secondary">/ Games / Quiz</span>
          </div>
          <VisitorCounter />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">🔬 Citation Guesser</h1>
          <p className="text-text-secondary">Guess if the quote is from a real paper or AI-generated!</p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="text-lg">
              <span className="text-text-secondary">Score: </span>
              <span className="text-primary font-bold">{score}</span>
            </div>
            <div className="text-text-secondary">
              {answeredCount}/{questions.length}
            </div>
          </div>
          <div className="mt-2 w-full bg-bg-card rounded-full h-2 max-w-xs mx-auto">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentQuestion && (
          <div className="bg-bg-card border border-border rounded-2xl p-6 mb-8">
            <div className="text-center mb-6">
              <div className="text-text-secondary text-sm mb-2">Quote {currentIndex + 1}</div>
              <blockquote className="text-lg text-text italic bg-bg p-4 rounded-xl">
                "{currentQuestion.quote}"
              </blockquote>
            </div>

            {!showResult ? (
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 py-4 bg-success/20 hover:bg-success/30 text-success border-2 border-success/50 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔬</span>
                  Real Paper
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 py-4 bg-error/20 hover:bg-error/30 text-error border-2 border-error/50 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>🤖</span>
                  AI Generated
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl text-center font-semibold ${isCorrect ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                  {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
                  <span className="ml-2">
                    {isCorrect ? '+10' : '-5'}
                  </span>
                </div>
                <div className="bg-bg p-4 rounded-xl">
                  <div className="text-text-secondary text-sm mb-1">Answer:</div>
                  <div className={`font-medium ${currentQuestion.isReal ? 'text-success' : 'text-error'}`}>
                    {currentQuestion.isReal ? '🔬 Real Paper' : '🤖 AI Generated'}
                  </div>
                  <div className="mt-2 text-text-secondary text-sm">
                    {currentQuestion.explanation}
                  </div>
                </div>
                {currentIndex < shuffledQuestions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-text">
                      Final Score: {score}
                    </div>
                    <div className="text-text-secondary">
                      {score >= 150 ? '🏆 Amazing!' : score >= 100 ? '🎉 Great job!' : score >= 50 ? '👍 Not bad!' : '💪 Keep practicing!'}
                    </div>
                    <button
                      onClick={resetGame}
                      className="w-full py-3 bg-secondary hover:bg-secondary/80 text-white rounded-xl font-medium transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center">
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
