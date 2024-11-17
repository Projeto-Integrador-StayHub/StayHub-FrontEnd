"use client";
import Image from "next/image";
import perfilLogo from "@/app/icon/perfilLogo.svg";
import logo from "@/app/icon/logo.svg";
import menu from "@/app/icon/menu.svg";
import buscar from "@/app/icon/pesquisar.svg";
import style from "@/app/page.module.scss";
import { useEffect, useState } from "react";

export default function TelaInicial() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<"login" | "cadastro" | null>(null);
  const [tipoQuarto, setTipoQuarto] = useState("single");
  const [preco, setPreco] = useState(0);
  const [qtdCamas, setQtdCamas] = useState(1);
  const [classificacaoMinima, setClassificacaoMinima] = useState(0);
  const [hoteisFiltrados, setHoteisFiltrados] = useState<any[]>([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCardOpen = (cardType: "login" | "cadastro") => {
    setActiveCard(cardType);
    setIsOpen(false);
  };

  const handleCardClose = () => setActiveCard(null);

  // Simulando dados de hotéis para o exemplo
  const hoteis = [
    { id: 1, nome: "Hotel Exemplo 1", localizacao: "São Paulo", preco: 200, tipo: "single", camas: 1, classificacao: 4 },
    { id: 2, nome: "Hotel Exemplo 2", localizacao: "Rio de Janeiro", preco: 300, tipo: "double", camas: 2, classificacao: 5 },
    { id: 3, nome: "Hotel Exemplo 3", localizacao: "Curitiba", preco: 150, tipo: "suite", camas: 1, classificacao: 3 },
  ];

  useEffect(() => {
    const filtrarHoteis = hoteis.filter(hotel => {
      const precoValido = preco === 0 || hotel.preco <= preco; 
      const tipoQuartoValido = tipoQuarto === "single" || hotel.tipo === tipoQuarto; 
      const camasValidas = hotel.camas >= qtdCamas; 
      const classificacaoValida = hotel.classificacao >= classificacaoMinima; 
  

      return precoValido && tipoQuartoValido && camasValidas && classificacaoValida;
    });
  

    setHoteisFiltrados(filtrarHoteis);
  }, [preco, tipoQuarto, qtdCamas, classificacaoMinima]);


  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace("R$", "").trim();
    setPreco(parseFloat(valor) || 0); // Converte para número diretamente
  };

  return (
    <main>
      {/* Container Header */}
      <div id={style.containerHeader}>
        <div className={style.header}>
          <div className={style.logo}>
            <Image src={logo} alt="logo" className={style.logo} />
          </div>

          <div className={style.anuncioProprietario}>
          <a href="/telaAnuncio">
            <button className={style.buttonAnucio}>Anuncie seu espaço no StayHub</button></a>
      
            <div className={style.filtroPesquisa}>
              <div className={style.campoPesquisa} key="onde">
                <label>Onde</label>
                <input type="text" placeholder="Buscar destinos" />
              </div>
              <div className={style.campoPesquisa} key="checkin">
                <label>Check-in</label>
                <input type="text" placeholder="Insira as datas" />
              </div>
              <div className={style.campoPesquisa} key="checkout">
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
              <Image src={menu} alt="menu" width={30} height={25} className={style.menuIcon} />
              <Image src={perfilLogo} alt="perfil" width={40} height={35} className={style.perfil} />
            </button>
            {isOpen && (
              <div className={style.menuInterativo}>
                <div className={style.menu}>
                  <div onClick={() => handleCardOpen("login")} className={style.menuItem}>Entrar</div>
                  <div onClick={() => handleCardOpen("cadastro")} className={style.menuItem}>Cadastrar</div>
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
                          <input type="email" className={style.input} />
                        </div>
                        <div className={style.campo}>
                          <label>Senha: </label>
                          <input type="password" className={style.input} />
                        </div>
                      </div>
                      <button className={style.mainButton}>Entrar</button>
                      <div className={style.divider}>ou</div>
                      <div className={style.linkEntrarCadastro}>
                        Ainda não possui conta? <span onClick={() => setActiveCard("cadastro")} className={style.link}>Cadastre-se</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>Cadastre-se </h2>
                      <h3>Crie sua conta no StayHub</h3>
                      <div className={style.cardBody}>
                        <div className={style.campo}>
                          <label>Nome Completo: </label>
                          <input type="text" className={style.input} />
                        </div>
                        <div className={style.campo}>
                          <label>E-mail: </label>
                          <input type="email" className={style.input} />
                        </div>
                        <div className={style.campo}>
                          <label>Telefone: </label>
                          <input type="text" className={style.input} />
                        </div>
                        <div className={style.campo}>
                          <label>CPF: </label>
                          <input type="text" className={style.input} />
                        </div>
                        <div className={style.campo}>
                          <label>Data de Nascimento: </label>
                          <input type="date" className={style.input} />
                        </div>
                        <div className={style.campo}>
                          <label>Senha: </label>
                          <input type="password" className={style.input} />
                        </div>
                      </div>
                      <button className={style.mainButton}>Cadastrar</button>
                      <div className={style.divider}>ou</div>
                      <div className={style.linkEntrarCadastro}>
                        Já tem uma conta? <span onClick={() => setActiveCard("login")} className={style.link}>Entrar</span>
                      </div>
                    </>
                  )}
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

          <div className={style.containerTipoQuarto}>
            <label>Tipo de Quarto</label>
            <select value={tipoQuarto} onChange={(e) => setTipoQuarto(e.target.value)}>
              <option value="single">Solteiro</option>
              <option value="double">Casal</option>
              <option value="suite">Suíte</option>
            </select>
          </div>

          <div className={style.containerPreco}>
            <label>Valor em Reais</label>
            <input
              type="text"
              value={formatarValor(preco)}
              onChange={handlePrecoChange}
              placeholder="Digite o valor"
            />
          </div>

          <div className={style.containerQtdCamas}>
            <label>Quantidade de Camas</label>
            <input
              type="number"
              value={qtdCamas}
              onChange={(e) => setQtdCamas(Number(e.target.value))}
              min="1"
            />
          </div>

          <div className={style.containerClassificacao}>
            <label>Classificação Mínima</label>
            <select value={classificacaoMinima} onChange={(e) => setClassificacaoMinima(Number(e.target.value))}>
              <option value="0">Todas</option>
              <option value="1">1 estrela</option>
              <option value="2">2 estrelas</option>
              <option value="3">3 estrelas</option>
              <option value="4">4 estrelas</option>
              <option value="5">5 estrelas</option>
            </select>
          </div>
        </aside>

        <section className={style.resultados}>
          <h2>Resultados da Busca</h2>

          {hoteisFiltrados.length > 0 ? (
            hoteisFiltrados.map(hotel => (
              <div key={hotel.id} className={style.cardHotel}>
                <Image src="/hotel-exemplo.jpg" alt={hotel.nome} width={200} height={150} />
                <div className={style.informacoesHotel}>
                  <h3>{hotel.nome}</h3>
                  <p>Localização: {hotel.localizacao}</p>
                  <p>Preço: {formatarValor(hotel.preco)}/noite</p>
                </div>
              </div>
            ))
          ) : (
            <p className={style.nenhumResultado}>Nenhum hotel encontrado com os filtros aplicados.</p>
          )}
        </section>
      </div>
    </main >
  );
}
