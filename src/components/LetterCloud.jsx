import { useEffect, useRef } from 'react'

const letters = [
  { char: 'e', color: 'bg-gradient-to-br from-pink-400 to-yellow-300' },
  { char: 'f', color: 'bg-gradient-to-br from-blue-400 to-cyan-100' },
  { char: 'l', color: 'bg-gradient-to-br from-green-400 to-emerald-100' },
  { char: 'o', color: 'bg-gradient-to-br from-orange-400 to-rose-300' },
  { char: 'a', color: 'bg-gradient-to-br from-purple-500 to-fuchsia-300' }
]

function useFloating(
  ref,
  {
    speed = 1.5,
    amplitudeY = 12,
    amplitudeX = 6,
    delay = 0,
    rotateRange = 7,
    scaleRange = 0.07,
  } = {}
) {
  useEffect(() => {
    if (!ref.current) return
    let id
    const el = ref.current
    let start = performance.now()

    function animate(now) {
      const t = ((now - start) / 1000) * speed + delay
      const y = Math.sin(t) * amplitudeY
      const x = Math.cos(t * 1.3) * amplitudeX
      const r = Math.sin(t + 0.3) * rotateRange
      const s = 1 + Math.sin(t * 2) * scaleRange
      el.style.transform = `translate(${x}px, ${y}px) rotateZ(${r}deg) scale(${s.toFixed(3)})`
      id = requestAnimationFrame(animate)
    }

    id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [ref, speed, amplitudeY, amplitudeX, delay, rotateRange, scaleRange])
}

function BgParticles() {
  const particles = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      width: 30 + Math.random() * 50,
      height: 25 + Math.random() * 50,
      left: Math.random() * 98,
      top: Math.random() * 92,
      blur: 8 + Math.random() * 16,
      opacity: 0.1 + Math.random() * 0.15,
      color: i % 3 === 0
        ? `radial-gradient(circle at 60% 30%, #FF3CAC88 0%, #4EFFF744 100%)`
        : i % 3 === 1
        ? `radial-gradient(circle at 40% 70%, #f9fafbaa 0%, #b0f7ff55 100%)`
        : `radial-gradient(circle at 50% 50%, #c0aaffbb 0%, #ff99cc33 100%)`,
      anim: `particleFloat${i % 6}`,
      key: i + '-' + Math.random()
    }))
  ).current

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {particles.map(p => (
        <div
          key={p.key}
          className="absolute rounded-full"
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: p.color,
            opacity: p.opacity,
            filter: `blur(${p.blur}px) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))`,
            animation: `${p.anim} ${10 + Math.random() * 10}s ease-in-out infinite alternate`
          }}
        />
      ))}
      <style>{`
        @keyframes particleFloat0 { 0% {transform:translateY(0);} 100% {transform:translateY(-20px);} }
        @keyframes particleFloat1 { 0% {transform:translateY(0);} 100% {transform:translateY(18px);} }
        @keyframes particleFloat2 { 0% {transform:translateX(0);} 100% {transform:translateX(-16px);} }
        @keyframes particleFloat3 { 0% {transform:translateX(0);} 100% {transform:translateX(12px);} }
        @keyframes particleFloat4 { 0% {transform:translate(0, 0);} 100% {transform:translate(12px, -12px);} }
        @keyframes particleFloat5 { 0% {transform:translate(0, 0);} 100% {transform:translate(-14px, 10px);} }
      `}</style>
    </div>
  )
}

export default function LetterCloud() {
  return (
    <div className="relative w-full flex flex-wrap justify-center items-center gap-x-2 gap-y-1 md:gap-x-6 min-h-[70vh] px-1 md:px-8 select-none z-10">
      <BgParticles />
      {letters.map(({ char, color }, i) => {
        const ref = useRef(null)
        // 每个字母初始化时使用固定随机种子避免抖动
        useFloating(ref, {
          speed: 0.8 + (i * 0.15),
          amplitudeY: 8 + i * 2,
          amplitudeX: 5 + (i % 3) * 3,
          delay: i * 0.7,
          rotateRange: 4 + (i % 5),
          scaleRange: 0.05 + (i % 3) * 0.02
        })

        return (
          <span
            key={char}
            ref={ref}
            className={`
              font-extrabold
              text-[17vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] xl:text-[6vw]
              text-transparent bg-clip-text ${color}
              drop-shadow-[0_8px_32px_rgba(31,38,135,0.14)]
              transition-all duration-300
              cursor-pointer
              will-change-transform
              relative z-10
              select-none

              // 呼吸灯动画
              animate-glow

              // 悬浮时更强烈的发光和微缩放
              hover:scale-110 hover:drop-shadow-[0_8px_48px_rgba(236,72,153,0.5)] hover:saturate-200 hover:blur-[0.5px] hover:rotate-3
              active:scale-95
            `}
            style={{
              filter: 'brightness(1.15) drop-shadow(0 0 20px #fff4)',
              transition:
                'transform 0.3s cubic-bezier(.77,0,.18,1), filter 0.25s ease-in-out',
            }}
            tabIndex={-1}
            aria-label={`Letter ${char}`}
          >
            {char}
      <style>{`
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 15px #fff5) drop-shadow(0 0 20px #ff66ccaa); }
          50% { filter: drop-shadow(0 0 30px #ff99ccff) drop-shadow(0 0 40px #ff66ccdd); }
        }
        .animate-glow {
          animation: glow 3.5s ease-in-out infinite;
        }
      `}</style>
          </span>
        )
      })}
    </div>
  )
}
