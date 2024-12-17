"use client";
import Image from "next/image";
import perfilLogo from "@/app/icon/perfilLogo.svg";
import logo from "@/app/icon/logo.svg";
import menu from "@/app/icon/menu.svg";
import buscar from "@/app/icon/pesquisar.svg";
import style from "@/app/page.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TelaInicial() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<"login" | "cadastro" | null>(null);

  // Filtros
  const [nomeQuarto, setNomeQuarto] = useState("");
  const [precoMinimo, setPrecoMinimo] = useState<number | null>(null);
  const [precoMaximo, setPrecoMaximo] = useState<number | null>(null);
  const [capacidadePessoas, setCapacidadePessoas] = useState<number | null>(null);
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [hoteisFiltrados, setHoteisFiltrados] = useState<any[]>([]);
  const [isLogged, setIsLogged] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dados de cadastro/login
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [senha, setSenha] = useState("");

  const router = useRouter();

  // Função para salvar um novo hóspede
  const salvarHospede = async () => {
    const dados = {
      nome,
      email,
      senha,
      telefone,
      nascimento,
      cpf,
      endereco: "Endereço Exemplo"
    };

    try {
      const response = await fetch("https://localhost:7274/api/Hospede/CriarHospede", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        setErrorMessage("Cadastro realizado com sucesso!");
        setActiveCard(null);
      } else {
        setErrorMessage("Erro ao cadastrar. Dados incorretos");
      }
    } catch (error) {
      console.error("Erro na requisição de cadastro:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCardOpen = (cardType: "login" | "cadastro") => {
    setActiveCard(cardType);
    setIsOpen(false);
  };

  const handleCardClose = () => setActiveCard(null);

  // Função para buscar todos os hotéis (listagem inicial)
  const buscarHoteis = async () => {
    try {
      const response = await fetch("https://localhost:7274/api/Quarto/ListarQuartos", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setHoteisFiltrados(data.dados || []);
      } else {
        console.error("Erro na resposta da API:", response.statusText);
        setErrorMessage("Erro ao buscar hotéis.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Erro ao buscar hotéis.");
    }
  };

  // Carrega todos os hotéis ao montar o componente
  useEffect(() => {
    buscarHoteis();
  }, []);

  const loginHospede = async () => {
    try {
      const response = await fetch("https://localhost:7274/api/Hospede/login", {
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
        const dadosUsuario = await response.json();
        setIsLogged(true);
        setErrorMessage("Login realizado com sucesso!");
        setActiveCard(null);
        //router.push("/telaPerfil");
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao realizar login");
      }
    } catch (error) {
      console.error("Erro na requisição de login:", error);
      setErrorMessage("Não foi possível conectar ao servidor.");
    }
  };

  const logout = () => {
    setIsLogged(false);
    setIsOpen(false);
    setEmail("");
    setSenha("");
    setErrorMessage(null);
    router.push("/");
  };

  // Função para aplicar filtros
  const aplicarFiltros = async () => {
    const params = new URLSearchParams();

    if (nomeQuarto) params.append("NomeQuarto", nomeQuarto);
    if (precoMinimo !== null && !isNaN(precoMinimo)) params.append("PrecoMinimo", precoMinimo.toString());
    if (precoMaximo !== null && !isNaN(precoMaximo)) params.append("PrecoMaximo", precoMaximo.toString());
    if (capacidadePessoas !== null && !isNaN(capacidadePessoas)) params.append("CapacidadePessoas", capacidadePessoas.toString());
    if (cidade) params.append("Cidade", cidade);
    if (estado) params.append("Estado", estado);

    const url = `https://localhost:7274/filtros/filtroQuarto?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setHoteisFiltrados(data.dados || []);
      } else {
        console.error("Erro na resposta da API de filtros:", response.statusText);
        setErrorMessage("Erro ao buscar hotéis filtrados.");
      }
    } catch (error) {
      console.error("Erro na requisição de filtros:", error);
      setErrorMessage("Erro ao buscar hotéis filtrados.");
    }
  };

  const handlePrecoMinimoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseFloat(e.target.value) || 0;
    setPrecoMinimo(valor);
  };

  const handlePrecoMaximoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseFloat(e.target.value) || 0;
    setPrecoMaximo(valor);
  };

  const handleCapacidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseInt(e.target.value, 10);
    setCapacidadePessoas(isNaN(valor) ? null : valor);
  };

  return (
    <main>
      {/* Container Header */}
      <div id={style.containerHeader}>
        <div className={style.header}>
          <div className={style.logo}>
            <a href="/"><Image src={logo} alt="logo" className={style.logo} /></a>
          </div>

          <div className={style.anuncioProprietario}>
            <a href="/telaAnuncio">
              <button className={style.buttonAnucio}>Anuncie seu espaço no StayHub</button>
            </a>

            <div className={style.filtroPesquisa}>
              <div className={style.campoPesquisa}>
                <label>Onde</label>
                <input type="text" placeholder="Buscar destinos" />
              </div>
              <div className={style.campoPesquisa}>
                <label>Check-in</label>
                <input type="text" placeholder="Insira as datas" />
              </div>
              <div className={style.campoPesquisa}>
                <label>Checkout</label>
                <input type="text" placeholder="Insira as datas" />
              </div>
              <button className={style.botaoBusca}>
                <Image src={buscar} alt="buscar" className={style.buscar} width={30} height={30} />
              </button>
            </div>
          </div>

          <div className={style.perfilUsuario}>
            <button className={style.perfilButton} onClick={toggleMenu}>
              <Image src={perfilLogo} alt="perfil" width={40} height={35} className={style.perfil} />
              <Image src={menu} alt="menu" width={30} height={25} className={style.menuIcon} />
            </button>
            {isOpen && (
              <div className={style.menuInterativo}>
                <div className={style.menu}>
                  {isLogged ? (
                    <>
                      <div className={style.menuItem}>
                        <a href="/telaPerfil">Meu Perfil</a>
                      </div>
                      <div className={style.menuItem}>Minhas Reservas</div>
                      <div className={style.menuItem} onClick={logout}>Sair</div>
                    </>
                  ) : (
                    <>
                      <div onClick={() => handleCardOpen("login")} className={style.menuItem}>Entrar</div>
                      <div onClick={() => handleCardOpen("cadastro")} className={style.menuItem}>Cadastrar</div>
                    </>
                  )}
                </div>
              </div>
            )}
            {activeCard && (
              <>
                <div className={style.overlay} onClick={handleCardClose}></div>
                <div className={style.card}>
                  <button className={style.closeButton} onClick={handleCardClose}>✕</button>
                  {activeCard === "login" ? (
                    <>
                      <h2>Entrar</h2>
                      <h3>Bem-vindo ao StayHub</h3>
                      <div className={style.cardBody}>
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
                        <button className={style.mainButton} onClick={loginHospede}>Entrar</button>
                      </div>
                      <div className={style.divider}>ou</div>
                      <div className={style.linkEntrarCadastro}>
                        Ainda não possui conta? <span onClick={() => setActiveCard("cadastro")} className={style.link}>Cadastre-se</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>Cadastre-se</h2>
                      <h3>Crie sua conta no StayHub</h3>
                      <div className={style.cardBody}>
                        <div className={style.campo}>
                          <label>Nome Completo: </label>
                          <input type="text" className={style.input} value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className={style.campo}>
                          <label>E-mail: </label>
                          <input type="email" className={style.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={style.campo}>
                          <label>Telefone: </label>
                          <input type="text" className={style.input} value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                        </div>
                        <div className={style.campo}>
                          <label>CPF: </label>
                          <input type="text" className={style.input} value={cpf} onChange={(e) => setCpf(e.target.value)} />
                        </div>
                        <div className={style.campo}>
                          <label>Data de Nascimento: </label>
                          <input type="date" className={style.input} value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
                        </div>
                        <div className={style.campo}>
                          <label>Senha: </label>
                          <input type="password" className={style.input} value={senha} onChange={(e) => setSenha(e.target.value)} />
                        </div>
                      </div>
                      <button className={style.mainButton} onClick={salvarHospede}>Cadastrar</button>
                      <div className={style.divider}>ou</div>
                      <div className={style.linkEntrarCadastro}>
                        Já tem uma conta? <span onClick={() => setActiveCard("login")} className={style.link}>Entrar</span>
                      </div>
                    </>
                  )}
                  {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Corpo da Página */}
      <div className={style.containerBody}>
        {/* Filtros Laterais */}
        <aside className={style.filtros}>
          <h2>Filtros</h2>

          <div>
            <label>Nome do Quarto</label>
            <input
              type="text"
              value={nomeQuarto}
              onChange={(e) => setNomeQuarto(e.target.value)}
              placeholder="Ex: Suite Master"
            />
          </div>

          <div>
            <label>Preço Mínimo</label>
            <input
              type="number"
              value={precoMinimo ?? ""}
              onChange={handlePrecoMinimoChange}
              placeholder="Ex: 100"
            />
          </div>

          <div>
            <label>Preço Máximo</label>
            <input
              type="number"
              value={precoMaximo ?? ""}
              onChange={handlePrecoMaximoChange}
              placeholder="Ex: 500"
            />
          </div>

          <div>
            <label>Capacidade de Pessoas</label>
            <input
              type="number"
              value={capacidadePessoas ?? ""}
              onChange={handleCapacidadeChange}
              placeholder="Ex: 2"
            />
          </div>

          <div>
            <label>Cidade</label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: São Paulo"
            />
          </div>

          <div>
            <label>Estado</label>
            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="Ex: SP"
            />
          </div>

          <button onClick={aplicarFiltros}>Filtrar</button>
        </aside>

        <section className={style.resultados}>
          <h2>Resultados da Busca</h2>

          {hoteisFiltrados && hoteisFiltrados.length > 0 ? (
            hoteisFiltrados.map((quarto) => (
              <div key={quarto.id} className={style.cardHotel}>
                <Image
                  src={quarto.imagem ? `data:image/jpeg;base64,${quarto.imagem}` : "/hotel-exemplo.jpg"}
                  alt={quarto.nomeQuarto}
                  width={200}
                  height={150}
                  style={{ objectFit: "cover" }}
                />
                <div className={style.informacoesHotel}>
                  <p>{quarto.nomeQuarto}</p>
                  <p>Endereço: {quarto.endereco}</p>
                  <p>Preço: R$ {quarto.preco}/noite</p>
                </div>
              </div>
            ))
          ) : (
            <p className={style.nenhumResultado}>Nenhum hotel encontrado.</p>
          )}
        </section>
      </div>
    </main>
  );
}