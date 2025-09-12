from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(200), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    documento_identidade = db.Column(db.String(500), nullable=False)  # URL do arquivo
    comprovante_renda = db.Column(db.String(500), nullable=False)  # URL do arquivo
    endereco_completo = db.Column(db.Text, nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com empréstimos
    emprestimos = db.relationship('Emprestimo', backref='cliente', lazy=True)
    
    # Relacionamento com garantias
    garantias = db.relationship('Garantia', backref='cliente', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'nome_completo': self.nome_completo,
            'cpf': self.cpf,
            'documento_identidade': self.documento_identidade,
            'comprovante_renda': self.comprovante_renda,
            'endereco_completo': self.endereco_completo,
            'telefone': self.telefone,
            'email': self.email,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None
        }

class Garantia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # 'carro', 'casa', 'outros'
    descricao = db.Column(db.Text, nullable=False)
    valor_estimado = db.Column(db.Float, nullable=True)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'tipo': self.tipo,
            'descricao': self.descricao,
            'valor_estimado': self.valor_estimado,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None
        }

class Emprestimo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    valor_solicitado = db.Column(db.Float, nullable=False)
    valor_aprovado = db.Column(db.Float, nullable=True)
    taxa_juros = db.Column(db.Float, nullable=True)
    numero_parcelas = db.Column(db.Integer, nullable=True)
    valor_parcela = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(50), default='pendente')  # 'pendente', 'aprovado', 'reprovado', 'liberado'
    tem_garantia = db.Column(db.Boolean, default=False)
    data_solicitacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_aprovacao = db.Column(db.DateTime, nullable=True)
    data_liberacao = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'valor_solicitado': self.valor_solicitado,
            'valor_aprovado': self.valor_aprovado,
            'taxa_juros': self.taxa_juros,
            'numero_parcelas': self.numero_parcelas,
            'valor_parcela': self.valor_parcela,
            'status': self.status,
            'tem_garantia': self.tem_garantia,
            'data_solicitacao': self.data_solicitacao.isoformat() if self.data_solicitacao else None,
            'data_aprovacao': self.data_aprovacao.isoformat() if self.data_aprovacao else None,
            'data_liberacao': self.data_liberacao.isoformat() if self.data_liberacao else None
        }

