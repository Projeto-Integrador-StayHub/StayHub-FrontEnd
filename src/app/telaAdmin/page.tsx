"use client";
import { useState, useEffect } from "react";
import style from "../../app/telaAdmin/page.module.scss"; // Ajuste o caminho conforme necessário
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

type Avaliacao = {
  id: number;
  comentario: string;
};

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [reserva, setReserva] = useState<any[]>([]);
  const [editReservas, setEditReservas] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [editRoom, setEditRoom] = useState<any | null>(null);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [editAvaliacao, setEditAvaliacao] = useState(null);
  const [isEditingAvaliacao, setIsEditingAvaliacao] = useState(false);

  const listarUsuarios = async () => {
    try {
      const response = await fetch("https://localhost:7274/api/Hospede/ListarHospedes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.dados); 
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao listar usuários");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível conectar ao servidor.");
    }
  };
  const handleSaveEdit = async (updatedUser: any) => {
    try {
      const response = await fetch(
        `https://localhost:7274/api/Hospede/EditarHospede/${updatedUser.id}`, // Adicionando o ID do usuário à URL
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser), 
        }
      );

      if (response.ok) {
        const data = await response.json();

        setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
        setIsEditing(false);
        setEditUser(null);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao editar usuário");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível atualizar o usuário.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este perfil?")) {
      try {
        const response = await fetch(`https://localhost:7274/api/Hospede/ExcluirHospede/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id)); 
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

  const handleEditOwner = (owner: any) => {
    setEditUser(owner);
    setIsEditing(true);
  };
  const listarDonos = async () => {
    try {
      const response = await fetch("https://localhost:7274/api/DonoHotel/ListarDonos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOwners(data.dados);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao listar donos de hotel");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível conectar ao servidor.");
    }
  };

  const handleSaveOwnerEdit = async (updatedOwner: any) => {
    try {
      const response = await fetch(
        `https://localhost:7274/api/DonoHotel/EditarDono/${updatedOwner.id}`, // Substitua pelo ID do dono
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOwner),
        }
      );

      if (response.ok) {
        setOwners(
          owners.map((owner) =>
            owner.id === updatedOwner.id ? updatedOwner : owner
          )
        );
        setIsEditing(false);
        setEditUser(null);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao editar dono de hotel");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível atualizar o dono.");
    }
  };

  const handleDeleteOwner = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este dono de hotel?")) {
      try {
        const response = await fetch(
          `https://localhost:7274/api/DonoHotel/ExcluirDono/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setOwners(owners.filter((owner) => owner.id !== id));
          alert("Dono excluído com sucesso!");
        } else {
          const error = await response.json();
          setErrorMessage(error.message || "Erro ao excluir dono");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        setErrorMessage("Não foi possível conectar ao servidor.");
      }
    }
  };

  const handleEditReservas = (reserva: any) => {
    setEditReservas(reserva);
    setIsEditing(true);
  };

  const listarReserva = async () => {
    try {
      const response = await fetch("https://localhost:7274/api/Reserva/ListarReservas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReserva(data.dados);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao listar reservas");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível conectar ao servidor.");
    }
  };
  const handleSaveReservasEdit = async (updatedReserva: any) => {
    try {
      const response = await fetch(
        `https://localhost:7274/api/Reserva/EditarReserva/${updatedReserva.id}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReserva),
        }
      );

      if (response.ok) {
        setReserva(
          reserva.map((r) => (r.id === updatedReserva.id ? updatedReserva : r)) 
        );
        setIsEditing(false);
        setEditReservas(null);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao editar reserva");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível atualizar a reserva.");
    }
  };

  const handleDeleteReserva = async (id: any) => {
    if (confirm("Tem certeza que deseja excluir esta reserva?")) {
      try {
        const response = await fetch(
          `https://localhost:7274/api/Reserva/ExcluirReserva/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          setReserva(reserva.filter((r) => r.id !== id));
          alert("Reserva excluída com sucesso!");
        } else {
          const error = await response.json();
          setErrorMessage(error.message || "Erro ao excluir reserva");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        setErrorMessage("Não foi possível conectar ao servidor.");
      }
    }
  };

  const listarQuartos = async () => {
    try {
      const response = await fetch("https://localhost:7274/api/Quarto/ListarQuartos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data.dados);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao listar quartos");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível conectar ao servidor.");
    }
  };

  // Função para editar quarto
  const handleSaveRoomEdit = async (updatedRoom: any) => {
    try {
      const response = await fetch(
        `https://localhost:7274/api/Quarto/EditarQuarto/${updatedRoom.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRoom),
        }
      );

      if (response.ok) {
        setRooms(rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)));
        setIsEditingRoom(false);
        setEditRoom(null);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao editar quarto");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível atualizar o quarto.");
    }
  };

  // Função para excluir quarto
  const handleDeleteRoom = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este quarto?")) {
      try {
        const response = await fetch(`https://localhost:7274/api/Quarto/ExcluirQuarto/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setRooms(rooms.filter((room) => room.id !== id));
          alert("Quarto excluído com sucesso!");
        } else {
          const error = await response.json();
          setErrorMessage(error.message || "Erro ao excluir quarto");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        setErrorMessage("Não foi possível conectar ao servidor.");
      }
    }
  };

  const listarAvaliacoes = async () => {
    try {
      const response = await fetch("https://localhost:7274/api/Avaliacao/ListarAvaliacoes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvaliacoes(data.dados); 
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao listar avaliações");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível conectar ao servidor.");
    }
  };


  const handleSaveAvaliacaoEdit = async (updatedAvaliacao: Avaliacao) => {
    try {
      const response = await fetch(
        `https://localhost:7274/api/Avaliacao/EditarAvaliacao/${updatedAvaliacao.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAvaliacao),
        }
      );

      if (response.ok) {
        setAvaliacoes(
          avaliacoes.map((avaliacao) =>
            avaliacao.id === updatedAvaliacao.id ? updatedAvaliacao : avaliacao
          )
        );
        setIsEditingAvaliacao(false);
        setEditAvaliacao(null);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao editar avaliação");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível atualizar a avaliação.");
    }
  };



  const handleDeleteAvaliacao = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
      try {
        const response = await fetch(
          `https://localhost:7274/api/Avaliacao/ExcluirAvaliacao/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          setAvaliacoes(avaliacoes.filter((avaliacao) => avaliacao.id !== id));
          alert("Avaliação excluída com sucesso!");
        } else {
          const error = await response.json();
          setErrorMessage(error.message || "Erro ao excluir avaliação");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        setErrorMessage("Não foi possível conectar ao servidor.");
      }
    }
  };


  useEffect(() => {
    listarUsuarios();
    listarDonos();
    listarReserva();
    listarQuartos(); 
    listarAvaliacoes
  }, []);

  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOwners = owners.filter((owner) =>
    owner.nome.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReservas = reserva.filter((reserva) =>
    reserva.nome.toLowerCase().includes(search.toLowerCase())
  );
  const handleEdit = (owner: any) => {
    setEditUser(owner);
    setIsEditing(true);
  };


  return (
    <main className={style.adminContainer}>
      <h1>Painel de Administração</h1>

      <Tabs>
        <TabList>
          <Tab> Hospede </Tab>
          <Tab> Dono Hotel </Tab>
          <Tab> Reserva </Tab>
          <Tab> Quarto </Tab>
          <Tab> Avaliacao </Tab>
        </TabList>

        <TabPanel>
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr className={style.containerInfo} key={user.id}>
                    <td >{user.nome}</td>
                    <td>{user.email}</td>
                    <td>{user.cpf}</td>
                    <td>{user.telefone}</td>
                    <td className={style.containerButtonTabela}>
                      <button className={style.editButton} onClick={() => handleEdit(user)}>
                        Editar
                      </button>
                      <button className={style.deleteButton} onClick={() => handleDelete(user.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhum usuário encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
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
              {filteredOwners.length > 0 ? (
                filteredOwners.map((owner) => (
                  <tr className={style.containerInfo} key={owner.id}>
                    <td>{owner.nome}</td>
                    <td>{owner.email}</td>
                    <td>{owner.cpf}</td>
                    <td>{owner.telefone}</td>
                    <td className={style.containerButtonTabela}>
                      <button
                        className={style.editButton}
                        onClick={() => handleEditOwner(owner)}
                      >
                        Editar
                      </button>
                      <button
                        className={style.deleteButton}
                        onClick={() => handleDeleteOwner(owner.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhum dono encontrado.</td>
                </tr>
              )}
            </tbody>

          </table>
        </TabPanel>

        <TabPanel>
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
                <th>Descrição</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.length > 0 ? (
                filteredReservas.map((reserva) => (
                  <tr className={style.containerInfo} key={reserva.id}>
                    <td>{reserva.nomeQuarto}</td>
                    <td>{reserva.descricao}</td>
                    <td>{reserva.entrada}</td>
                    <td>{reserva.saida}</td>
                    <td className={style.containerButtonTabela}>
                      <button
                        className={style.editButton}
                        onClick={() => handleEditReservas(reserva)}
                      >
                        Editar
                      </button>
                      <button
                        className={style.deleteButton}
                        onClick={() => handleDeleteReserva(reserva.id)} // Pode ser alterado para o método correto
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhuma reserva encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
          <div className={style.searchContainer}>
            <input
              type="text"
              placeholder="Pesquisar por nome do quarto..."
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
                <th>Descrição</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.nome}</td>
                    <td>{room.descricao}</td>
                    <td>{room.preco}</td>
                    <td>
                      <button
                        className={style.editButton}
                        onClick={() => {
                          setEditRoom(room);
                          setIsEditingRoom(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className={style.deleteButton}
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Nenhum quarto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>
          <div className={style.searchContainer}>
            <input
              type="text"
              placeholder="Pesquisar por descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={style.searchInput}
            />
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <table className={style.adminTable}>
            <thead>
              <tr>
                <th>Avaliação</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.length > 0 ? (
                avaliacoes.map((avaliacao) => (
                  <tr key={avaliacao.id}>
                    <td>{avaliacao.avaliacao}</td>
                    <td>{avaliacao.descricao}</td>
                    <td>
                      <button
                        className={style.editButton}
                        onClick={() => {
                          setEditAvaliacao(avaliacao);
                          setIsEditingAvaliacao(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className={style.deleteButton}
                        onClick={() => handleDeleteAvaliacao(avaliacao.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Nenhuma avaliação encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </TabPanel>

      </Tabs>

      {isEditing && (
        <div>
          {editUser && (
            <EditModal
              user={editUser}
              onSave={handleSaveEdit}  
              onCancel={() => setIsEditing(false)}
            />
          )}
          {editReservas && (
            <EditReservaModal
              reserva={editReservas}  
              onSave={handleSaveReservasEdit} 
              onCancel={() => setIsEditing(false)}
            />
          )}
          {isEditingRoom && (
            <EditRoomModal
              room={editRoom}
              onSave={handleSaveRoomEdit}
              onCancel={() => setIsEditingRoom(false)}
            />
          )}

          {isEditingAvaliacao && (
            <EditAvaliacaoModal
              avaliacao={editAvaliacao}
              onSave={handleSaveAvaliacaoEdit}
              onCancel={() => {
                setIsEditingAvaliacao(false);
                setEditAvaliacao(null);
              }}
            />
          )}

        </div>
      )}
    </main >
  );
};


const EditModal = ({ user, onSave, onCancel }: any) => {
  const [name, setName] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [cpf, setCpf] = useState(user.cpf);
  const [telefone, setTelefone] = useState(user.telefone);
  const [nascimento, setNascimento] = useState(user.nascimento);
  const [senha, setSenha] = useState(user.senha);
  const [endereco, setendereco] = useState(user.endereco);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, nome: name, email, cpf, telefone, nascimento, senha, endereco });
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
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
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
const EditReservaModal = ({ reserva, onSave, onCancel }: any) => {
  const [descricao, setDescricao] = useState(reserva.descricao);
  const [entrada, setEntrada] = useState(reserva.entrada);
  const [saida, setSaida] = useState(reserva.saida);
  const [preco, setPreco] = useState(reserva.preco);
  const [stats, setStats] = useState(reserva.stats);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...reserva, descricao, entrada, saida, preco, stats });
  };

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <h2>Editar Reserva</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Descrição:</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div>
            <label>Entrada:</label>
            <input
              type="date"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
            />
          </div>
          <div>
            <label>Saída:</label>
            <input
              type="date"
              value={saida}
              onChange={(e) => setSaida(e.target.value)}
            />
          </div>
          <div>
            <label>Preço:</label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Disponibilidade:</label>
            <select
              value={stats}
              onChange={(e) => setStats(e.target.value)}
            >
              <option value="Disponível">Disponível</option>
              <option value="Indisponível">Indisponível</option>
            </select>
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
const EditRoomModal = ({ room, onSave, onCancel }: any) => {
  const [name, setName] = useState(room.nome);
  const [descricao, setDescricao] = useState(room.descricao);
  const [preco, setPreco] = useState(room.preco);
  const [capacidadePessoas, setCapacidadePessoas] = useState(room.capacidadePessoas)
  const [disponibilidade, setDisponibilidade] = useState(room.disponibilidade);
  const [comodidades, setComodidades] = useState(room.comodidades);
  const [endereco, setEndereco] = useState(room.endereco);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...room, nome: name, descricao, preco, capacidadePessoas, disponibilidade, comodidades, endereco });
  };

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <h2>Editar Quarto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Descrição:</label>
            <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div>
            <label>Preço:</label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </div>
          <div>
            <label>Capacidade de Pessoas:</label>
            <input value={capacidadePessoas} onChange={(e) => setCapacidadePessoas(e.target.value)} />
          </div>
          <div>
            <label>Disponibilidade:</label>
            <select value={disponibilidade} onChange={(e) => setDisponibilidade(e.target.value)}>
              <option value="disponivel">Disponível</option>
              <option value="indisponivel">Indisponível</option>
            </select>
          </div>
          <div>
            <label>Comodidades:</label>
            <input value={comodidades} onChange={(e) => setComodidades(e.target.value)} />
          </div>
          <div>
            <label>Endereço:</label>
            <input value={endereco} onChange={(e) => setEndereco(e.target.value)} />
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

const EditAvaliacaoModal = ({ avaliacao, onSave, onCancel }: any) => {
  const [descricao, setDescricao] = useState(avaliacao.descricao);
  const [avaliacaoNota, setAvaliacaoNota] = useState(avaliacao.avaliacao);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...avaliacao, descricao, avaliacao: avaliacaoNota });
  };

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <h2>Editar Avaliação</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Descrição:</label>
            <input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div>
            <label>Avaliação (0-5):</label>
            <input
              type="number"
              value={avaliacaoNota}
              onChange={(e) => setAvaliacaoNota(Number(e.target.value))}
              min="0"
              max="5"
            />
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


export default AdminPanel;
