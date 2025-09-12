from flask import Blueprint, jsonify, request
from src.models.emprestimo import Emprestimo, Cliente, db
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

notificacao_bp = Blueprint('notificacao', __name__)

def enviar_email(destinatario, assunto, corpo):
    """Simula o envio de e-mail (em produção, configurar SMTP real)"""
    try:
        # Em produção, configurar com credenciais reais do SMTP
        print(f"E-mail enviado para {destinatario}")
        print(f"Assunto: {assunto}")
        print(f"Corpo: {corpo}")
        return True
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        return False

def enviar_whatsapp(telefone, mensagem):
    """Simula o envio de WhatsApp (em produção, integrar com API do WhatsApp Business)"""
    try:
        # Em produção, integrar com WhatsApp Business API
        print(f"WhatsApp enviado para {telefone}")
        print(f"Mensagem: {mensagem}")
        return True
    except Exception as e:
        print(f"Erro ao enviar WhatsApp: {e}")
        return False

@notificacao_bp.route('/notificacoes/emprestimo-aprovado', methods=['POST'])
def notificar_emprestimo_aprovado():
    try:
        data = request.json
        emprestimo_id = data['emprestimo_id']
        
        emprestimo = Emprestimo.query.get_or_404(emprestimo_id)
        cliente = Cliente.query.get_or_404(emprestimo.cliente_id)
        
        # E-mail
        assunto_email = "Empréstimo Aprovado - Crédito Fácil"
        corpo_email = f"""
Olá {cliente.nome_completo},

Parabéns! Seu empréstimo foi aprovado com sucesso.

Detalhes do empréstimo:
- Valor: R$ {emprestimo.valor_aprovado:,.2f}
- Parcelas: {emprestimo.numero_parcelas}x de R$ {emprestimo.valor_parcela:,.2f}
- Taxa de juros: {emprestimo.taxa_juros}% ao mês

O dinheiro será transferido via PIX em até 2 horas.

Atenciosamente,
Equipe Crédito Fácil
        """
        
        # WhatsApp
        mensagem_whatsapp = f"""
🎉 *Empréstimo Aprovado!*

Olá {cliente.nome_completo.split()[0]},

Seu empréstimo de *R$ {emprestimo.valor_aprovado:,.2f}* foi aprovado!

💰 Valor: R$ {emprestimo.valor_aprovado:,.2f}
📅 Parcelas: {emprestimo.numero_parcelas}x de R$ {emprestimo.valor_parcela:,.2f}
📈 Taxa: {emprestimo.taxa_juros}% a.m.

O dinheiro será transferido via PIX em até 2 horas.

Crédito Fácil ✅
        """
        
        # Enviar notificações
        email_enviado = enviar_email(cliente.email, assunto_email, corpo_email)
        whatsapp_enviado = enviar_whatsapp(cliente.telefone, mensagem_whatsapp)
        
        return jsonify({
            'sucesso': True,
            'email_enviado': email_enviado,
            'whatsapp_enviado': whatsapp_enviado
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@notificacao_bp.route('/notificacoes/lembrete-vencimento', methods=['POST'])
def enviar_lembrete_vencimento():
    try:
        # Buscar empréstimos com vencimento próximo (próximos 3 dias)
        data_limite = datetime.now() + timedelta(days=3)
        
        # Em um sistema real, haveria uma tabela de parcelas
        # Por simplicidade, vamos simular lembretes para empréstimos liberados
        emprestimos = Emprestimo.query.filter_by(status='liberado').all()
        
        lembretes_enviados = 0
        
        for emprestimo in emprestimos:
            cliente = Cliente.query.get(emprestimo.cliente_id)
            
            # Calcular data do próximo vencimento (simulado)
            if emprestimo.data_liberacao:
                proxima_parcela = emprestimo.data_liberacao + timedelta(days=30)
                
                if proxima_parcela <= data_limite:
                    # E-mail de lembrete
                    assunto = "Lembrete: Parcela do empréstimo vence em breve"
                    corpo = f"""
Olá {cliente.nome_completo},

Este é um lembrete de que sua parcela do empréstimo vence em breve.

Detalhes:
- Valor da parcela: R$ {emprestimo.valor_parcela:,.2f}
- Data de vencimento: {proxima_parcela.strftime('%d/%m/%Y')}
- Empréstimo: #{emprestimo.id}

Para evitar juros e multa, efetue o pagamento até a data de vencimento.

Atenciosamente,
Equipe Crédito Fácil
                    """
                    
                    # WhatsApp de lembrete
                    mensagem = f"""
⏰ *Lembrete de Vencimento*

Olá {cliente.nome_completo.split()[0]},

Sua parcela vence em breve:

💰 Valor: R$ {emprestimo.valor_parcela:,.2f}
📅 Vencimento: {proxima_parcela.strftime('%d/%m/%Y')}

Pague até a data para evitar juros e multa.

Crédito Fácil 📋
                    """
                    
                    enviar_email(cliente.email, assunto, corpo)
                    enviar_whatsapp(cliente.telefone, mensagem)
                    lembretes_enviados += 1
        
        return jsonify({
            'sucesso': True,
            'lembretes_enviados': lembretes_enviados
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@notificacao_bp.route('/notificacoes/teste', methods=['POST'])
def testar_notificacoes():
    """Endpoint para testar o sistema de notificações"""
    try:
        data = request.json
        email = data.get('email', 'teste@exemplo.com')
        telefone = data.get('telefone', '(11) 99999-9999')
        
        # Testar e-mail
        assunto = "Teste de Notificação - Crédito Fácil"
        corpo = "Este é um teste do sistema de notificações por e-mail."
        email_enviado = enviar_email(email, assunto, corpo)
        
        # Testar WhatsApp
        mensagem = "🧪 Teste do sistema de notificações WhatsApp - Crédito Fácil"
        whatsapp_enviado = enviar_whatsapp(telefone, mensagem)
        
        return jsonify({
            'sucesso': True,
            'email_enviado': email_enviado,
            'whatsapp_enviado': whatsapp_enviado
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

