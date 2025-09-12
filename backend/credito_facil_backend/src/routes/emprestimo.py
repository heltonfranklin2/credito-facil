from flask import Blueprint, jsonify, request
from src.models.emprestimo import Cliente, Garantia, Emprestimo, db
from datetime import datetime
import re

emprestimo_bp = Blueprint('emprestimo', __name__)

def validar_cpf(cpf):
    """Validação básica de CPF"""
    cpf = re.sub(r'[^0-9]', '', cpf)
    if len(cpf) != 11:
        return False
    # Verificação básica (não é uma validação completa de CPF)
    return True

def calcular_taxa_juros(tem_garantia, valor_garantia=0):
    """Calcula a taxa de juros baseada na garantia"""
    if tem_garantia and valor_garantia > 0:
        # Taxa menor para quem tem garantia
        if valor_garantia >= 50000:
            return 2.5  # 2.5% ao mês
        elif valor_garantia >= 20000:
            return 3.0  # 3.0% ao mês
        else:
            return 3.5  # 3.5% ao mês
    else:
        # Taxa maior para quem não tem garantia
        return 4.5  # 4.5% ao mês

def calcular_limite_credito(tem_garantia, valor_garantia=0, renda_estimada=3000):
    """Calcula o limite de crédito baseado na garantia e renda"""
    if tem_garantia and valor_garantia > 0:
        # Limite maior para quem tem garantia (até 70% do valor da garantia)
        limite_garantia = valor_garantia * 0.7
        limite_renda = renda_estimada * 10
        return min(limite_garantia, 50000)  # Máximo de R$ 50.000
    else:
        # Limite menor para quem não tem garantia
        limite_renda = renda_estimada * 5
        return min(limite_renda, 20000)  # Máximo de R$ 20.000

@emprestimo_bp.route('/clientes', methods=['POST'])
def cadastrar_cliente():
    try:
        data = request.json
        
        # Validações básicas
        if not validar_cpf(data.get('cpf', '')):
            return jsonify({'erro': 'CPF inválido'}), 400
        
        # Verificar se CPF já existe
        cliente_existente = Cliente.query.filter_by(cpf=data['cpf']).first()
        if cliente_existente:
            return jsonify({'erro': 'CPF já cadastrado'}), 400
        
        # Criar cliente
        cliente = Cliente(
            nome_completo=data['nome_completo'],
            cpf=data['cpf'],
            documento_identidade=data.get('documento_identidade', ''),
            comprovante_renda=data.get('comprovante_renda', ''),
            endereco_completo=data['endereco_completo'],
            telefone=data['telefone'],
            email=data['email']
        )
        
        db.session.add(cliente)
        db.session.flush()  # Para obter o ID do cliente
        
        # Adicionar garantias se existirem
        garantias_data = data.get('garantias', [])
        for garantia_data in garantias_data:
            garantia = Garantia(
                cliente_id=cliente.id,
                tipo=garantia_data['tipo'],
                descricao=garantia_data['descricao'],
                valor_estimado=garantia_data.get('valor_estimado', 0)
            )
            db.session.add(garantia)
        
        db.session.commit()
        
        return jsonify({
            'cliente': cliente.to_dict(),
            'mensagem': 'Cliente cadastrado com sucesso'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@emprestimo_bp.route('/clientes/<int:cliente_id>/analise-credito', methods=['POST'])
def analisar_credito(cliente_id):
    try:
        cliente = Cliente.query.get_or_404(cliente_id)
        
        # Simular análise de crédito (verificação de CPF limpo)
        # Em um sistema real, aqui seria feita a consulta aos órgãos de proteção ao crédito
        cpf_limpo = True  # Simulação - sempre aprovado para demonstração
        
        if not cpf_limpo:
            return jsonify({
                'aprovado': False,
                'mensagem': 'No momento não conseguimos liberar crédito para você.'
            }), 200
        
        # Calcular garantias
        garantias = Garantia.query.filter_by(cliente_id=cliente_id).all()
        valor_total_garantias = sum(g.valor_estimado or 0 for g in garantias)
        tem_garantia = len(garantias) > 0 and valor_total_garantias > 0
        
        # Calcular taxa de juros e limite
        taxa_juros = calcular_taxa_juros(tem_garantia, valor_total_garantias)
        limite_credito = calcular_limite_credito(tem_garantia, valor_total_garantias)
        
        return jsonify({
            'aprovado': True,
            'cliente_id': cliente_id,
            'tem_garantia': tem_garantia,
            'valor_garantias': valor_total_garantias,
            'taxa_juros': taxa_juros,
            'limite_credito': limite_credito,
            'mensagem': 'Crédito pré-aprovado!'
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@emprestimo_bp.route('/emprestimos/simular', methods=['POST'])
def simular_emprestimo():
    try:
        data = request.json
        valor_solicitado = data['valor_solicitado']
        numero_parcelas = data['numero_parcelas']
        taxa_juros = data['taxa_juros']
        
        # Calcular valor da parcela usando juros compostos
        taxa_mensal = taxa_juros / 100
        valor_parcela = valor_solicitado * (taxa_mensal * (1 + taxa_mensal) ** numero_parcelas) / ((1 + taxa_mensal) ** numero_parcelas - 1)
        valor_total = valor_parcela * numero_parcelas
        
        return jsonify({
            'valor_solicitado': valor_solicitado,
            'numero_parcelas': numero_parcelas,
            'taxa_juros': taxa_juros,
            'valor_parcela': round(valor_parcela, 2),
            'valor_total': round(valor_total, 2)
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@emprestimo_bp.route('/emprestimos', methods=['POST'])
def solicitar_emprestimo():
    try:
        data = request.json
        
        emprestimo = Emprestimo(
            cliente_id=data['cliente_id'],
            valor_solicitado=data['valor_solicitado'],
            taxa_juros=data['taxa_juros'],
            numero_parcelas=data['numero_parcelas'],
            valor_parcela=data['valor_parcela'],
            tem_garantia=data.get('tem_garantia', False),
            status='pendente'
        )
        
        db.session.add(emprestimo)
        db.session.commit()
        
        return jsonify({
            'emprestimo': emprestimo.to_dict(),
            'mensagem': 'Solicitação de empréstimo enviada com sucesso'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@emprestimo_bp.route('/emprestimos/<int:emprestimo_id>/aprovar', methods=['POST'])
def aprovar_emprestimo(emprestimo_id):
    try:
        emprestimo = Emprestimo.query.get_or_404(emprestimo_id)
        
        emprestimo.status = 'aprovado'
        emprestimo.valor_aprovado = emprestimo.valor_solicitado
        emprestimo.data_aprovacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'emprestimo': emprestimo.to_dict(),
            'mensagem': 'Empréstimo aprovado com sucesso'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@emprestimo_bp.route('/emprestimos/<int:emprestimo_id>/liberar', methods=['POST'])
def liberar_emprestimo(emprestimo_id):
    try:
        emprestimo = Emprestimo.query.get_or_404(emprestimo_id)
        
        if emprestimo.status != 'aprovado':
            return jsonify({'erro': 'Empréstimo deve estar aprovado para ser liberado'}), 400
        
        emprestimo.status = 'liberado'
        emprestimo.data_liberacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'emprestimo': emprestimo.to_dict(),
            'mensagem': 'Seu dinheiro será transferido via Pix em até 2 horas.'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@emprestimo_bp.route('/clientes/<int:cliente_id>/emprestimos', methods=['GET'])
def listar_emprestimos_cliente(cliente_id):
    try:
        emprestimos = Emprestimo.query.filter_by(cliente_id=cliente_id).all()
        return jsonify([emprestimo.to_dict() for emprestimo in emprestimos]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

