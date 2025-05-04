"use client"

import { useState, useEffect } from "react"
import { Volume2, VolumeX, Volume1, Volume } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface SoundControlsProps {
  onVolumeChange: (volume: number) => void
  onMuteToggle: (muted: boolean) => void
  initialVolume?: number
  initialMuted?: boolean
}

export default function SoundControls({
  onVolumeChange,
  onMuteToggle,
  initialVolume = 0.7,
  initialMuted = false,
}: SoundControlsProps) {
  const [volume, setVolume] = useState(initialVolume)
  const [muted, setMuted] = useState(initialMuted)
  const [isOpen, setIsOpen] = useState(false)

  // Salvar preferências no localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem("breadQuizVolume")
    const savedMuted = localStorage.getItem("breadQuizMuted")

    if (savedVolume) setVolume(Number.parseFloat(savedVolume))
    if (savedMuted) setMuted(savedMuted === "true")
  }, [])

  // Atualizar localStorage quando as preferências mudarem
  useEffect(() => {
    localStorage.setItem("breadQuizVolume", volume.toString())
    localStorage.setItem("breadQuizMuted", muted.toString())
  }, [volume, muted])

  // Notificar componente pai sobre mudanças
  useEffect(() => {
    onVolumeChange(muted ? 0 : volume)
    onMuteToggle(muted)
  }, [volume, muted, onVolumeChange, onMuteToggle])

  const handleVolumeChange = (newValue: number[]) => {
    const newVolume = newValue[0]
    setVolume(newVolume)
    if (newVolume > 0 && muted) {
      setMuted(false)
    }
  }

  const toggleMute = () => {
    setMuted(!muted)
  }

  const getVolumeIcon = () => {
    if (muted) return <VolumeX className="h-5 w-5" />
    if (volume === 0) return <VolumeX className="h-5 w-5" />
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />
    if (volume >= 0.5) return <Volume2 className="h-5 w-5" />
    return <Volume className="h-5 w-5" />
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 rounded-full w-10 h-10 p-0 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={muted ? "Ativar som" : "Controle de volume"}
      >
        {getVolumeIcon()}
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-amber-200 w-64 z-50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-amber-800">Volume</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="h-8 w-8 p-0 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
              aria-label={muted ? "Ativar som" : "Silenciar"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          <Slider
            defaultValue={[volume]}
            max={1}
            step={0.01}
            value={[volume]}
            onValueChange={handleVolumeChange}
            disabled={muted}
            className={muted ? "opacity-50" : ""}
            aria-label="Controle de volume"
          />

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0%</span>
            <span>{Math.round(volume * 100)}%</span>
            <span>100%</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
