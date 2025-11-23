'use client'

import { useState } from 'react'
import { Pet } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertTriangle } from 'lucide-react'

interface ReportDialogProps {
  pet: Pet | null
  open: boolean
  onClose: () => void
}

export function ReportDialog({ pet, open, onClose }: ReportDialogProps) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert('Denúncia enviada com sucesso. Nossa equipe irá analisar.')
    setReason('')
    setDetails('')
    setIsSubmitting(false)
    onClose()
  }

  if (!pet) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Denunciar Publicação
          </DialogTitle>
          <DialogDescription>
            Informe o motivo da denúncia. Nossa equipe analisará o caso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm">Motivo da denúncia *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger id="reason" className="text-sm">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fake">Anúncio falso ou enganoso</SelectItem>
                <SelectItem value="inappropriate">Conteúdo inapropriado</SelectItem>
                <SelectItem value="spam">Spam ou propaganda</SelectItem>
                <SelectItem value="abuse">Maus tratos ao animal</SelectItem>
                <SelectItem value="duplicate">Publicação duplicada</SelectItem>
                <SelectItem value="scam">Tentativa de golpe</SelectItem>
                <SelectItem value="other">Outro motivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm">
              Detalhes adicionais (opcional)
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Forneça mais informações sobre a denúncia..."
              rows={4}
              className="text-sm resize-none"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              Denúncias falsas ou mal-intencionadas podem resultar em suspensão da conta.
              Por favor, denuncie apenas conteúdo que viole nossas diretrizes.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="text-sm">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!reason || isSubmitting}
              variant="destructive"
              className="text-sm"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
