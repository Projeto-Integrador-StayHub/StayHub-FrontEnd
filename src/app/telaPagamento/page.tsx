"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import style from "../../app/telaPagamento/page.module.scss";

interface Hospede {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    endereco: string;
}

interface DetalhesReserva {
    id: number;
    nome: string;
    descricao: string;
    entrada: string;
    saida: string;
    preco: number;
    status: number;
    hospede: Hospede;
}

interface ConfirmationDetails {
    valorTotal: number;
    detalhesReserva: DetalhesReserva;
}

const Pagamento = () => {
    const searchParams = useSearchParams();

    const nomeQuarto = searchParams.get("nomeQuarto");
    const preco = searchParams.get("preco");
    const cidade = searchParams.get("cidade");
    const estado = searchParams.get("estado");
    const reservaId = searchParams.get("id");

    const [paymentMethod, setPaymentMethod] = useState("creditCard");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSummaryVisible, setIsSummaryVisible] = useState(false);
    const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);

    const handlePayment = async () => {
        // Verifica se o método de pagamento está definido
        if (!paymentMethod) {
            alert("Por favor, selecione um método de pagamento.");
            return;
        }

        const precoFinal = preco ?? "0"; // Garante um valor padrão caso seja null
        try {
            setIsProcessing(true);
            const response = await fetch(
                `https://localhost:7274/api/Pagamento/processar-pagamento/${reservaId}?metodoPagamento=${encodeURIComponent(paymentMethod)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hospedeId: 1,
                        nome: nomeQuarto ?? "Nome não especificado",
                        descricao: "Pagamento do quarto reservado",
                        entrada: new Date().toISOString(),
                        saida: new Date().toISOString(),
                        preco: parseFloat(precoFinal), // Converte para número
                        status: 0,
                        pagamentoStatus: 0,
                    }),
                }
            );

            const result = await response.json();
            console.log("Resposta completa da API:", result);

            if (response.ok) {
                alert("Pagamento realizado com sucesso!");
                closeModal();
            } else {
                console.error("Erros de validação:", result.errors);
                alert(`Erro ao processar o pagamento: ${result.title}`);
            }
        } catch (error) {
            console.error("Erro ao processar o pagamento:", error);
            alert("Houve um erro ao tentar processar o pagamento.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmPayment = async () => {
        try {
            const response = await fetch(
                `https://localhost:7274/api/Pagamento/confirmar-pagamento/${reservaId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await response.json();

            if (response.ok) {
                setConfirmationDetails(result);
            } else {
                alert(`Erro ao confirmar o pagamento: ${result.message}`);
            }
        } catch (error) {
            console.error("Erro ao confirmar o pagamento:", error);
            alert("Houve um erro ao tentar confirmar o pagamento.");
        }
    };

    const closeModal = () => {
        setConfirmationDetails(null);
    };

    return (
        <div className={style.containerPagamento}>
            <div className={style.container} >
            <h1 className={style.tituloPagamento}>Resumo do Pedido</h1>
            <div className={style.resumoPagamento}>
                <p><strong>Quarto:</strong> {nomeQuarto}</p>
                <p><strong>Preço por Noite:</strong> R${preco}</p>
                <p><strong>Localização:</strong> {cidade}, {estado}</p>
            </div>
            <div className={style.metodosPagamento}>
                <h3>Selecione o método de pagamento:</h3>
                <label>
                    <input
                        type="radio"
                        value="creditCard"
                        checked={paymentMethod === "creditCard"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cartão de Crédito
                </label>
                <label>
                    <input
                        type="radio"
                        value="pix"
                        checked={paymentMethod === "pix"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Pix
                </label>
                <label>
                    <input
                        type="radio"
                        value="debito"
                        checked={paymentMethod === "debito"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cartão de Débito
                </label>
            </div>
            <button
                className={style.botaoPagamento}
                onClick={handleConfirmPayment}
                disabled={isProcessing}
            >
                {isProcessing ? "Processando..." : "Processar Pagamento"}
            </button>

            {confirmationDetails && (
                <>
                    <div className={style.modalOverlay} onClick={closeModal}></div>
                    <div className={style.confirmationCard}>
                        <h2>Detalhes da Confirmação</h2>
                        <p><strong>Quarto:</strong> {nomeQuarto}</p>
                        <p><strong>Cidade:</strong> {cidade}</p>
                        <p><strong>Estado:</strong> {estado}</p>
                        <p><strong>Valor Total:</strong> R${preco}</p>

                        <button
                            className={style.botaoPagamento}
                            onClick={handlePayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processando..." : "Confirmar Pagamento"}
                        </button>
                    </div>
                </>
            )}
            </div>
        </div>
    );
};

export default Pagamento;