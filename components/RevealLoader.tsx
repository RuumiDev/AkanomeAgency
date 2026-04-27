'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef } from 'react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

export type StaggerType = 'left-to-right' | 'right-to-left' | 'center-out' | 'edges-in'
export type MovementType = 'top-down' | 'bottom-up' | 'fade-out' | 'scale-vertical'

interface RevealLoaderProps {
  logoSrc?: string
  bgColors?: string[]
  staggerOrder?: StaggerType
  movementDirection?: MovementType
  className?: string
  onComplete?: () => void
}

const RevealLoader = ({
  logoSrc,
  bgColors = ['#ffffff'],
  staggerOrder = 'edges-in',
  movementDirection = 'fade-out',
  className,
  onComplete,
}: RevealLoaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null)

  const getStaggerFrom = (type: StaggerType): string | number => {
    switch (type) {
      case 'right-to-left': return 'end'
      case 'center-out': return 'center'
      case 'edges-in': return 'edges'
      case 'left-to-right':
      default: return 'start'
    }
  }

  const getAnimationProperties = (type: MovementType) => {
    switch (type) {
      case 'fade-out': return { autoAlpha: 0, ease: 'power2.inOut' }
      default: return { y: '100%', ease: 'power2.inOut' }
    }
  }

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: onComplete })
    const moveProps = getAnimationProperties(movementDirection)
    const staggerConfig = { each: 0.1, from: getStaggerFrom(staggerOrder) as gsap.Position }

    // 1. Fade logo in
    if (logoSrc) {
      tl.fromTo(
        '.loader-logo',
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      )
      // 2. Hold, then fade logo out BEFORE loader ends
      tl.to('.loader-logo', { autoAlpha: 0, scale: 0.95, duration: 0.4, ease: 'power2.in' }, '+=0.5')
    }

    // 3. Animate the background bars away
    tl.to(
      '.preloader-item',
      { duration: 0.6, stagger: staggerConfig, ...moveProps },
      '-=0.1'
    ).to(preloaderRef.current, { autoAlpha: 0, duration: 0.1 })
  }, { scope: preloaderRef, dependencies: [staggerOrder, movementDirection, logoSrc] })

  return (
    <div
      className={cn('fixed inset-0 z-[100] flex overflow-hidden bg-transparent', className)}
      ref={preloaderRef}
    >
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="preloader-item h-full w-[10%]"
          style={{ backgroundColor: bgColors[0] }}
        />
      ))}
      {logoSrc && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={logoSrc}
            alt="Loading Logo"
            className="loader-logo w-48 md:w-64 h-auto object-contain invisible"
          />
        </div>
      )}
    </div>
  )
}

export default RevealLoader
