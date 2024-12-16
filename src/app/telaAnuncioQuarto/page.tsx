"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "../../app/telaAnuncioQuarto/page.module.scss";
import fotoQuarto from "@/app/image/fotoQuarto.png";
import logo from "@/app/icon/logo.svg";
import menu from "@/app/icon/menu.svg";

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

export default function TelaAnuncioQuarto() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<QuartoData>({
        nomeQuarto: "",
        descricao: "",
        preco: 0,
        capacidadePessoas: 0,
        disponibilidade: true,
        comodidades: "",
        endereco: "",
        estado: "",
        cidade: "",
        donoId: 0,
        image: null,
    });

    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleImageClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                setFormData({ ...formData, image: imageUrl });
            }
        };
        input.click();
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const newValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : type === "number"
                ? Number(value)
                : value;

        setFormData({ ...formData, [name]: newValue });
    };
    const handleSubmit = async () => {
        // Verificação simples para garantir que os campos obrigatórios estão preenchidos
        if (!formData.nomeQuarto || !formData.descricao || !formData.preco || !formData.capacidadePessoas || !formData.cidade || !formData.estado || !formData.endereco) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }
    
        // Verificação para garantir que o preço e a capacidade de pessoas sejam números positivos
        if (formData.preco <= 0) {
            alert("O preço deve ser um valor positivo.");
            return;
        }
    
        if (formData.capacidadePessoas <= 0) {
            alert("A capacidade de pessoas deve ser um valor positivo.");
            return;
        }
    
        const response = await fetch('http://localhost:7274/api/Quarto/CriarQuarto', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nomeQuarto: formData.nomeQuarto,
                descricao: formData.descricao,
                preco: formData.preco,
                capacidadePessoas: formData.capacidadePessoas,
                disponibilidade: formData.disponibilidade,
                comodidades: formData.comodidades,
                endereco: formData.endereco,
                estado: formData.estado,
                cidade: formData.cidade,
                donoId: formData.donoId,
            }),
        });
    
        const data = await response.json(); // Para obter a resposta da API
        console.log(data);  // Verifique a resposta da API
    
        if (response.ok) {
            console.log('Quarto cadastrado com sucesso!');
            alert('Quarto cadastrado com sucesso!');
            setFormData({
                nomeQuarto: "",
                descricao: "",
                preco: 0 ,
                capacidadePessoas: 0,
                disponibilidade: true,
                comodidades: "",
                endereco: "",
                estado: "",
                cidade: "",
                donoId: 0,
                image: null,
            });
            setStep(1);
        } else {
            alert('Erro ao cadastrar o quarto. Tente novamente.');
        }
    };
    
    const handleMenuClick = (route: string) => {
        router.push(route);
    };

    return (
        <div className={style.container}>
            <header className={style.header}>
                <div className={style.logoMenu}>
                    <Image src={logo} alt="Logo" className={style.logo} />
                </div>
                <div>
                    <button className={style.menuButton} onClick={toggleMenu}>
                        <Image src={menu} alt="Menu" className={style.menuIcon} />
                    </button>
                </div>
                {isOpen && (
                    <div className={style.menuDropdown}>
                        <div className={style.menu}>
                            <div className={style.menuItem} onClick={() => handleMenuClick("/perfil")}>Meu Perfil</div>
                            <div className={style.menuItem} onClick={() => handleMenuClick("/listaDeQuartos")}>Meus Anúncios</div>
                        </div>
                    </div>
                )}
            </header>

            <main className={style.mainContent}>
                {step === 1 && (
                    <div className={style.step1}>
                        <h2 className={style.tituloInicial}>Quer fazer uma reserva?</h2>
                        <button className={style.button} onClick={() => setStep(2)}>Começar</button>
                    </div>
                )}

                {step === 2 && (
                    <div className={style.step2}>
                        <h2 className={style.tituloInicial}>Envie uma imagem do quarto</h2>
                        <div className={style.imageWrapper} onClick={handleImageClick}>
                            {formData.image ? (
                                <Image src={formData.image} alt="Prévia" width={450} height={350} />
                            ) : (
                                <Image src={fotoQuarto} alt="Clique para selecionar imagem" width={450} height={350} priority  />
                            )}
                        </div>
                        <button className={style.button} onClick={() => setStep(3)}>Continuar</button>
                    </div>
                )}

                {step === 3 && (
                    <div className={style.step3}>
                        <h2 className={style.tituloInicial}>Preencha as informações do quarto</h2>
                        <form>
                            <label className={style.campoNomes}>Nome do Quarto:</label>
                            <input
                                name="nomeQuarto"
                                placeholder="Nome do Quarto"
                                value={formData.nomeQuarto}
                                onChange={handleInputChange}
                                className={style.input}
                            />
                            <label className={style.campoNomes}>Descrição: </label>
                            <textarea
                                name="descricao"
                                placeholder="Descrição"
                                value={formData.descricao}
                                onChange={handleInputChange}
                                className={style.input}
                            />
                            <label className={style.campoNomes}>Preço: </label>
                            <input
                                name="preco"
                                type="number"
                                placeholder="Preço"
                                value={formData.preco}
                                onChange={handleInputChange}
                                className={style.input}
                            />
                            <label className={style.campoNomes}>Cidade: </label>
                            <input
                                name="cidade"
                                placeholder="Cidade"
                                value={formData.cidade}
                                onChange={handleInputChange}
                                className={style.input}
                            />
                            <label className={style.campoNomes}>Estado: </label>
                            <input
                                name="estado"
                                placeholder="Estado"
                                value={formData.estado}
                                onChange={handleInputChange}
                                className={style.input}
                            />

                            <label className={style.campoNomes}>Endereço: </label>
                            <input
                                name="endereco"
                                placeholder="Endereço"
                                value={formData.endereco}
                                onChange={handleInputChange}
                                className={style.input}
                            />
                            <label className={style.campoNomes}>Capacidade de Pessoas: </label>
                            <input
                                name="capacidadePessoas"
                                placeholder="Capacidade de Pessoas"
                                value={formData.capacidadePessoas}
                                onChange={handleInputChange}
                                className={style.input}
                            />

                            <label className={style.campoNomes}>Comodidades: </label>
                            <textarea
                                name="comodidades"
                                placeholder="Comodidades"
                                value={formData.comodidades}
                                onChange={handleInputChange}
                                className={style.input}
                            />

                            <label className={style.campoNomes}>
                                Disponibilidade:
                                <input
                                    name="disponibilidade"
                                    type="checkbox"
                                    checked={formData.disponibilidade}
                                    onChange={handleInputChange}
                                    className={style.input}
                                />
                            </label>
                        </form>
                        <button className={style.button} onClick={() => setStep(4)}>Continuar</button>
                    </div>
                )}

                {step === 4 && (
                    <div className={style.step4}>
                        <h2 className={style.resumo}>Resumo do Anúncio:</h2>
                        {formData.image && (
                            <Image src={formData.image} alt="Prévia" width={300} height={150} />
                        )}
                        <p><strong>Nome do Quarto: </strong> {formData.nomeQuarto}</p>
                        <p><strong>Descrição: </strong> {formData.descricao}</p>
                        <p><strong>Preço: </strong> {formData.preco}</p>
                        <p><strong>Cidade: </strong> {formData.cidade}</p>
                        <p><strong>Estado: </strong> {formData.estado}</p>
                        <p><strong>Endereço: </strong> {formData.endereco}</p>
                        <p><strong>Capacidade: </strong> {formData.capacidadePessoas}</p>
                        <p><strong>Comodidade: </strong> {formData.comodidades}</p>
                        <button className={style.button} onClick={handleSubmit}>Finalizar</button>
                    </div>
                )}
            </main>
        </div>
    );
}
