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

  const handleOptionChange = (value: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = value;
    setSelectedAnswers(updatedAnswers);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedQuestions = (results.data as CsvRow[]).map((row) => ({
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

  const handleSubmit = () => {
    const correctAnswers = questions.map((q) => q.answer);
    const score = correctAnswers.reduce(
      (acc, ans, i) => (ans === selectedAnswers[i] ? acc + 1 : acc),
      0
    );
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

  return (
    <div className="container">
      <div className="header">
        <img src="../public/quiz-icon.svg" alt="Logo" className="logo" />
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
        <Button
          className="upload-button"
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          Selecionar arquivo CSV
        </Button>
      </div>

      {questions.length > 0 && (
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
                const selected = selectedAnswers[currentIndex] === opt;
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
                      value={opt}
                      checked={selected}
                      onChange={() => handleOptionChange(opt)}
                      disabled={submitted}
                    />
                    <span className="option-text">{opt}</span>
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
                Correct answer: {questions[currentIndex].answer}
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
                  <div key={qIdx} className="history-question">
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
