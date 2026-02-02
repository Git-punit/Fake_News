import { useState, useEffect } from 'react'
import axios from 'axios'
import { Moon, Sun, Search, AlertTriangle, CheckCircle, Brain, Activity } from 'lucide-react'

function App() {
  const [theme, setTheme] = useState('dark')
  const [text, setText] = useState('')
  const [modelType, setModelType] = useState('dl') // 'ml' or 'dl'
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const REAL_SAMPLES = [
    "NASA launches new satellite to monitor climate change. The mission aims to gather critical data on global temperature trends and sea-level rise.",
    "Stock market closes higher today as tech stocks lead the rally. Investors are optimistic about upcoming quarterly earnings reports.",
    "Local election results are in: Mayor Smith wins re-election by a narrow margin after a record turnout at the polls.",
    "New legislation passes to increase funding for public schools, aiming to improve infrastructure and teacher salaries across the state.",
    "Major city announces plans to become carbon neutral by 2030, involving a massive shift to renewable energy and electric public transport."
  ]

  const FAKE_SAMPLES = [
    "Aliens have landed in New York City and are distributing free gold bars to everyone! The government has confirmed that these extraterrestrial visitors are friendly and plan to stay for tea.",
    "President declares water is now illegal, stating that hydration is a sign of weakness. Citizens are urged to drink sand instead.",
    "New study shows chocolate helps you live forever. Scientists claim that eating 1kg of chocolate daily reverses aging completely.",
    "Government creates new department for time travel regulation after a tourist from 2050 accidentally deleted the internet.",
    "Doctors recommend eating rocks for better digestion. A leading 'expert' claims that gravel is essential for a balanced diet.",
    "Celebrity chef claims he can cook pasta with his mind. Witnesses say the water boiled instantly when he stared at it."
  ]

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleSample = (type) => {
    const samples = type === 'real' ? REAL_SAMPLES : FAKE_SAMPLES
    // Get a random sample
    const randomSample = samples[Math.floor(Math.random() * samples.length)]
    setText(randomSample)
    setResult(null)
    setError(null)
  }

  const handleClear = () => {
    setText('')
    setResult(null)
    setError(null)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Assuming backend is running on localhost:5000
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        text: text,
        model_type: modelType
      })

      // Artificial delay for effect
      await new Promise(r => setTimeout(r, 600))

      setResult(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to connect to the analysis engine. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container fade-in">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Activity size={32} className="text-accent" style={{ color: 'var(--accent-color)' }} />
          <div>
            <h1>Veritas AI</h1>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Advanced Fake News Detection</span>
          </div>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <main>
        <div className="card">
          <div className="input-header">
            <span className="input-label">Article Content</span>
            <div className="sample-actions">
              <button onClick={() => handleSample('real')} className="sample-btn">Paste Real Sample</button>
              <button onClick={() => handleSample('fake')} className="sample-btn">Paste Fake Sample</button>
              <button onClick={handleClear} className="sample-btn">Clear</button>
            </div>
          </div>

          <div className="textarea-container">
            <textarea
              id="news-input"
              placeholder="Paste the news article or headline here to verify its authenticity..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck="false"
            />
            <div className="word-count">{wordCount} words</div>
          </div>

          <div className="controls">
            <div className="model-selector">
              <button
                className={`model-btn ${modelType === 'ml' ? 'active' : ''}`}
                onClick={() => setModelType('ml')}
              >
                Machine Learning
              </button>
              <button
                className={`model-btn ${modelType === 'dl' ? 'active' : ''}`}
                onClick={() => setModelType('dl')}
              >
                Deep Learning
              </button>
            </div>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
            >
              {loading ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Brain size={20} /> Detect Fake News
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="card fade-in" style={{ marginTop: '2rem', borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={24} />
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {result && (
          <div className="card result-section fade-in">
            <div className={`result-badge ${result.prediction === 'Fake' ? 'result-fake' : 'result-real'}`}>
              {result.prediction === 'Fake' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={24} /> FAKE NEWS DETECTED
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={24} /> LIKELY REAL NEWS
                </span>
              )}
            </div>

            <div style={{ padding: '0 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Confidence Score</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-color)' }}>
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="confidence-bar-bg">
                <div
                  className="confidence-bar-fill"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <p className="meta-info">
                Analysis performed using <strong>{result.model_used}</strong>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
