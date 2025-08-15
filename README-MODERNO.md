# Resumos Prof F.silva - Visualizador Moderno

Um sistema moderno para visualização de documentos HTML com recursos de leitura em voz alta, marcação de texto e anotações pessoais.

## 🚀 Funcionalidades

### ✅ ETAPA 1 - Estrutura e Listagem (IMPLEMENTADA)
- ✅ Listagem automática de arquivos HTML a partir de pastas no servidor
- ✅ Exibição de cada arquivo em visualizador integrado (iframe)
- ✅ Layout responsivo com React + Tailwind
- ✅ Preservação das cores e imagens originais (#b76e00, #2a2f3b, #ff5722)
- ✅ Componentes modernos para botões e navegação

### ✅ ETAPA 2 - Leitura em Voz Alta (IMPLEMENTADA)
- ✅ Botão "Ler em voz alta" no visualizador
- ✅ API Web Speech Synthesis com voz portuguesa-BR
- ✅ Destaque visual (background amarelo) da palavra sendo lida
- ✅ Controles completos: iniciar, pausar, retomar, parar
- ✅ Seleção de voz e velocidade de leitura

### ✅ ETAPA 3 - Marcação e Notas (IMPLEMENTADA)
- ✅ Seleção de texto com opções "Marcar" e "Adicionar Nota"
- ✅ Sistema de marcação e notas salvas no Supabase
- ✅ Notas pessoais como popups no texto marcado
- ✅ Edição e exclusão de marcações e notas
- ✅ Vinculação por usuário autenticado

### ✅ ETAPA 4 - Design Moderno (IMPLEMENTADA)
- ✅ Interface moderna com React + Tailwind
- ✅ Preservação de imagens e cores originais
- ✅ UI moderna: cantos arredondados, sombras suaves, microanimações
- ✅ Responsividade total (desktop, tablet, mobile)
- ✅ Barra superior fixa com controles

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: PHP (mantém compatibilidade com sistema atual)
- **Base de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Ícones**: Lucide React
- **TTS**: Web Speech API

## 📦 Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie `.env.example` para `.env.local`
3. Configure suas chaves do Supabase:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Configurar banco de dados

Execute este SQL no Supabase SQL Editor:

```sql
-- Tabela de highlights
CREATE TABLE highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notas
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  text TEXT NOT NULL,
  note_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own highlights" ON highlights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own highlights" ON highlights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own highlights" ON highlights FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);
```

### 4. Executar aplicação

```bash
# Desenvolvimento
npm start

# Build para produção
npm run build
```

## 🎯 Como Usar

### 1. **Autenticação**
- Acesse a aplicação e crie uma conta ou faça login
- Sistema seguro com Supabase Auth

### 2. **Navegação**
- Clique nas categorias (pastas principais)
- Navegue pelas subcategorias
- Selecione o arquivo para visualizar

### 3. **Leitura em Voz Alta**
- Clique no botão ▶️ para iniciar a leitura
- Use ⏸️ para pausar e ⏹️ para parar
- Ajuste velocidade e selecione voz nas configurações

### 4. **Marcação e Notas**
- Selecione texto no documento
- Escolha "Marcar texto" ou "Adicionar nota"
- Suas anotações ficam salvas e sincronizadas

### 5. **Controles de Zoom**
- Use os botões + e - para ajustar o zoom
- Botão reset para voltar ao tamanho normal

## 🎨 Design System

### Cores (preservadas do original)
- **Primária**: `#b76e00` (laranja/dourado)
- **Secundária**: `#2a2f3b` (azul escuro)
- **Ação**: `#ff5722` (vermelho/laranja)
- **Texto**: `#e0e0e0` (cinza claro)

### Componentes
- Botões com hover effects e transições suaves
- Cards com sombras personalizadas
- Layout responsivo com grid system
- Animações de entrada (fade-in, slide-in)

## 📱 Responsividade

- **Desktop**: Layout em grid com 4-5 colunas
- **Tablet**: Layout em grid com 2-3 colunas
- **Mobile**: Layout em coluna única com botões adaptados

## 🔧 Integração com Sistema Atual

O sistema React funciona junto com o PHP atual:

1. **Backend PHP**: Mantém todas as funções de listagem de arquivos
2. **API Endpoint**: `api/file-structure.php` fornece dados para o React
3. **Arquivos HTML**: Continuam sendo servidos diretamente pelo servidor
4. **Imagens**: Usa a pasta `img/` existente

## 🚀 Deploy

### GitHub Actions (Configurado)
- Push para `main` faz deploy automático via FTP
- Configurar `FTP_PASSWORD` nos secrets do GitHub

### Deploy Manual
```bash
npm run build
# Copiar pasta 'build' para servidor
# Configurar servidor para servir React app
```

## 🔐 Segurança

- Autenticação obrigatória via Supabase
- Row Level Security (RLS) no banco
- CORS configurado para produção
- Dados de usuário isolados por ID

## 🎵 Recursos de Acessibilidade

- Leitura em voz alta com múltiplas vozes
- Controle de velocidade de leitura
- Alto contraste nas marcações
- Navegação por teclado
- Responsividade total

## 🛡️ Notas de Segurança

- Para demonstração, aceita qualquer email/senha
- Em produção, configure validação adequada no Supabase
- Use HTTPS em produção
- Configure domínios permitidos no Supabase

## 📞 Suporte

Sistema desenvolvido para modernizar o visualizador de resumos mantendo todas as funcionalidades originais e adicionando recursos avançados de estudo interativo.
