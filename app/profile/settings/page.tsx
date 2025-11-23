'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Bell, MapPin, Mail } from 'lucide-react'

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50">

      <main className="container mx-auto px-4 py-6 space-y-4 max-w-2xl">
        <div className="mb-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/profile')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Configurações</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>Gerencie suas preferências de notificação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-sightings">Avistamentos</Label>
                <p className="text-sm text-muted-foreground">Receber notificações de avistamentos dos seus pets</p>
              </div>
              <Switch id="notify-sightings" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-nearby">Pets próximos</Label>
                <p className="text-sm text-muted-foreground">Alertas de pets perdidos/encontrados perto de você</p>
              </div>
              <Switch id="notify-nearby" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-messages">Mensagens</Label>
                <p className="text-sm text-muted-foreground">Notificações de mensagens e contatos</p>
              </div>
              <Switch id="notify-messages" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localização
            </CardTitle>
            <CardDescription>Configurações de localização e privacidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="share-location">Compartilhar localização</Label>
                <p className="text-sm text-muted-foreground">Permitir que outros vejam sua região aproximada</p>
              </div>
              <Switch id="share-location" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-location">Detecção automática</Label>
                <p className="text-sm text-muted-foreground">Usar sua localização para sugestões personalizadas</p>
              </div>
              <Switch id="auto-location" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              E-mail
            </CardTitle>
            <CardDescription>Preferências de comunicação por e-mail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-updates">Atualizações</Label>
                <p className="text-sm text-muted-foreground">Receber resumos semanais por e-mail</p>
              </div>
              <Switch id="email-updates" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-tips">Dicas e novidades</Label>
                <p className="text-sm text-muted-foreground">Receber dicas sobre como encontrar pets</p>
              </div>
              <Switch id="email-tips" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacidade e Dados</CardTitle>
            <CardDescription>Gerencie seus dados e privacidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Baixar meus dados
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Excluir conta
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
