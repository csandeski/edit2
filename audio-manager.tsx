"use client"

import { createContext, useContext, useRef, useEffect, useState, type ReactNode } from "react"

// Definir tipos para os sons disponíveis
export type SoundType = "success" | "error" | "popup" | "levelUp" | "completion" | "click" | "background"

// Interface para o contexto de áudio
interface AudioContextType {
  playSound: (sound: SoundType) => void
  stopSound: (sound: SoundType) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  volume: number
  muted: boolean
}

// Criar o contexto
const AudioContext = createContext<AudioContextType | undefined>(undefined)

// Mapeamento de sons para URLs
const soundUrls: Record<SoundType, string> = {
  success: "https://infosaber.online/Success.wav",
  error: "https://archive.org/embed/wrong-error-effect",
  popup: "https://archive.org/embed/pop-up",
  levelUp: "https://infosaber.online/Complete%20Success.wav",
  completion: "https://infosaber.online/Success.wav",
  click: "https://infosaber.online/Simple%20Click.mp3",
    background: "https://infosaber.online/Happy%20Jazz%20Bossa%20Nova%20Music%20Happy%20Cafe%20Music%20For%20Work%20Study.mp3", // URL fictícia, substitua pela real
}

// Provedor de áudio
export function AudioProvider({ children }: { children: ReactNode }) {
  // Refs para elementos de áudio
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    success: null,
    error: null,
    popup: null,
    levelUp: null,
    completion: null,
    click: null,
    background: null,
  })

  // Estado para volume e mudo
  const [volume, setVolume] = useState(0.7)
  const [muted, setMuted] = useState(false)

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem("breadQuizVolume")
    const savedMuted = localStorage.getItem("breadQuizMuted")

    if (savedVolume) setVolume(Number.parseFloat(savedVolume))
    if (savedMuted) setMuted(savedMuted === "true")
  }, [])

  // Criar elementos de áudio
  useEffect(() => {
    // Criar elementos de áudio para cada som
    Object.entries(soundUrls).forEach(([key, url]) => {
      const soundType = key as SoundType
      const audio = new Audio(url)
      audio.preload = "auto"

      // Configurar loop para música de fundo
      if (soundType === "background") {
        audio.loop = true
      }

      audioRefs.current[soundType] = audio
    })

    // Limpar ao desmontar
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
    }
  }, [])

  // Atualizar volume e mudo para todos os sons
  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.volume = volume
        audio.muted = muted
      }
    })
  }, [volume, muted])

  // Função para tocar um som
  const playSound = (sound: SoundType) => {
    const audio = audioRefs.current[sound]
    if (audio) {
      // Para sons curtos, reinicie antes de tocar
      if (sound !== "background") {
        audio.currentTime = 0
      }
      audio.play().catch((err) => console.error(`Erro ao tocar som ${sound}:`, err))
    }
  }

  // Função para parar um som
  const stopSound = (sound: SoundType) => {
    const audio = audioRefs.current[sound]
    if (audio) {
      audio.pause()
      if (sound !== "background") {
        audio.currentTime = 0
      }
    }
  }

  // Valor do contexto
  const contextValue: AudioContextType = {
    playSound,
    stopSound,
    setVolume,
    setMuted,
    volume,
    muted,
  }

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>
}

// Hook para usar o contexto de áudio
export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio deve ser usado dentro de um AudioProvider")
  }
  return context
}
