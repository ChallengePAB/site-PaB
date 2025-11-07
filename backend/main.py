import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Configuração ---
app = FastAPI(title="API de Notícias PaB")

# Configuração do CORS
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

# Caminho do arquivo de dados
ARQUIVO_NOTICIAS = os.path.join(os.path.dirname(__file__), "data", "noticias.json")

# --- Modelos ---
class ConteudoNoticia(BaseModel):
    type: str = Field(..., description="Tipo de conteúdo (ex: 'paragraph', 'image', 'subtitle').")
    value: str = Field(..., description="O valor do conteúdo (texto do parágrafo, URL da imagem, etc.).")

class BaseNoticia(BaseModel):
    imagem: str
    titulo: str
    subtitulo: str
    time: Optional[str] = None
    assunto: Optional[str] = None
    conteudo: List[ConteudoNoticia]

class Noticia(BaseNoticia):
    id: int

# --- Funções de Manipulação de Arquivo ---
def ler_dados_noticias():
    """Lê os dados de notícias do arquivo JSON."""
    try:
        if not os.path.exists(ARQUIVO_NOTICIAS):
            return {"noticiaPrincipal": None, "noticiasSecundarias": []}

        with open(ARQUIVO_NOTICIAS, "r", encoding="utf-8") as f:
            return json.load(f)

    except json.JSONDecodeError as e:  # 🧩 erro de formatação JSON
        raise HTTPException(status_code=500, detail=f"Erro ao decodificar JSON: {e}")
    except Exception as e:  # 🧩 erro genérico
        raise HTTPException(status_code=500, detail=f"Erro ao ler o arquivo de notícias: {e}")

def escrever_dados_noticias(dados):
    """Escreve os dados de notícias no arquivo JSON."""
    try:
        os.makedirs(os.path.dirname(ARQUIVO_NOTICIAS), exist_ok=True)
        with open(ARQUIVO_NOTICIAS, "w", encoding="utf-8") as f:
            json.dump(dados, f, indent=2, ensure_ascii=False)
    except Exception as e:  # 🧩 erro ao salvar
        raise HTTPException(status_code=500, detail=f"Erro ao salvar os dados: {e}")

# --- Funções Auxiliares ---
def obter_todas_noticias():
    try:
        dados = ler_dados_noticias()
        todas = []
        if dados.get("noticiaPrincipal"):
            todas.append(dados["noticiaPrincipal"])
        todas.extend(dados.get("noticiasSecundarias", []))
        return todas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter notícias: {e}")

def encontrar_noticia_por_id(noticia_id: int):
    try:
        dados = ler_dados_noticias()

        # Verifica notícia principal
        principal = dados.get("noticiaPrincipal")
        if principal and principal.get("id") == noticia_id:
            return principal, "noticiaPrincipal"

        # Verifica secundárias
        for i, noticia in enumerate(dados.get("noticiasSecundarias", [])):
            if noticia.get("id") == noticia_id:
                return noticia, ("noticiasSecundarias", i)

        return None, None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar notícia por ID: {e}")

def gerar_novo_id(dados):
    try:
        ids = []
        if dados.get("noticiaPrincipal"):
            ids.append(dados["noticiaPrincipal"]["id"])
        ids.extend([n["id"] for n in dados.get("noticiasSecundarias", [])])
        return max(ids) + 1 if ids else 1
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar novo ID: {e}")

# --- Rotas ---
@app.get("/api/news", response_model=List[Noticia])
def listar_noticias():
    try:
        return obter_todas_noticias()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar notícias: {e}")

@app.get("/api/news/{news_id}", response_model=Noticia)
def obter_noticia(news_id: int):
    try:
        noticia, _ = encontrar_noticia_por_id(news_id)
        if not noticia:
            raise HTTPException(status_code=404, detail="Notícia não encontrada")
        return noticia
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter notícia: {e}")

@app.post("/api/news", response_model=Noticia, status_code=201)
def criar_noticia(noticia_data: BaseNoticia):
    try:
        dados = ler_dados_noticias()
        novo_id = gerar_novo_id(dados)
        nova_noticia = Noticia(id=novo_id, **noticia_data.model_dump())

        if "noticiasSecundarias" not in dados:
            dados["noticiasSecundarias"] = []

        dados["noticiasSecundarias"].append(nova_noticia.model_dump())
        escrever_dados_noticias(dados)
        return nova_noticia
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar notícia: {e}")

@app.put("/api/news/{news_id}", response_model=Noticia)
def atualizar_noticia(news_id: int, noticia_data: BaseNoticia):
    try:
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar notícia: {e}")

@app.delete("/api/news/{news_id}", status_code=204)
def deletar_noticia(news_id: int):
    try:
        dados = ler_dados_noticias()
        noticia, chave = encontrar_noticia_por_id(news_id)

        if not noticia:
            raise HTTPException(status_code=404, detail="Notícia não encontrada")

        if chave == "noticiaPrincipal":
            raise HTTPException(status_code=403, detail="Não é permitido deletar a notícia principal.")
        elif isinstance(chave, tuple) and chave[0] == "noticiasSecundarias":
            del dados["noticiasSecundarias"][chave[1]]

        escrever_dados_noticias(dados)
        return {"message": "Notícia deletada com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar notícia: {e}")

# --- Rota de Teste ---
@app.get("/")
def ler_raiz():
    return {"message": "API de Notícias PaB (Python) está rodando!"}

# --- Migração ---
def migrar_conteudo_antigo():
    try:
        dados = ler_dados_noticias()

        def converter_noticia(n):
            if isinstance(n.get("conteudo"), str):
                n["conteudo"] = [{"type": "paragraph", "value": n["conteudo"]}]
            return n

        if dados.get("noticiaPrincipal"):
            dados["noticiaPrincipal"] = converter_noticia(dados["noticiaPrincipal"])
        if dados.get("noticiasSecundarias"):
            dados["noticiasSecundarias"] = [converter_noticia(n) for n in dados["noticiasSecundarias"]]

        escrever_dados_noticias(dados)
    except Exception as e:
        print(f"⚠️ Erro na migração de conteúdo: {e}")

migrar_conteudo_antigo()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
