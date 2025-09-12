import { useState } from 'react'
import TelaInicial from './components/TelaInicial'
import CadastroUsuario from './components/CadastroUsuario'
import AnaliseCredito from './components/AnaliseCredito'
import SimulacaoEmprestimo from './components/SimulacaoEmprestimo'
import ContratoDigital from './components/ContratoDigital'
import LiberacaoEmprestimo from './components/LiberacaoEmprestimo'
import './App.css'

function App() {
  const [telaAtual, setTelaAtual] = useState('inicial')
  const [cliente, setCliente] = useState(null)
  const [analiseCredito, setAnaliseCredito] = useState(null)
  const [emprestimo, setEmprestimo] = useState(null)

  // Define a URL base da API usando a variável de ambiente
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSolicitarEmprestimo = () => {
    setTelaAtual('cadastro')
  }

  const handleCadastroCompleto = (clienteData) => {
    setCliente(clienteData)
    setTelaAtual('analise')
  }

  const handleAnaliseCompleta = (analiseData) => {
    setAnaliseCredito(analiseData)
    setTelaAtual('simulacao')
  }

  const handleSimulacaoCompleta = (emprestimoData) => {
    setEmprestimo(emprestimoData)
    setTelaAtual('contrato')
  }

  const handleContratoAssinado = (emprestimoData) => {
    setEmprestimo(emprestimoData)
    setTelaAtual('liberacao')
  }

  const handleNovoEmprestimo = () => {
    setTelaAtual('inicial')
    setCliente(null)
    setAnaliseCredito(null)
    setEmprestimo(null)
  }

  const handleVoltar = () => {
    switch (telaAtual) {
      case 'cadastro':
        setTelaAtual('inicial')
        break
      case 'analise':
        setTelaAtual('cadastro')
        break
      case 'simulacao':
        setTelaAtual('analise')
        break
      case 'contrato':
        setTelaAtual('simulacao')
        break
      default:
        setTelaAtual('inicial')
    }
  }

  return (
    <div className="App">
      {telaAtual === 'inicial' && (
        <TelaInicial onSolicitarEmprestimo={handleSolicitarEmprestimo} />
      )}
      
      {telaAtual === 'cadastro' && (
        <CadastroUsuario 
          onVoltar={handleVoltar}
          onCadastroCompleto={handleCadastroCompleto}
          apiBaseUrl={API_BASE_URL} // Passa a URL base da API para o componente
        />
      )}
      
      {telaAtual === 'analise' && (
        <AnaliseCredito 
          cliente={cliente}
          onVoltar={handleVoltar}
          onContinuar={handleAnaliseCompleta}
          apiBaseUrl={API_BASE_URL} // Passa a URL base da API para o componente
        />
      )}
      
      {telaAtual === 'simulacao' && (
        <SimulacaoEmprestimo 
          analise={analiseCredito}
          cliente={cliente}
          onVoltar={handleVoltar}
          onContinuar={handleSimulacaoCompleta}
          apiBaseUrl={API_BASE_URL} // Passa a URL base da API para o componente
        />
      )}
      
      {telaAtual === 'contrato' && (
        <ContratoDigital 
          emprestimo={emprestimo}
          cliente={cliente}
          onVoltar={handleVoltar}
          onContinuar={handleContratoAssinado}
          apiBaseUrl={API_BASE_URL} // Passa a URL base da API para o componente
        />
      )}
      
      {telaAtual === 'liberacao' && (
        <LiberacaoEmprestimo 
          emprestimo={emprestimo}
          cliente={cliente}
          onNovoEmprestimo={handleNovoEmprestimo}
          apiBaseUrl={API_BASE_URL} // Passa a URL base da API para o componente
        />
      )}
    </div>
  )
}

export default App


