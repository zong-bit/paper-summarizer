'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<'start' | 'playing' | 'dead'>('start')

  const gameRef = useRef({
    bird: { x: 50, y: 250, vy: 0, size: 15 },
    pipes: [] as { x: number; gap: number; width: number; scored: boolean }[],
    score: 0,
    frame: 0,
    gameState: 'start' as 'start' | 'playing' | 'dead',
  })

  const GRAVITY = 0.5
  const JUMP = -8
  const PIPE_SPEED = 3
  const PIPE_WIDTH = 40
  const PIPE_GAP = 120
  const PIPE_INTERVAL = 100

  const jump = useCallback(() => {
    const g = gameRef.current
    if (g.gameState === 'start') {
      g.gameState = 'playing'
      g.bird.vy = JUMP
    } else if (g.gameState === 'playing') {
      g.bird.vy = JUMP
    }
  }, [])

  const reset = useCallback(() => {
    const g = gameRef.current
    g.bird = { x: 50, y: 250, vy: 0, size: 15 }
    g.pipes = []
    g.score = 0
    g.frame = 0
    g.gameState = 'start'
    setScore(0)
    setGameState('start')
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (gameState === 'dead') reset()
        else jump()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [jump, reset, gameState])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const gameLoop = () => {
      const g = gameRef.current
      const W = 400
      const H = 500

      // Clear
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, W, H)

      if (g.gameState === 'playing') {
        // Physics
        g.bird.vy += GRAVITY
        g.bird.y += g.bird.vy

        // Spawn pipes
        g.frame++
        if (g.frame % PIPE_INTERVAL === 0) {
          const gapY = Math.random() * (H - PIPE_GAP - 100) + 50
          g.pipes.push({ x: W, gap: gapY, width: PIPE_WIDTH, scored: false })
        }

        // Move pipes
        for (const pipe of g.pipes) {
          pipe.x -= PIPE_SPEED
          if (!pipe.scored && pipe.x + pipe.width < g.bird.x) {
            pipe.scored = true
            g.score++
            setScore(g.score)
          }
        }

        // Remove offscreen pipes
        g.pipes = g.pipes.filter(p => p.x > -PIPE_WIDTH)

        // Collision
        const b = g.bird
        if (b.y + b.size > H || b.y - b.size < 0) {
          g.gameState = 'dead'
          setGameState('dead')
        }

        for (const pipe of g.pipes) {
          const bx = b.x, by = b.y, s = b.size
          if (
            bx + s > pipe.x &&
            bx - s < pipe.x + pipe.width &&
            (by - s < pipe.gap || by + s > pipe.gap + PIPE_GAP)
          ) {
            g.gameState = 'dead'
            setGameState('dead')
          }
        }
      }

      // Draw bird
      ctx.fillStyle = '#e94560'
      ctx.beginPath()
      ctx.arc(g.bird.x, g.bird.y, g.bird.size, 0, Math.PI * 2)
      ctx.fill()

      // Draw pipes
      ctx.fillStyle = '#0f3460'
      for (const pipe of g.pipes) {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.gap)
        ctx.fillRect(pipe.x, pipe.gap + PIPE_GAP, pipe.width, H - pipe.gap - PIPE_GAP)
        ctx.fillStyle = '#16213e'
        // Pipe caps
        ctx.fillRect(pipe.x - 5, pipe.gap - 15, pipe.width + 10, 15)
        ctx.fillRect(pipe.x - 5, pipe.gap + PIPE_GAP, pipe.width + 10, 15)
        ctx.fillStyle = '#0f3460'
      }

      // Draw ground
      ctx.fillStyle = '#16213e'
      ctx.fillRect(0, H - 5, W, 5)

      // Score
      ctx.fillStyle = '#fff'
      ctx.font = '24px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(g.score), W / 2, 40)

      // Messages
      if (g.gameState === 'start') {
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.font = '18px sans-serif'
        ctx.fillText('Press SPACE or Tap to Start', W / 2, H / 2 + 60)
      }
      if (g.gameState === 'dead') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#e94560'
        ctx.font = '32px sans-serif'
        ctx.fillText('Game Over', W / 2, H / 2 - 20)
        ctx.fillStyle = '#fff'
        ctx.font = '18px sans-serif'
        ctx.fillText('Score: ' + g.score, W / 2, H / 2 + 20)
        ctx.fillText('Press SPACE to Restart', W / 2, H / 2 + 60)
      }

      animId = requestAnimationFrame(gameLoop)
    }

    animId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center bg-bg p-4">
      <header className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-primary hover:text-primary-dark transition-colors text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Summarizer
          </Link>
          <button onClick={reset} className="text-sm text-text-secondary hover:text-text transition-colors">Restart</button>
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-3xl font-bold text-text">🎮 Flappy Bird</h1>
          <p className="text-text-secondary text-sm mt-1">Score: <span className="text-primary font-semibold text-lg">{score}</span></p>
        </div>
      </header>

      <div className="bg-gradient-to-b from-primary/5 to-secondary/5 rounded-2xl p-1">
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          onClick={() => { if (gameState === 'dead') reset(); else jump() }}
          className="rounded-xl border border-primary/30 cursor-pointer mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <div className="mt-6 text-center space-y-1">
        <p className="text-text-secondary/60 text-xs">Press SPACE or click/tap to flap</p>
      </div>

      <div className="mt-8 bg-bg-card border border-border rounded-xl p-4 text-center max-w-md w-full">
        <div className="text-text-secondary text-xs">Ad Placeholder - Google AdSense</div>
      </div>
    </div>
  )
}
