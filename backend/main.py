import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Configuração ---
app = FastAPI(title="API de Notícias PaB")

# Configuração do CORS para permitir requisições do frontend React
origens = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho para o arquivo JSON de dados
ARQUIVO_NOTICIAS = os.path.join(os.path.dirname(__file__), "data", "noticias.json")



class ConteudoNoticia(BaseModel):
    """Modelo para um parágrafo ou elemento de conteúdo da notícia."""
    type: str = Field(..., description="Tipo de conteúdo (ex: 'paragraph', 'image', 'subtitle').")
    value: str = Field(..., description="O valor do conteúdo (texto do parágrafo, URL da imagem, etc.).")

class BaseNoticia(BaseModel):
    """Modelo base para criação e atualização de notícias."""
    imagem: str = Field(..., description="Nome do arquivo da imagem principal (ex: 'mainPageNews1.png').")
    titulo: str = Field(..., description="Título da notícia.")
    subtitulo: str = Field(..., description="Subtítulo da notícia.")
    conteudo: List[ConteudoNoticia] = Field(..., description="Lista de blocos de conteúdo da notícia.")

class Noticia(BaseNoticia):
    """Modelo completo da notícia com ID."""
    id: int = Field(..., description="ID único da notícia.")

# --- Funções de Manipulação de Arquivo ---



def ler_dados_noticias():
    """Lê os dados de notícias do arquivo JSON."""
    if not os.path.exists(ARQUIVO_NOTICIAS):
        return {"noticiaPrincipal": None, "noticiasSecundarias": []}
    with open(ARQUIVO_NOTICIAS, "r", encoding="utf-8") as f:
        return json.load(f)

def escrever_dados_noticias(dados):
    """Escreve os dados de notícias no arquivo JSON."""
    with open(ARQUIVO_NOTICIAS, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=2, ensure_ascii=False)

# --- Funções Auxiliares de Dados ---

def obter_todas_noticias():
    """Retorna todas as notícias (principal e secundárias) como uma lista plana."""
    dados = ler_dados_noticias()
    todas_as_noticias = []
    if dados.get("noticiaPrincipal"):
        todas_as_noticias.append(dados["noticiaPrincipal"])
    todas_as_noticias.extend(dados.get("noticiasSecundarias", []))
    return todas_as_noticias

def encontrar_noticia_por_id(noticia_id: int):
    """Encontra uma notícia pelo ID e retorna a notícia e sua chave (principal/secundária)."""
    dados = ler_dados_noticias()

    # Verifica a notícia principal
    principal = dados.get("noticiaPrincipal")
    if principal and principal.get("id") == noticia_id:
        return principal, "noticiaPrincipal"
    
    # Verifica as notícias secundárias
    secundarias = dados.get("noticiasSecundarias", [])
    for i, noticia in enumerate(secundarias):
        if noticia.get("id") == noticia_id:
            return noticia, ("noticiasSecundarias", i)
            
    return None, None

def gerar_novo_id(dados):
    """Gera um novo ID para uma notícia."""
    todos_os_ids = []
    if dados.get("noticiaPrincipal"):
        todos_os_ids.append(dados["noticiaPrincipal"]["id"])
    todos_os_ids.extend([n["id"] for n in dados.get("noticiasSecundarias", [])])
    return max(todos_os_ids) + 1 if todos_os_ids else 1

# --- Rotas (Endpoints) ---

@app.get("/api/news", response_model=List[Noticia])
def listar_noticias():
    """Lista todas as notícias."""
    return obter_todas_noticias()

@app.get("/api/news/{news_id}", response_model=Noticia)
def obter_noticia(news_id: int):
    """Obtém uma notícia específica pelo ID."""
    noticia, _ = encontrar_noticia_por_id(news_id)
    if not noticia:
        raise HTTPException(status_code=404, detail="Notícia não encontrada")
    return noticia

@app.post("/api/news", response_model=Noticia, status_code=201)
def criar_noticia(noticia_data: BaseNoticia):
    """Cria uma nova notícia (sempre como secundária)."""
    dados = ler_dados_noticias()
    novo_id = gerar_novo_id(dados)
    nova_noticia = Noticia(id=novo_id, **noticia_data.model_dump())

    if "noticiasSecundarias" not in dados:
        dados["noticiasSecundarias"] = []
    
    dados["noticiasSecundarias"].append(nova_noticia.model_dump())
    escrever_dados_noticias(dados)
    return nova_noticia

@app.put("/api/news/{news_id}", response_model=Noticia)
def atualizar_noticia(news_id: int, noticia_data: BaseNoticia):
    """Atualiza uma notícia existente."""
    dados = ler_dados_noticias()
    noticia, chave = encontrar_noticia_por_id(news_id)
    if not noticia:
        raise HTTPException(status_code=404, detail="Notícia não encontrada")

    noticia_atualizada = Noticia(id=news_id, **noticia_data.model_dump())

    if chave == "noticiaPrincipal":
        dados["noticiaPrincipal"] = noticia_atualizada.model_dump()
    elif isinstance(chave, tuple) and chave[0] == "noticiasSecundarias":
        dados["noticiasSecundarias"][chave[1]] = noticia_atualizada.model_dump()
    escrever_dados_noticias(dados)
    return noticia_atualizada

@app.delete("/api/news/{news_id}", status_code=204)
def deletar_noticia(news_id: int):
    """Deleta uma notícia."""
    dados = ler_dados_noticias()
    noticia, chave = encontrar_noticia_por_id(news_id)

    if not noticia:
        raise HTTPException(status_code=404, detail="Notícia não encontrada")
    if chave == "noticiaPrincipal":

        # Não permite deletar a notícia principal, apenas substituí-la
        raise HTTPException(status_code=403, detail="Não é permitido deletar a notícia principal. Apenas substituí-la com um PUT.")
    elif isinstance(chave, tuple) and chave[0] == "noticiasSecundarias":
        del dados["noticiasSecundarias"][chave[1]]
    escrever_dados_noticias(dados)
    return {"message": "Notícia deletada com sucesso"}

# --- Rota de Teste ---
@app.get("/")
def ler_raiz():
    return {"message": "API de Notícias PaB (Python) está rodando!"}

# --- Inicialização: Converter o conteúdo antigo para o novo formato ---
def migrar_conteudo_antigo():
    """Converte o campo 'conteudo' de string para lista de objetos se for o formato antigo."""
    dados = ler_dados_noticias()
    def converter_noticia(noticia):
        if isinstance(noticia.get("conteudo"), str):
            # Converte a string em um único parágrafo
            noticia["conteudo"] = [{"type": "paragraph", "value": noticia["conteudo"]}]
        return noticia

    # Migra a notícia principal
    if dados.get("noticiaPrincipal"):
        dados["noticiaPrincipal"] = converter_noticia(dados["noticiaPrincipal"])
    # Migra as notícias secundárias
    if dados.get("noticiasSecundarias"):
        dados["noticiasSecundarias"] = [converter_noticia(n) for n in dados["noticiasSecundarias"]]
    escrever_dados_noticias(dados)

# Executa a migração na inicialização
migrar_conteudo_antigo()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)