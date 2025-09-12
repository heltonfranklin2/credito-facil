import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Shield, Clock, CheckCircle } from 'lucide-react'

function TelaInicial({ onSolicitarEmprestimo }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Crédito Fácil</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Como Funciona</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Taxas</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Suporte</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Peça seu empréstimo de forma
            <span className="text-blue-600"> rápida e segura</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Crédito aprovado em minutos, sem burocracia. Você não precisa ter bens como garantia para conseguir um empréstimo.
          </p>
        </div>

        {/* Informações Importantes */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-blue-100">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Como Funciona</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Apenas com sua CNH e nome limpo</h4>
                  <p className="text-gray-600">Já é possível ser aprovado para um empréstimo</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Mais bens em garantia</h4>
                  <p className="text-gray-600">Menor taxa de juros e maior limite de crédito</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Menos bens em garantia</h4>
                  <p className="text-gray-600">Maior taxa de juros, mas ainda assim acessível</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Liberação rápida</h4>
                  <p className="text-gray-600">Dinheiro na conta via Pix em até 2 horas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={onSolicitarEmprestimo}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Solicitar Empréstimo
            </Button>
          </div>
        </div>

        {/* Vantagens */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Aprovação Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Análise de crédito em tempo real. Resposta em poucos minutos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">100% Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Seus dados protegidos com criptografia de ponta a ponta.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Sem Burocracia</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Processo 100% digital. Sem filas, sem papelada.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Faixas de Valores */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">Valores Disponíveis</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <h4 className="text-xl font-semibold text-blue-900 mb-2">Sem Garantia</h4>
              <p className="text-3xl font-bold text-blue-600 mb-2">R$ 500 - R$ 20.000</p>
              <p className="text-gray-600">Taxa a partir de 4,5% ao mês</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <h4 className="text-xl font-semibold text-green-900 mb-2">Com Garantia</h4>
              <p className="text-3xl font-bold text-green-600 mb-2">R$ 1.000 - R$ 50.000</p>
              <p className="text-gray-600">Taxa a partir de 2,5% ao mês</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-6 w-6" />
                <span className="text-xl font-bold">Crédito Fácil</span>
              </div>
              <p className="text-gray-400">
                Empréstimos pessoais rápidos e seguros para você realizar seus sonhos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Empréstimo Pessoal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Empréstimo com Garantia</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-mail</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Crédito Fácil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TelaInicial

