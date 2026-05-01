'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Footer'
import VisitorCounter from '../../../components/VisitorCounter'

interface Cell {
  text: string
  isFlipped: boolean
  isHit: boolean
}

const bingoWords = [
  'Further research is needed',
  'It has been shown that...',
  'Results are promising',
  'This is beyond the scope of this paper',
  'Preliminary results suggest',
  'It is widely accepted that',
  'Limitations of this study include',
  'Our findings are consistent with',
  'As illustrated in Figure X',
  'Future work should investigate',
  'The authors declare no conflict of interest',
  'This approach is novel',
  'It should be noted that',
  'To the best of our knowledge',
  'These results open new avenues',
  'In light of these findings',
  'Robustness checks confirm',
  'A growing body of literature',
  'Significant at the p<0.05 level',
  'This paper contributes to',
  'The dataset consists of',
  'Our method outperforms',
  'We use a pre-trained model',
  'Code will be made available',
  'Peer review process',
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function BingoPage() {
  const [cells, setCells] = useState<Cell[]>([])
  const [bingoCount, setBingoCount] = useState(0)
  const [isBingoFlash, setIsBingoFlash] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    initGame()
  }, [])

  const initGame = () => {
    const shuffledWords = shuffleArray(bingoWords)
    const newCells: Cell[] = shuffledWords.map((text) => ({
      text,
      isFlipped: false,
      isHit: false,
    }))
    setCells(newCells)
    setBingoCount(0)
    setScore(0)
  }

  const checkBingo = (updatedCells: Cell[]): number => {
    let count = 0

    for (let i = 0; i < 5; i++) {
      let rowBingo = true
      let colBingo = true
      for (let j = 0; j < 5; j++) {
        if (!updatedCells[i * 5 + j].isHit) rowBingo = false
        if (!updatedCells[j * 5 + i].isHit) colBingo = false
      }
      if (rowBingo) count++
      if (colBingo) count++
    }

    let diag1 = true
    let diag2 = true
    for (let i = 0; i < 5; i++) {
      if (!updatedCells[i * 5 + i].isHit) diag1 = false
      if (!updatedCells[i * 5 + (4 - i)].isHit) diag2 = false
    }
    if (diag1) count++
    if (diag2) count++

    return count
  }

  const handleCellClick = (index: number) => {
    if (cells[index].isFlipped) return

    const isHit = Math.random() < 0.5
    const updatedCells = cells.map((cell, i) =>
      i === index ? { ...cell, isFlipped: true, isHit } : cell
    )

    setCells(updatedCells)

    if (isHit) {
      setScore((prev) => prev + 10)
      const newBingoCount = checkBingo(updatedCells)
      if (newBingoCount > bingoCount) {
        setBingoCount(newBingoCount)
        setIsBingoFlash(true)
        setTimeout(() => setIsBingoFlash(false), 1000)
      }
    }
  }

  const getCellClass = (cell: Cell) => {
    if (!cell.isFlipped) {
      return 'bg-bg-card hover:bg-bg-hover text-text cursor-pointer'
    }
    return cell.isHit
      ? 'bg-success/20 text-success border-success/50'
      : 'bg-error/20 text-error border-error/50'
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
            <span className="text-text-secondary">/ Games / Bingo</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-lg font-bold ${isBingoFlash ? 'text-success animate-pulse' : 'text-text'}`}>
              Bingo: {bingoCount}
            </div>
            <VisitorCounter />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">🎯 Paper Bingo</h1>
          <p className="text-text-secondary">Click squares to flip them! 50% chance of finding the phrase.</p>
          <div className="mt-4 text-lg">
            <span className="text-text-secondary">Score: </span>
            <span className="text-primary font-bold">{score}</span>
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-4 mb-8">
          <div className="grid grid-cols-5 gap-2">
            {cells.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                className={`aspect-square rounded-lg p-2 text-xs font-medium border-2 transition-all ${getCellClass(cell)}`}
              >
                {cell.isFlipped ? (cell.isHit ? '✅ Found!' : '❌ Not in this paper') : cell.text}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={initGame}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            New Game
          </button>
        </div>

        <div className="flex justify-center mt-6">
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
