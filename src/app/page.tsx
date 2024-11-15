"use client"
import Image from "next/image";
import perfilLogo from "@/app/icon/perfilLogo.svg";
import logo from "@/app/icon/logo.svg";
import menu from "@/app/icon/menu.svg";
import buscar from "@/app/icon/pesquisar.svg";
import style from "@/app/page.module.scss";
import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';


export default function TelaInicial() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState< "login" | "cadastro" | null>(null); 


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCardOpen = (cardType: "login" | "cadastro") => {
    setActiveCard(cardType);
    setIsOpen(false);
  } 

  const handleCardClose = () => setActiveCard(null);

  return (
    <main>
      {/* container header */}
      <div id={style.containerHeader}>
        <div className={style.header}>
          <div className={style.logo}>
            <Image src={logo} alt="logo" className={style.logo} />
          </div>

          <div className={style.anuncioProprietario}>
            <button className={style.buttonAnucio}>Anuncie seu espaço no StayHub</button>
      
            <div className={style.filtroPesquisa}>
              <div className={style.campoPesquisa} key="onde">
                <label>Onde</label>
                <input type="text" placeholder="Buscar destinos" />
              </div>
              <div className={style.campoPesquisa} key="checkin">
                <label>Check-in</label>
                <input type="text" placeholder="Insira as datas"/>
              </div>
              <div className={style.campoPesquisa} key="checkout">
                <label>Checkout</label>
                <input type="text" placeholder="Insira as datas"/>
              </div>
              <button className={style.botaoBusca}>  <Image src={buscar} alt="buscar" className={style.buscar}  width={30} height={30}/> </button>
            </div>
          </div>

          <div className={style.perfilUsuario}>
            <button className={style.perfilButton} onClick={toggleMenu}>
              <Image src={menu} alt="menu" width={30} height={25} className={style.menuIcon} />
              <Image src={perfilLogo} alt="perfil" width={40} height={35} className={style.perfil} />
              
            </button>
              <div className={style.menuInterativo}>
              {isOpen && (
                <div className={style.menu}>
                  <div onClick={() => handleCardOpen('login')} className={style.menuItem}>Entrar</div>
                  <div onClick={() => handleCardOpen('cadastro')}className={style.menuItem}>Cadastrar</div>
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
                                <label className={style.campoName}>E-mail: </label>
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
      </div>
      
      {/* espaço para o body */}
    </main>
  );
}
