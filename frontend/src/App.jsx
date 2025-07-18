import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import JobForm from './pages/JobForm';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs/:id/edit" element={<JobForm />} />
          <Route path="/create" element={<JobForm />} />
          <Route path="/stats" element={<Statistics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;