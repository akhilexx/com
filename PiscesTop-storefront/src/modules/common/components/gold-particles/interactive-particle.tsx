"use client"

import React, { useEffect, useRef } from "react"

interface CursorParticle {
  x: number
  y: number
  size: number
  angle: number
  distance: number
  opacity: number
  lifespan: number
}

const InteractiveGoldParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<CursorParticle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, moving: false })
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

    // Create particle following mouse
    const createCursorParticle = (x: number, y: number, speed: number): CursorParticle => {
      // Random angle around the cursor
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 20 + 10
      
      return {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        size: Math.random() * 5 + 2,
        angle: angle,
        distance: distance,
        opacity: Math.random() * 0.5 + 0.5,
        lifespan: Math.random() * 40 + 20
      }
    }

    // Mouse move event handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      mouseRef.current.prevX = mouseRef.current.x
      mouseRef.current.prevY = mouseRef.current.y
      mouseRef.current.x = x
      mouseRef.current.y = y
      mouseRef.current.moving = true
      
      // Calculate mouse speed
      const dx = mouseRef.current.x - mouseRef.current.prevX
      const dy = mouseRef.current.y - mouseRef.current.prevY
      const speed = Math.sqrt(dx * dx + dy * dy)
      
      // Create particles based on mouse speed
      if (speed > 5) {
        const numParticles = Math.min(Math.floor(speed / 5), 3)
        for (let i = 0; i < numParticles; i++) {
          particlesRef.current.push(createCursorParticle(x, y, speed))
        }
      }
    }

    // Initial mouse position
    mouseRef.current = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2, 
      prevX: window.innerWidth / 2, 
      prevY: window.innerHeight / 2, 
      moving: false
    }

    // Add mouse event listeners
    window.addEventListener("mousemove", handleMouseMove)

    // Draw a gold particle
    const drawGoldParticle = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      size: number,
      opacity: number
    ) => {
      ctx.save()
      
      // Create radial gradient for gold effect
      const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, size
      )
      gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`)    // Center: Gold
      gradient.addColorStop(0.6, `rgba(255, 200, 50, ${opacity * 0.8})`)  // Middle: Lighter gold
      gradient.addColorStop(1, "rgba(255, 230, 150, 0)")   // Edge: Transparent

      // Draw glow
      ctx.beginPath()
      ctx.arc(x, y, size * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
      
      // Draw core
      ctx.beginPath()
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 200, ${opacity})`
      ctx.fill()
      
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return
      
      // Clear canvas with full transparent fill
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i]
        
        // Update particle
        particle.lifespan--
        
        // Calculate opacity based on lifespan
        particle.opacity = (particle.lifespan / 60) * 0.8
        
        // Draw particle
        drawGoldParticle(
          ctx, 
          particle.x, 
          particle.y, 
          particle.size,
          particle.opacity
        )
        
        // Remove dead particles
        if (particle.lifespan <= 0) {
          particlesRef.current.splice(i, 1)
        }
      }
      
      // Add sparkle around cursor when not moving
      if (!mouseRef.current.moving && Math.random() < 0.2) {
        particlesRef.current.push(
          createCursorParticle(mouseRef.current.x, mouseRef.current.y, 0)
        )
      }
      
      // Reset moving flag
      mouseRef.current.moving = false
      
      // Limit number of particles
      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100)
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
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  )
}

export default InteractiveGoldParticles 