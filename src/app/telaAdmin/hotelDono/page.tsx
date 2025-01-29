"use client";
import { useState, useEffect } from "react";
import style from "../hotelDono/page.module.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const AdminPanel2 = () => {
    const [DonoHotel, setDonoHotel] = useState<any[]>([]);
    const [editDonoHotel, seteditDonoHotel] = useState<any | null>(null);
    const [isEditingDonoHotel, setIsEditingDonoHotel] = useState(false);
    const [search, setSearch] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const handleStartScraping = async () => {
        try {
            const response = await fetch('https://localhost:7274/api/Scraper/start-scraping', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            document.getElementById('responseMessage')!.innerText = data.message || 'Scraping started successfully!';
        } catch (error: any) {
            document.getElementById('responseMessage')!.innerText = `Error: ${error.message}`;
        }
    };

    const listarDonoHotel = async () => {
        try {
            const response = await fetch("https://localhost:7274/api/DonoHotel/ListarDonos", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDonoHotel(data.dados);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Erro ao listar donos hotéis");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setErrorMessage("Não foi possível conectar ao servidor.");
        }
    };
    const handleSaveEditDonoHotel = async (updatedDonoHotel: any) => {
        try {
            const response = await fetch(
                `https://localhost:7274/api/DonoHotel/EditarDono/${updatedDonoHotel.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedDonoHotel),
                }
            );

            if (response.ok) {
                const data = await response.json();

                setDonoHotel(DonoHotel.map((userDonoHotel) => (userDonoHotel.id === updatedDonoHotel.id ? updatedDonoHotel : userDonoHotel)));
                setIsEditingDonoHotel(false);
                seteditDonoHotel(null);
            } else {
                const error = await response.json();
                setErrorMessage(error.message || "Erro ao editar donos hotéis");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setErrorMessage("Não foi possível atualizar o donos hotéis.");
        }
    };

    const handleDeleteDonoHotel = async (id: number) => {
        if (confirm("Tem certeza que deseja excluir este perfil?")) {
            try {
                const response = await fetch(`https://localhost:7274/api/DonoHotel/ExcluirDono/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    setDonoHotel(DonoHotel.filter((userDonoHotel) => userDonoHotel.id !== id));
                    alert("Usuário excluído com sucesso!");
                } else {
                    const error = await response.json();
                    setErrorMessage(error.message || "Erro ao excluir usuário");
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                setErrorMessage("Não foi possível conectar ao servidor.");
            }
        }
    };


    useEffect(() => {
        listarDonoHotel();
    }, []);

    const handleEdit = (campo: any) => {
        seteditDonoHotel(campo);
        setIsEditingDonoHotel(true);
    };
    const filteredDonoHotel = DonoHotel.filter((userDonoHotel) =>
        userDonoHotel.nome.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <main className={style.adminContainer}>
                    <div className={style.searchContainer}>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={style.searchInput}
                        />
                    </div>

                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                    <table className={style.adminTable}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>CPF</th>
                                <th>Telefone</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonoHotel.length > 0 ? (
                                filteredDonoHotel.map((userDonoHotel) => (
                                    <tr className={style.containerInfo} key={userDonoHotel.id}>
                                        <td >{userDonoHotel.nome}</td>
                                        <td>{userDonoHotel.email}</td>
                                        <td>{userDonoHotel.cpf}</td>
                                        <td>{userDonoHotel.telefone}</td>
                                        <td className={style.containerButtonTabela}>
                                            <button className={style.editButton} onClick={() => handleEdit(userDonoHotel)}>
                                                Editar
                                            </button>
                                            <button className={style.deleteButton} onClick={() => handleDeleteDonoHotel(userDonoHotel.id)}>
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    {/* <td colSpan="5">Nenhum usuário encontrado.</td> */}
                                </tr>
                            )}
                        </tbody>
                    </table>

            {isEditingDonoHotel && (
                <div>
                    {editDonoHotel && (
                        <EditModalDonoHotel
                            userDonoHotel={editDonoHotel}
                            onSave={handleSaveEditDonoHotel}
                            onCancel={() => setIsEditingDonoHotel(false)}
                        />
                    )}
                </div>
            )}
        </main >
    );
};


const EditModalDonoHotel = ({ userDonoHotel, onSave, onCancel }: any) => {
    const [name, setName] = useState(userDonoHotel.nome);
    const [email, setEmail] = useState(userDonoHotel.email);
    const [cpf, setCpf] = useState(userDonoHotel.cpf);
    const [telefone, setTelefone] = useState(userDonoHotel.telefone);
    const [nascimento, setNascimento] = useState(userDonoHotel.nascimento);
    const [senha, setSenha] = useState(userDonoHotel.senha);
    const [endereco, setendereco] = useState(userDonoHotel.endereco);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...userDonoHotel, nome: name, email, cpf, telefone, nascimento, senha, endereco });
    };

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <h2>Editar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nome:</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>E-mail:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>CPF:</label>
                        <input value={cpf} onChange={(e) => setCpf(e.target.value)} />
                    </div>
                    <div>
                        <label>Telefone:</label>
                        <input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    </div>
                    <div>
                        <label>Endereço:</label>
                        <input value={endereco} onChange={(e) => setendereco(e.target.value)} />
                    </div>
                    <div>
                        <label>Data de Nascimento:</label>
                        <input
                            type="date"
                            value={nascimento}
                            onChange={(e) => setNascimento(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Senha:</label>
                        <input
                            type={mostrarSenha ? 'text' : 'password'}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            style={{
                                marginLeft: '10px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>

                    <button type="submit" className={style.saveButton}>
                        Salvar
                    </button>
                    <button type="button" onClick={onCancel} className={style.cancelButton}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};



export default AdminPanel2;