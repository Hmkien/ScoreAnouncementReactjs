import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamList from "./Components/Exam/ExamList";
import ConfigExam from "./Components/ConfigExam/ConfigExam";
import Navigation from "./Components/Navigation/navigation";
import Footer from "./Components/Navigation/footer";

const App = () => {
  return (
    <div id="root">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<ExamList />} />
          <Route path="/config-exam/:examId" element={<ConfigExam />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
export default App;
