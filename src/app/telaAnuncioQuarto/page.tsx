"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "../../app/telaAnuncioQuarto/page.module.scss";
import fotoQuarto from "@/app/image/fotoQuarto.png";
import logo from "@/app/icon/logo.svg";
import menu from "@/app/icon/menu.svg";

export default function TelaAnuncioQuarto() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState({
        nomeQuarto: "",
        descricao: "",
        preco: 0,
        capacidadePessoas: 0,
        disponibilidade: true,
        comodidades: "",
        endereco: "",
        estado: "",
        cidade: "",
        donoId: 1,
        image: null as string | null, 
    });
    const [errors, setErrors] = useState<string[]>([]);

    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleImageClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setFormData({ ...formData, image: reader.result as string });
                };
                reader.readAsDataURL(file); // Converte para base64
            }
        };
        input.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const newValue =
            type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? Number(value) : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const validateForm = () => {
        const newErrors: string[] = [];
        if (!formData.nomeQuarto) newErrors.push("O campo Nome do Quarto é obrigatório.");
        if (!formData.descricao) newErrors.push("O campo Descrição é obrigatório.");
        if (!formData.preco) newErrors.push("O campo Preço é obrigatório.");
        if (!formData.capacidadePessoas) newErrors.push("O campo Capacidade de Pessoas é obrigatório.");
        if (!formData.cidade) newErrors.push("O campo Cidade é obrigatório.");
        if (!formData.estado) newErrors.push("O campo Estado é obrigatório.");
        if (!formData.endereco) newErrors.push("O campo Endereço é obrigatório.");
        if (!formData.comodidades) newErrors.push("O campo Comodidades é obrigatório.");
        if (!formData.image) newErrors.push("A imagem do quarto é obrigatória.");
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Adiciona os campos de texto
            formDataToSend.append('nomeQuarto', formData.nomeQuarto);
            formDataToSend.append('descricao', formData.descricao);
            formDataToSend.append('preco', formData.preco.toString());
            formDataToSend.append('capacidadePessoas', formData.capacidadePessoas.toString());
            formDataToSend.append('disponibilidade', formData.disponibilidade.toString());
            formDataToSend.append('comodidades', formData.comodidades);
            formDataToSend.append('endereco', formData.endereco);
            formDataToSend.append('estado', formData.estado);
            formDataToSend.append('cidade', formData.cidade);
            formDataToSend.append('donoId', formData.donoId.toString());

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await fetch('https://localhost:7274/api/Quarto/CriarQuarto', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).join(", ");
                    alert(`Erro de validação: ${errorMessages}`);
                } else {
                    alert(`Erro desconhecido: ${errorData.title || "Erro desconhecido"}`);
                }

                console.error("Erro no servidor:", errorData);
                return;
            }

            const data = await response.json();

            alert("Quarto cadastrado com sucesso!");

            setFormData({
                nomeQuarto: "",
                descricao: "",
                preco: 0,
                capacidadePessoas: 0,
                disponibilidade: true,
                comodidades: "",
                endereco: "",
                estado: "",
                cidade: "",
                donoId: 1,
                image: null,
            });

            setStep(1);
        } catch (error) {
            alert("Erro ao conectar ao servidor. Verifique se a API está online.");
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
                                <Image src={fotoQuarto} alt="Clique para selecionar imagem" width={450} height={350} priority />
                            )}
                        </div>
                        <button className={style.button} onClick={() => setStep(3)}>Continuar</button>
                    </div>
                )}

                {step === 3 && (
                    <div className={style.step3}>
                        <h2 className={style.tituloInicial}>Preencha as informações do quarto</h2>
                        {errors.length > 0 && (
                            <div className={style.errorMessages}>
                                {errors.map((error, index) => (
                                    <p key={index} className={style.errorMessage}>{error}</p>
                                ))}
                            </div>
                        )}
                        {/* Inputs de formulário */}
                        <label className={style.campoNomes}>Nome do Quarto:</label>
                        <input name="nomeQuarto" placeholder="Nome do Quarto" value={formData.nomeQuarto} onChange={handleInputChange} className={style.input} />
                        <label className={style.campoNomes}>Descrição: </label>
                        <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleInputChange} className={style.input} />
                        <label className={style.campoNomes}>Preço: </label>
                        <input name="preco" type="number" placeholder="Preço" value={formData.preco} onChange={handleInputChange} className={style.input} />
                        <label className={style.campoNomes}>Cidade: </label>
                        <input name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleInputChange} className={style.input} />
                        <label className={style.campoNomes}>Estado: </label>
                        <input name="estado" placeholder="Estado" value={formData.estado} onChange={handleInputChange} className={style.input} />
                        <label className={style.campoNomes}>Endereço: </label>
                        <input name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleInputChange} className={style.input} />
                        <label className={style.campoNomes}>Capacidade de pessoas:</label>
                        <input name="capacidadePessoas" type="number" placeholder="Capacidade de pessoas" value={formData.capacidadePessoas} onChange={handleInputChange} className={style.input} />
                        <label className={style.campoNomes}>Comodidades:</label>
                        <input name="comodidades" placeholder="Comodidades" value={formData.comodidades} onChange={handleInputChange} className={style.input} />
                        <label className={style.campoNomes}>Disponibilidade:</label>
                        <input name="disponibilidade" type="checkbox" checked={formData.disponibilidade} onChange={handleInputChange} className={style.checkbox} />
                        <button onClick={handleSubmit} className={style.button}>Criar Quarto</button>
                    </div>
                )}
            </main>
        </div>
    );
}
