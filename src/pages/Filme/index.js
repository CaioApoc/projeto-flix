import { useEffect , useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import "./filme-info.css";

import api from "../../services/api"

function Filme(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function loadFilme(){
      await api.get(`/movie/${id}`, {
        params:{
          api_key:"28fc232cc001c31e8a031f419d0a14ca",
          language: "pt-BR",
        }
      })
      .then((response)=>{
        // console.log(response.data);~
        setFilme(response.data);
        setLoading(false);
      })
      .catch(()=>{
        console.log("Filme nao encontrado");
        navigate("/" , { replace: true})
        return;
      })

    }

    loadFilme();

    return() => {
      console.log("COMPONENTE FOI DESMONTANDO")
    }

  },[navigate , id])


  function salvarFilme(){
    const minhaLista = localStorage.getItem("@primeflix");

    let filmesSalvos = JSON.parse(minhaLista) || [] ;

    const hasFilme = filmesSalvos.some((filmesSalvo)=> filmesSalvo.id === filme.id)

    if(hasFilme){
      // alert("Esse filme ja esta na sua lista!");
      toast.warn("Esse filme ja esta na sua lista")
      return;
    }

    filmesSalvos.push(filme);
    localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
    // alert("Filme salvo com sucesso!")
    toast.success("Filme salvo com sucesso!")
  }


  if(loading){
    return(
      <div className="filme-info">
        <h1>Carregando detalhes do filme....</h1>
      </div>
    )
  }

  return(
    <div className="filme-info">
      <h1>{filme.title}</h1>
      <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title} /> 
      <h3>Sinopse</h3>
      <span>{filme.overview}</span>     
      <strong>Avaliação:{filme.vote_average} /10</strong>
      <div className="area-buttons">
        <button onClick={salvarFilme}>Salvar</button>
        <button>
          <a target="_blank" rel="external" href={`https://youtube.com/results?search_query=${filme.title} trailer`}>
            Trailer
          </a>
        </button>
      </div>
    </div>
  )
}

export default Filme;