import './App.css';
import {useState, useEffect} from 'react'

const url="http://localhost:5000/alunos"

function App() {
    //Guarda o resultado da requisição ao banco
    const [alunos, setAlunos] = useState([])
    
    //Variáveis para um novo aluno
    const [nome,setNome] = useState([])
    const [turma,setTurma] = useState([])
    const [ano_escolar,setAnoEscolar] = useState([])
    const [idAluno,setIdAluno] = useState([])
    
    //Estado de carregamento
    const [loading, setLoading] = useState(false)
    
    //Estado de erro
    const [error, setError] = useState(null)

    //Função para remover um aluno
    const handleRemove = async (e) => {
      e.preventDefault()

      try{
        const id = idAluno
        const res = await fetch(`http://localhost:5000/alunos/${id}`,{
          method:"DELETE",
          headers: {"Content-Type" : "application/json"},
        } )

        const alunoRemovido = await res.json()
      }
      catch(error){
          setError("Houve algum erro ao deletar os dados")
      }
    }

    //Função que adiciona os alunos após o clique
    const handleSubmit = async(e) => {
        e.preventDefault()

        setLoading(true)
        const aluno = {nome, turma, ano_escolar}

        const res = await fetch(url, {
            method:"POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(aluno)
        })

        //Atualiza a lista de alunos na tela do cliente com o último aluno adicionado
        const alunoAdicionado = await res.json()
        setAlunos((prevAlunos) => [...prevAlunos, alunoAdicionado])

        setNome('')
        setTurma('')
        setAnoEscolar('')

        setLoading(false)
    }
    
    //Resgatar dados da API
    useEffect(() => {
        async function fetchData(){
          setLoading(true)

          try{
          //Busca os dados
          const res = await fetch(url)
          
          //Converte a resposta para json
          const data = await res.json()
          
          setAlunos(data)
          }catch (error) {
            setError("Houve um erro ao carregar os dados")
          }

          setLoading(false)
        }

        fetchData()
    } , [])

    console.log(alunos)

  return (
    <div className="App">
      <div className='add-aluno'>
      <h1>Cadastrar um aluno</h1>
        <form onSubmit={handleSubmit}>
            <label><b>
              Aluno:
              <input type='text' value={nome} name='nome' onChange={(e) => {setNome(e.target.value)}}></input>
            </b></label>
            <br/>
            <label><b>
              Turma:
              <input type='text' value={turma} name='turma' onChange={(e) => {setTurma(e.target.value)}}></input>
            </b></label>
            <br/>
            <label><b>
              Ano:
              <input type='number' value={ano_escolar} name='ano_escolar' onChange={(e) => {setAnoEscolar(Number(e.target.value))}}></input>
            </b></label>
            <br/>
            {loading &&
            <input type='submit' value="Aguarde" disabled className='btn'></input>}
            {!loading &&
            <input type='submit' value="Cadastrar" className='btn'></input>}
        </form>
        <div className='remove-aluno'>
            <h1>Remova um Aluno</h1>
            <form onSubmit={handleRemove}>
            <label><b>
              Id Aluno:
              <input type='text' value={idAluno} name='id_aluno' onChange={(e) => {setIdAluno((e.target.value))}}></input>
            </b></label>
            <br/>
            <input type='submit' value="Remover" className='btn'></input>
            </form>
        </div>
      </div>
      <div className='lista-alunos'>
      <h2>Lista de alunos</h2>

      {loading && <h3>Carregando Lista...</h3>}
      {error && <h3>Houve um erro ao carregar os dados</h3>}
      {!error &&
      <ul>
        {alunos.map((alu) => (
          <li key={alu.id}>
            Aluno: {alu.nome} - Turma: {alu.turma} - Ano: {alu.ano_escolar}
          </li>
        ))}
      </ul>}
      </div>
      <div className='tabela-alunos'>
        <table style={{border: "2px solid black", backgroundColor: "lightblue", margin: "0px auto"}}>
          <thead>
            <th>Id</th>
            <th>Nome</th>
            <th>Turma</th>
            <th>Ano Escolar</th>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.id}>
                  <td>{aluno.id}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.turma}</td>
                  <td>{aluno.ano_escolar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
