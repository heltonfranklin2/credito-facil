import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Smartphone, Mail, MessageCircle, Home, Download } from 'lucide-react'

function LiberacaoEmprestimo({ emprestimo, cliente, onNovoEmprestimo }) {
  const [loading, setLoading] = useState(true)
  const [liberado, setLiberado] = useState(false)

  useEffect(() => {
    const liberarEmprestimo = async () => {
      try {
        setLoading(true)
        
        // Simular tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const response = await fetch(`/api/emprestimos/${emprestimo.id}/liberar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          setLiberado(true)
        }
      } catch (error) {
        console.error('Erro ao liberar empréstimo:', error)
      } finally {
        setLoading(false)
      }
    }

    if (emprestimo && emprestimo.status === 'aprovado') {
      liberarEmprestimo()
    } else {
      setLoading(false)
      setLiberado(true)
    }
  }, [emprestimo])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processando liberação...</h3>
            <p className="text-gray-600 mb-4">
              Estamos preparando a transferência do seu dinheiro
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Contrato assinado</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Preparando transferência PIX...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de Sucesso */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Empréstimo Aprovado!</h1>
          <p className="text-xl text-gray-600">Seu dinheiro será transferido via Pix em até 2 horas</p>
        </div>

        {/* Informações da Liberação */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Valor Liberado */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle className="mr-2 h-5 w-5" />
                Valor Liberado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">
                  R$ {emprestimo.valor_aprovado?.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <p className="text-green-700">Será transferido via PIX</p>
              </div>
            </CardContent>
          </Card>

          {/* Próximo Vencimento */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Clock className="mr-2 h-5 w-5" />
                Primeira Parcela
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  R$ {emprestimo.valor_parcela?.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <p className="text-blue-700">
                  Vence em {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Empréstimo */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle>Resumo do seu Empréstimo</CardTitle>
            <CardDescription>
              Todas as informações do seu contrato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Valor do empréstimo:</span>
                  <span className="font-semibold">R$ {emprestimo.valor_aprovado?.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Número de parcelas:</span>
                  <span className="font-semibold">{emprestimo.numero_parcelas}x</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Valor da parcela:</span>
                  <span className="font-semibold">R$ {emprestimo.valor_parcela?.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Taxa de juros:</span>
                  <span className="font-semibold">{emprestimo.taxa_juros}% ao mês</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Data de liberação:</span>
                  <span className="font-semibold">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">Liberado</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>
              O que você precisa saber agora
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Aguarde a transferência</p>
                    <p className="text-sm text-gray-600">O dinheiro será enviado via PIX em até 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Anote as datas de vencimento</p>
                    <p className="text-sm text-gray-600">Primeira parcela vence em 30 dias</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Configure lembretes</p>
                    <p className="text-sm text-gray-600">Evite atrasos configurando alertas no seu celular</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Guarde o contrato</p>
                    <p className="text-sm text-gray-600">Baixe e salve uma cópia do seu contrato</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle>Notificações Enviadas</CardTitle>
            <CardDescription>
              Você receberá confirmações pelos canais abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">E-mail</p>
                <p className="text-sm text-gray-600">{cliente.email}</p>
                <p className="text-xs text-green-600 mt-1">✓ Enviado</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-600">{cliente.telefone}</p>
                <p className="text-xs text-green-600 mt-1">✓ Enviado</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">SMS</p>
                <p className="text-sm text-gray-600">{cliente.telefone}</p>
                <p className="text-xs text-green-600 mt-1">✓ Enviado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="grid md:grid-cols-3 gap-6">
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Download className="h-5 w-5" />
            <span>Baixar Contrato</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Suporte WhatsApp</span>
          </Button>
          <Button
            onClick={onNovoEmprestimo}
            className="h-16 flex flex-col items-center justify-center space-y-1 bg-blue-600 hover:bg-blue-700"
          >
            <Home className="h-5 w-5" />
            <span>Voltar ao Início</span>
          </Button>
        </div>

        {/* Mensagem de Agradecimento */}
        <div className="text-center mt-12 p-8 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Obrigado por escolher o Crédito Fácil!</h3>
          <p className="text-gray-600 mb-4">
            Estamos felizes em poder ajudar você a realizar seus objetivos. 
            Lembre-se de que estamos sempre disponíveis para esclarecer dúvidas e oferecer suporte.
          </p>
          <p className="text-sm text-gray-500">
            Em caso de dúvidas, entre em contato conosco pelo WhatsApp ou e-mail.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LiberacaoEmprestimo

