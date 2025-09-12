import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, CheckCircle, Clock, XCircle, DollarSign, Calendar } from 'lucide-react'

function HistoricoEmprestimos({ clienteId, onVoltar }) {
  const [emprestimos, setEmprestimos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const response = await fetch(`/api/clientes/${clienteId}/emprestimos`)
        if (response.ok) {
          const data = await response.json()
          setEmprestimos(data)
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      } finally {
        setLoading(false)
      }
    }

    if (clienteId) {
      carregarHistorico()
    }
  }, [clienteId])

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pendente': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendente' },
      'aprovado': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Aprovado' },
      'liberado': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Liberado' },
      'reprovado': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Reprovado' }
    }

    const config = statusConfig[status] || statusConfig['pendente']
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando histórico...</h3>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <History className="mr-3 h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Histórico de Empréstimos</h1>
              <p className="text-gray-600">Acompanhe todos os seus empréstimos</p>
            </div>
          </div>
          <Button variant="outline" onClick={onVoltar}>
            Voltar
          </Button>
        </div>

        {emprestimos.length === 0 ? (
          <Card className="shadow-lg border-0 text-center py-12">
            <CardContent>
              <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum empréstimo encontrado</h3>
              <p className="text-gray-600">Você ainda não possui empréstimos em nosso sistema.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {emprestimos.map((emprestimo) => (
              <Card key={emprestimo.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                      Empréstimo #{emprestimo.id}
                    </CardTitle>
                    {getStatusBadge(emprestimo.status)}
                  </div>
                  <CardDescription>
                    Solicitado em {new Date(emprestimo.data_solicitacao).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 mb-1">Valor Solicitado</p>
                      <p className="text-2xl font-bold text-blue-600">
                        R$ {emprestimo.valor_solicitado?.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    
                    {emprestimo.valor_aprovado && (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 mb-1">Valor Aprovado</p>
                        <p className="text-2xl font-bold text-green-600">
                          R$ {emprestimo.valor_aprovado?.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                    
                    {emprestimo.numero_parcelas && (
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700 mb-1">Parcelas</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {emprestimo.numero_parcelas}x
                        </p>
                      </div>
                    )}
                    
                    {emprestimo.taxa_juros && (
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-700 mb-1">Taxa de Juros</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {emprestimo.taxa_juros}%
                        </p>
                      </div>
                    )}
                  </div>

                  {emprestimo.valor_parcela && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                          <span className="font-medium text-gray-900">Valor da Parcela:</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          R$ {emprestimo.valor_parcela?.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Data de Solicitação:</p>
                      <p className="font-medium">
                        {new Date(emprestimo.data_solicitacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    {emprestimo.data_aprovacao && (
                      <div>
                        <p className="text-gray-600">Data de Aprovação:</p>
                        <p className="font-medium">
                          {new Date(emprestimo.data_aprovacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                    
                    {emprestimo.data_liberacao && (
                      <div>
                        <p className="text-gray-600">Data de Liberação:</p>
                        <p className="font-medium">
                          {new Date(emprestimo.data_liberacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {emprestimo.tem_garantia ? (
                        <Badge className="bg-green-100 text-green-800">Com Garantia</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Sem Garantia</Badge>
                      )}
                    </div>
                    
                    {emprestimo.status === 'liberado' && (
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoricoEmprestimos

