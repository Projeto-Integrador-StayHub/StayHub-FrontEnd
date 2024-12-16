"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import style from "../../app/listaDeQuartos/page.module.scss";

type QuartoData = {
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
                const response = await fetch("http://localhost:5057/api/Quarto/ListarQuartos");
                const data = await response.json();

                if (data.status) {
                    setQuartos(data.dados); // Assuming 'dados' contains the list of rooms
                } else {
                    console.error("Erro ao buscar os quartos:", data.mensagem);
                }
            } catch (error) {
                console.error("Erro ao realizar a requisição:", error);
            }
        };

        fetchQuartos();
    }, []);

    return (
        <div className={style.container}>
            <h2 className={style.seusAnuncios}>Seus Anúncios:</h2>
            <div className={style.quartosList}>
                {quartos.map((quarto, index) => (
                    <div className={style.listQuarto} key={index}>
                        {quarto.image && (
                            <Image
                                src={quarto.image}
                                alt={`Quarto ${index + 1}`}
                                width={300}
                                height={250}
                            />
                        )}
                        <p><strong>Nome:</strong> {quarto.nomeQuarto}</p>
                        <p><strong>Descrição:</strong> {quarto.descricao}</p>
                        <p><strong>Preço:</strong> {quarto.preco}</p>
                        <p><strong>Disponível:</strong> {quarto.disponibilidade ? 'Sim' : 'Não'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
