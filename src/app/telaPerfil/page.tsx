"use client";
import Image from "next/image";
import style from "../../app/telaPerfil/page.module.scss";
import logo from "@/app/icon/logo.svg";
import { useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import fotoPerfil from "../image/foto.png";
import edit from "../icon/edit.svg";
import logout from "../icon/logout.svg";

export default function TelaPerfil() {
  const [image, setImage] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const imageAccept: Accept = {
    "image/png": [],
    "image/jpeg": [],
    "image/jpg": [],
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: imageAccept,
    onDrop,
  });

  return (
    <div className={style.pageWrapper}>
     
      <div className={style.header}>
        <a href="/">
          <Image src={logo} alt="logo" className={style.logo} />
        </a>
        <button className={style.logoutButton}>
            <Image src={logout} alt="sair" className={style.logout} />
        </button>
      </div>

      
      <div className={style.container}>
        
        <div className={style.leftColumn}>
          <div {...getRootProps()} className={style.areaFoto}>
            <Image
              src={image || fotoPerfil}
              alt="foto de perfil"
              className={style.perfilImagem}
              width={200}
              height={200}
            />
            <input {...getInputProps()} className={style.inputFile} />
          </div>
          <h2 className={style.userName}>Nome do Usuário</h2>
        </div>

        
        <div className={style.rightColumn}>
          {["Nome Completo", "E-mail", "Telefone", "CPF"].map((label, index) => (
            <div className={style.formGroup} key={index}>
              <label className={style.label}>{label}:</label>
              <div className={style.inputContainer}>
                <input
                  type="text"
                  placeholder={label}
                  className={style.input}
                />
                <button className={style.editButton}>
                  <Image src={edit} alt="editar" />
                </button>
              </div>
              
            </div>
          ))}
              <div className={style.containerButton}>
                    <button className={style.buttonSave}>Salvar Alterações</button>
              </div>
        </div>
      </div>
    </div>
  );
}
