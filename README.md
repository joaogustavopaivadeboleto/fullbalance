# FullBalance - Seu Sistema Financeiro Pessoal
---

## 📋 Sobre o Projeto

**FullBalance** é uma aplicação web completa para gerenciamento de finanças pessoais. Desenvolvida com as tecnologias mais modernas, permite que o usuário controle suas receitas e despesas de forma intuitiva, organize transações por contas e categorias, e personalize a experiência visual da plataforma.

Este projeto foi construído como um sistema financeiro completo, demonstrando habilidades em desenvolvimento front-end, integração com backend (BaaS) e design de interfaces responsivas.

---

## ✨ Funcionalidades Principais

*   **🔐 Autenticação de Usuários:** Sistema seguro de cadastro e login com e-mail e senha.
*   **📊 Dashboard Interativo:** Visualização rápida do saldo, receitas, despesas e saldos por conta, com filtros dinâmicos por tipo, conta e período.
*   **💸 Gerenciamento de Transações:** Funcionalidades completas de CRUD (Criar, Ler, Atualizar, Excluir) para todas as transações.
*   **💳 Gerenciamento de Contas:** Crie e gerencie múltiplas contas (ex: Carteira, Banco, Cartão de Crédito) com cores personalizadas.
*   **📂 Gerenciamento de Categorias:** Organize suas transações com categorias personalizadas.
*   **🎨 Tema Customizável:** O usuário pode escolher a cor primária da aplicação, que é salva em suas preferências.
*   **📄 Relatórios e Exportação:** Gere relatórios filtrados e exporte os dados de transações para um arquivo `.csv`, compatível com Excel e Google Sheets.
*   **📱 Design Responsivo:** Interface totalmente adaptada para uma experiência perfeita em desktops, tablets e celulares.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com o seguinte stack:

*   **Front-End:**
    *   [**Next.js 14**](https://nextjs.org/ ) (com App Router)
    *   [**React 18**](https://reactjs.org/ )
    *   [**TypeScript**](https://www.typescriptlang.org/ )
*   **Back-End (BaaS):**
    *   [**Firebase**](https://firebase.google.com/ ) (Authentication e Firestore Database)
*   **Estilização:**
    *   **CSS Puro** com Variáveis CSS (para theming)
*   **Estado e Contexto:**
    *   **React Context API**
*   **Ícones:**
    *   [**React Icons**](https://react-icons.github.io/react-icons/ ) (Feather Icons)
*   **Bibliotecas Adicionais:**
    *   `react-day-picker` (para o seletor de datas customizado)
    *   `react-number-format` (para a máscara de input de moeda)
*   **Hospedagem:**
    *   [**Vercel**](https://vercel.com/ )

---

## ⚙️ Como Executar o Projeto Localmente

Para rodar este projeto no seu ambiente de desenvolvimento, siga os passos abaixo.

### **Pré-requisitos**

*   [Node.js](https://nodejs.org/en/ ) (versão 18.x ou superior)
*   [npm](https://www.npmjs.com/ ) ou [yarn](https://yarnpkg.com/ )
*   Uma conta no [Firebase](https://firebase.google.com/ )

### **Passos para Instalação**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/fullbalance.git
    cd fullbalance
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Firebase:**
    *   Crie um projeto no console do Firebase.
    *   Ative os serviços de **Authentication** (com o provedor E-mail/Senha ) e **Firestore Database**.
    *   Vá para as configurações do seu projeto no Firebase (`Project Settings`) e encontre as suas chaves de configuração da web (`firebaseConfig`).

4.  **Configure as Variáveis de Ambiente:**
    *   Na raiz do projeto, crie um arquivo chamado `.env.local`.
    *   Copie o conteúdo do arquivo `.env.example` (se houver) ou adicione as seguintes variáveis com as suas chaves do Firebase:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="SUA_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="SEU_APP_ID"
    ```

5.  **Configure as Regras de Segurança do Firestore:**
    *   No seu banco de dados Firestore, vá para a aba "Regras" (Rules) e cole as regras de segurança desenvolvidas para garantir que cada usuário só possa acessar seus próprios dados.

6.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```

7.  Abra [http://localhost:3000](http://localhost:3000 ) no seu navegador para ver a aplicação funcionando.

---
