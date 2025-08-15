# 🎯 COMO EXECUTAR O SISTEMA MODERNO

## Opção 1: Execução Automática (Recomendado)

### Windows (PowerShell)
```powershell
.\start-dev.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x start-dev.sh
./start-dev.sh
```

## Opção 2: Execução Manual

### 1. Instalar dependências (apenas na primeira vez)
```bash
npm install
```

### 2. Iniciar servidor PHP (Terminal 1)
```bash
php -S localhost:8080
```

### 3. Iniciar React (Terminal 2)
```bash
npm start
```

## 🌐 Acessos

- **Aplicação React**: http://localhost:3000
- **Servidor PHP**: http://localhost:8080
- **API de arquivos**: http://localhost:8080/api/file-structure.php

## 🔧 Configuração Inicial

### 1. Configurar Supabase (Opcional para demonstração)
1. Copie `.env.example` para `.env.local`
2. Configure suas chaves do Supabase
3. Execute o SQL no Supabase para criar as tabelas

### 2. Sem Supabase (Modo Demonstração)
- O sistema funcionará com dados locais simulados
- Autenticação aceita qualquer email/senha

## ✅ Verificação

1. ✅ React carregando em http://localhost:3000
2. ✅ PHP respondendo em http://localhost:8080
3. ✅ API retornando dados em http://localhost:8080/api/file-structure.php
4. ✅ Arquivos HTML acessíveis em http://localhost:8080/resumos/

## 🎮 Como Usar

### 1. **Login/Cadastro**
- Tela inicial com formulário de autenticação
- Para demonstração: use qualquer email/senha
- Sistema criará conta automaticamente

### 2. **Navegação**
- **Categorias**: Clique nas pastas principais (ex: DIREITO-PENAL)
- **Subcategorias**: Clique nas subpastas ou "Arquivos Principais"
- **Arquivos**: Clique no arquivo para abrir o visualizador

### 3. **Visualizador de Documentos**
#### Barra de Ferramentas:
- ❌ **Fechar**: Volta para lista de arquivos
- ▶️ **Play**: Inicia leitura em voz alta
- ⏸️ **Pausa**: Pausa/retoma leitura
- ⏹️ **Stop**: Para leitura completamente
- 🔍 **Zoom In/Out/Reset**: Controla zoom do documento
- 🔊 **Voz**: Seleciona voz para leitura (1, 2, 3...)
- ⚡ **Velocidade**: Ajusta velocidade (0.5x a 2x)

### 4. **Leitura em Voz Alta**
1. Clique no botão ▶️ na barra de ferramentas
2. O sistema extrairá o texto do documento
3. Palavras sendo lidas ficam destacadas em **amarelo**
4. Use controles para pausar/parar conforme necessário

### 5. **Marcações e Notas**
1. **Selecionar texto** no documento
2. **Menu aparece** automaticamente com opções:
   - 📝 **Marcar texto**: Destaca permanentemente
   - 🗒️ **Adicionar nota**: Cria nota pessoal
3. **Notas salvas** aparecem como pop-ups no texto
4. **Editar/excluir** clicando nas marcações

## 🎨 Interface

### Design Preservado
- **Cores originais**: #b76e00, #2a2f3b, #ff5722
- **Imagem de fundo**: img/1.jpg (original)
- **Fontes**: Inter + sistema original

### Responsividade
- **Desktop**: Grade 4-5 colunas
- **Tablet**: Grade 2-3 colunas  
- **Mobile**: Coluna única, botões adaptados

## 🔧 Funcionalidades Avançadas

### TTS (Text-to-Speech)
- Múltiplas vozes em português
- Controle de velocidade
- Destaque visual sincronizado
- Pausa/retoma em qualquer momento

### Sistema de Anotações
- Highlights amarelos para texto marcado
- Notas verdes com conteúdo personalizado
- Sincronização com servidor (Supabase)
- Edição e exclusão de anotações

### Navegação Intuitiva
- Breadcrumbs visuais
- Botões de volta em cada nível
- Animações suaves de transição
- Loading states informativos

## 🚨 Solução de Problemas

### Erro: "Cannot find module"
```bash
npm install
```

### PHP não inicia
- Verificar se PHP está instalado: `php --version`
- Porta 8080 ocupada? Altere para 8081 no script

### React não conecta com PHP
- Verificar se ambos servidores estão rodando
- Testar API diretamente: http://localhost:8080/api/file-structure.php

### Supabase não conecta
- Verificar chaves no .env.local
- Testar autenticação local (modo demo)

## 📱 Deploy em Produção

### Build para produção
```bash
npm run build
```

### Deploy com GitHub Actions (já configurado)
- Push para branch `main`
- Deploy automático via FTP

### Deploy manual
1. `npm run build`
2. Copiar pasta `build` para servidor
3. Configurar servidor web para servir React SPA
4. Manter arquivos PHP no servidor

## 🎯 Principais Melhorias

### ✅ Interface Moderna
- React + Tailwind CSS
- Animações suaves
- Design responsivo total

### ✅ Funcionalidades Avançadas
- Leitura em voz alta inteligente
- Sistema de anotações personais
- Sincronização multi-dispositivo

### ✅ Mantém Compatibilidade
- Todos arquivos HTML funcionam
- Backend PHP inalterado
- Imagens e assets preservados

### ✅ Experiência de Usuário
- Carregamento rápido
- Navegação intuitiva
- Controles acessíveis

O sistema está pronto para uso! 🚀
