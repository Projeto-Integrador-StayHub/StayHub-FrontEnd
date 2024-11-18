"use client";
import Image from "next/image";
import style from "../../app/telaAnuncio/page.module.scss";
import imageLogo from "../image/imagemFundo.png";
import { useState } from "react";

export default function TelaAnuncio() {
    const [form, setIsForm] = useState(false);
    const [isCadastro, setIsCadastro] = useState(false);

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
            const response = await fetch("https://localhost:7274/api/DonoHotel/CriarDono", {
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
        const dadosLogin = { email, senha };
    
        try {
            // Criando a query string com os parâmetros
            const url = new URL("https://localhost:7274/api/DonoHotel/ListarDonos");
            url.searchParams.append("email", dadosLogin.email);
            url.searchParams.append("senha", dadosLogin.senha);
    
            // Fazendo a requisição GET
            const response = await fetch(url, {
                method: "GET", // Método GET
                headers: {
                    "Content-Type": "application/json", // Isso pode ser removido, já que não há corpo
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log("Login realizado com sucesso", result);
                // Aqui você pode salvar o token ou as informações do usuário no estado ou localStorage
            } else {
                console.error("Erro ao fazer login", response.statusText);
                alert("E-mail ou senha incorretos");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar realizar login");
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
