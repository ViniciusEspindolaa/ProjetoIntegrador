'use client'

import { Pet } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone } from 'lucide-react'

interface ContactDialogProps {
  pet: Pet | null
  open: boolean
  onClose: () => void
}

export function ContactDialog({ pet, open, onClose }: ContactDialogProps) {
  if (!pet) return null

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Vi seu anúncio sobre ${pet.name || 'o pet'} no PetFinder.`
    )
    const phone = pet.contactPhone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    onClose()
  }

  const handleCall = () => {
    window.location.href = `tel:${pet.contactPhone}`
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Entrar em Contato</DialogTitle>
          <DialogDescription>
            Escolha como deseja entrar em contato com {pet.contactName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Button
            onClick={handleWhatsApp}
            className="w-full h-12 bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Falar por WhatsApp
          </Button>
          
          <Button
            onClick={handleCall}
            variant="outline"
            className="w-full h-12"
          >
            <Phone className="w-5 h-5 mr-2" />
            Ligar para {pet.contactPhone}
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Contato: {pet.contactName}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
