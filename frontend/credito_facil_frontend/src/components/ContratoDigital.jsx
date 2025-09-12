import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Shield, CheckCircle, ArrowLeft, Download } from 'lucide-react'

function ContratoDigital({ emprestimo, cliente, onVoltar, onContinuar }) {
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAssinarContrato = async () => {
    if (!aceitouTermos) {
      alert('Você deve aceitar os termos do contrato para continuar.')
      return
    }

    setLoading(true)
    try {
      // Aprovar o empréstimo
      const response = await fetch(`/api/emprestimos/${emprestimo.id}/aprovar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        onContinuar(result.emprestimo)
      } else {
        const error = await response.json()
        alert(`Erro: ${error.erro}`)
      }
    } catch (error) {
      alert('Erro ao assinar contrato. Tente novamente.')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const contratoTexto = `
CONTRATO DE EMPRÉSTIMO PESSOAL

CONTRATANTE: ${cliente.nome_completo}
CPF: ${cliente.cpf}
ENDEREÇO: ${cliente.endereco_completo}
TELEFONE: ${cliente.telefone}
E-MAIL: ${cliente.email}

CONTRATADA: CRÉDITO FÁCIL LTDA
CNPJ: 12.345.678/0001-90

VALOR DO EMPRÉSTIMO: R$ ${emprestimo.valor_solicitado?.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}

TAXA DE JUROS: ${emprestimo.taxa_juros}% ao mês
NÚMERO DE PARCELAS: ${emprestimo.numero_parcelas}
VALOR DA PARCELA: R$ ${emprestimo.valor_parcela?.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}

CLÁUSULAS E CONDIÇÕES:

1. DO OBJETO
O presente contrato tem por objeto a concessão de empréstimo pessoal no valor acima especificado, a ser pago em ${emprestimo.numero_parcelas} parcelas mensais e consecutivas.

2. DAS CONDIÇÕES DE PAGAMENTO
2.1. O pagamento das parcelas deverá ser efetuado mensalmente, sempre no dia ${new Date().getDate()} de cada mês.
2.2. O primeiro vencimento ocorrerá em ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}.
2.3. O pagamento poderá ser efetuado via PIX, transferência bancária ou boleto bancário.

3. DOS JUROS E ENCARGOS
3.1. A taxa de juros aplicada é de ${emprestimo.taxa_juros}% ao mês, já incluída no valor das parcelas.
3.2. Em caso de atraso no pagamento, será aplicada multa de 2% sobre o valor da parcela em atraso.
3.3. Juros de mora de 1% ao mês sobre o valor em atraso.

4. DA LIBERAÇÃO DO CRÉDITO
4.1. O valor do empréstimo será liberado via PIX em até 2 (duas) horas úteis após a assinatura deste contrato.
4.2. A liberação está condicionada à aprovação final dos documentos apresentados.

5. DAS GARANTIAS
${emprestimo.tem_garantia ? 
  '5.1. Este empréstimo possui garantias adicionais conforme declarado no cadastro do cliente.' :
  '5.1. Este empréstimo não possui garantias adicionais, sendo baseado exclusivamente na análise de crédito do cliente.'
}

6. DO VENCIMENTO ANTECIPADO
6.1. O contratado poderá considerar vencidas todas as parcelas em caso de:
   a) Atraso superior a 30 dias no pagamento de qualquer parcela;
   b) Falsidade nas informações prestadas;
   c) Deterioração da situação financeira do contratante.

7. DA QUITAÇÃO ANTECIPADA
7.1. O contratante poderá quitar antecipadamente o empréstimo, com desconto proporcional dos juros.

8. DAS DISPOSIÇÕES GERAIS
8.1. Este contrato é regido pelas leis brasileiras.
8.2. Fica eleito o foro da comarca de São Paulo para dirimir quaisquer questões oriundas deste contrato.

São Paulo, ${new Date().toLocaleDateString('pt-BR')}

CONTRATANTE: ${cliente.nome_completo}
CPF: ${cliente.cpf}

CONTRATADA: CRÉDITO FÁCIL LTDA
CNPJ: 12.345.678/0001-90
  `

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl font-bold text-gray-900">Contrato Digital</h1>
            <p className="text-gray-600">Revise e assine seu contrato de empréstimo</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resumo do Empréstimo */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Resumo do Empréstimo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    R$ {emprestimo.valor_solicitado?.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className="text-green-700">Valor do empréstimo</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-green-200">
                  <div className="flex justify-between">
                    <span className="text-green-700">Parcelas:</span>
                    <span className="font-semibold text-green-800">{emprestimo.numero_parcelas}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Valor da parcela:</span>
                    <span className="font-semibold text-green-800">
                      R$ {emprestimo.valor_parcela?.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Taxa de juros:</span>
                    <span className="font-semibold text-green-800">{emprestimo.taxa_juros}% a.m.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Primeiro vencimento:</span>
                    <span className="font-semibold text-green-800">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-600" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Contrato com validade jurídica</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Assinatura digital certificada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Dados protegidos por criptografia</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Conforme legislação brasileira</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contrato */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Contrato de Empréstimo Pessoal
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                </CardTitle>
                <CardDescription>
                  Leia atentamente todos os termos e condições
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full border rounded-lg p-4 bg-gray-50">
                  <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {contratoTexto}
                  </pre>
                </ScrollArea>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Checkbox
                      id="aceito-termos"
                      checked={aceitouTermos}
                      onCheckedChange={setAceitouTermos}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor="aceito-termos"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Li e aceito todos os termos e condições deste contrato
                      </label>
                      <p className="text-xs text-gray-600">
                        Ao marcar esta opção, você concorda com todas as cláusulas do contrato de empréstimo e 
                        autoriza a liberação do crédito conforme as condições estabelecidas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Importante:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Este contrato tem validade jurídica plena</li>
                          <li>Sua assinatura digital será registrada com certificação</li>
                          <li>O não pagamento pode resultar em negativação do CPF</li>
                          <li>Você pode quitar antecipadamente com desconto nos juros</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            onClick={handleAssinarContrato}
            disabled={!aceitouTermos || loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Processando...' : 'Assinar Contrato Digitalmente'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ContratoDigital

