"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import style from "./page.module.scss";
import Imagem from "@/app/telaReserva/quarto-casal-com-vista.jpg";
import { Container } from "postcss";
import logo from "@/app/icon/logo.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const RoomReservation = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const images = [Imagem, Imagem, Imagem];

    const searchParams = useSearchParams();
    const roomId = useMemo(() => searchParams.get("id"), []);

    const [quarto, setQuarto] = useState<any>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const router = useRouter();
    const [isReserving, setIsReserving] = useState(false);
    const [mostrarMais, setMostrarMais] = useState(false);

    const [checkIn, SetCheckIn] = useState<Date | null>(null);
    const [checkOut, SetCheckOut] = useState<Date | null>(null);
    const [totalNoite, SetTotalNoite] = useState(0);

    useEffect(() => {
        if (checkIn && checkOut) {
            const nights = Math.ceil(
                (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
            );
            SetTotalNoite(nights > 0 ? nights : 0);
        }
    }, [checkIn, checkOut]);

    const toggleMostrarMais = () => {
        setMostrarMais((prev) => !prev);
    };

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
        if (!checkIn || !checkOut) {
            alert("Por favor, selecione as datas de check-in e check-out.");
            return;
        }
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
        <main>
            <div id={style.containerHeader}>
                <div id={style.containerHeader}>
                    <div className={style.header}>
                        <div className={style.logo}>
                            <button className={style.buttonLogo} onClick={() => router.push("/")}>
                                <Image src={logo} alt="logo" className={style.logo} />
                            </button>
                        </div>

                        <div className={style.anuncioProprietario}>
                            <a href="/telaAnuncio">
                                <button className={style.buttonAnucio}>Anuncie seu espaço no StayHub</button>
                            </a>

                        </div>
                    </div>
                </div>
            </div>

            <div className={style.container}>
                {quarto && ( //imagem
                    <div className={style.carouselContainer}>
                        <div className={style.carousel}>
                            {images.map((image, index) => (
                                <div key={index} className={style.carouselItem}>
                                    <Image src={image} alt={`Imagem ${index + 1}`} width={450} height={400} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={style.tituloReserva}>
                    {quarto && quarto.comodidades ? (  //titulo
                        <div className={style.info}>
                            <div className={style.titulo}>{quarto.nomeQuarto}</div>
                        </div>
                    ) : null}
                    {quarto && (
                        <div className={style.info}>
                            <div className={style.capacidade}>{quarto.capacidadePessoas} Hospedes - </div>
                            <div className={style.comodidades}>  {quarto.comodidades}</div>
                        </div>
                    )}

                    {quarto && (
                        <div className={style.infoContainer}>
                            <div className={style.cardPreco}>
                                <p className={style.preco}>
                                    <strong>Preço por Noite: </strong>R${quarto.preco || "0"} / noite
                                </p>

                                <div className={style.filtroPesquisa}>
                                    <div className={style.campoPesquisa}>
                                        <label>Check-in</label>
                                        <DatePicker
                                            selected={checkIn}
                                            onChange={(date) => SetCheckIn(date)}
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()}
                                            placeholderText="Selecione o check-in"
                                        />
                                    </div>

                                    <div className={style.campoPesquisa}>
                                        <label>Check-out</label>
                                        <DatePicker
                                            selected={checkOut}
                                            onChange={(date) => SetCheckOut(date)}
                                            dateFormat="dd/MM/yyyy"
                                            minDate={checkIn || new Date()}
                                            placeholderText="Selecione o check-out"
                                        />
                                    </div>
                                </div>
                                <div className={style.tituloPreco}>Preço total:</div>
                                <div className={style.noites}>
                                    <span>
                                        R${quarto.preco} x {totalNoite} noites
                                    </span>
                                    <span className={style.valorFinal}>
                                        R${(quarto.preco * totalNoite).toFixed(2)}
                                    </span>
                                </div>

                                <button className={style.buttonReservar} onClick={handleReserve} >
                                    Reservar
                                </button>
                            </div>
                        </div>
                    )}
                </div>


                {quarto && (
                    <div className={style.cardInfo}>
                        <h2 className={style.descricao}>Descrição do Espaço:</h2>
                        <div className={style.sobre}>
                            {mostrarMais ? quarto.descricao : quarto.descricao.substring(0, 250) + (quarto.descricao.length > 250 ? "..." : "")}
                        </div>
                        {quarto.descricao.length > 250 && (
                            <button className={style.botaoMostrar} onClick={toggleMostrarMais}>
                                {mostrarMais ? "Mostrar menos" : "Mostrar mais"}
                            </button>
                        )}
                    </div>
                )}

                {quarto && coordinates && (
                    <div className={style.mapContainer}>
                        <h2>Localização no Mapa</h2>
                        <LoadScript googleMapsApiKey="AIzaSyApLqskijIdC0LJz8obm6-Xx7j4axkEbLI">
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


        </main>
    );
};

export default RoomReservation;





