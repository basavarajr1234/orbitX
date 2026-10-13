import React, { useState, useEffect } from 'react';
import { MockTest, TestAttempt } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Timer,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Clock,
  ArrowRight,
  ArrowLeft,
  Send
} from 'lucide-react';

export const MockTestPage: React.FC = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [loading, setLoading] = useState(true);

  // In-test states
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [userHistory, setUserHistory] = useState<TestAttempt[]>([]);

  useEffect(() => {
    api.getMockTests().then(data => {
      setTests(data);
      setLoading(false);
    });

    if (user) {
      api.getTestHistory().then(hist => setUserHistory(hist)).catch(() => {});
    }
  }, [user]);

  // Timer countdown
  useEffect(() => {
    if (!activeTest || result || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, result, timeLeft]);

  const startTest = async (testSummary: MockTest) => {
    setLoading(true);
    try {
      const fullTest = await api.getMockTest(testSummary.id);
      setActiveTest(fullTest);
      setCurrentQIndex(0);
      setUserAnswers({});
      setResult(null);
      setTimeLeft(fullTest.durationMinutes * 60);
    } catch (e) {
      console.error('Failed to load test', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optIndex
    }));
  };

  const handleAutoSubmit = async () => {
    if (!activeTest) return;
    submitExam();
  };

  const submitExam = async () => {
    if (!activeTest) return;
    setTestSubmitting(true);
    const timeSpent = (activeTest.durationMinutes * 60) - timeLeft;

    try {
      const res = await api.submitMockTest(activeTest.id, {
        answers: userAnswers,
        timeSpentSeconds: timeSpent
      });
      setResult(res);

      if (res.percentage >= 60) {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      if (user) {
        api.getTestHistory().then(hist => setUserHistory(hist)).catch(() => {});
      }
    } catch (e) {
      console.error('Submission failed', e);
    } finally {
      setTestSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If viewing results review
  if (result && activeTest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
        {/* Results Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
              Test Completed Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {activeTest.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto pt-4 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-slate-400">Total Score</p>
              <p className="text-xl font-bold text-white mt-1">{result.score} / {result.totalMarks}</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-slate-400">Accuracy Rate</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">{result.percentage}%</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-slate-400">Correct / Total</p>
              <p className="text-xl font-bold text-white mt-1">{result.correctCount} / {result.totalQuestions}</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <p className="text-slate-400">Time Taken</p>
              <p className="text-xl font-bold text-cyan-400 mt-1">
                {Math.floor(result.attempt.timeSpentSeconds / 60)}m {result.attempt.timeSpentSeconds % 60}s
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => { setActiveTest(null); setResult(null); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
            >
              Back to Tests Catalog
            </button>
            <button
              onClick={() => startTest(activeTest)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <RotateCcw className="w-4 h-4" /> Retake Test
            </button>
          </div>
        </div>

        {/* Question by Question Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Step-by-Step Question Review & Explanations</h3>

          <div className="space-y-4">
            {result.reviewQuestions.map((q: any, idx: number) => (
              <div
                key={q.id}
                className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 space-y-3 ${
                  q.isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 font-bold">Question {idx + 1}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    q.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{q.isCorrect ? `Correct (+${q.marks})` : 'Incorrect (0)'}</span>
                  </span>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed">
                  {q.question}
                </p>

                {/* Options display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = q.selectedAnswer === optIdx;
                    const isCorrectOpt = q.correctAnswer === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center gap-2 ${
                          isCorrectOpt
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold'
                            : isSelected
                            ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                            : 'bg-slate-800/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px]">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {q.explanation && (
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-emerald-400 text-[11px] uppercase font-mono block">
                      Official Explanation:
                    </span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If currently taking test
  if (activeTest && activeTest.questions && activeTest.questions.length > 0) {
    const currentQ = activeTest.questions[currentQIndex];
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
        {/* Test Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
              {activeTest.examType} Exam
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 truncate max-w-md">
              {activeTest.title}
            </h2>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <Clock className={`w-4 h-4 ${timeLeft < 180 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            <span className={`text-base font-black font-mono ${timeLeft < 180 ? 'text-rose-400' : 'text-white'}`}>
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>

        {/* Main Test Layout (Question on Left, Palette on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Box */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 min-h-[460px]">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800">
                <span className="font-mono font-bold text-white">
                  Question {currentQIndex + 1} of {activeTest.questions.length}
                </span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                  +{currentQ.marks} Mark
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed mb-6">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[currentQ.id] === oIdx;
                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQ.id, oIdx)}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/10'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(i => i - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="flex items-center gap-3">
                {currentQIndex < activeTest.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex(i => i + 1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={submitExam}
                    disabled={testSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{testSubmitting ? 'Evaluating...' : 'Submit Final Test'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Question Palette
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {activeTest.questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = currentQIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-emerald-400 bg-emerald-500 text-slate-950'
                        : isAnswered
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center justify-between">
                <span>Answered:</span>
                <span className="font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Remaining:</span>
                <span className="font-bold text-slate-300">{activeTest.questions.length - answeredCount}</span>
              </div>
            </div>

            <button
              onClick={submitExam}
              disabled={testSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Submit Test &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Catalog view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-10">
        <div className="max-w-3xl space-y-2">
          <span className="text-[11px] font-mono uppercase font-bold text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            Interactive Exam Simulator
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Timed Mock Tests & Performance Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Practice under real examination conditions for KCET, NEET, Karnataka SSLC, and 2nd PUC with automated scoring, answer keys, and step-by-step solutions.
          </p>
        </div>
      </div>

      {/* Tests Catalog Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Timer className="w-5 h-5 text-emerald-400" />
          <span>Available Mock Exams</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    t.examType === 'KCET' ? 'bg-amber-500/20 text-amber-300' :
                    t.examType === 'NEET' ? 'bg-rose-500/20 text-rose-300' :
                    'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {t.examType} Exam
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {t.durationMinutes} Mins
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {t.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {t.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 pb-2">
                  <span>Questions: <strong className="text-slate-200">{t.questionCount || 5}</strong></span>
                  <span>•</span>
                  <span>Total Marks: <strong className="text-slate-200">{t.totalMarks}</strong></span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => startTest(t)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/15 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Mock Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Attempt History */}
      {userHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Your Recent Test Attempts</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Test Title</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {userHistory.map((att) => (
                  <tr key={att.id}>
                    <td className="py-2.5 px-3 font-semibold text-white">{att.testTitle}</td>
                    <td className="py-2.5 px-3 font-mono">{att.score} / {att.totalMarks}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      {Math.round((att.score / att.totalMarks) * 100)}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">
                      {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(att.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
