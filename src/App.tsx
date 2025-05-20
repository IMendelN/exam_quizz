import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { motion } from "framer-motion";
import "./styles/quizapp.css";

interface CsvRow {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
}

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface Attempt {
  questions: Question[];
  answers: string[];
  score: number;
}

export default function QuizApp() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOptionChange = (letter: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = letter;
    setSelectedAnswers(updatedAnswers);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    input.value = "";

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedQuestions = (results.data as CsvRow[])
          .filter((row) => row.question && row.question.trim() !== "")
          .map((row) => ({
            question: row.question,
            options: [row.optionA, row.optionB, row.optionC, row.optionD],
            answer: row.answer,
          }));
        setQuestions(parsedQuestions);
        setSelectedAnswers(Array(parsedQuestions.length).fill(""));
        setSubmitted(false);
        setCurrentIndex(0);
      },
    });
  };

  const handleRetry = () => {
    setSelectedAnswers(Array(questions.length).fill(""));
    setSubmitted(false);
    setCurrentIndex(0);
  };

  const handleSubmit = () => {
    const score = questions.reduce((acc, question, i) => {
      const correct = question.answer.trim().toUpperCase();
      const selected = (selectedAnswers[i] || "").trim().toUpperCase();
      return correct === selected ? acc + 1 : acc;
    }, 0);

    setSubmitted(true);
    setHistory([...history, { questions, answers: selectedAnswers, score }]);
  };

  const reshuffleAndRetake = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setSelectedAnswers(Array(shuffled.length).fill(""));
    setSubmitted(false);
    setCurrentIndex(0);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const downloadExampleCSV = () => {
    const link = document.createElement("a");
    link.href = "/public/exemplo-quiz.csv";
    link.download = "exemplo-quiz.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <div className="header">
        <img src="/quiz-icon.svg" alt="Logo" className="logo" />
        <h1 className="title">Quiz App</h1>
      </div>
      <h2 className="subtitle">Teste seus conhecimentos</h2>

      <div className="upload-section">
        <label
          htmlFor="file-upload"
          className="block mb-2 font-semibold text-gray-700"
        >
          Upload Question CSV File
        </label>

        {/* input file escondido */}
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: "none" }} // escondido
        />

        {/* botão que dispara o clique do input file */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button
            className="upload-button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Selecionar arquivo CSV
          </Button>

          <Button
            className="download-example-button"
            variant="ghost"
            onClick={downloadExampleCSV}
          >
            Baixar Exemplo CSV
          </Button>
        </div>
      </div>

      {questions.length > 0 && !submitted && (
        <Card className="card">
          <CardContent>
            <p className="question-count">
              Pergunta {currentIndex + 1} de {questions.length}
            </p>
            <h2 className="question-text">
              {currentIndex + 1}. {questions[currentIndex].question}
            </h2>

            <div className="options">
              {questions[currentIndex].options.map((opt, optIndex) => {
                const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
                const selected = selectedAnswers[currentIndex] === letter;

                return (
                  <label
                    key={optIndex}
                    className={`option-label ${selected ? "selected" : ""} ${
                      submitted ? "disabled" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentIndex}`}
                      value={letter}
                      checked={selected}
                      onChange={() => handleOptionChange(letter)}
                      disabled={submitted}
                    />
                    <span className="option-text">
                      {letter}. {opt}
                    </span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <p
                className={
                  selectedAnswers[currentIndex] ===
                  questions[currentIndex].answer
                    ? "feedback-correct"
                    : "feedback-wrong"
                }
              >
                Resposta correta: {questions[currentIndex].answer}.{" "}
                {
                  questions[currentIndex].options[
                    questions[currentIndex].answer.charCodeAt(0) - 65
                  ]
                }
              </p>
            )}

            <div className="buttons">
              <Button
                onClick={goBack}
                disabled={currentIndex === 0}
                className="button button-outline"
              >
                Voltar
              </Button>

              {currentIndex === questions.length - 1 ? (
                !submitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswers[currentIndex] === ""}
                    className="button"
                  >
                    Enviar Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={reshuffleAndRetake}
                    className="button button-outline"
                  >
                    Refazer com Nova Ordem
                  </Button>
                )
              ) : (
                <Button
                  onClick={goNext}
                  disabled={selectedAnswers[currentIndex] === ""}
                  className="button"
                >
                  Avançar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="score-box"
        >
          <h3>
            Score:{" "}
            {questions.filter((q, i) => q.answer === selectedAnswers[i]).length}{" "}
            / {questions.length}
          </h3>
          <div className="buttons" style={{ marginTop: 16 }}>
            <Button
              onClick={handleRetry}
              className="button"
              style={{ marginRight: 8 }}
            >
              Tentar Novamente
            </Button>
            <Button
              onClick={reshuffleAndRetake}
              className="button button-outline"
            >
              Refazer com Nova Ordem
            </Button>
          </div>
        </motion.div>
      )}

      {history.length > 0 && (
        <div>
          <h3 className="history-title">Histórico de Tentativas</h3>
          {history.map((attempt, idx) => (
            <Card key={idx} className="history-card">
              <CardContent>
                <h4>
                  Tentativa {idx + 1} - Score: {attempt.score} /{" "}
                  {attempt.questions.length}
                </h4>
                {attempt.questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className={`history-question ${
                      attempt.answers[qIdx]?.toUpperCase() ===
                      q.answer.toUpperCase()
                        ? "correct"
                        : "wrong"
                    }`}
                  >
                    <p>
                      {qIdx + 1}. {q.question}
                    </p>
                    <p className="history-answer">
                      Sua resposta: {attempt.answers[qIdx]}
                    </p>
                    <p className="history-correct">Correta: {q.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
