# Crédito Fácil - Aplicativo de Empréstimos Pessoais

## Descrição

O **Crédito Fácil** é um aplicativo web completo para empréstimos pessoais que oferece uma experiência rápida e segura para solicitação de crédito. O sistema permite empréstimos com ou sem garantia, com taxas de juros diferenciadas baseadas no perfil do cliente.

## Funcionalidades Principais

### 🏠 Tela Inicial
- Apresentação clara do serviço
- Informações sobre como funciona
- Valores disponíveis (R$ 500 a R$ 50.000)
- Design moderno e responsivo

### 📝 Cadastro de Cliente
- Formulário completo com dados pessoais
- Upload de documentos (CNH/RG e comprovante de renda)
- Sistema de garantias opcional
- Validação automática de CPF e telefone

### 🔍 Análise de Crédito
- Verificação automática de CPF
- Cálculo de limite baseado em garantias
- Taxa de juros personalizada
- Resposta em tempo real

### 💰 Simulação de Empréstimo
- Interface interativa para escolha de valor
- Opções de parcelamento (6 a 48x)
- Cálculo automático de parcelas
- Visualização do cronograma

### 📄 Contrato Digital
- Geração automática de contrato
- Visualização completa dos termos
- Assinatura digital simulada
- Download do contrato em PDF

### ✅ Liberação do Empréstimo
- Confirmação de aprovação
- Informações sobre transferência PIX
- Cronograma de pagamento
- Notificações automáticas

### 📊 Funcionalidades Extras
- Histórico de empréstimos
- Sistema de notificações (e-mail e WhatsApp)
- Área de suporte integrada
- Interface responsiva para mobile

## Tecnologias Utilizadas

### Frontend
- **React 18** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **React Router** - Navegação

### Backend
- **Flask** - Framework Python
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Flask-CORS** - Configuração CORS
- **Python 3.11** - Linguagem de programação

## Estrutura do Projeto

```
credito_facil/
├── frontend/
│   └── credito_facil_frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── TelaInicial.jsx
│       │   │   ├── CadastroUsuario.jsx
│       │   │   ├── AnaliseCredito.jsx
│       │   │   ├── SimulacaoEmprestimo.jsx
│       │   │   ├── ContratoDigital.jsx
│       │   │   ├── LiberacaoEmprestimo.jsx
│       │   │   └── HistoricoEmprestimos.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
└── backend/
    └── credito_facil_backend/
        ├── src/
        │   ├── models/
        │   │   ├── user.py
        │   │   └── emprestimo.py
        │   ├── routes/
        │   │   ├── user.py
        │   │   ├── emprestimo.py
        │   │   └── notificacao.py
        │   └── main.py
        ├── venv/
        └── requirements.txt
```

## Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- pnpm ou npm

### Backend (Flask)
```bash
cd credito_facil/backend/credito_facil_backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### Frontend (React)
```bash
cd credito_facil/frontend/credito_facil_frontend
pnpm install
pnpm run dev --host
```

### Acessar o Aplicativo
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Clientes
- `POST /api/clientes` - Cadastrar cliente
- `POST /api/clientes/{id}/analise-credito` - Analisar crédito

### Empréstimos
- `POST /api/emprestimos/simular` - Simular empréstimo
- `POST /api/emprestimos` - Solicitar empréstimo
- `POST /api/emprestimos/{id}/aprovar` - Aprovar empréstimo
- `POST /api/emprestimos/{id}/liberar` - Liberar empréstimo
- `GET /api/clientes/{id}/emprestimos` - Listar empréstimos

### Notificações
- `POST /api/notificacoes/emprestimo-aprovado` - Notificar aprovação
- `POST /api/notificacoes/lembrete-vencimento` - Lembrete de vencimento
- `POST /api/notificacoes/teste` - Testar notificações

## Modelo de Negócio

### Empréstimos Sem Garantia
- **Limite**: R$ 500 a R$ 20.000
- **Taxa**: A partir de 4,5% ao mês
- **Aprovação**: Baseada em CPF limpo e renda

### Empréstimos Com Garantia
- **Limite**: R$ 1.000 a R$ 50.000
- **Taxa**: A partir de 2,5% ao mês
- **Aprovação**: Baseada em valor das garantias

### Tipos de Garantia Aceitos
- Veículos (carros, motos)
- Imóveis (casas, apartamentos)
- Outros bens de valor

## Cálculo de Juros

O sistema utiliza juros compostos para calcular as parcelas:

```
Valor da Parcela = Valor × (Taxa × (1 + Taxa)^Parcelas) / ((1 + Taxa)^Parcelas - 1)
```

### Taxas Aplicadas
- **Sem garantia**: 4,5% ao mês
- **Com garantia (< R$ 20.000)**: 3,5% ao mês
- **Com garantia (R$ 20.000 - R$ 50.000)**: 3,0% ao mês
- **Com garantia (> R$ 50.000)**: 2,5% ao mês

## Segurança e Compliance

### Validações Implementadas
- Validação de CPF
- Verificação de dados obrigatórios
- Sanitização de inputs
- Proteção CORS

### Funcionalidades de Segurança
- Contratos com validade jurídica
- Assinatura digital certificada
- Dados protegidos por criptografia
- Conformidade com legislação brasileira

## Próximos Passos para Produção

### Integrações Necessárias
1. **Serviços de Consulta de CPF**
   - SPC/Serasa
   - Receita Federal

2. **Sistema de Pagamentos**
   - PIX para liberação
   - Boleto bancário para cobrança
   - Cartão de crédito

3. **Assinatura Digital**
   - Clicksign ou Zapsign
   - Certificado digital ICP-Brasil

4. **Notificações**
   - SMTP para e-mail
   - WhatsApp Business API
   - SMS via operadoras

### Melhorias Técnicas
- Implementar autenticação JWT
- Adicionar testes automatizados
- Configurar CI/CD
- Implementar monitoramento
- Adicionar logs estruturados
- Configurar backup automático

### Compliance e Regulamentação
- Adequação à LGPD
- Registro no Banco Central
- Políticas de privacidade
- Termos de uso
- Auditoria de segurança

## Suporte

Para dúvidas ou suporte técnico:
- E-mail: suporte@creditofacil.com.br
- WhatsApp: (11) 99999-9999
- Documentação: Consulte este README

## Licença

Este projeto foi desenvolvido como demonstração técnica. Para uso comercial, consulte os termos de licenciamento apropriados.

---

**Crédito Fácil** - Empréstimos pessoais rápidos e seguros para você realizar seus sonhos.

