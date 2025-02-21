"use client";
import { useState, useEffect } from "react";
import style from "../hotelDono/page.module.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const AdminPainelAvaliacao = () => {
    const [Edit, setEdit] = useState<any[]>([]);
    const [editEdit, seteditEdit] = useState<any | null>(null);
    const [isEditingEdit, setIsEditingEdit] = useState(false);
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

    const listarEdit = async () => {
        try {
            const response = await fetch("https://localhost:7274/api/Avaliacao/ListarAvaliacoes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setEdit(data.dados);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Erro ao listar donos hotéis");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setErrorMessage("Não foi possível conectar ao servidor.");
        }
    };
    const handleSaveEditEdit = async (updatedEdit: any) => {
        try {
            const response = await fetch(
                `https://localhost:7274/api/Avaliacao/EditarAvaliacao/${updatedEdit.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedEdit),
                }
            );

            if (response.ok) {
                const data = await response.json();

                setEdit(Edit.map((userEdit) => (userEdit.id === updatedEdit.id ? updatedEdit : userEdit)));
                setIsEditingEdit(false);
                seteditEdit(null);
            } else {
                const error = await response.json();
                setErrorMessage(error.message || "Erro ao editar donos hotéis");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setErrorMessage("Não foi possível atualizar o donos hotéis.");
        }
    };

    const handleDeleteEdit = async (id: number) => {
        if (confirm("Tem certeza que deseja excluir este perfil?")) {
            try {
                const response = await fetch(`https://localhost:7274/api/Avaliacao/ExcluirAvaliacao/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    setEdit(Edit.filter((userEdit) => userEdit.id !== id));
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
        listarEdit();
    }, []);

    const handleEdit = (campo: any) => {
        seteditEdit(campo);
        setIsEditingEdit(true);
    };
    const filteredEdit = Edit.filter((userEdit) =>
        userEdit.nome.toLowerCase().includes(search.toLowerCase())
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
                                <th>Descrição</th>
                                <th>Avalicao</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEdit.length > 0 ? (
                                filteredEdit.map((userEdit) => (
                                    <tr className={style.containerInfo} key={userEdit.id}>
                                        <td >{userEdit.descricao}</td>
                                        <td >{userEdit.avaliacao}</td>
                                        <td className={style.containerButtonTabela}>
                                            <button className={style.editButton} onClick={() => handleEdit(userEdit)}>
                                                Editar
                                            </button>
                                            <button className={style.deleteButton} onClick={() => handleDeleteEdit(userEdit.id)}>
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

            {isEditingEdit && (
                <div>
                    {editEdit && (
                        <EditModalEdit
                            userEdit={editEdit}
                            onSave={handleSaveEditEdit}
                            onCancel={() => setIsEditingEdit(false)}
                        />
                    )}
                </div>
            )}
        </main >
    );
};


const EditModalEdit = ({ userEdit, onSave, onCancel }: any) => {
    const [descricao, setdescricao] = useState(userEdit.descricao);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...userEdit, descricao: descricao });
    };

    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <h2>Editar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>descricao:</label>
                        <input value={descricao} onChange={(e) => setdescricao(e.target.value)} />
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



export default AdminPainelAvaliacao;