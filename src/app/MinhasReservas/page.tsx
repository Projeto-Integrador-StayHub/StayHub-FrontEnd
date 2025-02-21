"use client";
import { useState } from "react";
import style from "../../app/minhasReservas/page.module.scss";

interface Reserva {
  id: number;
  nome: string;
  entrada: string;
  saida: string;
  preco: number;
  status: number;
  pagamentoStatus: number;
  hospedeId?: number;
  quartoId?: number;
}

export default function MinhasReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: 1,
      nome: "Hotel Exemplo 1",
      entrada: "2025-03-01T10:00:00.000Z",
      saida: "2025-03-05T10:00:00.000Z",
      preco: 350,
      status: 1,
      pagamentoStatus: 1,
      hospedeId: 0,
      quartoId: 0,
    },
    {
      id: 2,
      nome: "Hotel Exemplo 2",
      entrada: "2025-04-10T14:00:00.000Z",
      saida: "2025-04-15T12:00:00.000Z",
      preco: 500,
      status: 0,
      pagamentoStatus: 0,
      hospedeId: 0,
      quartoId: 0,
    },
    {
      id: 3,
      nome: "Hotel Exemplo 3",
      entrada: "2025-05-20T16:00:00.000Z",
      saida: "2025-05-25T11:00:00.000Z",
      preco: 450,
      status: 1,
      pagamentoStatus: 0,
      hospedeId: 0,
      quartoId: 0,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [novaEntrada, setNovaEntrada] = useState("");
  const [novaSaida, setNovaSaida] = useState("");

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    const ano = data.getUTCFullYear();
    const mes = data.getUTCMonth(); // 0 = Janeiro
    const dia = data.getUTCDate();
    return new Date(ano, mes, dia).toLocaleDateString("pt-BR");
  };

  const cancelarReserva = async (id: number) => {
    if (confirm("Deseja realmente cancelar a reserva?")) {
      try {
        const response = await fetch(`/api/Reserva/EditarReserva/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: 2 }),
        });
        if (response.ok) {
          const data = await response.json();
          const reservaAtualizada = data.dados[0];
          setReservas((prev) =>
            prev.map((reserva) =>
              reserva.id === id ? { ...reserva, ...reservaAtualizada } : reserva
            )
          );
        } else {
          alert("Erro ao cancelar a reserva.");
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao conectar com a API.");
      }
    }
  };

  const abrirModalEditar = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    const entradaDate = reserva.entrada.split("T")[0];
    const saidaDate = reserva.saida.split("T")[0];
    setNovaEntrada(entradaDate);
    setNovaSaida(saidaDate);
    setShowModal(true);
  };
  const salvarEdicao = async () => {
    if (selectedReserva) {
      try {
        const payload = {
          hospedeId: selectedReserva.hospedeId || 0,
          quartoId: selectedReserva.quartoId || 0,
          nome: selectedReserva.nome,
          entrada: new Date(novaEntrada + "T00:00:00.000Z").toISOString(),
          saida: new Date(novaSaida + "T00:00:00.000Z").toISOString(),
          preco: selectedReserva.preco,
          pagamentoStatus: selectedReserva.pagamentoStatus,
        };

        const response = await fetch(`/api/Reserva/EditarReserva/${selectedReserva.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const data = await response.json();
          const reservaAtualizada = data.dados[0];
          setReservas((prev) =>
            prev.map((reserva) =>
              reserva.id === selectedReserva.id ? { ...reserva, ...reservaAtualizada } : reserva
            )
          );
        } else {
          alert("Erro ao atualizar a reserva.");
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao conectar com a API.");
      }
    }
    setShowModal(false);
    setSelectedReserva(null);
  };

  return (
    <main className={style.reservationsPage}>
      <h2 className={style.pageTitle}>Minhas Reservas</h2>
      <div className={style.cardsContainer}>
        {reservas.map((reserva) => (
          <div key={reserva.id} className={style.cardReserva}>
            <div className={style.cardHeader}>
              <h3>{reserva.nome}</h3>
            </div>

            <div className={style.cardBody}>
              <div className={style.cardColumn}>
                <p>
                  <strong>Entrada:</strong> {formatarData(reserva.entrada)}
                </p>
                <p>
                  <strong>Saída:</strong> {formatarData(reserva.saida)}
                </p>
                <p>
                  <strong>Preço:</strong> R$ {reserva.preco}
                </p>
              </div>
              <div className={style.cardColumn}>
                <p>
                  <strong>Status:</strong>{" "}
                  {reserva.status === 1
                    ? "Confirmada"
                    : reserva.status === 2
                    ? "Cancelada"
                    : "Pendente"}
                </p>
                <p>
                  <strong>Pagamento:</strong>{" "}
                  {reserva.pagamentoStatus === 1 ? "Pago" : "Pendente"}
                </p>
                <p>
                  <strong>ID Reserva:</strong> {reserva.id}
                </p>
              </div>
            </div>

            <div className={style.cardFooter}>
              <button onClick={() => abrirModalEditar(reserva)} disabled={reserva.status === 2}>
                Editar
              </button>
              {reserva.status !== 2 && (
                <button onClick={() => cancelarReserva(reserva.id)}>Cancelar</button>
              )}
            </div>

            {reserva.status === 2 && (
              <div className={style.canceladoOverlay}>
                <span>Reserva Cancelada</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Editar Datas</h3>
            <label>
              Data de Entrada:
              <input
                type="date"
                value={novaEntrada}
                onChange={(e) => setNovaEntrada(e.target.value)}
              />
            </label>
            <label>
              Data de Saída:
              <input
                type="date"
                value={novaSaida}
                onChange={(e) => setNovaSaida(e.target.value)}
              />
            </label>
            <div className={style.modalActions}>
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
