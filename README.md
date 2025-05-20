# 📚 Quiz App

Um aplicativo de simulado para certificações, ideal para estudantes e profissionais que desejam testar seus conhecimentos de forma prática e eficiente. O app permite **upload de arquivos CSV com questões**, fornece **feedback instantâneo**, armazena o **histórico de tentativas** e oferece a opção de **refazer o quiz com perguntas em ordem aleatória**.

---

## 🚀 Demonstração

Acesse localmente: [http://localhost:5173](http://localhost:5173)

---

## ✨ Funcionalidades

- ✅ Upload de questões via arquivos CSV  
- 🧠 Feedback imediato após cada tentativa (respostas corretas e incorretas)  
- 🕒 Histórico completo de tentativas realizadas  
- 🔁 Refazer quiz com **ordem aleatória** das perguntas  
- 📊 Visual limpo e responsivo, com componentes modernos  

---

## 📁 Formato Aceito de Arquivo CSV

O arquivo CSV deve conter os seguintes cabeçalhos, **na primeira linha**:

```csv
question,optionA,optionB,optionC,optionD,answer
```
## 📝 Exemplo:
```csv
question,optionA,optionB,optionC,optionD,answer
What is AI?,Artificial Intelligence,Automated Inference,Advanced Internet,Artificial Integration,Artificial Intelligence
What is the capital of France?,Paris,London,Berlin,Madrid,Paris
```
## ⚙️ Como Rodar Localmente
1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/quiz-app.git
cd quiz-app
```
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor:
```bash
npm run dev
```
4. Abra no navegador:
```bash
http://localhost:3000
```
## 🛠️ Tecnologias Utilizadas
- React — Biblioteca JavaScript para construção de interfaces
- TypeScript — Tipagem estática para JavaScript
- Tailwind CSS — Framework utilitário de CSS
- Shadcn UI — Componentes UI modernos baseados em Tailwind
- PapaParse — Biblioteca para leitura e parsing de arquivos CSV

## 📌 Próximos Passos (roadmap)
 - Suporte a múltiplos tipos de questões (ex: verdadeiro/falso)
 - Exportação do histórico como CSV ou PDF
 - Área do usuário com login e ranking
 - Timer e cronômetro para quizzes
 - Modo "Revisão" para estudar questões erradas

## 🤝 Contribuindo
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues, sugerir melhorias ou enviar pull requests.
