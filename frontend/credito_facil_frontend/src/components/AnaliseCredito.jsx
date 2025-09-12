import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock, Shield, TrendingUp, AlertCircle } from 'lucide-react'

function AnaliseCredito({ cliente, onContinuar, onVoltar }) {
  const [analise, setAnalise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const realizarAnalise = async () => {
      try {
        setLoading(true)
        
        // Simular tempo de análise
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        const response = await fetch(`/api/clientes/${cliente.id}/analise-credito`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const result = await response.json()
          setAnalise(result)
        } else {
          const error = await response.json()
          setError(error.erro)
        }
      } catch (error) {
        setError('Erro ao realizar análise de crédito')
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    if (cliente) {
      realizarAnalise()
    }
  }, [cliente])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analisando seu crédito...</h3>
            <p className="text-gray-600 mb-4">
              Estamos verificando seus dados nos órgãos de proteção ao crédito
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Verificando CPF...</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Calculando limite de crédito...</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Definindo taxa de juros...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro na Análise</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={onVoltar} variant="outline" className="w-full">
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analise?.aprovado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Crédito Não Aprovado</h3>
            <p className="text-gray-600 mb-6">
              No momento não conseguimos liberar crédito para você.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Possíveis motivos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>CPF com restrições</li>
                    <li>Renda insuficiente</li>
                    <li>Histórico de crédito</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Button onClick={onVoltar} variant="outline" className="w-full">
                Voltar ao Início
              </Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parabéns!</h1>
          <p className="text-xl text-gray-600">Seu crédito foi pré-aprovado</p>
        </div>

        {/* Informações da Análise */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Limite de Crédito */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <TrendingUp className="mr-2 h-5 w-5" />
                Limite Aprovado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">
                  R$ {analise.limite_credito?.toLocaleString('pt-BR') || '0'}
                </p>
                <p className="text-green-700">Valor máximo disponível</p>
              </div>
            </CardContent>
          </Card>

          {/* Taxa de Juros */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Shield className="mr-2 h-5 w-5" />
                Taxa de Juros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {analise.taxa_juros}% a.m.
                </p>
                <p className="text-blue-700">
                  {analise.tem_garantia ? 'Com garantia' : 'Sem garantia'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes da Análise */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle>Detalhes da Análise</CardTitle>
            <CardDescription>
              Resumo da avaliação do seu perfil de crédito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">CPF Aprovado</p>
                    <p className="text-sm text-gray-600">Sem restrições nos órgãos de proteção</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Documentos Válidos</p>
                    <p className="text-sm text-gray-600">Todos os documentos foram verificados</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {analise.tem_garantia ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {analise.tem_garantia ? 'Com Garantia' : 'Sem Garantia'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {analise.tem_garantia 
                        ? `Valor total: R$ ${analise.valor_garantias?.toLocaleString('pt-BR') || '0'}`
                        : 'Empréstimo baseado apenas na renda'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Perfil Aprovado</p>
                    <p className="text-sm text-gray-600">Você atende aos critérios de crédito</p>
                  </div>
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
              O que acontece agora?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Escolha o valor e parcelas</p>
                  <p className="text-sm text-gray-600">Simule diferentes opções de pagamento</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Assine o contrato digital</p>
                  <p className="text-sm text-gray-600">Processo 100% online e seguro</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Receba o dinheiro</p>
                  <p className="text-sm text-gray-600">Via Pix em até 2 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onVoltar}
            className="px-8 py-3"
          >
            Voltar
          </Button>
          <Button
            onClick={() => onContinuar(analise)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
          >
            Simular Empréstimo
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AnaliseCredito

