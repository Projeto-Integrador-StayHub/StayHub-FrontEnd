"use client";
import Image from "next/image";
import style from "../../app/telaPerfil/page.module.scss";
import logo from "@/app/icon/logo.svg";
import { useState, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import fotoPerfil from "../image/foto.png";
import edit from "../icon/edit.svg";
import logout from "../icon/logout.svg";

const validateCPF = (cpf: string) => {
  const regex = /^\d{11}$/;
  return regex.test(cpf);
};

const validatePhone = (phone: string) => {
  const regex = /^\(\d{2}\)\d{1}\s\d{4}-\d{4}$/;
  return regex.test(phone);
};

const validateBirthDate = (date: string) => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(date);
};

const formatBirthDate = (date: string) => {
  const cleaned = date.replace(/\D/g, "");
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 4) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  }
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
};

export default function TelaPerfil() {
  const [image, setImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para a mensagem de sucesso

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

  const fetchUserData = async () => {
    try {
      const idHospede = "id"; //PROBLEMA EM TRAZER O ID DO HOSPEDE tem q fazer um requisicao do user atual
      const response = await fetch(`https://localhost:7274/api/Hospede/BuscarHospede/${idHospede}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário');
      }
  
      const text = await response.text();
      
      if (!text) {
        throw new Error('Resposta vazia recebida');
      }
  
      const data = JSON.parse(text);
  
      if (data.status) {
        setUserData(data.dados[0]); 
      } else {
        console.error('Erro: ' + data.mensagem);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEdit = (field: string) => {
    console.log(`Editar campo: ${field}`);
  };

  const handleSave = async () => {
    let valid = true;
    const newErrors: any = {};

    // Validando CPF
    if (!validateCPF(userData.cpf)) {
      newErrors.cpf = 'CPF inválido. Deve ter 11 dígitos.';
      valid = false;
    }

    // Validando telefone
    if (!validatePhone(userData.telefone)) {
      newErrors.telefone = 'Telefone inválido.';
      valid = false;
    }

    // Validando data de nascimento
    if (!validateBirthDate(userData.nascimento)) {
      newErrors.nascimento = 'Data de nascimento inválida.';
      valid = false;
    }

    if (valid) {
      try {
        const idHospede = "id_do_usuario";
        const response = await fetch(`https://localhost:7274/api/Hospede/EditarHospede/${idHospede}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error('Erro ao salvar alterações');
        }

        const data = await response.json();

        if (data.status) {
          setSuccessMessage("Alterações salvas com sucesso!"); // Definir mensagem de sucesso
          setTimeout(() => setSuccessMessage(null), 5000); // Remover a mensagem após 5 segundos
        } else {
          console.error('Erro: ' + data.mensagem);
        }
      } catch (error) {
        console.error('Erro ao salvar alterações:', error);
      }
    } else {
      setErrors(newErrors);
    }
  };

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
        <div className={style.rightColumn}>
          {["Nome Completo", "E-mail", "Telefone", "CPF", "Data de Nascimento"].map((label, index) => (
            <div className={style.formGroup} key={index}>
              <label className={style.label}>{label}:</label>
              <div className={style.inputContainer}>
                <input
                  type="text"
                  placeholder={label}
                  className={style.input}
                  value={label === "Data de Nascimento" && userData ? formatBirthDate(userData[label.toLowerCase().replace(/ /g, "")]) : userData ? userData[label.toLowerCase().replace(/ /g, "")] : ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      [label.toLowerCase().replace(/ /g, "")]: label === "Data de Nascimento" ? e.target.value : e.target.value,
                    })
                  }
                />
                {errors[label.toLowerCase().replace(/ /g, "")] && (
                  <span className={style.error}>{errors[label.toLowerCase().replace(/ /g, "")]}</span>
                )}
                <button className={style.editButton} onClick={() => handleEdit(label)}>
                  <Image src={edit} alt="editar" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Mensagem de Sucesso */}
          {successMessage && <div className={style.successMessage}>{successMessage}</div>}

          <div className={style.containerButton}>
            <button className={style.buttonSave} onClick={handleSave}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
