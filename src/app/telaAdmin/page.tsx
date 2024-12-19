"use client";
import { useState, useEffect } from "react";
import style from "../../app/telaAdmin/page.module.scss"; // Ajuste o caminho conforme necessário
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]); // Estado para donos
  const [editowners, setEditOwners] = useState<any | null>(null);
  const [quartos, setQuartos] = useState<any[]>([]); // Estado para donos
  const [editQuarto, setEditQuarto] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchOwners, setSearchOwners] = useState("");
  const [searchQuartos, setSearchQuartos] = useState("");
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
      console.log("Erro na requisição:", error);
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
        setErrorMessage(error.message || "Erro ao listar donos");
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  };
  const handleSaveEditDono = async (updatedUser: any) => {
    try {
      const response = await fetch(
        `https://localhost:7274/api/DonoHotel/EditarDono/${updatedUser.id}`, // Adicionando o ID do usuário à URL
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

        setOwners(users.map((owner) => (owner.id === updatedUser.id ? updatedUser : owner)));
        setIsEditing(false);
        setEditOwners(null);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao editar dono");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrorMessage("Não foi possível atualizar o dono.");
    }
  };

  const handleDeleteDono = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este perfil?")) {
      try {
        const response = await fetch(`https://localhost:7274/api/DonoHotel/ExcluirDono/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setOwners(users.filter((owner) => owner.id !== id));
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
        setQuartos(data.dados);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao listar donos");
      }
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  };

  const handleSaveEditQuarto = async (updatedQuarto: any) => {
    try {
      const response = await fetch(
        `https://localhost:7274/api/Quarto/EditarQuarto/${updatedQuarto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedQuarto),
        }
      );

      if (response.ok) {
        setQuartos((prevQuartos) =>
          prevQuartos.map((quarto) =>
            quarto.id === updatedQuarto.id ? updatedQuarto : quarto
          )
        );
        setIsEditing(false);
        setEditQuarto(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar quarto");
      }
    } catch (error) {
      setErrorMessage("Não foi possível salvar as alterações.");
      console.error(error);
    }
  };

  useEffect(() => {
    listarUsuarios();
    listarDonos();
    listarQuartos();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredOwners = owners.filter((owner) =>
    owner.nome.toLowerCase().includes(searchOwners.toLowerCase())
  );

  const filteredQuartos = quartos.filter((quarto) =>
    quarto.nomeQuarto.toLowerCase().includes(searchQuartos.toLowerCase())
  );

  const handleEdit = (owner: any) => {
    setEditUser(owner);
    setIsEditing(true);
  };

  const handleSaveEditDonos = (owner: any) => {
    setEditUser(owner);
    setIsEditing(true);
  };

  const handleEditQuarto = (quarto: any) => {
    if (!quarto) {
      setErrorMessage("dados nao encontrados para edição");
      return
    }
    setEditQuarto(quarto);
    setIsEditing(true);
  };

  return (
    <main className={style.adminContainer}>
      <h1>Painel de Administração</h1>

      <div>
        <h1>Scraping</h1>
        <button onClick={handleStartScraping}>Começar Scraping</button>
        <p id="responseMessage"></p>
      </div>

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
              value={searchUsers}
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
                  <td>Nenhum usuário encontrado.</td>
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
              value={searchOwners}
              onChange={(e) => setSearchOwners(e.target.value)}
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
                  <tr key={owner.id}>
                    <td>{owner.nome}</td>
                    <td>{owner.email}</td>
                    <td>{owner.cpf}</td>
                    <td>{owner.telefone}</td>
                    <td className={style.containerButtonTabela}>
                      <button className={style.editButton} onClick={() => handleSaveEditDonos(owner)}>
                        Editar
                      </button>
                      <button className={style.deleteButton} onClick={() => handleDeleteDono(owner.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Nenhum dono encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </TabPanel>

        <TabPanel>asdasdas</TabPanel>

        <TabPanel>
          <div className={style.searchContainer}>
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchQuartos}
              onChange={(e) => setSearchQuartos(e.target.value)}
              className={style.searchInput}
            />
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <table className={style.adminTable}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Capacidade de Pessoas</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuartos.length > 0 ? (
                filteredQuartos.map((quarto) => (
                  <tr key={quarto.id}>
                    <td>{quarto.nomeQuarto}</td>
                    <td>{quarto.capacidadePessoas}</td>
                    <td>{quarto.preco}</td>
                    <td className={style.containerButtonTabela}>
                      <button className={style.editButton} onClick={() => handleEditQuarto(quarto)}>
                        Editar
                      </button>
                      <button className={style.deleteButton} onClick={() => handleDeleteDono(quarto.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Nenhum quarto encontrado.</td>
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
          {editUser && (
            <EditModalDono
              user={editUser}
              onSave={handleSaveEditDono}
              onCancel={() => setIsEditing(false)}
            />
          )}
          {editQuarto && (
            <EditQuartoModal
              user={editQuarto}
              onSave={handleSaveEditQuarto}
              onCancel={() => setIsEditing(false)}
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

const EditModalDono = ({ user, onSave, onCancel }: any) => {
  if (!user) {
    return null; // Retorna null caso o objeto user não esteja disponível.
  }

  const [name, setName] = useState(user.nome || "");
  const [email, setEmail] = useState(user.email || "");
  const [cpf, setCpf] = useState(user.cpf || "");
  const [telefone, setTelefone] = useState(user?.telefone || "");
  const [nascimento, setNascimento] = useState(user.nascimento || "");
  const [senha, setSenha] = useState(user.senha || "");
  const [endereco, setEndereco] = useState(user.endereco || "");


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
const EditQuartoModal = ({ quarto, onSave, onCancel }: any) => {
  if (!quarto) {
    return null;
  }

  const [name, setName] = useState(quarto.nome);
  const [descricao, setDescricao] = useState(quarto.descricao);
  const [preco, setPreco] = useState(quarto.preco);
  const [capacidadePessoas, setCapacidadePessoas] = useState(quarto.capacidadePessoas);
  const [disponibilidade, setDisponibilidade] = useState(quarto.disponibilidade);
  const [comodidades, setComodidades] = useState(quarto.comodidades);
  const [endereco, setEndereco] = useState(quarto.endereco);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...quarto, nome: name, descricao, preco, capacidadePessoas, disponibilidade, comodidades, endereco });
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