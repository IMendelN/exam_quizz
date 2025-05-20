# Quiz App

Um app de simulado para certificações com suporte a upload de arquivos CSV com perguntas, feedback de respostas e histórico de tentativas.

## 🚀 Como rodar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/quiz-app.git
cd quiz-app
```
2. Instale as dependências:
```bash
npm install
```
3. Rode o servidor:
```bash
npm run dev
```
4. Acesse no navegador:
```bash
http://localhost:3000
```
## 📁 Formato do CSV aceito
O arquivo CSV deve conter os seguintes cabeçalhos:
```csv
question,optionA,optionB,optionC,optionD,answer
```
Exemplo:
```csv
question,optionA,optionB,optionC,optionD,answer
What is AI?,Artificial Intelligence,Automated Inference,Advanced Internet,Artificial Integration,Artificial Intelligence
...
```
## 🧠 Funcionalidades
Upload de questões via CSV

Resposta com feedback de acertos e erros

Histórico de tentativas

Refazer quiz com ordem aleatória das perguntas

## 📦 Tecnologias
React

TypeScript

TailwindCSS

Shadcn UI

Papaparse (para ler CSV)



