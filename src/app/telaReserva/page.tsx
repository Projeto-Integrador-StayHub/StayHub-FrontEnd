"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import style from "./page.module.scss";
import Imagem from "@/app/telaReserva/a.jpeg";

const RoomReservation = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const images = [Imagem, Imagem, Imagem];

    const searchParams = useSearchParams();
    const roomId = searchParams.get("id"); // pega o id do quarto da URL

    const [quarto, setQuarto] = useState<any>(null);

    useEffect(() => {
        if (roomId) {
            fetchQuarto(roomId);
        }
    }, [roomId]);

    const fetchQuarto = async (id: string) => {
        try {
            const response = await fetch(`https://localhost:7274/api/Quarto/ListarQuartos?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                setQuarto(data);
            } else {
                console.error("Erro ao obter dados do quarto:", response.statusText);
            }
        } catch (error) {
            console.error("Erro na requisição do quarto:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            moveSlide(1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const moveSlide = (step: number) => {
        setSlideIndex((prevIndex) => {
            const newIndex = prevIndex + step;
            if (newIndex >= images.length) return 0; 
            if (newIndex < 0) return images.length - 1; 
            return newIndex;
        });
    };

    return (
        <div className={style.container}>
            <h1 className={style.title}>Reserva de Quarto</h1>

            <div className={style.carouselContainer} style={{ position: "relative", overflow: "hidden" }}>
                <div
                    className={style.carousel}
                    style={{
                        display: "flex",
                        transition: "transform 0.5s ease-in-out",
                        transform: `translateX(-${slideIndex * 100}%)`,
                    }}
                >
                    {images.map((image, index) => (
                        <div key={index} className={style.carouselItem} style={{ Width: "100%" }}>
                            <Image
                                src={image}
                                alt={`Imagem ${index + 1}`}
                                width={250}  
                                height={250}  
                            />
                        </div>
                    ))}
                </div>
                <button
                    className={style.prev}
                    onClick={() => moveSlide(-1)}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "2px",
                        transform: "translateY(-50%)",
                        background: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        border: "none",
                        padding: "10px"
                    }}
                >
                    &#10094;
                </button>
                <button
                    className={style.next}
                    onClick={() => moveSlide(1)}
                    style={{
                        position: "absolute",
                        top: "50%",
                        right: "2px",
                        transform: "translateY(-50%)",
                        background: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        border: "none",
                        padding: "10px"
                    }}
                >
                    &#10095;
                </button>
            </div>

            {quarto ? (
                <>
                    <div className={style.info}>
                        <p><strong>Nome do Quarto:</strong> {quarto.nomeQuarto}</p>
                        <p><strong>Quantidade de cômodos:</strong> {quarto.capacidadePessoas}</p>
                        <p><strong>Localização:</strong> {quarto.endereco} - {quarto.cidade}/{quarto.estado}</p>
                        <p><strong>Preço por noite:</strong> R$ {quarto.preco}</p>
                        <p><strong>Forma de pagamento:</strong> Cartão de Crédito, Pix, Dinheiro</p>
                    </div>

                    <div className={style.description}>
                        <p><strong>Descrição do Quarto:</strong> {quarto.descricao}</p>
                        <p><strong>Contato:</strong> (44) 99999-9999</p>
                    </div>

                    <div className={style.rating}>
                        <p><strong>Avaliação:</strong> ⭐⭐⭐⭐☆ (4/5)</p>
                    </div>

                    <div className={style.map}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=..."
                            width="100%"
                            height="300"
                            style={{ border: "0" }}
                            loading="lazy"
                            title="Localização"
                        ></iframe>
                    </div>
                </>
            ) : (
                <p>Carregando dados do quarto...</p>
            )}
        </div>
    );
};

export default RoomReservation;