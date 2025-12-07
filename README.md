# Sistema de Estudos - RoupaLeve

Este projeto é uma aplicação web para estudos, oferecendo acesso a capítulos de conteúdo técnico e simulados para testar o conhecimento. Desenvolvido com React, Vite e Tailwind CSS.

## 🚀 Tecnologias Utilizadas

- **[React](https://reactjs.org/)**: Biblioteca para construção de interfaces de usuário.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build rápida e leve.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS utilitário para estilização rápida.
- **[React Router](https://reactrouter.com/)**: Roteamento para navegação SPA (Single Page Application).
- **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones.

## 📁 Estrutura do Projeto

```
/
├── public/              # Arquivos estáticos e dados
│   ├── cap1..5/         # Conteúdo dos capítulos (texto e JSON de questões)
│   └── chapters.json    # Configuração dos capítulos disponíveis
├── src/
│   ├── components/      # Componentes reutilizáveis (QuizManager, etc.)
│   ├── layouts/         # Layouts da aplicação (Sidebar, MainLayout)
│   ├── pages/           # Páginas principais (ChapterPage, SimulationPage)
│   └── main.jsx         # Ponto de entrada da aplicação
└── index.html           # Arquivo HTML principal
```

## 🛠️ Instalação e Execução

Pré-requisitos: Node.js instalado.

1.  **Clone o repositório ou acesse a pasta:**
    ```bash
    cd RoupaLeve
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O projeto estará rodando em `http://localhost:5173`.

## 🏗️ Build para Produção

Para gerar a versão otimizada para produção:

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist`.

## 📝 Customização de Conteúdo

- **Adicionar Capítulos**:
    1. Crie uma pasta `capX` em `public/`.
    2. Adicione `cap.txt` (conteúdo), `multi.json` (questões múltipla escolha) e `dissertativas.json` (questões dissertativas).
    3. Registre o novo capítulo em `public/chapters.json`.

- **Estilização**:
    - O tema visual é controlado via Tailwind CSS.
    - Alterações globais podem ser feitas em `src/index.css`.
