"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
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
    const router = useRouter();
    const [isReserving, setIsReserving] = useState(false);
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
    const handleReserve = async () => {
        if (!quarto) return;
    
        setIsReserving(true);
    
        try {
            const response = await fetch("https://localhost:7274/api/Reserva/CriarReserva", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hospedeId: 1,
                    nome: quarto.nomeQuarto || "",
                    descricao: quarto.descricao || "Sem descrição",
                    preco: quarto.preco || 0,
                    status: 0,
                    pagamentoStatus: 0,
                    quartoId: roomId,
                    cidade: quarto.cidade,
                    estado: quarto.estado,
                }),
            });
    
            const data = await response.json();
    
            // Log para identificar onde está o ID da reserva
            console.log("Resposta da API (CriarReserva):", data);
    
            // Aqui, ajustamos de acordo com o retorno da API
            const reservaId = data.dados?.[0]?.id || null; // Supondo que o ID está no primeiro item do array 'dados'
    
            console.log("Reserva ID retornado:", reservaId);
            if (!reservaId) {
                alert("Erro: reservaId não foi retornado corretamente pela API.");
                return;
            }
    
            const query = new URLSearchParams({
                id: reservaId.toString(),
                nomeQuarto: quarto.nomeQuarto || "",
                preco: quarto.preco?.toString() || "0",
                cidade: quarto.cidade || "",
                estado: quarto.estado || "",
            }).toString();
    
            router.push(`/telaPagamento?${query}`);
        } catch (error) {
            console.error("Erro ao processar reserva:", error);
            alert("Erro ao processar a reserva. Tente novamente mais tarde.");
        } finally {
            setIsReserving(false);
        }
    };
    
    
    
    return (
        <div className={style.container}>
            {/* <h1 className={style.title}>Reserva de Quarto</h1> */}
            {quarto && quarto.comodidades ? (
                <p className={style.titulo}>{quarto.nomeQuarto}</p>
            ) : null}

            {quarto && (
                <div className={style.carouselContainer}>
                    <div className={style.carousel}>
                        {images.map((image, index) => (
                            <div key={index} className={style.carouselItem}>
                                <Image src={image} alt={`Imagem ${index + 1}`} width={450} height={400} />
                            </div>
                        ))}
                    </div>
                </div>
            )};


            {quarto && (
                <div className={style.infoContainer}>
                    <div className={style.cardPreco}>
                        <p className={style.preco}>
                            <strong>Preço por Noite: </strong>R${quarto.preco || "0"} / noite
                        </p>
                        <button className={style.buttonReservar} onClick={handleReserve}>
                            Reservar
                        </button>
                    </div>
                </div>
            )}

            {quarto && (
                <div className={style.cardInfo}>
                    <h2>Informações gerais:</h2>
                    <p><strong>Capacidade de Pessoas:</strong> {quarto.capacidadePessoas}</p>
                    <p><strong>Endereço:</strong> {quarto.endereco}</p>
                    <p><strong>Cidade:</strong> {quarto.cidade}</p>
                    <p><strong>Estado:</strong> {quarto.estado}</p>
                    <p><strong>Comodidade:</strong>{quarto.comodidades}</p>
                </div>
            )}

            {quarto && coordinates && (
                <div className={style.mapContainer}>
                    <h2>Localização no Mapa</h2>
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
                </div>
            )}
        </div>
    );
};

export default RoomReservation;