import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../api/BASE_URL";

export default function QuizComponent() {
  const [courseData, setCourseData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    // 1. Get Course Info
    axios.get(`${BASE_URL}/api/Ai/Get-fileCoures/1`)
      .then(res => {
        setCourseData(res.data);
      });

    // 2. Get Quiz
    axios.get(`${BASE_URL}/api/Ai/New-Quiz/1`)
      .then(res => {
        setQuizData(res.data);
      });
  }, []);

  const submitAnswers = async () => {
    const payload = {
      sourceId: quizData.sourceId,
      mcqQuestions: quizData.mcqQuestions.map(q => ({
        ...q,
        userAnswer: userAnswers[q.question] || null
      })),
      trueFalseQuestions: quizData.trueFalseQuestions.map(q => ({
        ...q,
        userAnswer: userAnswers[q.question] || null
      })),
      isSubmitted: true,
      score: 0, // server calculates it
      totalQuestions: 10
    };

    try {
      const res = await axios.post(
        "https://edu-smart.runasp.net/api/Ai/Quiz-Result",
        payload
      );
    } catch (err) {
    }
  };

  return (
    <div>
      <h2>Quiz</h2>
      {quizData && (
        <>
          <h3>MCQ Questions</h3>
          {quizData.mcqQuestions.map((q, idx) => (
            <div key={idx}>
              <p>{q.question}</p>
              {q.options.map(opt => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={q.question}
                    value={opt}
                    onChange={(e) =>
                      setUserAnswers(prev => ({ ...prev, [q.question]: e.target.value }))
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <h3>True/False Questions</h3>
          {quizData.trueFalseQuestions.map((q, idx) => (
            <div key={idx}>
              <p>{q.question}</p>
              <label>
                <input
                  type="radio"
                  name={q.question}
                  value="true"
                  onChange={() =>
                    setUserAnswers(prev => ({ ...prev, [q.question]: true }))
                  }
                />
                True
              </label>
              <label>
                <input
                  type="radio"
                  name={q.question}
                  value="false"
                  onChange={() =>
                    setUserAnswers(prev => ({ ...prev, [q.question]: false }))
                  }
                />
                False
              </label>
            </div>
          ))}

          <button onClick={submitAnswers}>Submit Quiz</button>
        </>
      )}
    </div>
  );
}
