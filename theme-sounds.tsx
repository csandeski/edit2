"use client"

import { useState } from "react"
import { Check, Music, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAudio } from "./audio-manager"
import { motion } from "framer-motion"

// Temas sonoros disponíveis
const soundThemes = [
  {
    id: "default",
    name: "Padaria Tradicional",
    description: "Sons clássicos de uma padaria tradicional",
    preview: "success", // Som para preview
  },
  {
    id: "modern",
    name: "Padaria Moderna",
    description: "Sons contemporâneos para uma experiência moderna",
    preview: "levelUp",
  },
  {
    id: "fun",
    name: "Padaria Divertida",
    description: "Sons alegres e divertidos para uma experiência mais leve",
    preview: "completion",
  },
]

export default function ThemeSounds() {
  const [selectedTheme, setSelectedTheme] = useState("default")
  const { playSound } = useAudio()

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId)

    // Encontrar o tema selecionado
    const theme = soundThemes.find((theme) => theme.id === themeId)
    if (theme) {
      // Tocar o som de preview
      playSound(theme.preview)

      // Salvar a preferência
      localStorage.setItem("breadQuizSoundTheme", themeId)
    }
  }

  return (
    <Card className="border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-amber-600" />
          Temas Sonoros
        </CardTitle>
        <CardDescription>Personalize sua experiência com diferentes temas sonoros</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <RadioGroup value={selectedTheme} onValueChange={handleThemeChange} className="space-y-3">
          {soundThemes.map((theme) => (
            <div
              key={theme.id}
              className={`flex items-center rounded-lg border p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${
                selectedTheme === theme.id ? "bg-amber-50 border-amber-300" : "bg-white border-gray-200"
              }`}
            >
              <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} className="sr-only" />
              <Label htmlFor={`theme-${theme.id}`} className="flex items-center w-full cursor-pointer">
                <div className="flex-1">
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm text-gray-500">{theme.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={(e) => {
                      e.preventDefault()
                      playSound(theme.preview)
                    }}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  {selectedTheme === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-4 text-sm text-gray-500">
          Cada tema altera os sons de acertos, erros e outros eventos do jogo.
        </div>
      </CardContent>
    </Card>
  )
}
