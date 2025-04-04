"use client"

import React, { useEffect, useRef } from "react"

interface Fish {
  x: number
  y: number
  size: number
  speed: number
  direction: number // 1 for right, -1 for left
  wiggle: number
  wiggleSpeed: number
  wiggleDirection: number
  opacity: number
}

const GoldenFish = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fishRef = useRef<Fish[]>([])
  const requestIdRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener("resize", handleResize)
    handleResize()

    // Create a fish
    const createFish = (): Fish => {
      const size = Math.random() * 20 + 10
      const direction = Math.random() > 0.5 ? 1 : -1
      return {
        x: direction === 1 ? -size * 2 : canvas.width + size * 2,
        y: Math.random() * canvas.height,
        size,
        speed: (Math.random() * 0.5 + 0.3) * 1.5,
        direction,
        wiggle: 0,
        wiggleSpeed: Math.random() * 0.1 + 0.05,
        wiggleDirection: 1,
        opacity: Math.random() * 0.4 + 0.2
      }
    }

    // Initialize fish
    const fishCount = Math.min(Math.floor(window.innerWidth / 200), 15) + 5
    fishRef.current = Array.from({ length: fishCount }, createFish)

    // Draw a golden fish
    const drawFish = (
      ctx: CanvasRenderingContext2D,
      fish: Fish
    ) => {
      const { x, y, size, direction, wiggle, opacity } = fish
      
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(direction === 1 ? 0 : Math.PI)
      ctx.globalAlpha = opacity
      
      // Fish body gradient
      const bodyGradient = ctx.createLinearGradient(-size, 0, size, 0)
      bodyGradient.addColorStop(0, "rgba(255, 215, 0, 0.8)")    // Gold
      bodyGradient.addColorStop(0.5, "rgba(218, 165, 32, 0.9)")  // Golden rod
      bodyGradient.addColorStop(1, "rgba(184, 134, 11, 0.8)")   // Dark golden rod
      
      // Draw fish body (oval)
      ctx.beginPath()
      ctx.ellipse(0, 0, size, size/2, 0, 0, Math.PI * 2)
      ctx.fillStyle = bodyGradient
      ctx.fill()
      
      // Draw tail
      ctx.beginPath()
      ctx.moveTo(size * -0.5, 0)
      ctx.quadraticCurveTo(
        size * -1, 
        size * 0.5 + wiggle * size * 0.3, 
        size * -1.5, 
        0
      )
      ctx.quadraticCurveTo(
        size * -1, 
        size * -0.5 - wiggle * size * 0.3, 
        size * -0.5, 
        0
      )
      ctx.fillStyle = bodyGradient
      ctx.fill()
      
      // Draw dorsal fin
      ctx.beginPath()
      ctx.moveTo(0, size * -0.5)
      ctx.quadraticCurveTo(
        size * 0.3, 
        size * -1.2, 
        size * 0.6, 
        size * -0.3
      )
      ctx.lineTo(0, size * -0.5)
      ctx.fillStyle = "rgba(255, 215, 0, 0.6)"
      ctx.fill()
      
      // Draw eye
      ctx.beginPath()
      ctx.arc(size * 0.5, 0, size * 0.15, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fill()
      
      // Shine on eye
      ctx.beginPath()
      ctx.arc(size * 0.55, size * -0.05, size * 0.05, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fill()

      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return
      
      // Clear canvas with semi-transparent fill for trailing effect
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw fish
      fishRef.current.forEach((fish, index) => {
        // Update position
        fish.x += fish.speed * fish.direction
        
        // Update wiggle for swimming effect
        fish.wiggle += fish.wiggleSpeed * fish.wiggleDirection
        if (Math.abs(fish.wiggle) > 1) {
          fish.wiggleDirection *= -1
        }
        
        // Draw fish
        drawFish(ctx, fish)
        
        // Reset fish if out of canvas
        if (
          (fish.direction === 1 && fish.x > canvas.width + fish.size * 2) ||
          (fish.direction === -1 && fish.x < -fish.size * 2)
        ) {
          fishRef.current[index] = createFish()
        }
        
        // Random vertical movement
        fish.y += Math.sin(Date.now() * 0.001 + index) * 0.5
        
        // Keep fish within vertical bounds
        if (fish.y < fish.size) {
          fish.y = fish.size
        } else if (fish.y > canvas.height - fish.size) {
          fish.y = canvas.height - fish.size
        }
      })
      
      // Occasionally add a new fish
      if (Math.random() < 0.005 && fishRef.current.length < 30) {
        fishRef.current.push(createFish())
      }

      requestIdRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  )
}

export default GoldenFish 