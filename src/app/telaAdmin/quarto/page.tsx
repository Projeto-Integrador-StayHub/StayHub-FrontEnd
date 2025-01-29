"use client";
import { useState, useEffect } from "react";
import style from "../hotelDono/page.module.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const AdminPainelQuarto = () => {
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
            const response = await fetch("https://localhost:7274/api/Quarto/ListarQuartos", {
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
            // Monte o objeto final que a API espera:
            const payload = {
                dados: {
                    // Se a API ainda usa o ID na rota,
                    // é normal repetir o ID também no corpo, conforme seu modelo:
                    id: updatedDonoHotel.id,
    
                    // Se precisar repassar o objeto `dono`, você pode ajustar aqui
                    // Ou, se só precisa do ID do dono, basta setar como abaixo
                    dono: {
                      id: updatedDonoHotel.donoId
                    },
    
                    nomeQuarto: updatedDonoHotel.nomeQuarto,
                    descricao: updatedDonoHotel.descricao,
                    // Cuidado com parseFloat e parseInt
                    preco: parseFloat(updatedDonoHotel.preco),
                    capacidadePessoas: parseInt(updatedDonoHotel.capacidadePessoas),
                    disponibilidade: updatedDonoHotel.disponibilidade ?? true, // ou false, conforme precisar
                    comodidades: updatedDonoHotel.comodidades,
                    endereco: updatedDonoHotel.endereco,
                    cidade: updatedDonoHotel.cidade,
                    estado: updatedDonoHotel.estado,
    
                    // Caso a sua modelagem exija o donoId diretamente, coloque aqui também
                    donoId: parseInt(updatedDonoHotel.donoId),
    
                    // Se sua API precisa desse campo,
                    // recupere do objeto que já veio do back, ou mantenha se não for obrigatório
                    fotosPath: updatedDonoHotel.fotosPath ?? "" 
                },
                mensagem: "Editando quarto",
                status: true
            };
    
            const response = await fetch(
                `https://localhost:7274/api/Quarto/EditarQuarto/${updatedDonoHotel.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload), // Envie o objeto `payload` completo
                }
            );
    
            if (!response.ok) {
                const error = await response.json();
                console.log("Erro da API:", JSON.stringify(error, null, 2));
                // Lembre de exibir mensagens significativas ou mostrar no console
                setErrorMessage(error.title || "Erro ao editar quarto.");
                return;
            }
    
            // Se chegar aqui deu certo
            const data = await response.json();
            console.log("Sucesso! Resposta do servidor:", data);
    
            // Atualiza a lista de quartos em tela
            setDonoHotel((prevState) =>
                prevState.map((item) =>
                    item.id === updatedDonoHotel.id ? updatedDonoHotel : item
                )
            );
    
            setIsEditingDonoHotel(false);
            seteditDonoHotel(null);
    
        } catch (err) {
            console.error("Erro na requisição:", err);
            setErrorMessage("Não foi possível atualizar o quarto.");
        }
    };
    


    const handleDeleteDonoHotel = async (id: number) => {
        if (confirm("Tem certeza que deseja excluir este perfil?")) {
            try {
                const response = await fetch(`https://localhost:7274/api/Quarto/ExcluirQuarto/${id}`, {
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
        + (userDonoHotel?.nomeQuarto ?? "").toLowerCase().includes(search.toLowerCase())
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
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Preco</th>
                        <th>Capacidade Pessoas</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDonoHotel.length > 0 ? (
                        filteredDonoHotel.map((userDonoHotel) => (
                            <tr className={style.containerInfo} key={userDonoHotel.id}>
                                <td >{userDonoHotel.id}</td>
                                <td>{userDonoHotel.nomeQuarto}</td>
                                <td>{userDonoHotel.preco}</td>
                                <td>{userDonoHotel.capacidadePessoas}</td>
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
    const [name, setName] = useState(userDonoHotel.nomeQuarto ?? "");
    const [descricao, setdescricao] = useState(userDonoHotel.descricao ?? "");
    const [preco, setpreco] = useState(userDonoHotel.preco ?? "");
    const [capacidadePessoas, setcapacidadePessoas] = useState(userDonoHotel.capacidadePessoas ?? "");
    const [comodidades, setcomodidades] = useState(userDonoHotel.comodidades ?? "");
    const [endereco, setendereco] = useState(userDonoHotel.endereco ?? "");
    const [cidade, setcidade] = useState(userDonoHotel.cidade ?? "");
    const [estado, setestado] = useState(userDonoHotel.estado ?? "");
    const [donoId, setdonoId] = useState(userDonoHotel.dono.id ?? "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        onSave({
            ...userDonoHotel,
            nomeQuarto: name,
            descricao,
            preco: parseFloat(preco),
            capacidadePessoas: parseInt(capacidadePessoas),
            comodidades,
            endereco,
            cidade,
            estado,
            donoId
          });
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
                        <label>Descrição:</label>
                        <input
                            value={descricao}
                            onChange={(e) => setdescricao(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Preço:</label>
                        <input value={preco} onChange={(e) => setpreco(e.target.value)} />
                    </div>
                    <div>
                        <label>Capacidade de Pessoas:</label>
                        <input value={capacidadePessoas} onChange={(e) => setcapacidadePessoas(e.target.value)} />
                    </div>

                    <div>
                        <label>Comodidades:</label>
                        <input
                            value={comodidades}
                            onChange={(e) => setcomodidades(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Endereço:</label>
                        <input value={endereco} onChange={(e) => setendereco(e.target.value)} />
                    </div>

                    <div>
                        <label>Cidade:</label>
                        <input value={cidade} onChange={(e) => setcidade(e.target.value)} />
                    </div>

                    <div>
                        <label>Estado:</label>
                        <input value={estado} onChange={(e) => setestado(e.target.value)} />
                    </div>

                    <div>
                        <label>Dono Id:</label>
                        <input value={donoId} onChange={(e) => setdonoId(e.target.value)} />
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



export default AdminPainelQuarto;