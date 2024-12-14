"use client";
import Image from "next/image";
import style from "../../app/telaAnuncio/page.module.scss";
import imageLogo from "../image/imagemFundo.png";
import { useState } from "react";

export default function TelaAnuncio() {
    const [form, setIsForm] = useState(false);
    const [isCadastro, setIsCadastro] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // Estados para os campos de formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [senha, setSenha] = useState("");

    // Função para salvar o dono
    const salvarDono = async () => {
        const dados = {
            nome,
            email,
            senha,
            telefone,
            cpf,
            nascimento: nascimento || "2000-01-01", // Substitua por uma data válida
            endereco: "Endereço Exemplo" // Adicione ou remova conforme a necessidade da API
        };
    
        console.log("Dados enviados para a API:", dados); // Depuração para verificar os dados
    
        try {
            const response = await fetch("http://localhost:5057/api/DonoHotel/CriarDono", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log("Dono salvo com sucesso:", result);
            } else {
                const errorData = await response.json();
                console.error("Erro ao salvar dono:", errorData);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    const loginDono = async () => {
        try {
            const response = await fetch("http://localhost:5057/api/DonoHotel/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password: senha,
                    twoFactorCode: null,
                    twoFactorRecoveryCode: null,
                }),
            });
    
            if (response.ok) {
                const dadosDono = await response.json();
              
                setErrorMessage("Login realizado com sucesso!");
                console.log("Usuário autenticado:", dadosDono);
            } else {
                const error = await response.json();
                setErrorMessage(error.message || "Erro ao realizar login");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setErrorMessage("Não foi possível conectar ao servidor.");
        }
    };
   
    return (
        <main>
            <div id={style.container}>
                <div className={style.left}>
                    <a href="/">
                        <Image src={imageLogo} alt="perfil" className={style.fundo} />
                    </a>
                </div>

                <div className={style.right}>
                    <h1 className={style.tituloPrincipal}>Deseja anunciar quartos ou pousadas?</h1>
                    <h3 className={style.titulo}>Anuncie agora no StayHub</h3>

                    {!form && (
                        <div className={style.botãoContinuar}>
                            <button className={style.continuar} onClick={() => setIsForm(true)}>
                                Continuar
                            </button>
                        </div>
                    )}

                    {form && !isCadastro && (
                        <div className={style.formulario}>
                            <h2 className={style.tituloFormulario}>Entrar</h2>
                            <div className={style.campo}>
                                <label>E-mail: </label>
                                <input
                                    type="email"
                                    className={style.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={style.campo}>
                                <label>Senha: </label>
                                <input
                                    type="password"
                                    className={style.input}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>

                            <div className={style.buttonEntrar}>
                                <button className={style.mainButton} onClick={loginDono}>
                                    Entrar
                                </button>
                            </div>
                            <div className={style.trocaForm} onClick={() => setIsCadastro(true)}>
                                Não possui um cadastro? <span className={style.entreCadastre}>Cadastre-se</span>
                            </div>
                        </div>
                    )}

                    {form && isCadastro && (
                        <div className={style.formulario}>
                            <h2 className={style.tituloFormulario}>Cadastre-se</h2>
                            <div className={style.campo}>
                                <label>Nome Completo: </label>
                                <input
                                    type="text"
                                    className={style.input}
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>

                            <div className={style.campo}>
                                <label>Telefone: </label>
                                <input
                                    type="text"
                                    className={style.input}
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                />
                            </div>

                            <div className={style.campo}>
                                <label>CPF: </label>
                                <input
                                    type="text"
                                    className={style.input}
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                />
                            </div>

                            <div className={style.campo}>
                                <label>E-mail: </label>
                                <input
                                    type="email"
                                    className={style.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className={style.campo}>
                                <label>Senha: </label>
                                <input
                                    type="password"
                                    className={style.input}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>

                            <div className={style.buttonEntrar}>
                                <button className={style.mainButton} onClick={salvarDono}>
                                    Cadastrar
                                </button>
                            </div>
                            <div className={style.trocaForm} onClick={() => setIsCadastro(false)}>
                                Já possui um cadastro? <span className={style.entreCadastre}>Entre</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
