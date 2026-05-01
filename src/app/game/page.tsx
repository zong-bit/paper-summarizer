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
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-4">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-text">Flappy Bird</h1>
        <p className="text-text-secondary text-sm">Score: {score}</p>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        onClick={() => { if (gameState === 'dead') reset(); else jump() }}
        className="rounded-xl border border-border cursor-pointer"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <div className="mt-4 flex gap-4">
        <Link href="/" className="text-primary hover:text-primary-dark transition-colors text-sm">← Back to Summarizer</Link>
        <button onClick={reset} className="text-primary hover:text-primary-dark transition-colors text-sm">Restart</button>
      </div>
      <div className="mt-8 bg-bg-card border border-border rounded-xl p-4 text-center max-w-md">
        <div className="text-text-secondary text-xs">Ad Placeholder - Google AdSense</div>
      </div>
    </div>
  )
}
