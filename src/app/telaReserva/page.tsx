"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import style from "../../app/telaReserva/page.module.scss";
import Imagem from "@/app/telaReserva/a.jpeg";

const RoomReservation = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const images = [Imagem, Imagem, Imagem];

    useEffect(() => {
        const interval = setInterval(() => {
            moveSlide(1);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const moveSlide = (step) => {
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


            <div className={style.info}>
                <p><strong>Quantidade de cômodos:</strong> 3</p>
                <p><strong>Localização:</strong> Rua Exemplo, nº 123, Bairro Centro</p>
                <p><strong>Preço por noite:</strong> R$ 150,00</p>
                <p><strong>Forma de pagamento:</strong> Cartão de Crédito, Pix, Dinheiro</p>
            </div>

            <div className={style.description}>
                <p><strong>Descrição do Inquilino:</strong> Quarto mobiliado, com ótima iluminação natural, ideal para estudantes ou profissionais.</p>
                <p><strong>Contato:</strong> (44) 99999-9999</p>
            </div>

            <div className={style.rating}>
                <p><strong>Avaliação:</strong> ⭐⭐⭐⭐☆ (4/5)</p>
            </div>

            <div className={style.map}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=... (seu link do Google Maps)"
                    width="100%"
                    height="300"
                    style={{ border: "0" }}
                    loading="lazy"
                    title="Localização"
                ></iframe>
            </div>
        </div>
    );
};

export default RoomReservation;
