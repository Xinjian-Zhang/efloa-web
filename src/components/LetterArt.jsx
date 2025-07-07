import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef } from 'react'

const gradients = [
  "bg-gradient-to-br from-pink-400 via-yellow-200 to-yellow-300",
  "bg-gradient-to-bl from-blue-400 via-cyan-200 to-cyan-300",
  "bg-gradient-to-tr from-green-400 via-emerald-100 to-emerald-200",
  "bg-gradient-to-br from-orange-400 via-rose-200 to-rose-400",
  "bg-gradient-to-tr from-purple-500 via-fuchsia-200 to-fuchsia-400"
]

export default function LetterArt({ char, style }) {
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // 悬停3D光泽
  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    rotateY.set(((x / rect.width) - 0.5) * 30)
    rotateX.set(-((y / rect.height) - 0.5) * 32)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  // 随机渐变样式，每个字母不同
  const gradientClass = gradients[Math.floor(Math.random() * gradients.length)]

  return (
    <motion.div
      ref={ref}
      className={`
        flex items-center justify-center
        rounded-[2vw]
        shadow-[0_8px_32px_0_rgba(31,38,135,0.13)]
        font-display font-extrabold
        text-[17vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] xl:text-[6vw]
        text-transparent bg-clip-text ${gradientClass}
        transition-all duration-500
        cursor-pointer select-none
        mix-blend-lighten
        relative
        backdrop-blur-2xl
        will-change-transform
      `}
      style={{
        ...style,
        filter: `drop-shadow(0 0 42px #fff3) blur(0.3px) saturate(1.15)`,
        textShadow: "0 0 34px #fff, 0 0 12px #b2e5fa",
      }}
      initial={{
        opacity: 0,
        scale: 0.7,
        y: 40,
        filter: "blur(16px) brightness(0.7)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0.3px) brightness(1.1)"
      }}
      whileHover={{
        scale: 1.18,
        filter: "brightness(1.7) blur(0px) saturate(2.5) drop-shadow(0 0 64px #FF3CAC99)",
        textShadow: "0 0 104px #fff, 0 0 60px #FF3CAC, 0 0 12px #4EFFF7",
        zIndex: 20,
      }}
      transition={{ type: "spring", stiffness: 110, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span
        style={{
          rotateX,
          rotateY,
          display: 'inline-block',
          filter: 'drop-shadow(0 2px 26px #fff4)'
        }}
      >
        {char}
      </motion.span>
      {/* 流体光斑装饰 */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '130%',
          height: '120%',
          background: 'radial-gradient(circle at 60% 30%, #fff6 0%, #fff0 80%)',
          opacity: 0.22,
          filter: 'blur(22px)',
          zIndex: 2,
        }}
      />
    </motion.div>
  )
}
