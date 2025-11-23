'use client'

import { useState } from 'react'
import { Pet } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, Map, Eye, Share2, Flag, MapPin } from 'lucide-react'
import Image from 'next/image'
import { ContactDialog } from './contact-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { InteractiveMap as InteractiveMapClient } from './interactive-map.client'
import { DirectionsDialog } from '@/components/directions-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PetCardProps {
  pet: Pet
  onViewSightings: (pet: Pet) => void
  onReportSighting: (pet: Pet) => void
  onViewMap: (pet: Pet) => void
  isOwner?: boolean
  onEdit?: (pet: Pet) => void
  onComplete?: (pet: Pet) => void
  onShare?: (pet: Pet) => void
  onReport?: (pet: Pet) => void
  compactMode?: boolean
}

export function PetCard({ 
  pet, 
  onViewSightings, 
  onReportSighting, 
  onViewMap,
  isOwner = false,
  onEdit,
  onComplete,
  onShare,
  onReport,
  compactMode = false
}: PetCardProps) {
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [directionsOpen, setDirectionsOpen] = useState(false)
  
  const statusConfig = {
    lost: { label: 'Perdido', color: 'bg-red-500 text-white' },
    found: { label: 'Encontrado', color: 'bg-blue-500 text-white' },
    adoption: { label: 'Adoção', color: 'bg-green-500 text-white' },
  }

  const getDisplayName = () => {
    if (pet.status === 'found') {
      const species = pet.type === 'dog' ? 'Cachorro' : pet.type === 'cat' ? 'Gato' : 'Pet'
      return `${species} encontrado`
    }
    return pet.name
  }

  const displayName = getDisplayName()

  return (
    <>
      <Card onClick={() => setDetailOpen(true)} className="cursor-pointer w-full overflow-hidden hover:shadow-lg transition-shadow active:scale-[0.98] pt-0">
        <div className={compactMode ? "relative h-40" : "relative aspect-[4/3] sm:aspect-square"}>
          <Image
            src={pet.photoUrl || "/placeholder.svg"}
            alt={displayName || 'Pet'}
            fill
            className="object-cover"
            priority={false}
            loading="lazy"
          />
          <div className="absolute top-1.5 left-1.5 flex gap-1 flex-wrap">
            <Badge className={`${statusConfig[pet.status].color} text-[10px] px-1.5 py-0.5 ${compactMode ? 'sm:text-xs sm:px-2' : 'text-xs px-2'}`}>
              {statusConfig[pet.status].label}
            </Badge>
            {pet.completed && (
              <Badge variant="secondary" className={`bg-gray-700 text-white text-[10px] px-1.5 py-0.5 ${compactMode ? 'sm:text-xs sm:px-2' : 'text-xs px-2'}`}>
                Finalizado
              </Badge>
            )}
          </div>
          {pet.reward && (
            <div className="absolute bottom-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-tl-lg shadow-sm z-10">
              R$ {pet.reward}
            </div>
          )}
            {pet.sightings.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onViewSightings(pet) }}
              className={`absolute top-1.5 right-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium flex items-center gap-1 active:scale-95 ${compactMode ? 'px-2 py-0.5 text-[9px]' : 'px-2 py-1 text-xs'}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
            >
              <Eye className={compactMode ? "w-3 h-3 text-gray-700" : "w-3 h-3 text-gray-700"} />
              <span className={compactMode ? 'ml-0.5 text-gray-800' : 'ml-1 text-gray-800'}>{pet.sightings.length}</span>
            </button>
          )}
        </div>
        
        <CardContent className={compactMode ? "pt-1 pb-1 px-2 space-y-1 sm:pt-1 sm:pb-1 sm:px-3" : "pt-1 pb-1 px-3 sm:pt-1 sm:pb-2 sm:px-4 space-y-2 sm:space-y-3"}>
          <div className="flex flex-col gap-1">
            <div>
              {displayName && (
                <h3 className={compactMode ? "font-bold text-sm leading-tight" : "font-bold text-sm sm:text-lg leading-tight"}>
                  {displayName}
                </h3>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-[10px] font-normal h-5 px-1.5 text-muted-foreground border-gray-300">
                {pet.breed}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-normal h-5 px-1.5 text-muted-foreground border-gray-300">
                {pet.size === 'small' ? 'Pequeno' : pet.size === 'medium' ? 'Médio' : 'Grande'}
              </Badge>
            </div>
          </div>

          <div className={compactMode ? "flex items-start gap-1 text-[10px] sm:text-[11px] sm:gap-1" : "flex items-start gap-1.5 text-xs sm:text-sm"}>
            <MapPin className={compactMode ? "w-3 h-3 mt-0.5 text-muted-foreground shrink-0" : "w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0"} />
            <div className="leading-snug w-full">
              <p className="font-medium line-clamp-1">
                {pet.location.address}
              </p>
              <p className="text-muted-foreground line-clamp-1">
                {pet.location.neighborhood && `${pet.location.neighborhood}, `}
                {pet.location.city}
              </p>
              <p className={compactMode ? "text-muted-foreground text-[9px] mt-0.5" : "text-muted-foreground text-[11px] sm:text-xs mt-0.5"}>
                {pet.status === 'lost' ? 'Visto' : pet.status === 'found' ? 'Encontrado' : 'Local'}: {new Date(pet.lastSeenDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </p>
            </div>
          </div>

          {!compactMode && (
            <>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-snug">{pet.description}</p>

              {pet.completed && pet.completionReason && (
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Finalizado:</span> {pet.completionReason}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{pet.contactName}</span>
              </div>
            </>
          )}

          {isOwner ? (
            <div className={compactMode ? "grid grid-cols-2 gap-1 pt-1" : "grid grid-cols-2 gap-1.5 pt-1.5"}>
              <Button
                size="sm"
                variant="outline"
                className={compactMode ? "text-[10px] h-6 px-1" : "text-xs h-8 px-2 sm:h-10"}
                onClick={(e) => { e.stopPropagation(); onEdit?.(pet) }}
                disabled={pet.completed}
              >
                {compactMode ? <span className="sr-only">Editar</span> : 'Editar'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={compactMode ? "text-[10px] h-6 px-1" : "text-xs h-8 px-2 sm:h-10"}
                onClick={(e) => { e.stopPropagation(); onComplete?.(pet) }}
                disabled={pet.completed}
              >
                {!compactMode && 'Finalizar'}
              </Button>
            </div>
          ) : (
            <>
              <div className={compactMode ? `grid ${pet.status === 'lost' ? 'grid-cols-3' : 'grid-cols-2'} gap-1 pt-1` : `grid ${pet.status === 'lost' ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 pt-1.5`}>
                <Button
                  size="sm"
                  variant="outline"
                  className={`${compactMode ? 'text-[10px] h-6 px-1 w-full' : 'text-xs h-8 px-2 sm:h-10 w-full'}`}
                  onClick={(e) => { e.stopPropagation(); onViewMap(pet) }}
                >
                  <Map className="w-3 h-3" />
                  {!compactMode && <span className="ml-1">Mapa</span>}
                </Button>
                <Button
                  size="sm"
                  className={`${compactMode ? 'text-[10px] bg-green-600 hover:bg-green-700 h-6 px-1 w-full' : 'text-xs bg-green-600 hover:bg-green-700 h-8 px-2 sm:h-10 w-full'}`}
                  onClick={(e) => { e.stopPropagation(); setContactDialogOpen(true) }}
                >
                  <Phone className="w-3 h-3" />
                  {!compactMode && <span className="ml-1">Contato</span>}
                </Button>
                {pet.status === 'lost' && (
                <Button
                  size="sm"
                  variant="secondary"
                  className={`${compactMode ? 'text-[10px] h-6 px-1 w-full' : 'text-xs h-8 px-2 sm:h-10 w-full'}`}
                  onClick={(e) => { e.stopPropagation(); onReportSighting(pet) }}
                >
                  <Eye className="w-3 h-3" />
                  {!compactMode && <span className="ml-1">Avistar</span>}
                </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className={compactMode ? "text-[10px] h-6 px-1" : "text-xs h-8 px-2"}
                  onClick={(e) => { e.stopPropagation(); onShare?.(pet) }}
                >
                  <Share2 className="w-3 h-3" />
                  {!compactMode && <span className="ml-1">Compartilhar</span>}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={compactMode ? "text-[10px] h-6 px-1 text-muted-foreground hover:text-red-600" : "text-xs h-8 px-2 text-muted-foreground hover:text-red-600"}
                  onClick={(e) => { e.stopPropagation(); onReport?.(pet) }}
                >
                  <Flag className="w-3 h-3" />
                  {!compactMode && <span className="ml-1">Denunciar</span>}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={(open) => setDetailOpen(open)}>
        <DialogContent className="max-w-3xl w-full max-h-[80vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>{displayName || `${pet.type}`}</DialogTitle>
            <DialogDescription>
              {pet.breed} • {pet.size === 'small' ? 'Pequeno' : pet.size === 'medium' ? 'Médio' : 'Grande'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="w-full h-48 sm:h-64 relative rounded-lg overflow-hidden bg-gray-100">
              <Image src={pet.photoUrl || '/placeholder.svg'} alt={displayName || 'Pet'} fill className="object-cover" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`${statusConfig[pet.status].color} inline-flex items-center rounded-full text-[12px] px-2 py-0.5`}>
                  {statusConfig[pet.status].label}
                </span>
                {pet.reward && <span className="inline-flex items-center rounded-full bg-amber-500 text-white text-[12px] px-2 py-0.5">R$ {pet.reward}</span>}
                {pet.completed && <span className="inline-flex items-center rounded-full bg-gray-700 text-white text-[12px] px-2 py-0.5">Finalizado</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <h4 className="font-semibold">Informações</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li><strong>Tipo:</strong> {pet.type === 'dog' ? 'Cachorro' : pet.type === 'cat' ? 'Gato' : 'Outro'}</li>
                    {pet.age && <li><strong>Idade:</strong> {pet.age}</li>}
                    <li><strong>Cidade:</strong> {pet.location.city}</li>
                    {pet.location.neighborhood && <li><strong>Bairro:</strong> {pet.location.neighborhood}</li>}
                    <li><strong>Endereço:</strong> {pet.location.address}</li>
                    
                    {pet.status === 'adoption' ? (
                      <li><strong>Criado em:</strong> {new Date(pet.createdAt).toLocaleString('pt-BR')}</li>
                    ) : (
                      <li><strong>{pet.status === 'lost' ? 'Perdido em' : 'Encontrado em'}:</strong> {new Date(pet.lastSeenDate).toLocaleDateString('pt-BR')}</li>
                    )}

                    {pet.sightings && pet.sightings.length > 0 && (
                      <li><strong>Última vista:</strong> {
                        new Date(Math.max(...pet.sightings.map(s => new Date(s.date).getTime()))).toLocaleDateString('pt-BR')
                      }</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold">Contato</h4>
                  <p className="text-sm text-muted-foreground mt-1">{pet.contactName} — {pet.contactPhone}</p>

                  {pet.status === 'lost' && (
                    <>
                      <div className="flex items-center justify-between mt-3">
                        <h4 className="font-semibold">Avistamentos</h4>
                        {pet.sightings.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2 text-muted-foreground hover:text-primary"
                            onClick={() => {
                              setDetailOpen(false)
                              onViewSightings(pet)
                            }}
                          >
                            Ver detalhes
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 space-y-2 max-h-40 overflow-auto">
                        {pet.sightings.length === 0 && <p>Nenhum avistamento registrado.</p>}
                        {pet.sightings.map((s) => (
                          <div 
                            key={s.id} 
                            className="border rounded px-2 py-1 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => {
                              setDetailOpen(false)
                              onViewSightings(pet)
                            }}
                          >
                            <div className="text-xs text-muted-foreground"><strong>{new Date(s.date).toLocaleDateString('pt-BR')}</strong> {s.time}</div>
                            <div className="text-xs text-muted-foreground">Reportado {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true, locale: ptBR })}</div>
                            <div className="text-sm">{s.description}</div>
                            <div className="text-xs text-muted-foreground">{s.reporterName} — {s.reporterPhone}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                {pet.status === 'lost' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { onReportSighting(pet); setDetailOpen(false); }}>
                    Avistar
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setContactDialogOpen(true)}>
                  Contatar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDirectionsOpen(true)}>
                  Como chegar
                </Button>
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard?.writeText(window.location.href); }}>
                  Copiar link
                </Button>
              </div>
            </div>

            <div className="w-full h-60 sm:h-96">
              <InteractiveMapClient pets={[pet]} selectedPetId={pet.id} onPetSelect={() => {}} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ContactDialog
        pet={pet}
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />

      <DirectionsDialog 
        open={directionsOpen} 
        onClose={() => setDirectionsOpen(false)} 
        lat={pet.location.lat} 
        lng={pet.location.lng} 
        address={pet.location.address}
      />
    </>
  )
}
