"use client"

import React, { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  rotation: number
  rotationSpeed: number
  lifespan: number
  maxLifespan: number
}

const GoldParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
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

    // Create gradient for gold particles
    const createGoldGradient = (ctx: CanvasRenderingContext2D, size: number) => {
      const gradient = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      )
      gradient.addColorStop(0, "rgba(255, 215, 0, 1)")    // Bright gold
      gradient.addColorStop(0.5, "rgba(255, 223, 120, 0.8)") // Medium gold
      gradient.addColorStop(1, "rgba(255, 230, 150, 0)")   // Transparent edge
      return gradient
    }

    // Function to create a new particle
    const createParticle = (): Particle => {
      // Make particles smaller (reduced size range)
      const size = Math.random() * 3.5 + 1
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        speedX: (Math.random() - 0.5) * 0.2, // Slower movement
        speedY: (Math.random() - 0.5) * 0.15 - 0.05, // Very slight upward bias
        opacity: Math.random() * 0.3 + 0.1, // Lower opacity
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005, // Slower rotation
        lifespan: 0,
        maxLifespan: Math.random() * 700 + 300 // Longer lifespan
      }
    }

    // Initialize particles - more particles but smaller and less visible
    const particleCount = Math.min(Math.floor(window.innerWidth / 8), 150)
    particlesRef.current = Array.from(
      { length: particleCount }, 
      () => createParticle()
    )

    // Draw a star-shaped particle
    const drawStar = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      size: number, 
      rotation: number, 
      opacity: number
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = opacity
      
      const outerRadius = size
      const innerRadius = size / 2.5
      const spikes = 5
      
      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (Math.PI * 2 * i) / (spikes * 2)
        if (i === 0) {
          ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle))
        } else {
          ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle))
        }
      }
      ctx.closePath()
      
      // Fill with gold gradient
      const gradient = createGoldGradient(ctx, size * 2)
      ctx.fillStyle = gradient
      ctx.fill()
      
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return
      
      // Clear canvas with a transparent fill to create trailing effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.01)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.rotationSpeed
        particle.lifespan++
        
        // Adjust opacity based on lifespan
        if (particle.lifespan < 30) {
          particle.opacity = (particle.lifespan / 30) * 0.3
        } else if (particle.lifespan > particle.maxLifespan - 30) {
          particle.opacity = ((particle.maxLifespan - particle.lifespan) / 30) * 0.3
        }
        
        // Draw the particle
        drawStar(
          ctx, 
          particle.x, 
          particle.y, 
          particle.size, 
          particle.rotation, 
          particle.opacity
        )
        
        // Reset particle if it goes out of bounds or exceeds lifespan
        if (
          particle.x < -50 || 
          particle.x > canvas.width + 50 || 
          particle.y < -50 || 
          particle.y > canvas.height + 50 ||
          particle.lifespan >= particle.maxLifespan
        ) {
          particlesRef.current[index] = createParticle()
          
          // Start new particles at edges with inward direction
          const edge = Math.floor(Math.random() * 4)
          if (edge === 0) { // top
            particlesRef.current[index].y = -10
            particlesRef.current[index].speedY = Math.abs(particlesRef.current[index].speedY) * 0.2
          } else if (edge === 1) { // right
            particlesRef.current[index].x = canvas.width + 10
            particlesRef.current[index].speedX = -Math.abs(particlesRef.current[index].speedX) * 0.2
          } else if (edge === 2) { // bottom
            particlesRef.current[index].y = canvas.height + 10
            particlesRef.current[index].speedY = -Math.abs(particlesRef.current[index].speedY) * 0.2
          } else { // left
            particlesRef.current[index].x = -10
            particlesRef.current[index].speedX = Math.abs(particlesRef.current[index].speedX) * 0.2
          }
        }
      })
      
      // Add new particles randomly
      if (Math.random() < 0.1 && particlesRef.current.length < 200) {
        const newParticle = createParticle()
        // Random position at the edge of the screen
        const side = Math.floor(Math.random() * 4)
        if (side === 0) { // top
          newParticle.y = -10
          newParticle.x = Math.random() * canvas.width
          newParticle.speedY = Math.abs(newParticle.speedY) * 0.1
        } else if (side === 1) { // right
          newParticle.x = canvas.width + 10
          newParticle.y = Math.random() * canvas.height
          newParticle.speedX = -Math.abs(newParticle.speedX) * 0.1
        } else if (side === 2) { // bottom
          newParticle.y = canvas.height + 10
          newParticle.x = Math.random() * canvas.width
          newParticle.speedY = -Math.abs(newParticle.speedY) * 0.1
        } else { // left
          newParticle.x = -10
          newParticle.y = Math.random() * canvas.height
          newParticle.speedX = Math.abs(newParticle.speedX) * 0.1
        }
        particlesRef.current.push(newParticle)
        
        // Keep particle count reasonable
        if (particlesRef.current.length > 250) {
          particlesRef.current.shift()
        }
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
      style={{ opacity: 0.3 }}
    />
  )
}

export default GoldParticles 