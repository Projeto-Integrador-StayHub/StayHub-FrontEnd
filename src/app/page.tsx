import Image from "next/image";
import perfilLogo from "@/app/icon/perfilLogo.svg";
import logo from "@/app/icon/logo.svg";
import buscar from "@/app/icon/pesquisar.svg";

import style from "@/app/page.module.scss";

export default function TelaInicial() {
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
                <input type="text" placeholder="Insira as datas"/>
              </div>
              <button className={style.botaoBusca}>  <Image src={buscar} alt="buscar" className={style.buscar}  width={30} height={30}/> </button>
            </div>
          </div>

          <div className={style.perfilUsuario}>
            <button className={style.perfilButton}>
              <Image src={perfilLogo} alt="perfil" width={40} height={35} className={style.perfil} />
            </button>
          </div>
        </div>
      </div>
      
      {/* espaço para o body */}
    </main>
  );
}
