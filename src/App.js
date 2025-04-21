import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import StarsRating from "./Stars";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY='eb96e2f0';

function ConceptPopup({ title, content, onClose }) {
  return (
    <div className="concept-popup-overlay">
      <div className="concept-popup">
        <button className="btn-close" onClick={onClose}>×</button>
        <h2>{title}</h2>
        {content}
      </div>
    </div>
  );
}

function FiberTreeVisual() {
  const [showDetails, setShowDetails] = useState(false);
  const [operation, setOperation] = useState('Idle');
  const [phase, setPhase] = useState('');
  const [activeNodes, setActiveNodes] = useState([]);
  useEffect(() => {
    const handleStateChange = e => {
      const { type } = e.detail;
      let opText = '';
      let phaseText = 'Render Phase';
      let nodes = [];
      switch (type) {
        case 'search':
          opText = 'Searching for Movies';
          nodes = ['Main','MovieList'];
          break;
        case 'select-movie':
          opText = 'Selecting a Movie';
          nodes = ['Main','MovieList'];
          break;
        case 'add-watched':
          opText = 'Adding Movie to Watched';
          phaseText = 'Commit Phase';
          nodes = ['Main','WatchedSummary'];
          break;
        case 'delete-watched':
          opText = 'Removing Movie from Watched';
          phaseText = 'Commit Phase';
          nodes = ['Main','WatchedSummary'];
          break;
        default:
          opText = 'Idle';
          nodes = [];
      }
      setOperation(opText);
      setPhase(phaseText);
      setActiveNodes(nodes);
    };
    window.addEventListener('stateChange', handleStateChange);
    return () => window.removeEventListener('stateChange', handleStateChange);
  }, []);
  // Determine status badges for each node
  const badges = {
    App: 'Root',
    NavBar: 'Stable',
    Main: activeNodes.includes('Main') ? 'Updating' : 'Stable',
    MovieList: activeNodes.includes('MovieList') ? 'Re-rendering' : 'Stable',
    WatchedSummary: activeNodes.includes('WatchedSummary') ? 'Re-rendering' : 'Stable',
  };
  return (
    <div className="fiber-tree-visual">
      {/* Educational Header */}
      <div className="fiber-explanation">
        <h3>React Fiber Tree Visualization</h3>
        <p>Watch how React updates your components in real-time. The Fiber tree shows the current component hierarchy and helps visualize React's rendering process.</p>
      </div>

      {/* Current Operation Display */}
      <div className="current-operation">
        <div className="operation-status"></div>
        <span className="operation-text">Currently: {operation}</span>
      </div>

      {/* Phase Indicator */}
      <div className="phase-indicator">
        <div className="phase-dot"></div>
        <span className="phase-label">{phase}</span>
      </div>

      {/* Tree Container */}
      <div className="tree-container">
        <div className={`tree-node${activeNodes.includes('App') ? ' active' : ''}`}>
          App
          <span className="status-badge">{badges.App}</span>
        </div>
        
        <div className="tree-level">
          <div className={`tree-node${activeNodes.includes('NavBar') ? ' active' : ''}`}>
            NavBar
            <span className="status-badge">{badges.NavBar}</span>
          </div>
          
          <div className={`tree-node${activeNodes.includes('Main') ? ' active' : ''}`}>
            Main
            <span className="status-badge">{badges.Main}</span>
          </div>
          
          <div className="tree-level">
            <div className={`tree-node${activeNodes.includes('MovieList') ? ' active' : ''}`}>
              MovieList
              <span className="status-badge">{badges.MovieList}</span>
            </div>
            <div className={`tree-node${activeNodes.includes('WatchedSummary') ? ' active' : ''}`}>
              WatchedSummary
              <span className="status-badge">{badges.WatchedSummary}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="info-panel">
        <h4>What's Happening?</h4>
        <div className="info-item">
          <span className="info-icon">🔄</span>
          <div className="info-content">
            <h5>Current Update</h5>
            <p>MovieList is re-rendering because its props changed</p>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">⚡</span>
          <div className="info-content">
            <h5>Performance Impact</h5>
            <p>Only MovieList and its children will update</p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="quick-tips">
        <h4>Quick Tips</h4>
        <div className="tip-item">
          <span className="tip-icon">💡</span>
          <p className="tip-text">Components with red badges are currently being processed by React</p>
        </div>
        <div className="tip-item">
          <span className="tip-icon">💡</span>
          <p className="tip-text">Indented components are children of the component above them</p>
        </div>
      </div>

      {/* Learn More Button */}
      <button className="learn-more-btn" onClick={() => setShowDetails(true)}>
        Learn More About Fiber Tree
      </button>

      {/* Detailed Explanation Popup */}
      {showDetails && (
        <div className="fiber-details-overlay">
          <div className="fiber-details-content">
            <h3>Understanding React Fiber Tree</h3>
            
            <div className="fiber-step">
              <h4>1. Creation Phase</h4>
              <p>React creates a Fiber node for each component in your app. Each node contains:</p>
              <ul>
                <li>Component type and props</li>
                <li>Pointers to parent, child, and sibling nodes</li>
                <li>Pending state updates and effects</li>
              </ul>
            </div>

            <div className="fiber-step">
              <h4>2. Render Phase</h4>
              <p>When state changes occur:</p>
              <ul>
                <li>React walks through the Fiber tree</li>
                <li>Marks nodes that need updates</li>
                <li>Can pause and resume work (time slicing)</li>
                <li>Calculates changes without touching the DOM</li>
              </ul>
            </div>

            <div className="fiber-step">
              <h4>3. Commit Phase</h4>
              <p>After calculations are complete:</p>
              <ul>
                <li>Updates are applied to the DOM</li>
                <li>Effects are scheduled</li>
                <li>Refs are updated</li>
                <li>Lifecycle methods are called</li>
              </ul>
            </div>

            <div className="fiber-step">
              <h4>4. Cleanup Phase</h4>
              <p>After updates are applied:</p>
              <ul>
                <li>Old Fiber nodes are cleaned up</li>
                <li>Effect cleanups are run</li>
                <li>Memory is freed</li>
              </ul>
            </div>

            <button className="close-details-btn" onClick={() => setShowDetails(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReconciliationVisual({ isActive }) {
  const [step, setStep] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setStep(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getNodeStyle = (isChanged) => ({
    backgroundColor: isChanged ? 'rgba(250, 82, 82, 0.2)' : 'var(--color-background-500)',
    border: `2px solid ${isChanged ? '#fa5252' : 'var(--color-primary)'}`,
    padding: '0.8rem',
    borderRadius: '6px',
    margin: '0.5rem 0',
    position: 'relative',
    transition: 'all 0.3s ease'
  });

  const handleExplanationClose = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setShowExplanation(false);
  };

  return (
    <div className="reconciliation-visual">
      <div className="reconciliation-header">
        <h3>React Reconciliation Process</h3>
        <button 
          className="btn-learn"
          onClick={() => setShowExplanation(true)}
          style={{ marginLeft: 'auto' }}
        >
          Learn More
        </button>
      </div>

      <div className="diff-container">
        <div className="diff-sides">
          <div className="diff-side">
            <h4>Current Virtual DOM</h4>
            <div className="tree-view">
              <div style={getNodeStyle(false)}>MovieList
                <div className="tree-children">
                  <div style={getNodeStyle(step === 1)}>Movie: Inception</div>
                  <div style={getNodeStyle(false)}>Movie: Matrix</div>
                  {step >= 2 && <div style={getNodeStyle(true)} className="new-node">Movie: Interstellar</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="diff-side">
            <h4>New Virtual DOM</h4>
            <div className="tree-view">
              <div style={getNodeStyle(false)}>MovieList
                <div className="tree-children">
                  <div style={getNodeStyle(step === 1)}>Movie: Inception</div>
                  <div style={getNodeStyle(false)}>Movie: Matrix</div>
                  <div style={getNodeStyle(true)}>Movie: Interstellar</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="diff-process">
          <div className="diff-arrow">↓</div>
          <div className="diff-steps">
            {step >= 1 && <div className="diff-step">Compare Trees</div>}
            {step >= 2 && <div className="diff-step">Find Differences</div>}
            {step >= 3 && <div className="diff-step">Update DOM</div>}
          </div>
        </div>
      </div>

      {showExplanation && (
        <div className="popup-overlay" onClick={handleExplanationClose}>
          <div className="concept-popup" onClick={e => e.stopPropagation()}>
            <button className="btn-close" onClick={handleExplanationClose}>×</button>
            <h2>Understanding React Reconciliation</h2>
            
            <div className="concept-highlight">
              Reconciliation is React's process of efficiently updating the DOM by comparing Virtual DOM trees.
            </div>

            <h3>The Process:</h3>
            <ol>
              <li>
                <strong>Virtual DOM Comparison</strong>
                <p>React maintains two trees: the current Virtual DOM and a new one with pending updates.</p>
              </li>
              <li>
                <strong>Diffing Algorithm</strong>
                <p>React compares these trees using a sophisticated diffing algorithm that:</p>
                <ul>
                  <li>Compares elements of the same type</li>
                  <li>Uses unique 'key' props to track elements</li>
                  <li>Identifies what has changed, been added, or removed</li>
                </ul>
              </li>
              <li>
                <strong>Efficient Updates</strong>
                <p>React only updates the DOM elements that have actually changed, not the entire tree.</p>
              </li>
            </ol>

            <div className="code-example">
              <pre>{`// Example of how React's reconciliation works
const MovieList = ({ movies }) => {
  return (
    <div>
      {movies.map(movie => (
        <Movie
          key={movie.id}  // Key helps React track changes
          title={movie.title}
        />
      ))}
    </div>
  );
};

// When movies array changes:
// 1. React creates new Virtual DOM
// 2. Compares with current Virtual DOM
// 3. Identifies which Movie components changed
// 4. Only updates those specific DOM nodes`}</pre>
            </div>

            <div className="concept-highlight">
              <h4>Key Benefits:</h4>
              <ul>
                <li>Minimizes actual DOM manipulation</li>
                <li>Improves performance by batching updates</li>
                <li>Ensures UI consistency</li>
                <li>Handles complex UI updates efficiently</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReactConceptExplainer({ concept, onClose }) {
  const concepts = {
    fiberTree: {
      title: "React Fiber Tree",
      description: "React uses a Fiber tree (a linked list) to track component relationships and manage updates efficiently.",
      example: "When you search for movies, React creates a new Fiber tree and performs reconciliation.",
      code: `// React's internal Fiber node structure
interface Fiber {
  type: Function | string;
  key: string | null;
  child: Fiber | null;
  sibling: Fiber | null;
  return: Fiber | null;
  alternate: Fiber | null;
  // ... other properties
}`,
      visual: <FiberTreeVisual />
    },
    reconciliation: {
      title: "Reconciliation Process",
      description: "React compares the new and old Fiber trees to determine what changed and updates only the necessary parts of the DOM.",
      example: "When you add a movie to your watched list, React only updates that specific part of the UI.",
      code: `// React's reconciliation algorithm
function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any
) {
  // Diff algorithm implementation
}`,
      visual: <ReconciliationVisual isActive={true} />
    },
    hooks: {
      title: "React Hooks",
      description: "Hooks let you use state and other React features in functional components.",
      example: "We use useState for movie data and useEffect for API calls.",
      code: `// Using hooks in our movie app
const [movies, setMovies] = useState([]);
useEffect(() => {
  // Fetch movies when query changes
}, [query]);`,
      visual: (
        <div className="hooks-visual">
          <div className="hook-flow">
            <div className="hook-step">
              <div className="step-number">1</div>
              <div className="step-content">Component Renders</div>
            </div>
            <div className="hook-arrow">↓</div>
            <div className="hook-step">
              <div className="step-number">2</div>
              <div className="step-content">Hooks Initialize</div>
            </div>
            <div className="hook-arrow">↓</div>
            <div className="hook-step">
              <div className="step-number">3</div>
              <div className="step-content">Effects Run</div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="popup-overlay">
      <div className="concept-popup">
        <button className="btn-close" onClick={onClose}>×</button>
        <h2>{concepts[concept].title}</h2>
        <p>{concepts[concept].description}</p>
        <p className="concept-example">{concepts[concept].example}</p>
        <div className="visual-demo">
          {concepts[concept].visual}
        </div>
        <div className="code-example">
          <pre>
            <code>{concepts[concept].code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function ReactFundamentals() {
  const [activeTab, setActiveTab] = useState("basics");
  const [selectedConcept, setSelectedConcept] = useState(null);

  const conceptsByTab = {
    basics: [
      {
        title: "Components",
        icon: "🧩",
        description: "Building blocks of React applications",
        tips: [
          "Components are reusable UI elements",
          "Can be functional or class-based",
          "Follow single responsibility principle",
          "Use composition over inheritance"
        ],
        usageExample: `// Functional Component
function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>{movie.year}</p>
    </div>
  );
}`
      },
      {
        title: "JSX",
        icon: "📝",
        description: "JavaScript XML syntax for React components",
        tips: [
          "JSX is syntactic sugar for React.createElement()",
          "Allows HTML-like syntax in JavaScript",
          "Must have a single root element",
          "Use curly braces for JavaScript expressions"
        ],
        usageExample: `// JSX Example
const element = (
  <div className="movie-list">
    <h2>Popular Movies</h2>
    <ul>
      {movies.map(movie => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  </div>
);`
      },
      {
        title: "Props",
        icon: "📦",
        description: "Data passed from parent to child components",
        tips: [
          "Props are read-only",
          "Can pass any JavaScript value",
          "Use destructuring for cleaner code",
          "Default props for optional values"
        ],
        usageExample: `// Props Example
function MovieDetails({ title, year, rating }) {
  return (
    <div className="movie-details">
      <h2>{title}</h2>
      <p>Year: {year}</p>
      <p>Rating: {rating}</p>
    </div>
  );
}`
      }
    ],
    hooks: [
      {
        title: "useState",
        icon: "🔄",
        description: "Manage state in functional components",
        tips: [
          "Returns state value and setter function",
          "State updates trigger re-renders",
          "Use multiple useState calls for different values",
          "State updates are asynchronous"
        ],
        usageExample: `// useState Example
function MovieRating() {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const addReview = (newReview) => {
    setReviews(prev => [...prev, newReview]);
    setRating(prev => (prev + newReview.rating) / 2);
  };
}`
      },
      {
        title: "useEffect",
        icon: "⚡",
        description: "Handle side effects in components",
        tips: [
          "Runs after every render",
          "Can return cleanup function",
          "Dependency array controls when it runs",
          "Use for data fetching, subscriptions"
        ],
        usageExample: `// useEffect Example
function MovieDetails({ id }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const data = await getMovieDetails(id);
      setMovie(data);
    };

    fetchMovie();
  }, [id]);
}`
      },
      {
        title: "useContext",
        icon: "🌐",
        description: "Share data across component tree",
        tips: [
          "Avoids prop drilling",
          "Create context with createContext",
          "Wrap components with Provider",
          "Use useContext to access values"
        ],
        usageExample: `// Context Example
const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <MovieList />
    </ThemeContext.Provider>
  );
}

function MovieCard() {
  const theme = useContext(ThemeContext);
  return <div className={\`movie-card \${theme}\`}>...</div>;
}`
      }
    ],
    advanced: [
      {
        title: "useRef",
        icon: "🎯",
        description: "Persist values between renders",
        tips: [
          "Mutable ref object",
          "Changes don't trigger re-renders",
          "Commonly used for DOM references",
          "Can store any mutable value"
        ],
        usageExample: `// useRef Example
function MoviePlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
}`
      },
      {
        title: "Custom Hooks",
        icon: "🛠️",
        description: "Reuse stateful logic across components",
        tips: [
          "Start with 'use' prefix",
          "Can use other hooks inside",
          "Share logic between components",
          "Keep hooks focused and simple"
        ],
        usageExample: `// Custom Hook Example
function useMovieSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      const data = await searchMovies(query);
      setResults(data);
      setLoading(false);
    };

    search();
  }, [query]);

  return { results, loading };
}`
      },
      {
        title: "Performance",
        icon: "⚡",
        description: "Optimize React application performance",
        tips: [
          "Use React.memo for pure components",
          "Implement useMemo for expensive calculations",
          "Use useCallback for function props",
          "Profile with React DevTools"
        ],
        usageExample: `// Performance Example
const MovieList = React.memo(function MovieList({ movies }) {
  return (
    <div className="movie-list">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
});`
      }
    ]
  };

  return (
    <div className="react-fundamentals">
      <div className="fundamentals-header">
        <h2>React Fundamentals</h2>
        <div className="tabs">
          <button
            className={`tab ${activeTab === "basics" ? "active" : ""}`}
            onClick={() => setActiveTab("basics")}
          >
            Basics
          </button>
          <button
            className={`tab ${activeTab === "hooks" ? "active" : ""}`}
            onClick={() => setActiveTab("hooks")}
          >
            Hooks
          </button>
          <button
            className={`tab ${activeTab === "advanced" ? "active" : ""}`}
            onClick={() => setActiveTab("advanced")}
          >
            Advanced
          </button>
        </div>
      </div>
      <div className="concepts-grid">
        {conceptsByTab[activeTab].map((concept, index) => (
          <div key={index} className="concept-card">
            <div className="concept-header">
              <h3>{concept.title}</h3>
              <span className="concept-icon">{concept.icon}</span>
            </div>
            <p className="concept-description">{concept.description}</p>
            <div className="concept-tips">
              <h4>Key Points</h4>
              <ul>
                {concept.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
            <div className="code-preview">
              <h4>Example</h4>
              <pre>{concept.usageExample}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="movie-list-container">
      <div className="movie-list-header">
        <h2>Available Movies</h2>
        <div 
          className="render-indicator" 
          onClick={() => setShowTooltip(true)}
        >
          <div className="render-pulse"></div>
          <span>React Updates Demo</span>
        </div>
      </div>
      {showTooltip && (
        <div className="popup-overlay">
          <div className="concept-popup">
            <button className="btn-close" onClick={() => setShowTooltip(false)}>×</button>
            <h2>React State, Props, and Effects in Action</h2>
            <div className="concept-highlight">
              <p>This demo shows how React's core concepts work together to manage updates:</p>
            </div>
            
            <h3>1. State Management</h3>
            <div className="code-example">
              <pre>{`// Parent component state
const [movies, setMovies] = useState([]);
const [query, setQuery] = useState("");

// State updates trigger re-renders
useEffect(() => {
  async function fetchMovies() {
    const res = await fetch(\`http://www.omdbapi.com/?apikey=\${KEY}&s=\${query}\`);
    const data = await res.json();
    setMovies(data.Search);
  }
  fetchMovies();
}, [query]);`}</pre>
            </div>
            <p>When you type in the search box, the query state updates, triggering a re-render and a new API call.</p>

            <h3>2. Props and Component Communication</h3>
            <div className="code-example">
              <pre>{`// Parent passes data and callbacks as props
<MovieList 
  movies={movies} 
  onSelectMovie={handleMovieClick} 
/>

// Child component receives props
function MovieList({ movies, onSelectMovie }) {
  return (
    <ul>
      {movies.map(movie => (
        <Movie 
          key={movie.imdbID} 
          movie={movie} 
          onSelectMovie={onSelectMovie} 
        />
      ))}
    </ul>
  );
}`}</pre>
            </div>
            <p>Props flow down the component tree, enabling parent-child communication.</p>

            <h3>3. useEffect and Side Effects</h3>
            <div className="code-example">
              <pre>{`// Managing side effects
useEffect(() => {
  // Setup phase
  const controller = new AbortController();
  
  // Cleanup phase
  return () => {
    controller.abort();
  };
}, [query]);`}</pre>
            </div>
            <p>useEffect handles side effects like API calls and cleanup.</p>

            <h3>4. Performance Optimization</h3>
            <div className="code-example">
              <pre>{`// Memoization with useMemo
const memoizedMovies = useMemo(() => 
  movies.filter(m => m.year > 2000),
  [movies]
);

// Memoized callbacks with useCallback
const handleMovieClick = useCallback((id) => {
  setSelectedId(id);
}, []);`}</pre>
            </div>
            <p>React provides hooks to optimize performance and prevent unnecessary re-renders.</p>

            <div className="concept-highlight">
              <h4>Key React Concepts in Action:</h4>
              <ul>
                <li><strong>Unidirectional Data Flow:</strong> State flows down through props</li>
                <li><strong>Component Lifecycle:</strong> Mount → Update → Unmount</li>
                <li><strong>Virtual DOM:</strong> Efficient updates through reconciliation</li>
                <li><strong>Hooks:</strong> useState, useEffect, useMemo, useCallback</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <Movie 
            movie={movie} 
            key={movie.imdbID} 
            onSelectMovie={onSelectMovie}
          />
        ))}
      </ul>
    </div>
  );
}

function Movie({ movie, onSelectMovie }) {
  const handleClick = () => {
    onSelectMovie(movie.imdbID);
    // Dispatch event for Fiber tree visualization
    window.dispatchEvent(new CustomEvent('stateChange', {
      detail: { type: 'select-movie' }
    }));
  };

  return (
    <li className="movie-item" onClick={handleClick}>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        onError={e => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
        }}
      />
      <h3>{movie.Title}</h3>
      <div className="movie-details">
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function LifecycleVisual({ onClose }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const phases = [
    { 
      name: 'Mount', 
      color: '#4c6ef5', 
      description: 'The Mount phase occurs when a component is first created and inserted into the DOM.',
      appExplanation: 'In usePopcorn, this happens when you first search for movies. The Search component mounts and initializes the movie fetching process.',
      codeExample: `// Search component mounting
function Search({ query, setQuery }) {
  useEffect(() => {
    // Initialize search state
    setQuery('');
    // Prepare for movie fetching
    const controller = new AbortController();
    return () => controller.abort();
  }, []);
  
  return <input onChange={e => setQuery(e.target.value)} />;
}`,
      visual: (
        <div className="phase-visual">
          <div className="component-box">
            <div className="component-name">Search</div>
            <div className="component-state">query: ""</div>
            <div className="component-effect">useEffect: Initialize</div>
          </div>
          <div className="arrow">↓</div>
          <div className="component-box">
            <div className="component-name">MovieList</div>
            <div className="component-state">movies: []</div>
            <div className="component-effect">useEffect: Fetch Movies</div>
          </div>
        </div>
      )
    },
    { 
      name: 'Render', 
      color: '#40c057', 
      description: 'The Render phase is where React creates the Virtual DOM representation of your component.',
      appExplanation: 'In usePopcorn, this is when the movie cards are created in memory, with their posters, titles, and rating systems.',
      codeExample: `// MovieList rendering
function MovieList({ movies }) {
  return (
    <ul>
      {movies.map(movie => (
        <MovieCard 
          key={movie.imdbID}
          title={movie.Title}
          poster={movie.Poster}
          year={movie.Year}
        />
      ))}
    </ul>
  );
}`,
      visual: (
        <div className="phase-visual">
          <div className="virtual-dom">
            <div className="dom-node">MovieList
              <div className="dom-children">
                <div className="dom-node">MovieCard
                  <div className="dom-props">title: "Inception"</div>
                  <div className="dom-props">year: "2010"</div>
                </div>
                <div className="dom-node">MovieCard
                  <div className="dom-props">title: "Matrix"</div>
                  <div className="dom-props">year: "1999"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      name: 'Commit', 
      color: '#fab005', 
      description: 'The Commit phase is when React applies the changes to the actual DOM.',
      appExplanation: 'In usePopcorn, this is when the movie cards appear on screen, the rating system becomes interactive, and click handlers are attached.',
      codeExample: `// Movie selection handling
function MovieCard({ movie, onSelect }) {
  return (
    <li onClick={() => onSelect(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <StarsRating 
        maxRating={10}
        onSetRating={rating => setUserRating(rating)}
      />
    </li>
  );
}`,
      visual: (
        <div className="phase-visual">
          <div className="dom-update">
            <div className="dom-before">
              <div className="dom-node">MovieList
                <div className="dom-children">
                  <div className="dom-node">Loading...</div>
                </div>
              </div>
            </div>
            <div className="dom-arrow">→</div>
            <div className="dom-after">
              <div className="dom-node">MovieList
                <div className="dom-children">
                  <div className="dom-node active">MovieCard
                    <div className="dom-props">title: "Inception"</div>
                    <div className="dom-props">rating: 8.8</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    { 
      name: 'Cleanup', 
      color: '#fa5252', 
      description: 'The Cleanup phase occurs when a component is removed from the DOM.',
      appExplanation: 'In usePopcorn, this happens when you start a new search - old results are cleared, previous ratings are reset, and pending requests are cancelled.',
      codeExample: `// Cleanup in Search component
useEffect(() => {
  const controller = new AbortController();
  
  return () => {
    // Cleanup function
    controller.abort(); // Cancel pending requests
    setMovies([]);     // Clear old results
    setUserRating(0);  // Reset ratings
  };
}, [query]);`,
      visual: (
        <div className="phase-visual">
          <div className="cleanup-flow">
            <div className="cleanup-step">
              <div className="step-icon">🗑</div>
              <div className="step-text">Cancel Requests</div>
            </div>
            <div className="cleanup-arrow">↓</div>
            <div className="cleanup-step">
              <div className="step-icon">🧹</div>
              <div className="step-text">Clear State</div>
            </div>
            <div className="cleanup-arrow">↓</div>
            <div className="cleanup-step">
              <div className="step-icon">🔄</div>
              <div className="step-text">Reset UI</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="concept-popup lifecycle-popup" onClick={e => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose}>×</button>
        <h2>React Lifecycle in usePopcorn</h2>
        
        <div className="lifecycle-diagram">
          <div className="phase-container">
            {phases.map((phase, index) => (
              <div 
                key={phase.name}
                className={`lifecycle-phase ${currentPhase === index ? 'active' : ''}`}
                style={{ '--phase-color': phase.color }}
                data-phase={phase.name}
                onClick={() => setCurrentPhase(index)}
              >
                <div className="phase-header">
                  <span className="phase-dot"></span>
                  <h3>{phase.name}</h3>
                </div>
                <div className="phase-content">
                  <div className="phase-description">
                    <p>{phase.description}</p>
                  </div>
                  <div className="phase-number">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {phases[currentPhase] && (
            <div className="phase-details">
              <div className="phase-explanation">
                <h4>In usePopcorn:</h4>
                <p>{phases[currentPhase].appExplanation}</p>
                <div className="phase-visual-container">
                  {phases[currentPhase].visual}
                </div>
              </div>
              <div className="code-example">
                <pre>{phases[currentPhase].codeExample}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showFiberTree, setShowFiberTree] = useState(false);
  const [activeConcept, setActiveConcept] = useState(null);
  const [showLifecycle, setShowLifecycle] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const memoizedMovies = useMemo(() => movies, [movies]);

  const handleMovieClick = (id) => {
    setSelectedId(selectedId === id ? null : id);
    // Dispatch event for Fiber tree visualization
    window.dispatchEvent(new CustomEvent('stateChange', {
      detail: { type: 'select-movie' }
    }));
  };

  // Initial load effect to fetch popular movies
  useEffect(function () {
    async function fetchInitialMovies() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=inception`
        );
        if (!res.ok) throw new Error("Something went wrong with fetching movies");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        // Dispatch event for Fiber tree visualization
        window.dispatchEvent(new CustomEvent('stateChange', {
          detail: { type: 'search' }
        }));
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);
        setIsLoading(false);
      }
    }
    fetchInitialMovies();
  }, []);

  // Search effect
  useEffect(function () {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setSelectedId(null);

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        // Dispatch event for Fiber tree visualization
        window.dispatchEvent(new CustomEvent('stateChange', {
          detail: { type: 'search' }
        }));
        setIsLoading(false);
      } catch (err) {
        console.error(err.message);

        if (err.name !== "AbortError") {
          setIsLoading(false);
        }
      }
    }

    if (query.length < 3) {
      // Don't reset movies when query is short
      setIsLoading(false);
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const handleStateChange = e => {
      if (e.detail.type === 'delete-watched') {
        setShowDeletePopup(true);
      }
    };
    window.addEventListener('stateChange', handleStateChange);
    return () => window.removeEventListener('stateChange', handleStateChange);
  }, []);

  return (
    <div className="app">
      <NavBar 
        query={query} 
        setQuery={setQuery} 
        movies={movies}
        showFiberTree={showFiberTree}
        setShowFiberTree={setShowFiberTree}
        setActiveConcept={setActiveConcept}
        setShowLifecycle={setShowLifecycle}
      />

      <div className="concept-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1rem' }}>
        <button 
          className="btn-learn"
          onClick={() => setShowFiberTree(prev => !prev)}
        >
          {showFiberTree ? 'Hide' : 'Show'} Fiber Tree
        </button>
        <button 
          className="btn-learn"
          onClick={() => setActiveConcept('reconciliation')}
        >
          Learn Reconciliation
        </button>
        <button 
          className="btn-learn"
          onClick={() => setShowLifecycle(true)}
        >
          View Lifecycle
        </button>
        <button
          className="btn-learn"
          onClick={() => setShowAbout(true)}
        >
          Who Built This?
        </button>
      </div>

      <div className="section-separator"></div>

      <Main 
        watched={watched}
        isLoading={isLoading}
        memoizedMovies={memoizedMovies}
        handleMovieClick={handleMovieClick}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setWatched={setWatched}
      >
        <ReactFundamentals />
      </Main>

      {showFiberTree && <FiberTreeVisual />}

      {activeConcept && (
        <ReactConceptExplainer 
          concept={activeConcept} 
          onClose={() => setActiveConcept(null)} 
        />
      )}

      {showLifecycle && (
        <LifecycleVisual onClose={() => setShowLifecycle(false)} />
      )}

      {showDeletePopup && (
        <div className="popup-overlay" onClick={() => setShowDeletePopup(false)}>
          <div className="concept-popup" onClick={e => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setShowDeletePopup(false)}>×</button>
            <h2>React DOM Deletion Process</h2>
            <ul>
              <li>React marks the Virtual DOM node for removal during reconciliation.</li>
              <li>In the commit phase, React unmounts the component and removes its DOM element.</li>
              <li>Any useEffect cleanup functions are invoked.</li>
              <li>Browser garbage collector frees up memory.</li>
            </ul>
          </div>
        </div>
      )}

      {showAbout && (
        <div className="popup-overlay" onClick={() => setShowAbout(false)}>
          <div className="concept-popup" onClick={e => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setShowAbout(false)}>×</button>
            <h2>Who Built This?</h2>
            <p>Hi! I'm Gorantla Ritika, a passionate Frontend Developer with 2 years of experience crafting responsive, user-friendly web interfaces using React, Angular, Bootstrap, and modern JavaScript. I love turning complex problems into intuitive, beautiful user experiences.</p>
            <p>Over the past few years, I've worked on diverse projects—from building interactive dashboards to developing scalable frontend architectures for real-world applications. I'm also comfortable across the full stack with backend experience in Node.js, Express, and MongoDB.</p>
            <p>I care deeply about clean code, performance, and design systems. Whether it's through pixel-perfect UIs or seamless user flows, I aim to build experiences that users enjoy and remember.</p>
            <p>When I'm not coding, you'll probably find me exploring design trends, learning new tools, or tinkering with side projects.</p>
            <p>Resume: <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a></p>
            <p><strong>LinkedIn: <a href="https://www.linkedin.com/in/ritika-gorantla-719546207/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/ritika-gorantla-719546207/</a></strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

function NavBar({ 
  query, 
  setQuery, 
  movies, 
  showFiberTree, 
  setShowFiberTree, 
  setActiveConcept, 
  setShowLifecycle 
}) {
  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </div>
    </nav>
  );
}

function NumResults({ movies }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="num-results-container">
      <div className="num-results">
        Found <strong>{movies.length}</strong> results
        <button 
          className="results-explanation"
          onClick={() => setShowPopup(true)}
        >
          ❓
        </button>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="concept-popup">
            <button className="btn-close" onClick={() => setShowPopup(false)}>×</button>
            <h2>Understanding React State and Results Count</h2>
            
            <div className="concept-highlight">
              <p>This demo shows how React's state management and component updates work in real-time:</p>
            </div>

            <h3>1. State Definition and Initialization</h3>
            <div className="code-example">
              <pre>{`// State initialization in parent component
const [movies, setMovies] = useState([]);
const [query, setQuery] = useState("");

// State definition includes:
// - Initial value: []
// - State updater function: setMovies
// - Current state value: movies`}</pre>
            </div>
            <p>React state is more than just a variable - it's a special React feature that:</p>
            <ul>
              <li>Maintains data between renders</li>
              <li>Triggers re-renders when updated</li>
              <li>Preserves state during component lifecycle</li>
            </ul>

            <h3>2. State Updates and Batching</h3>
            <div className="code-example">
              <pre>{`// State updates are batched for performance
function handleSearch() {
  setLoading(true);        // Batch 1
  setMovies([]);          // Batch 1
  fetchMovies().then(data => {
    setMovies(data);      // Batch 2
    setLoading(false);    // Batch 2
  });
}`}</pre>
            </div>
            <p>React batches state updates to optimize performance:</p>
            <ul>
              <li>Multiple setState calls in the same function are batched</li>
              <li>Async operations create new batches</li>
              <li>Batching reduces unnecessary re-renders</li>
            </ul>

            <h3>3. Derived State and Computations</h3>
            <div className="code-example">
              <pre>{`// Derived state example
const movieCount = movies.length;
const hasResults = movies.length > 0;
const averageRating = movies.reduce((acc, movie) => 
  acc + movie.rating, 0) / movies.length;

// Memoized computations
const memoizedCount = useMemo(() => movies.length, [movies]);`}</pre>
            </div>
            <p>Results count demonstrates derived state:</p>
            <ul>
              <li>Automatically updates when movies change</li>
              <li>No need for separate state management</li>
              <li>Can be optimized with useMemo for expensive calculations</li>
            </ul>

            <h3>4. Component Re-rendering Process</h3>
            <div className="code-example">
              <pre>{`// Component re-rendering flow
1. State changes (movies array updates)
2. React creates new Virtual DOM
3. Diffing algorithm compares changes
4. Only affected DOM nodes update
5. Results count automatically reflects new length`}</pre>
            </div>
            <p>The re-rendering process is efficient because:</p>
            <ul>
              <li>Only components using the changed state re-render</li>
              <li>Virtual DOM diffing minimizes actual DOM updates</li>
              <li>Results count updates are optimized by React</li>
            </ul>

            <div className="concept-highlight">
              <h4>Key State Management Concepts:</h4>
              <ul>
                <li><strong>State Immutability:</strong> Always create new state objects/arrays</li>
                <li><strong>State Updates:</strong> Use functional updates for state depending on previous state</li>
                <li><strong>State Dependencies:</strong> Components only re-render when their used state changes</li>
                <li><strong>State Lifting:</strong> State is often lifted to the closest common ancestor</li>
              </ul>
            </div>

            <div className="code-example">
              <pre>{`// Best practices for state management
// 1. Functional updates
setMovies(prevMovies => [...prevMovies, newMovie]);

// 2. State dependencies
useEffect(() => {
  // Only runs when movies.length changes
}, [movies.length]);

// 3. State lifting
function Parent() {
  const [movies, setMovies] = useState([]);
  return <Child movies={movies} />;
}`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Logo() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1 onClick={() => setShowPopup(true)}>usePopcorn</h1>
      {showPopup && (
        <div className="popup-overlay">
          <div className="concept-popup">
            <button className="btn-close" onClick={() => setShowPopup(false)}>×</button>
            <h2>Welcome to usePopcorn!</h2>
            
            <div className="concept-highlight">
              <p>A hands-on learning experience for understanding React's core concepts through a movie application.</p>
            </div>

            <h3>Why React?</h3>
            <p>React is a powerful JavaScript library for building user interfaces because it:</p>
            <ul>
              <li><strong>Uses a Declarative Approach:</strong> You describe what you want to see, and React handles how to update the UI</li>
              <li><strong>Implements Virtual DOM:</strong> Efficiently updates only what changed, not the entire page</li>
              <li><strong>Provides Component-Based Architecture:</strong> Build reusable, maintainable UI pieces</li>
              <li><strong>Offers Unidirectional Data Flow:</strong> Makes state changes predictable and easier to debug</li>
            </ul>

            <h3>What You'll Learn Here:</h3>
            <div className="learning-points">
              <div className="learning-point">
                <h4>1. State Management</h4>
                <p>See how React's useState and useEffect hooks manage movie data, search queries, and watched lists in real-time.</p>
              </div>
              <div className="learning-point">
                <h4>2. Component Lifecycle</h4>
                <p>Understand how components mount, update, and unmount through the movie search and display process.</p>
              </div>
              <div className="learning-point">
                <h4>3. Performance Optimization</h4>
                <p>Learn about React's reconciliation process and how it efficiently updates the UI when movies change.</p>
              </div>
              <div className="learning-point">
                <h4>4. React Fiber</h4>
                <p>Explore React's internal architecture through visualizations of the component tree and update process.</p>
              </div>
            </div>

            <h3>Interactive Learning Features:</h3>
            <ul>
              <li><strong>Real-time Updates:</strong> Watch the UI update as you search and interact with movies</li>
              <li><strong>Visual Demonstrations:</strong> See React's Fiber tree and reconciliation process in action</li>
              <li><strong>Code Examples:</strong> Learn through practical examples of React hooks and patterns</li>
              <li><strong>Performance Insights:</strong> Understand how React optimizes rendering and updates</li>
            </ul>

            <div className="concept-highlight">
              <h4>Try These Actions to Learn:</h4>
              <ol>
                <li>Search for movies to see state updates in action</li>
                <li>Add movies to your watched list to understand component communication</li>
                <li>Click the "Learn" buttons to explore React concepts</li>
                <li>Watch the Fiber tree visualization as you interact with the app</li>
              </ol>
            </div>

            <div className="code-example">
              <pre>{`// Example of React's power in our app
function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movies when query changes
    // React handles all the updates automatically
  }, [query]);

  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
      />
      <MovieList movies={movies} />
    </div>
  );
}`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Search({ query, setQuery }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    // Dispatch event for Fiber tree visualization
    window.dispatchEvent(new CustomEvent('stateChange', {
      detail: { type: 'search' }
    }));
  };

  return (
    <div className="search-container">
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={handleSearch}
      />
      <div 
        className="search-explanation"
        onClick={() => setShowPopup(true)}
      >
        <span>❓</span>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="concept-popup">
            <button className="btn-close" onClick={() => setShowPopup(false)}>×</button>
            <h2>Search Implementation in usePopcorn</h2>
            
            <div className="concept-highlight">
              <p>This search feature demonstrates React's state management and API integration:</p>
            </div>

            <h3>1. Search State Management</h3>
            <div className="code-example">
              <pre>{`// Search state in App component
const [query, setQuery] = useState("");
const [movies, setMovies] = useState([]);

// Search effect for API calls
useEffect(() => {
  const controller = new AbortController();

  async function fetchMovies() {
    try {
      setIsLoading(true);
      const res = await fetch(
        \`http://www.omdbapi.com/?apikey=\${KEY}&s=\${query}\`,
        { signal: controller.signal }
      );
      const data = await res.json();
      setMovies(data.Search);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (query.length < 3) {
    setMovies([]);
    return;
  }

  fetchMovies();

  return () => controller.abort();
}, [query]);`}</pre>
            </div>
            <p>Key aspects of our search implementation:</p>
            <ul>
              <li>Debounced API calls to prevent excessive requests</li>
              <li>AbortController for cleanup of pending requests</li>
              <li>Minimum query length check for optimization</li>
              <li>Error handling for failed API calls</li>
            </ul>

            <h3>2. Component Communication</h3>
            <div className="code-example">
              <pre>{`// Parent-child component communication
function App() {
  const [query, setQuery] = useState("");
  
  return (
    <div>
      <Search query={query} setQuery={setQuery} />
      <MovieList movies={movies} />
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input 
      value={query} 
      onChange={e => setQuery(e.target.value)} 
    />
  );
}`}</pre>
            </div>
            <p>Component structure and data flow:</p>
            <ul>
              <li>State lifted to App component for shared access</li>
              <li>Props passed down to child components</li>
              <li>Unidirectional data flow pattern</li>
              <li>Controlled input component pattern</li>
            </ul>

            <h3>3. Performance Optimizations</h3>
            <div className="code-example">
              <pre>{`// Performance optimizations
const memoizedMovies = useMemo(() => movies, [movies]);

function MovieList({ movies }) {
  return (
    <ul>
      {movies.map(movie => (
        <Movie 
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
}`}</pre>
                </div>
            <p>Optimization techniques used:</p>
            <ul>
              <li>useMemo for memoizing movie list</li>
              <li>Key prop for efficient list rendering</li>
              <li>Conditional rendering based on query length</li>
              <li>Loading state management</li>
            </ul>

            <div className="concept-highlight">
              <h4>Search Flow in usePopcorn:</h4>
              <ol>
                <li>User types in search box</li>
                <li>Query state updates in App component</li>
                <li>useEffect triggers API call with debounce</li>
                <li>Movies state updates with API response</li>
                <li>MovieList re-renders with new results</li>
                <li>Cleanup function cancels pending requests</li>
              </ol>
                </div>
              </div>
            </div>
      )}
          </div>
  );
}

function Main({ 
  children,
  watched,
  isLoading,
  memoizedMovies,
  handleMovieClick,
  selectedId,
  setSelectedId,
  setWatched
}) {
  return (
    <main className="main">
      <div className="movie-sections">
        <div className="box box-movies">
          {isLoading && <Loader />}
          {!isLoading && !selectedId && (
            <MovieList movies={memoizedMovies} onSelectMovie={handleMovieClick} />
          )}
          {selectedId && (
            <SelectedMovie
              selectedId={selectedId}
              onClose={() => setSelectedId(null)}
              onAddWatched={(movie) => {
                setWatched((watched) => [...watched, movie]);
                setSelectedId(null);
              }}
            />
          )}
          </div>
          
        <div className="box box-watched">
          <div className="watched-stats">
            <h2>Movies you watched</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <p>
                  <span>🎬</span>
                  <span>{watched.length} movies</span>
                </p>
                </div>
              <div className="stat-item">
                <p>
                  <span>⭐️</span>
                  <span>
                    {watched.length > 0
                      ? (
                          watched.reduce((acc, cur) => acc + cur.imdbRating, 0) /
                          watched.length
                        ).toFixed(1)
                      : 0}
                  </span>
                </p>
              </div>
              <div className="stat-item">
                <p>
                  <span>🌟</span>
                  <span>
                    {watched.length > 0
                      ? (
                          watched.reduce((acc, cur) => acc + cur.userRating, 0) /
                          watched.length
                        ).toFixed(1)
                      : 0}
                  </span>
                </p>
              </div>
              <div className="stat-item">
                <p>
                  <span>⏳</span>
                  <span>
                    {watched.reduce((acc, cur) => acc + cur.runtime, 0)} min
                  </span>
                </p>
            </div>
        </div>
      </div>
          <WatchedMoviesList watched={watched} onDeleteWatched={movie => {
            setWatched(watched => watched.filter(w => w.imdbID !== movie.imdbID));
          }} />
    </div>
      </div>
      <div className="section-separator"></div>
      {children}
    </main>
  );
}

function Loader()
  {
    return(<p className="loader">Loading...</p>);
  }

function Box({children})
{
  const [isOpen, setIsOpen] = useState(true);
  return(
  <div className="box">
        <button 
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
        >
      {isOpen ? "–" : "+"}
        </button>
    {isOpen && children
    }
    </div>
  );
}

function SelectedMovie({ selectedId, onClose, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [renderCount, setRenderCount] = useState(0);

  // Demo of useEffect dependencies
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ").at(0)),
      userRating: userRating,
    };
    onAddWatched(newWatchedMovie);
    // Dispatch event for Fiber tree visualization
    window.dispatchEvent(new CustomEvent('stateChange', {
      detail: { type: 'add-watched' }
    }));
    onClose();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setLoading(true);
      const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
        setMovie(data);
        setLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {loading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img
              src={movie.Poster}
              alt="Poster of the movie"
              onError={e => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>Released on: {movie.Released}</p>
              <p>Genre: {movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating}
              </p>
              <p className="render-count">
                Component Renders: {renderCount}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarsRating onSetRating={setUserRating} />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to List
                </button>
              )}
</div>
            <p>{movie.Plot}</p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({watched})
{
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(1);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(1);
  const avgRuntime = Math.round(average(watched.map((movie) => movie.runtime)));
  return( <div className="summary">
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
        </p>
      </div>
  </div>);
}
function WatchedMoviesList({ watched, onDeleteWatched }) {
  const handleDelete = (movieToDelete) => {
    // Remove the movie from the watched list
    onDeleteWatched(movieToDelete);
  };

  return (
    <ul className="list watched-list">
      {watched.length === 0 ? (
        <div className="no-movies">
          Your watchlist is looking a bit empty...
          <span>Start adding some movies! 🍿</span>
          </div>
      ) : (
        watched.map((movie) => (
          <WatchedMovie
            movie={movie}
            key={movie.imdbID}
            onDeleteWatched={handleDelete}
          />
        ))
      )}
    </ul>
  );
}
function WatchedMovie({ movie, onDeleteWatched }) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeleteClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    onDeleteWatched(movie);
    // Dispatch event for Fiber tree visualization
    window.dispatchEvent(new CustomEvent('stateChange', {
      detail: { type: 'delete-watched' }
    }));
  };

  // Reset confirmation state if user moves mouse away
  const handleMouseLeave = () => {
    setIsConfirming(false);
  };

  return (
    <li className="watched-movie" onMouseLeave={handleMouseLeave}>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        onError={e => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
        }}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
        <button 
        className={`btn-delete ${isConfirming ? 'confirming' : ''}`}
        onClick={handleDeleteClick}
        >
        {isConfirming ? 'Confirm?' : 'Delete'}
        </button>
    </li>
  );
}
