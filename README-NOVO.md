# 🎓 Sistema Moderno de Visualização de Resumos

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.6-blue?logo=tailwindcss)](https://tailwindcss.com)
[![PHP](https://img.shields.io/badge/PHP-8.0+-purple?logo=php)](https://php.net)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green?logo=supabase)](https://supabase.com)

Aplicação moderna para visualização de arquivos HTML com funcionalidades de **leitura em voz alta**, **marcação de texto** e **anotações pessoais**. Mantém o design original mas com interface React moderna.

## ✨ Funcionalidades Principais

- 📁 **Navegação Intuitiva**: Explore pastas e arquivos de forma fluida
- 🔊 **Leitura em Voz Alta**: TTS inteligente com destaque de palavras
- ✏️ **Sistema de Marcações**: Destaque textos importantes
- 📝 **Notas Personais**: Adicione anotações sincronizadas
- 📱 **Responsivo Total**: Funciona em desktop, tablet e mobile
- 🔐 **Autenticação**: Sistema seguro com Supabase
- 🎨 **Design Preservado**: Mantém cores e imagens originais

## 🚀 Início Rápido

### Windows (PowerShell) - Recomendado
```powershell
.\start-dev.ps1
```

### Manual
```bash
# 1. Instalar dependências
npm install

# 2. Terminal 1: Servidor PHP
php -S localhost:8080

# 3. Terminal 2: React
npm start
```

🌐 **Acesse**: http://localhost:3000

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Web Speech API** para leitura

### Backend
- **PHP** para API e arquivos
- **Supabase** para autenticação e dados
- **Proxy HTTP** para integração

### Funcionalidades Avançadas
- Text-to-Speech com múltiplas vozes
- Highlights dinâmicos durante leitura
- Sistema de notas com CRUD completo
- Zoom e controles de visualização

## 📖 Como Usar

### 1. **Autenticação**
- Para demonstração: qualquer email/senha funciona
- Para produção: configurar Supabase no `.env.local`

### 2. **Navegação**
- **Pastas** → **Subpastas** → **Arquivos**
- Clique nos cards para navegar
- Use botões "Voltar" para retornar

### 3. **Visualizador**
#### Barra de Ferramentas:
- ▶️ **Play/Pause**: Controla leitura TTS
- ⏹️ **Stop**: Para leitura completamente  
- 🔍 **Zoom**: In/Out/Reset
- 🔊 **Voz**: Seleção de voz (1,2,3...)
- ⚡ **Velocidade**: 0.5x até 2x

#### Marcações:
- **Selecione texto** → Menu aparece
- 📝 **Marcar**: Destaque amarelo permanente
- 🗒️ **Nota**: Pop-up verde com texto personalizado

## 🎨 Interface

### Design System
- **Primário**: `#b76e00` (Laranja)
- **Secundário**: `#2a2f3b` (Azul escuro)
- **Ação**: `#ff5722` (Vermelho)
- **Fonte**: Inter + Original

### Responsividade
- **Desktop**: 4-5 colunas
- **Tablet**: 2-3 colunas
- **Mobile**: 1 coluna adaptativa

## 🔧 Arquitetura

```
src/
├── components/          # Componentes React
│   ├── Auth.tsx        # Tela de login
│   ├── FolderGrid.tsx  # Grade de pastas
│   ├── FileGrid.tsx    # Grade de arquivos
│   └── DocumentViewer.tsx # Visualizador principal
├── hooks/              # Hooks customizados
│   ├── useAuth.ts      # Autenticação
│   └── useTTS.ts       # Text-to-Speech
├── services/           # Serviços
│   ├── supabase.ts     # Cliente Supabase
│   └── annotationService.ts # CRUD anotações
└── types/              # Tipos TypeScript

api/
└── file-structure.php  # API de estrutura de arquivos

resumos/                # Arquivos HTML originais
├── DIREITO-PENAL/
├── DIREITO-CONSTITUCIONAL/
└── ...
```

## 🚀 Deploy

### Desenvolvimento
```bash
npm start  # React em localhost:3000
php -S localhost:8080  # PHP API
```

### Produção
```bash
npm run build  # Gera build otimizado
# Copiar pasta build/ para servidor
# Configurar servidor para React SPA
```

### GitHub Actions (Já configurado)
- Push para `main` → Deploy automático via FTP
- Servidor: resumos.sanguedepolicia.com.br

## 📱 Principais Melhorias

### ✅ **Interface Moderna**
- React com Tailwind CSS
- Animações fluidas e responsivas
- Loading states e feedback visual

### ✅ **Funcionalidades Avançadas**  
- Leitura em voz alta sincronizada
- Sistema de anotações pessoais
- Autenticação e dados na nuvem

### ✅ **Mantém Compatibilidade**
- Todos os arquivos HTML funcionam
- Backend PHP original preservado
- Assets e imagens inalterados

### ✅ **Experiência Superior**
- Navegação intuitiva com breadcrumbs
- Controles de acessibilidade
- Performance otimizada

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Clone** localmente
3. **Instale** dependências: `npm install`
4. **Desenvolva** e teste
5. **Commit** e **Push**
6. **Pull Request**

## 📄 Licença

Este projeto mantém a estrutura original do sistema de resumos, adicionando uma camada moderna de interface e funcionalidades.

---

**Desenvolvido com ❤️ usando React, TypeScript e PHP**

🌐 **Demo**: http://resumos.sanguedepolicia.com.br
📖 **Docs**: [COMO-USAR.md](./COMO-USAR.md)
