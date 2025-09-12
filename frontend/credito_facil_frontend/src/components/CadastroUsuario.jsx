import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Upload, User, FileText, Home, Phone, Mail, Shield } from 'lucide-react'

function CadastroUsuario({ onVoltar, onCadastroCompleto, apiBaseUrl }) {
  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    endereco_completo: '',
    telefone: '',
    email: '',
    tem_garantia: false,
    garantias: []
  })

  const [documentoIdentidadeFile, setDocumentoIdentidadeFile] = useState(null)
  const [comprovanteRendaFile, setComprovanteRendaFile] = useState(null)

  const documentoIdentidadeInputRef = useRef(null)
  const comprovanteRendaInputRef = useRef(null)

  const [garantiaAtual, setGarantiaAtual] = useState({
    tipo: '',
    descricao: '',
    valor_estimado: ''
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (type, file) => {
    if (type === 'documento_identidade') {
      setDocumentoIdentidadeFile(file)
    } else if (type === 'comprovante_renda') {
      setComprovanteRendaFile(file)
    }
  }

  const handleGarantiaChange = (field, value) => {
    setGarantiaAtual(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const adicionarGarantia = () => {
    if (garantiaAtual.tipo && garantiaAtual.descricao) {
      setFormData(prev => ({
        ...prev,
        garantias: [...prev.garantias, { ...garantiaAtual }]
      }))
      setGarantiaAtual({ tipo: '', descricao: '', valor_estimado: '' })
    }
  }

  const removerGarantia = (index) => {
    setFormData(prev => ({
      ...prev,
      garantias: prev.garantias.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    for (const key in formData) {
      if (key === 'garantias') {
        data.append(key, JSON.stringify(formData[key]))
      } else {
        data.append(key, formData[key])
      }
    }
    if (documentoIdentidadeFile) {
      data.append('documento_identidade', documentoIdentidadeFile)
    }
    if (comprovanteRendaFile) {
      data.append('comprovante_renda', comprovanteRendaFile)
    }

    try {
      const response = await fetch("https://credito-facil-production.up.railway.app/api/clientes", {
        method: 'POST',
        body: data, // FormData não precisa de Content-Type
      })

      if (response.ok) {
        const result = await response.json()
        onCadastroCompleto(result.cliente)
      } else {
        const error = await response.json()
        alert(`Erro: ${error.erro}`)
      }
    } catch (error) {
      alert('Erro ao cadastrar cliente. Tente novamente.')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Cadastro de Cliente</h1>
            <p className="text-gray-600">Preencha seus dados para solicitar o empréstimo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados Pessoais */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Informe seus dados pessoais básicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome_completo}
                    onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                    placeholder="Digite seu nome completo"
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone Celular *</Label>
                  <Input
                    id="telefone"
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo *</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco_completo}
                  onChange={(e) => handleInputChange('endereco_completo', e.target.value)}
                  placeholder="Rua, número, bairro, cidade, estado, CEP"
                  required
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Documentos
              </CardTitle>
              <CardDescription>
                Faça upload dos documentos necessários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Documento de Identidade (CNH ou RG) *</Label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => documentoIdentidadeInputRef.current.click()}
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">{documentoIdentidadeFile ? documentoIdentidadeFile.name : 'Clique para fazer upload'}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('documento_identidade', e.target.files[0])}
                      className="hidden"
                      ref={documentoIdentidadeInputRef}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Comprovante de Renda *</Label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => comprovanteRendaInputRef.current.click()}
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">{comprovanteRendaFile ? comprovanteRendaFile.name : 'Clique para fazer upload'}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('comprovante_renda', e.target.files[0])}
                      className="hidden"
                      ref={comprovanteRendaInputRef}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Garantias */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-600" />
                Garantias (Opcional)
              </CardTitle>
              <CardDescription>
                Adicione bens como garantia para reduzir os juros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tem_garantia"
                  checked={formData.tem_garantia}
                  onCheckedChange={(checked) => handleInputChange('tem_garantia', checked)}
                />
                <Label htmlFor="tem_garantia">
                  Desejo adicionar bens como garantia para reduzir os juros
                </Label>
              </div>

              {formData.tem_garantia && (
                <div className="space-y-6 p-6 bg-blue-50 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Bem</Label>
                      <Select
                        value={garantiaAtual.tipo}
                        onValueChange={(value) => handleGarantiaChange('tipo', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carro">Carro</SelectItem>
                          <SelectItem value="casa">Casa/Imóvel</SelectItem>
                          <SelectItem value="outros">Outros Bens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Valor Estimado (R$)</Label>
                      <Input
                        type="number"
                        value={garantiaAtual.valor_estimado}
                        onChange={(e) => handleGarantiaChange('valor_estimado', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={adicionarGarantia}
                        className="w-full"
                        disabled={!garantiaAtual.tipo || !garantiaAtual.descricao}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição do Bem</Label>
                    <Textarea
                      value={garantiaAtual.descricao}
                      onChange={(e) => handleGarantiaChange('descricao', e.target.value)}
                      placeholder="Ex: Honda Civic 2020, Apartamento no Centro, etc."
                    />
                  </div>

                  {/* Lista de Garantias Adicionadas */}
                  {formData.garantias.length > 0 && (
                    <div className="space-y-2">
                      <Label>Bens Adicionados:</Label>
                      {formData.garantias.map((garantia, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <span className="font-medium capitalize">{garantia.tipo}</span>
                            {garantia.valor_estimado && (
                              <span className="text-green-600 ml-2">
                                R$ {parseFloat(garantia.valor_estimado).toLocaleString('pt-BR')}
                              </span>
                            )}
                            <p className="text-sm text-gray-600">{garantia.descricao}</p>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removerGarantia(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onVoltar}
              className="px-8 py-3"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Cadastrando...' : 'Continuar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CadastroUsuario


