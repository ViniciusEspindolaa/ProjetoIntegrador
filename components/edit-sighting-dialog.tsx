'use client'

import { useState, useEffect } from 'react'
import { Sighting } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin } from 'lucide-react'

interface EditSightingDialogProps {
  sighting: Sighting | null
  open: boolean
  onClose: () => void
  onSave: (sighting: Sighting) => void
}

export function EditSightingDialog({ sighting, open, onClose, onSave }: EditSightingDialogProps) {
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [reporterPhone, setReporterPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (sighting) {
      setLocation(sighting.location.address)
      setCity(sighting.location.city)
      setDate(new Date(sighting.date).toISOString().split('T')[0])
      setTime(sighting.time)
      setDescription(sighting.description)
      setReporterName(sighting.reporterName)
      setReporterPhone(sighting.reporterPhone)
    }
  }, [sighting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sighting) return

    setIsSubmitting(true)

    const updatedSighting: Sighting = {
      ...sighting,
      location: {
        ...sighting.location,
        address: location,
        city,
      },
      date: new Date(date),
      time,
      description,
      reporterName,
      reporterPhone,
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSave(updatedSighting)
    setIsSubmitting(false)
    onClose()
  }

  if (!sighting) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Avistamento</DialogTitle>
          <DialogDescription>Atualize as informações do avistamento</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-location" className="text-sm">Local *</Label>
            <Input
              id="edit-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="text-sm"
              placeholder="Endereço ou referência"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-city" className="text-sm">Cidade *</Label>
            <Input
              id="edit-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-date" className="text-sm">Data *</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-time" className="text-sm">Hora *</Label>
              <Input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm">Descrição *</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="text-sm"
              placeholder="Descreva o que você viu..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm">Seu nome *</Label>
            <Input
              id="edit-name"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-sm">Seu telefone *</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              required
              className="text-sm"
              placeholder="(00) 00000-0000"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="text-sm">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-sm">
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
