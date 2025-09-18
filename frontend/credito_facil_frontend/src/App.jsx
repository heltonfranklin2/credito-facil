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

        />
      )}
      
      {telaAtual === 'analise' && (
        <AnaliseCredito 
          cliente={cliente}
          onVoltar={handleVoltar}
          onContinuar={handleAnaliseCompleta}

        />
      )}
      
      {telaAtual === 'simulacao' && (
        <SimulacaoEmprestimo 
          analise={analiseCredito}
          cliente={cliente}
          onVoltar={handleVoltar}
          onContinuar={handleSimulacaoCompleta}

        />
      )}
      
      {telaAtual === 'contrato' && (
        <ContratoDigital 
          emprestimo={emprestimo}
          cliente={cliente}
          onVoltar={handleVoltar}
          onContinuar={handleContratoAssinado}

        />
      )}
      
      {telaAtual === 'liberacao' && (
        <LiberacaoEmprestimo 
          emprestimo={emprestimo}
          cliente={cliente}
          onNovoEmprestimo={handleNovoEmprestimo}

        />
      )}
    </div>
  )
}

export default App



// Comentário para forçar novo deploy

