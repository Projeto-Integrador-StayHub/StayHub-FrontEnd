"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import style from "../../app/listaDeQuartos/page.module.scss";

type QuartoData = {
    id: number;
    nomeQuarto: string;
    descricao: string;
    preco: number;
    capacidadePessoas: number;
    disponibilidade: boolean;
    comodidades: string;
    endereco: string;
    estado: string;
    cidade: string;
    donoId: number;
    image: string | null;
};

export default function ListaDeQuartos() {
    const [quartos, setQuartos] = useState<QuartoData[]>([]);

    useEffect(() => {
        const fetchQuartos = async () => {
            try {
                const response = await fetch("https://localhost:7274/api/Quarto/ListarQuartos");

                const data = await response.json();

                if (data.status && data.dados) {
                    setQuartos(data.dados);
                } else {
                    console.error("Erro ao buscar os quartos:", data.mensagem || "Resposta inválida");
                }
            } catch (error) {
                console.error("Erro ao realizar a requisição:", error);
            }
        };

        fetchQuartos();
    }, []);

    const deleteQuarto = async (id: number) => {
        try {
            const response = await fetch(`https://localhost:7274/api/Quarto/ExcluirQuarto/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setQuartos(quartos.filter((quarto) => quarto.id !== id));
            } else {
                console.error("Erro ao excluir o quarto.");
            }
        } catch (error) {
            console.error("Erro ao realizar a requisição de exclusão:", error);
        }
    };

    const editarQuarto = async (id: number) => {
        try {
            const quartoToEdit = quartos.find((quarto) => quarto.id === id);

            if (!quartoToEdit) {
                console.error("Quarto não encontrado.");
                return;
            }

            const formData = new FormData();
            formData.append("id", quartoToEdit.id.toString());
            formData.append("nomeQuarto", quartoToEdit.nomeQuarto || "");
            formData.append("descricao", quartoToEdit.descricao || "");
            formData.append("preco", quartoToEdit.preco ? quartoToEdit.preco.toString() : "0");
            formData.append("capacidadePessoas", quartoToEdit.capacidadePessoas ? quartoToEdit.capacidadePessoas.toString() : "0");
            formData.append("disponibilidade", quartoToEdit.disponibilidade ? quartoToEdit.disponibilidade.toString() : "false");
            formData.append("comodidades", quartoToEdit.comodidades || "");
            formData.append("endereco", quartoToEdit.endereco || "");
            formData.append("estado", quartoToEdit.estado || "");
            formData.append("cidade", quartoToEdit.cidade || "");
            formData.append("donoId", quartoToEdit.donoId ? quartoToEdit.donoId.toString() : "0");

            if (quartoToEdit.image) {
                const imageBlob = await fetch(quartoToEdit.image).then((res) => res.blob());
                formData.append("image", imageBlob, "image.jpg");
            }

            const response = await fetch(`https://localhost:7274/api/Quarto/EditarQuarto/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                const updatedQuarto = await response.json();
                setQuartos((prevQuartos) =>
                    prevQuartos.map((quarto) => (quarto.id === id ? { ...quarto, ...updatedQuarto } : quarto))
                );
            } else {
                const errorData = await response.json();
                console.error("Erro ao editar o quarto:", errorData);
            }
        } catch (error) {
            console.error("Erro ao realizar a requisição de edição:", error);
        }
    };

    return (
        <div className={style.container}>
            <h2 className={style.seusAnuncios}>Seus Anúncios:</h2>
            <div className={style.quartosList}>
                {quartos.map((quarto, index) => (
                    <div className={style.listQuarto} key={quarto.id}>
                        <div className={style.imageContainer}>
                            <Image
                                src={quarto.image || "/images/default-room.jpg"}
                                alt={`Quarto ${index + 1}`}
                                width={150}
                                height={150}
                                priority
                                className={style.image}
                            />
                        </div>

                        <div className={style.infoContainer}>
                            <p className={style.campo}><strong className={style.nomeCampo}>Nome:</strong> {quarto.nomeQuarto}</p>
                            <p className={style.campo}><strong className={style.nomeCampo}>Endereço:</strong> {quarto.endereco}</p>
                            <p className={style.campo}><strong className={style.nomeCampo}>Cidade:</strong> {quarto.cidade}</p>
                            <p className={style.campo}><strong className={style.nomeCampo}>Capacidade:</strong> {quarto.capacidadePessoas}</p>
                            <p className={style.campo}><strong className={style.nomeCampo}>Estado:</strong> {quarto.estado}</p>
                            <p className={style.campo}><strong className={style.nomeCampo}>Preço:</strong> R$ {quarto.preco}</p>
                            <p className={style.campo}><strong className={style.nomeCampo}>Disponível:</strong> {quarto.disponibilidade ? 'Sim' : 'Não'}</p>

                            <button onClick={() => editarQuarto(quarto.id)} className={style.editarButton}>
                                Editar
                            </button>
                            <button onClick={() => deleteQuarto(quarto.id)} className={style.deleteButton}>
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
