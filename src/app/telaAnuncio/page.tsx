
import Image from "next/image";
import style from "../../app/telaAnuncio/page.module.scss";

export default function TelaAnuncio() {
    return (
        <main>
           <div id={style.container}>
                <div className={style.left}></div>
                <div className={style.right}></div>

           </div>
        </main>
    );
}
