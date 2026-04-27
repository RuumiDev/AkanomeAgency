'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import ProfileCard from './ProfileCard'
import StarBorder from './StarBorder'
import RevealLoader from './RevealLoader'
// Cast to any so TS doesn't try to infer props from the plain JS source
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Card = ProfileCard as React.ComponentType<any>

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: number
  role: string
  roleImage: string
  displayName: string
  fullName: string
  studentId: string
  image: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    role: 'LEADER',
    roleImage: '/assets/titles/leader.png',
    displayName: 'Muhammad Faris',
    fullName: 'MUHD FARIS AIMAN BIN MOHD FADLI',
    studentId: 'IPJ241310389',
    image: '/assets/profiles/farisu.png',
  },
  {
    id: 2,
    role: 'DESIGNER',
    roleImage: '/assets/titles/designer.png',
    displayName: 'Khairin Irham',
    fullName: 'MUHD KHAIRIN IRHAM BIN MOHD TAHA',
    studentId: 'IPJ241310438',
    image: '/assets/profiles/Rin - Edited.png',
  },
  {
    id: 3,
    role: 'IDEATION',
    roleImage: '/assets/titles/ideation.png',
    displayName: 'Muhammad Irfan',
    fullName: 'MUHAMMAD IRFAN BIN ANUAR',
    studentId: 'IPJ241310304',
    image: '/assets/profiles/Irufan - Edited (1).png',
  },
  {
    id: 4,
    role: 'PRESENTER',
    roleImage: '/assets/titles/presenter.png',
    displayName: 'Ahmad Akmal',
    fullName: 'AHMAD AKMAL BIN ABDULLAH',
    studentId: 'IPJ241310104',
    image: '/assets/profiles/Maru - Edited (1).png',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function AkanomeTeam() {
  const heroRef      = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLDivElement>(null)
  const cardsRef     = useRef<HTMLDivElement>(null)
  const [isLoaderFinished, setIsLoaderFinished] = useState(false)

  // ── 1. Scroll restoration ────────────────────────────────────────────────────
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // ── 2. Lenis smooth scroll ───────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    lenis.on('scroll', () => ScrollTrigger.update())
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => { lenis.raf(time * 1000) })
    }
  }, [])

  // ── 4. Master GSAP sequence — fires only after RevealLoader completes ────────
  useEffect(() => {
    if (!isLoaderFinished) return

    const ctx = gsap.context(() => {

      // Gaussian blur reveal sequence
      const mainTl = gsap.timeline()
      mainTl
        .fromTo('.hello-text',
          { filter: 'blur(20px)', autoAlpha: 0, scale: 0.9 },
          { filter: 'blur(0px)', autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power4.out' }
        )
        .fromTo('.hce-text',
          { filter: 'blur(15px)', opacity: 0 },
          { filter: 'blur(0px)', opacity: 1, duration: 1, ease: 'power2.out' },
          '-=0.5'
        )
        .to('.scroll-line', { scaleY: 1, duration: 1, ease: 'power2.inOut' }, '-=0.4')

      // Background: white → dark as user scrolls through hero
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          backgroundColor: '#0A0A0A',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom center',
            scrub: true,
          },
        })
        gsap.to(['.hello-text', '.hce-text'], {
          color: '#ffffff',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom center',
            scrub: true,
          },
        })
      }

      // Title characters — scroll scrub
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.char')
        gsap.from(chars, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            end: 'bottom 55%',
            scrub: 1,
          },
          yPercent: 120,
          autoAlpha: 0,
          stagger: { each: 0.04, from: 'center' },
          ease: 'sine.out',
        })
      }

      // Cards — scroll-responsive entrance
      if (cardsRef.current) {
        gsap.fromTo('.team-card',
          { y: 100, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'power3.out',
            force3D: true,
            stagger: { amount: 0.6, from: 'center' },
            scrollTrigger: {
              trigger: '.team-card',
              start: 'top bottom-=50',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isLoaderFinished])

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const splitText = (text: string) =>
    text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ willChange: 'transform' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full" style={{ background: '#0A0A0A' }}>

      {/* ══ REVEAL LOADER ════════════════════════════════════════════════════ */}
      <RevealLoader
        logoSrc="/assets/Akanome logo.png"
        bgColors={['#0A0A0A']}
        onComplete={() => setIsLoaderFinished(true)}
      />

      {/* ══ HERO SECTION ═════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="hero-container h-screen w-full flex flex-col items-center justify-center bg-white relative z-50"
      >
        <div className="text-center">
          <h1 className="hello-text text-[clamp(4rem,15vw,10rem)] font-black tracking-tighter text-black leading-none mb-4 opacity-0 invisible">
            Hello! 👋
          </h1>
          <p className="hce-text text-2xl md:text-3xl font-bold tracking-[0.5em] opacity-0" style={{ color: '#52525b' }}>
            HCE2013
          </p>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-black opacity-50">
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-black origin-top scale-y-0 scroll-line" />
        </div>
      </section>

      {/* ══ TEAM SECTION ═════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col pt-12">

        {/* Title — overflow-hidden only here so the title scrub clips, not the cards */}
        <div className="flex flex-col items-center w-full px-6 pt-16 pb-8 overflow-hidden">
          <div
            ref={titleRef}
            aria-label="AKANOME AGENCY"
            className="font-black uppercase text-[clamp(2rem,8vw,6rem)] whitespace-nowrap leading-none tracking-tighter text-white"
          >
            {splitText('AKANOME AGENCY')}
          </div>
          <div
            className="mt-5 h-px w-24"
            style={{ background: 'linear-gradient(90deg,transparent,#E30613,#85291E,transparent)' }}
          />
          <p className="text-[#C6C6C7] text-[10px] md:text-xs tracking-[0.4em] uppercase mt-2 opacity-90">
            Meet the Team
          </p>
        </div>

        {/* Centered Grid Section */}
        <div className="flex-1 flex items-center justify-center w-full py-8 -mt-12">
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 w-full max-w-[90rem] mx-auto px-8 pb-20 place-items-center"
          >
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card w-full max-w-[340px] md:max-w-none flex flex-col items-center mx-auto will-change-transform opacity-0">

                {/* Profile Card */}
                <div className="w-full">
                  <StarBorder
                    as="div"
                    color="#E30613"
                    speed="6s"
                    thickness={4.5}
                    className="w-full"
                    style={{ borderRadius: '30px' }}
                  >
                    <Card
                      name={member.displayName}
                      title=""
                      handle={member.studentId}
                      status={member.fullName}
                      avatarUrl={member.image}
                      showUserInfo={true}
                      enableTilt={true}
                      enableMobileTilt={false}
                      behindGlowEnabled={true}
                      behindGlowColor="#E30613"
                      innerGradient="linear-gradient(145deg, #0A0A0A 0%, rgba(227, 6, 19, 0.1) 100%)"
                    />
                  </StarBorder>
                </div>

                {/* Role image below card */}
                <div className="-mt-20 flex justify-center w-full px-4">
                  <img
                    src={member.roleImage}
                    alt={member.role}
                    className="h-52 md:h-64 lg:h-72 w-auto object-contain drop-shadow-[0_0_15px_rgba(227,6,19,0.4)]"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default AkanomeTeam