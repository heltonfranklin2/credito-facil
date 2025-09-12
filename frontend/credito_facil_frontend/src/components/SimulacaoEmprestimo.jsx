import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Calculator, DollarSign, Calendar, TrendingUp, ArrowLeft, CheckCircle } from 'lucide-react'

function SimulacaoEmprestimo({ analise, cliente, onVoltar, onContinuar }) {
  const [valorSolicitado, setValorSolicitado] = useState(1000)
  const [numeroParcelas, setNumeroParcelas] = useState(12)
  const [simulacao, setSimulacao] = useState(null)
  const [loading, setLoading] = useState(false)

  const opcoesParcelamento = [
    { value: 6, label: '6 parcelas' },
    { value: 12, label: '12 parcelas' },
    { value: 18, label: '18 parcelas' },
    { value: 24, label: '24 parcelas' },
    { value: 36, label: '36 parcelas' },
    { value: 48, label: '48 parcelas' }
  ]

  useEffect(() => {
    simularEmprestimo()
  }, [valorSolicitado, numeroParcelas])

  const simularEmprestimo = async () => {
    if (!valorSolicitado || !numeroParcelas || !analise) return

    setLoading(true)
    try {
      const response = await fetch('/api/emprestimos/simular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor_solicitado: valorSolicitado,
          numero_parcelas: numeroParcelas,
          taxa_juros: analise.taxa_juros
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSimulacao(result)
      }
    } catch (error) {
      console.error('Erro na simulação:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSolicitarEmprestimo = async () => {
    if (!simulacao) return

    setLoading(true)
    try {
      const response = await fetch('/api/emprestimos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id: cliente.id,
          valor_solicitado: simulacao.valor_solicitado,
          taxa_juros: simulacao.taxa_juros,
          numero_parcelas: simulacao.numero_parcelas,
          valor_parcela: simulacao.valor_parcela,
          tem_garantia: analise.tem_garantia
        })
      })

      if (response.ok) {
        const result = await response.json()
        onContinuar(result.emprestimo)
      } else {
        const error = await response.json()
        alert(`Erro: ${error.erro}`)
      }
    } catch (error) {
      alert('Erro ao solicitar empréstimo. Tente novamente.')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onVoltar}
            className="mr-4 p-2 hover:bg-white/50 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Simulação de Empréstimo</h1>
            <p className="text-gray-600">Escolha o valor e as condições do seu empréstimo</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Painel de Configuração */}
          <div className="space-y-6">
            {/* Valor do Empréstimo */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                  Valor do Empréstimo
                </CardTitle>
                <CardDescription>
                  Escolha o valor que deseja solicitar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>R$ 500</span>
                    <span>R$ {analise.limite_credito?.toLocaleString('pt-BR')}</span>
                  </div>
                  <Slider
                    value={[valorSolicitado]}
                    onValueChange={(value) => setValorSolicitado(value[0])}
                    max={analise.limite_credito}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                  <div className="text-center">
                    <Input
                      type="number"
                      value={valorSolicitado}
                      onChange={(e) => setValorSolicitado(Number(e.target.value))}
                      min={500}
                      max={analise.limite_credito}
                      className="text-center text-2xl font-bold h-16 text-blue-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Número de Parcelas */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Parcelamento
                </CardTitle>
                <CardDescription>
                  Em quantas vezes deseja pagar?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={numeroParcelas.toString()}
                  onValueChange={(value) => setNumeroParcelas(Number(value))}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {opcoesParcelamento.map((opcao) => (
                      <SelectItem key={opcao.value} value={opcao.value.toString()}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Informações do Cliente */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Seu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Limite aprovado:</span>
                    <span className="font-semibold">R$ {analise.limite_credito?.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de juros:</span>
                    <span className="font-semibold">{analise.taxa_juros}% a.m.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-semibold">
                      {analise.tem_garantia ? 'Com garantia' : 'Sem garantia'}
                    </span>
                  </div>
                  {analise.tem_garantia && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor das garantias:</span>
                      <span className="font-semibold text-green-600">
                        R$ {analise.valor_garantias?.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resultado da Simulação */}
          <div className="space-y-6">
            {simulacao && (
              <>
                {/* Resumo da Simulação */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-800">
                      <Calculator className="mr-2 h-5 w-5" />
                      Resultado da Simulação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-sm text-blue-700 mb-1">Valor da Parcela</p>
                        <p className="text-4xl font-bold text-blue-600">
                          R$ {simulacao.valor_parcela?.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                        <p className="text-blue-700">por {simulacao.numero_parcelas} meses</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Valor Solicitado</p>
                          <p className="text-xl font-bold text-gray-900">
                            R$ {simulacao.valor_solicitado?.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                          <p className="text-xl font-bold text-gray-900">
                            R$ {simulacao.valor_total?.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detalhes do Empréstimo */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                      Detalhes do Empréstimo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Valor solicitado:</span>
                        <span className="font-semibold">R$ {simulacao.valor_solicitado?.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Taxa de juros:</span>
                        <span className="font-semibold">{simulacao.taxa_juros}% ao mês</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Número de parcelas:</span>
                        <span className="font-semibold">{simulacao.numero_parcelas}x</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Valor da parcela:</span>
                        <span className="font-semibold text-blue-600">
                          R$ {simulacao.valor_parcela?.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Valor total a pagar:</span>
                        <span className="font-semibold text-lg">
                          R$ {simulacao.valor_total?.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cronograma de Pagamento (Resumo) */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Cronograma de Pagamento</CardTitle>
                    <CardDescription>
                      Primeiras parcelas do seu empréstimo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from({ length: Math.min(3, simulacao.numero_parcelas) }, (_, i) => {
                        const dataVencimento = new Date()
                        dataVencimento.setMonth(dataVencimento.getMonth() + i + 1)
                        return (
                          <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-gray-600">
                              {i + 1}ª parcela - {dataVencimento.toLocaleDateString('pt-BR')}
                            </span>
                            <span className="font-semibold">
                              R$ {simulacao.valor_parcela?.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </div>
                        )
                      })}
                      {simulacao.numero_parcelas > 3 && (
                        <div className="text-center text-gray-500 text-sm pt-2">
                          ... e mais {simulacao.numero_parcelas - 3} parcelas
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onVoltar}
            className="px-8 py-3"
          >
            Voltar
          </Button>
          <Button
            onClick={handleSolicitarEmprestimo}
            disabled={loading || !simulacao}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Processando...' : 'Continuar para Contrato'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SimulacaoEmprestimo

