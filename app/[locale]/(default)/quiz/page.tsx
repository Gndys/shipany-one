'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: '以下哪个是 React 的核心概念?',
    options: ['虚拟 DOM', '真实 DOM', '影子 DOM', '文档 DOM'],
    correctAnswer: 0,
    explanation: '虚拟 DOM 是 React 的核心概念,它通过在内存中维护一个虚拟的 DOM 树来提高性能。',
  },
  {
    id: 2,
    question: 'Next.js 14 引入了哪个新特性?',
    options: ['Server Actions', 'Client Actions', 'Middleware Actions', 'Edge Actions'],
    correctAnswer: 0,
    explanation: 'Server Actions 是 Next.js 14 的重要特性,允许在服务器端直接处理表单提交和数据变更。',
  },
  {
    id: 3,
    question: 'TypeScript 的主要优势是什么?',
    options: ['运行更快', '类型安全', '文件更小', '兼容性更好'],
    correctAnswer: 1,
    explanation: 'TypeScript 提供静态类型检查,在编译时就能发现潜在的类型错误,提高代码质量。',
  },
  {
    id: 4,
    question: 'Tailwind CSS 属于什么类型的 CSS 框架?',
    options: ['组件库', '实用优先', '语义化', '预处理器'],
    correctAnswer: 1,
    explanation: 'Tailwind CSS 是一个实用优先(Utility-First)的 CSS 框架,通过组合小的实用类来构建界面。',
  },
  {
    id: 5,
    question: '以下哪个 Hook 用于处理副作用?',
    options: ['useState', 'useEffect', 'useContext', 'useMemo'],
    correctAnswer: 1,
    explanation: 'useEffect 用于处理副作用,如数据获取、订阅或手动修改 DOM 等操作。',
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      if (score >= questions.length * 0.8) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setIsCorrect(null);
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    let message = '';
    let emoji = '';

    if (percentage >= 80) {
      message = '太棒了!你是真正的专家!';
      emoji = '🏆';
    } else if (percentage >= 60) {
      message = '不错!继续加油!';
      emoji = '👍';
    } else {
      message = '还需要多多学习哦!';
      emoji = '📚';
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Trophy className="w-20 h-20 mx-auto text-yellow-500" />
              </motion.div>
              <CardTitle className="text-4xl font-bold">测验完成!</CardTitle>
              <CardDescription className="text-2xl">
                {emoji} {message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary">
                  {score} / {questions.length}
                </div>
                <div className="text-xl text-muted-foreground">
                  正确率: {percentage.toFixed(0)}%
                </div>
              </div>

              <div className="space-y-3">
                {questions.map((q, index) => (
                  <motion.div
                    key={q.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    {answeredQuestions[index] &&
                    selectedAnswer === q.correctAnswer ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm">{q.question}</span>
                  </motion.div>
                ))}
              </div>

              <Button onClick={handleRestart} className="w-full" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新开始
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="w-full max-w-3xl space-y-6">
        {/* Progress Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              问题 {currentQuestion + 1} / {questions.length}
            </span>
            <span>得分: {score}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <Card className="shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    前端开发测验
                  </span>
                </div>
                <CardTitle className="text-2xl">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer = index === question.correctAnswer;
                    const showCorrect =
                      answeredQuestions[currentQuestion] && isCorrectAnswer;
                    const showIncorrect =
                      answeredQuestions[currentQuestion] &&
                      isSelected &&
                      !isCorrectAnswer;

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: answeredQuestions[currentQuestion] ? 1 : 1.02 }}
                        whileTap={{ scale: answeredQuestions[currentQuestion] ? 1 : 0.98 }}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={answeredQuestions[currentQuestion]}
                        className={`
                          p-4 rounded-lg border-2 text-left transition-all
                          ${
                            showCorrect
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : showIncorrect
                              ? 'border-red-500 bg-red-50 dark:bg-red-950'
                              : isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }
                          ${
                            answeredQuestions[currentQuestion]
                              ? 'cursor-not-allowed'
                              : 'cursor-pointer'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {showCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                          {showIncorrect && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {answeredQuestions[currentQuestion] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`p-4 rounded-lg ${
                          isCorrect
                            ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="font-semibold mb-1">
                              {isCorrect ? '回答正确!' : '回答错误!'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                {answeredQuestions[currentQuestion] && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <Button onClick={handleNext} className="w-full" size="lg">
                      {currentQuestion < questions.length - 1
                        ? '下一题'
                        : '查看结果'}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
