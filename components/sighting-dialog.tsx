'use client'

import { useState, useEffect } from 'react'
import { Pet, Sighting } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Calendar, Clock } from 'lucide-react'

interface SightingDialogProps {
  pet: Pet | null
  open: boolean
  onClose: () => void
  onSubmit: (sighting: Omit<Sighting, 'id' | 'petId' | 'createdAt'>) => void
}

export function SightingDialog({ pet, open, onClose, onSubmit }: SightingDialogProps) {
  const { user } = useAuth()
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [reporterPhone, setReporterPhone] = useState('')

  useEffect(() => {
    if (open && user) {
      setReporterName(user.name || '')
      setReporterPhone(user.phone || '')
    }
  }, [open, user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      location: {
        lat: -23.5505,
        lng: -46.6333,
        address: location,
        city: 'São Paulo',
      },
      date: new Date(date),
      time,
      description,
      reporterName,
      reporterPhone,
    })
    // Reset form
    setLocation('')
    setDate('')
    setTime('')
    setDescription('')
    setReporterName('')
    setReporterPhone('')
    onClose()
  }

  if (!pet) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reportar Avistamento</DialogTitle>
          <DialogDescription>
            Ajude a encontrar {pet.name || 'este pet'} reportando onde você o viu
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPin className="w-4 h-4 inline mr-1" />
              Local do avistamento
            </Label>
            <Input
              id="location"
              placeholder="Rua, bairro ou ponto de referência"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">
                <Clock className="w-4 h-4 inline mr-1" />
                Hora
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="O que você viu? Como o pet estava?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporterName">Seu nome</Label>
            <Input
              id="reporterName"
              placeholder="Nome completo"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporterPhone">Seu telefone</Label>
            <Input
              id="reporterPhone"
              type="tel"
              placeholder="+55 11 98765-4321"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Enviar Avistamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
