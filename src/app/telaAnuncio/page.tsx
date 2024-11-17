"use client"
import Image from "next/image";
import style from "../../app/telaAnuncio/page.module.scss";
import imageLogo from "../image/imagemFundo.png"
import { useState } from "react";
export default function TelaAnuncio() {
    const [form, setIsForm] = useState(false);
    const [isCadastro, setIsCadastro] = useState(false);

    
    
    return (
        <main>
           <div id={style.container}>
                <div className={style.left}> 
                    <a href="/"><Image src={imageLogo} alt="perfil" className={style.fundo} /></a>
                    
                </div>
                
                <div className={style.right}>
                    <h1 className={style.tituloPrincipal}>Deseja anunciar quartos ou pousadas?</h1>
                    <h3 className={style.titulo}>Anucie agora no StayHub</h3>
                {!form && (
                    <div className={style.botãoContinuar}>
                        <button className={style.continuar} onClick={() => setIsForm(true)} > Continuar</button>
                    </div>
                )}
                {form && !isCadastro &&( 
                    <div className={style.formulario}>
                        <h2 className={style.tituloFormulario}>Entrar</h2>
                            <div className={style.campo}>
                                <label>E-mail: </label>
                                <input type="email" className={style.input} />
                            </div>
                        <div className={style.campo}>
                            <label>Senha: </label>
                            <input type="password" className={style.input} />
                        </div>

                        <div className={style.buttonEntrar}>
                            <button className={style.mainButton}>Entrar</button>
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
                            <input type="text" className={style.input} />
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
                            <label>E-mail: </label>
                            <input type="email" className={style.input} />
                        </div>

                        <div className={style.campo}>
                            <label>Senha: </label>
                            <input type="password" className={style.input} />
                        </div>

                        <div className={style.buttonEntrar}>
                            <button className={style.mainButton}>Cadastrar</button>
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
