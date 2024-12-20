"use client";
import Image from "next/image";
import style from "../../app/telaPerfil/page.module.scss";
import logo from "@/app/icon/logo.svg";
import { useState, useEffect } from "react";
import fotoPerfil from "../image/foto.png";
import edit from "../icon/edit.svg";
import logout from "../icon/logout.svg";
import { useSearchParams } from "next/navigation";

const validateCPF = (cpf: string) => /^\d{11}$/.test(cpf);

const validatePhone = (phone: string) => /^\(\d{2}\)\d{1}\s\d{4}-\d{4}$/.test(phone);

const validateBirthDate = (date: string) =>
  /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(date);

const formatBirthDate = (date: string) => {
  const cleaned = date.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
};

interface UserData {
  nomecompleto: string;
  email: string;
  telefone: string;
  cpf: string;
  nascimento: string;
}

export default function TelaPerfil() {
  const [userData, setUserData] = useState<UserData>({
    nomecompleto: "",
    email: "",
    telefone: "",
    cpf: "",
    nascimento: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const Userid = searchParams.get("id");

  const fetchUserData = async (id: string) => {
    try {
      const response = await fetch(
        `https://localhost:7274/api/Hospede/BuscarHospede/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      const text = await response.text();
      if (!text) {
        throw new Error("Resposta vazia recebida");
      }

      const data = JSON.parse(text);
      if (data.status) {
        setUserData(data.dados[0]);
      } else {
        console.error("Erro: " + data.mensagem);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    if (Userid) {
      fetchUserData(Userid);
    }
  }, [Userid]);

  const handleEdit = (field: string) => {
    console.log(`Editar campo: ${field}`);
  };

  const handleSave = async () => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    if (!validateCPF(userData.cpf)) {
      newErrors.cpf = "CPF inválido. Deve ter 11 dígitos.";
      valid = false;
    }

    if (!validatePhone(userData.telefone)) {
      newErrors.telefone = "Telefone inválido.";
      valid = false;
    }

    if (!validateBirthDate(userData.nascimento)) {
      newErrors.nascimento = "Data de nascimento inválida.";
      valid = false;
    }

    if (valid) {
      try {
        const response = await fetch(
          `https://localhost:7274/api/Hospede/EditarHospede/${Userid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao salvar alterações");
        }

        const data = await response.json();
        if (data.status) {
          setSuccessMessage("Alterações salvas com sucesso!");
          setTimeout(() => setSuccessMessage(null), 5000);
        } else {
          console.error("Erro: " + data.mensagem);
        }
      } catch (error) {
        console.error("Erro ao salvar alterações:", error);
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
          {["Nome Completo", "E-mail", "Telefone", "CPF", "Data de Nascimento"].map((label, index) => {
            const field = label.toLowerCase().replace(/ /g, "") as keyof UserData;
            return (
              <div className={style.formGroup} key={index}>
                <label className={style.label}>{label}:</label>
                <div className={style.inputContainer}>
                  <input
                    type="text"
                    placeholder={label}
                    className={style.input}
                    value={label === "Data de Nascimento"
                      ? formatBirthDate(userData[field] || "")
                      : userData[field] || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        [field]: e.target.value,
                      })
                    }
                  />
                  {errors[field] && <span className={style.error}>{errors[field]}</span>}
                  <button className={style.editButton} onClick={() => handleEdit(label)}>
                    <Image src={edit} alt="editar" />
                  </button>
                </div>
              </div>
            );
          })}

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
