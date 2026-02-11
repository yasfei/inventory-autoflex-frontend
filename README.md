# ⚡ Inventory Autoflex – Frontend

## 🧭 Descrição

Este projeto é o **frontend** da aplicação **Inventory Autoflex**, desenvolvido com **React 18** e **Redux Toolkit**, consumindo os endpoints do **backend Quarkus** que roda na **porta 8080**.  

O objetivo é gerenciar **produtos** e **matérias-primas**, incluindo:

* Listagem de produtos e matérias-primas.
* Criação, edição e exclusão de produtos.
* Associação de matérias-primas a produtos com validação de quantidade.
* Validação de formulários antes de enviar dados para o backend.

Além disso, foram implementados **testes de componentes** com **Cypress Component Testing**, garantindo que a interface funcione corretamente e validando os principais fluxos da aplicação.

---

## 📊 Funcionalidades

### 🏭 Gestão de Produtos

* CRUD completo de produtos (Create, Read, Update, Delete).
* Validação de campos obrigatórios: código, nome e valor.
* Associações com matérias-primas, incluindo quantidade mínima.
* Atualização e remoção de matérias-primas associadas a um produto.

### 🧱 Gestão de Matérias-Primas

* CRUD completo de matérias-primas.
* Controle de estoque disponível.
* Exclusão de matérias-primas apenas se não estiverem associadas a produtos.

### 🔗 Relações entre Produtos e Matérias-Primas

* Cada produto pode ter múltiplas matérias-primas.
* Cada matéria-prima pode ser associada a múltiplos produtos.
* Listagem de matérias-primas associadas no formulário de edição do produto.

### ✅ Validação e Experiência do Usuário

* Mensagens de erro em campos obrigatórios e quantidades inválidas.
* Confirmação de exclusão antes de remover produtos ou matérias-primas.
* Formulários claros e responsivos com **Tailwind CSS**.
* Feedback visual de ações concluídas (adicionar, atualizar, remover).

---

## 🧩 Tecnologias Utilizadas

* **React 18** – componentes funcionais e hooks (`useState`, `useEffect`).
* **Redux Toolkit** – gerenciamento global de estado para produtos e matérias-primas.
* **Cypress** – testes de componentes e integração, com mocks para APIs.
* **Tailwind CSS** – estilização moderna e responsiva.
* **JavaScript/JSX** – lógica de interface e interação.
* **Quarkus Backend** – integração com endpoints REST (porta 8080).
* **Fetch API** – para consumo de dados do backend.
* **Framer Motion** (opcional) – animações de abertura e fechamento de modais (se aplicável).

---

## ⚙️ Setup

### 1. Clonar o projeto
```
git clone <URL_DO_REPOSITORIO_FRONTEND>
cd inventory-autoflex-frontend
```

### 2. Instalar dependências
```
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo .env com a URL do backend:
VITE_API_URL=http://localhost:8080

### 4. Rodar a aplicação
```
npm run dev
```

O frontend estará disponível em http://localhost:5173 (ou porta configurada no Vite).

---

## 🧪 Testes

- Cypress Component Testing
- Testa formulários, listas e interações da aplicação.
- Garante que mensagens de erro apareçam corretamente.
- Valida a associação de matérias-primas a produtos.
- Comando para rodar testes:
```
npx cypress open --component
```

- ou para rodar todos os testes em CLI:
```
npx cypress run --component
```

💡 Os testes foram implementados com mock do Redux e das APIs, garantindo isolamento e consistência mesmo sem backend em execução.

---

## ☁️ Deploy (opcional)

- Frontend pode ser publicado em Vercel, Netlify ou outro serviço de hospedagem estática.

- Certifique-se de apontar a variável VITE_API_URL para o backend Quarkus.

---

## ✨ Observações

- Todos os formulários possuem validação de campos e confirmação de ações críticas.
- Listas de produtos e matérias-primas atualizam automaticamente ao criar, editar ou excluir.
- Testes de componentes foram feitos com Cypress para garantir funcionamento independente do backend.
- Interface responsiva construída com Tailwind CSS.
- O frontend e o backend são independentes, mas integrados via API REST.
- É possível rodar apenas o frontend com mocks para testes isolados.