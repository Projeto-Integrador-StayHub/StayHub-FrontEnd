"use client";

import { useState } from 'react';
import Image from "next/image";
import perfilLogo from "@/app/icon/perfilLogo.svg";
import logo from "@/app/icon/logo.svg";
import buscar from "@/app/icon/pesquisar.svg";
import style from "@/app/page.module.scss";

export default function TelaInicial() {

  // Estados para os filtros
  const [tipoQuarto, setTipoQuarto] = useState("single");
  const [preco, setPreco] = useState(500);
  const [qtdCamas, setQtdCamas] = useState(1);
  const [classificacaoMinima, setClassificacaoMinima] = useState(0); // Novo estado para a classificação mínima

  // Exemplo de dados dos hotéis (substitua por dados reais ou de API)
  const hoteis = [
    { id: 1, nome: "Hotel Exemplo", localizacao: "Cidade Exemplo", preco: 200, tipo: "single", camas: 1, classificacao: 3 },
    { id: 2, nome: "Hotel Premium", localizacao: "Cidade Premium", preco: 500, tipo: "double", camas: 2, classificacao: 5 },
    // Adicione mais hotéis conforme necessário
  ];

  // Função para formatação de valor monetário em reais
  const formatarValor = (valor) => {
    return valor
      .toFixed(2) // Garante duas casas decimais
      .replace('.', ',') // Substitui o ponto por vírgula
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona ponto como separador de milhar
  };

  // Função para tratar a mudança no valor
  const handlePrecoChange = (e) => {
    let valor = e.target.value.replace(/[^\d,]/g, ''); // Remove qualquer coisa que não seja número ou vírgula
    valor = valor.replace(',', '.'); // Converte a vírgula para ponto para que o número seja entendido corretamente
    const precoFormatado = parseFloat(valor);
    setPreco(isNaN(precoFormatado) ? 0 : precoFormatado);
  };

  // Função para filtrar hotéis com base nos estados dos filtros
  const hoteisFiltrados = hoteis.filter(hotel => {
    return (
      (tipoQuarto === "" || hotel.tipo === tipoQuarto) &&
      hotel.preco <= preco &&
      hotel.camas >= qtdCamas &&
      hotel.classificacao >= classificacaoMinima // Filtra por classificação mínima
    );
  });

  return (
    <main>
      {/* Container Header */}
      <div id={style.containerHeader}>
        <div className={style.header}>
          <div className={style.logo}>
            <Image src={logo} alt="logo" className={style.logo} />
          </div>

          <div className={style.anuncioProprietario}>
            <button className={style.buttonAnucio}>Anuncie seu espaço no StayHub</button>
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
            <button className={style.perfilButton}>
              <Image src={perfilLogo} alt="perfil" width={40} height={35} className={style.perfil} />
            </button>
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
              value={`R$ ${formatarValor(preco)}`}
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

        {/* Lista de Resultados */}
        <section className={style.resultados}>
          <h2>Pontos turísticos mais acessados</h2>

          {/* Renderização dos hotéis filtrados */}
          {hoteisFiltrados.length > 0 ? (
            hoteisFiltrados.map(hotel => (
              <div key={hotel.id} className={style.cardHotel}>
                <Image src="/hotel-exemplo.jpg" alt={hotel.nome} width={200} height={150} />
                <div className={style.informacoesHotel}>
                  <h3>{hotel.nome}</h3>
                  <p>Localização: {hotel.localizacao}</p>
                  <p>Preço: R$ {formatarValor(hotel.preco)}/noite</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum hotel encontrado com os filtros selecionados.</p>
          )}

          {hoteisFiltrados.length > 0 ? (
            hoteisFiltrados.map(hotel => (
              <div key={hotel.id} className={style.cardHotel}>
                <Image src="/hotel-exemplo.jpg" alt={hotel.nome} width={200} height={150} />
                <div className={style.informacoesHotel}>
                  <h3>{hotel.nome}</h3>
                  <p>Localização: {hotel.localizacao}</p>
                  <p>Preço: R$ {formatarValor(hotel.preco)}/noite</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum hotel encontrado com os filtros selecionados.</p>
          )}
          {hoteisFiltrados.length > 0 ? (
            hoteisFiltrados.map(hotel => (
              <div key={hotel.id} className={style.cardHotel}>
                <Image src="/hotel-exemplo.jpg" alt={hotel.nome} width={200} height={150} />
                <div className={style.informacoesHotel}>
                  <h3>{hotel.nome}</h3>
                  <p>Localização: {hotel.localizacao}</p>
                  <p>Preço: R$ {formatarValor(hotel.preco)}/noite</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum hotel encontrado com os filtros selecionados.</p>
          )}
          {hoteisFiltrados.length > 0 ? (
            hoteisFiltrados.map(hotel => (
              <div key={hotel.id} className={style.cardHotel}>
                <Image src="/hotel-exemplo.jpg" alt={hotel.nome} width={200} height={150} />
                <div className={style.informacoesHotel}>
                  <h3>{hotel.nome}</h3>
                  <p>Localização: {hotel.localizacao}</p>
                  <p>Preço: R$ {formatarValor(hotel.preco)}/noite</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum hotel encontrado com os filtros selecionados.</p>
          )}
          {hoteisFiltrados.length > 0 ? (
            hoteisFiltrados.map(hotel => (
              <div key={hotel.id} className={style.cardHotel}>
                <Image src="/hotel-exemplo.jpg" alt={hotel.nome} width={200} height={150} />
                <div className={style.informacoesHotel}>
                  <h3>{hotel.nome}</h3>
                  <p>Localização: {hotel.localizacao}</p>
                  <p>Preço: R$ {formatarValor(hotel.preco)}/noite</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum hotel encontrado com os filtros selecionados.</p>
          )}
        </section>
      </div>
    </main>
  );
}
