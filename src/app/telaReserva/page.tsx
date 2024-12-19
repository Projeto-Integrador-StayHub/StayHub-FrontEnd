"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import style from "./page.module.scss";
import Imagem from "@/app/telaReserva/a.jpeg";

const RoomReservation = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const images = [Imagem, Imagem, Imagem];

    const searchParams = useSearchParams();
    const roomId = useMemo(() => searchParams.get("id"), []);

    const [quarto, setQuarto] = useState<any>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (roomId) {
            fetchQuarto();
        }
    }, [roomId]);

    const fetchQuarto = useCallback(async () => {
        try {
            const response = await fetch(`https://localhost:7274/api/Quarto/BuscarQuartoId/${roomId}`);
            const data = await response.json();
            const dados = data.dados;

            if (dados.cidade && dados.estado) {
                const geocodeResponse = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                        `${dados.cidade}, ${dados.estado}`
                    )}&key=AIzaSyDj6VdgOwBD9nyoOk0kIQxGT4vMCg-7kkA`
                );
                const geocodeData = await geocodeResponse.json();
                if (geocodeData.results && geocodeData.results.length > 0) {
                    const location = geocodeData.results[0].geometry.location;
                    setCoordinates({ lat: location.lat, lng: location.lng });
                }
            }
            console.log(dados);
            setQuarto({
                nomeQuarto: dados.nomeQuarto || "Não disponível",
                capacidadePessoas: dados.capacidadePessoas || "Não especificado",
                endereco: dados.endereco || "",
                cidade: dados.cidade || "",
                estado: dados.estado || "",
                preco: dados.preco || null,
                comodidades: dados.comodidades || "Não especificado",
                disponibilidade: dados.disponibilidade || false,
                descricao: dados.descricao || "Sem descrição",
                dono: dados.dono || { nome: "Não informado", telefone: "(44) 99999-9999" },
            });
        } catch (error) {
            console.error("Erro na requisição do quarto:", error);
        }
    }, [roomId]);

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

            <div className={style.carouselContainer}>
                <div
                    className={style.carousel}
                    style={{
                        display: "flex",
                        transition: "transform 0.5s ease-in-out",
                        transform: `translateX(-${slideIndex * 100}%)`,
                    }}
                >
                    {images.map((image, index) => (
                        <div key={index} className={style.carouselItem}>
                            <Image src={image} alt={`Imagem ${index + 1}`} width={250} height={250} />
                        </div>
                    ))}
                </div>
            </div>

            {quarto ? (
                <>
                    <div className={style.info}>
                        <p><strong>Nome do Quarto:</strong> {quarto.nomeQuarto}</p>
                        <p><strong>Capacidade de Pessoas:</strong> {quarto.capacidadePessoas}</p>
                        <p><strong>Localização:</strong> 
                            {quarto.endereco && quarto.cidade && quarto.estado
                                ? `${quarto.endereco}, ${quarto.cidade} - ${quarto.estado}`
                                : "Localização não informada"}
                        </p>
                        <p><strong>Preço por noite:</strong> R$ {quarto.preco ? quarto.preco.toFixed(2) : "Não informado"}</p>
                        <p><strong>Comodidades:</strong> {quarto.comodidades}</p>
                    </div>

                    <div className={style.mapContainer}>
                        <h2>Localização no Mapa</h2>
                        {coordinates ? (
                            <LoadScript googleMapsApiKey="AIzaSyDj6VdgOwBD9nyoOk0kIQxGT4vMCg-7kkA">
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: "100%",
                                        height: "400px",
                                    }}
                                    center={coordinates}
                                    zoom={14}
                                >
                                    <Marker position={coordinates} />
                                </GoogleMap>
                            </LoadScript>
                        ) : (
                            <p>Carregando mapa...</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Carregando dados do quarto...</p>
            )}
        </div>
    );
};

export default RoomReservation;
