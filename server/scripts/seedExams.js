const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Category = require('../models/Category');

dotenv.config({ path: './.env' });

const seedAllExams = async () => {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    console.log('✅ Connected to MongoDB.');

    // 1. Ensure Categories Exist
    const categoryDefs = [
      { name: 'Advanced', slug: 'advanced', description: 'Cutting-edge algorithms, quantum computing, and distributed architectures.', icon: 'Award', color: 'purple' },
      { name: 'Programming', slug: 'programming', description: 'Software engineering, web development, React, JavaScript, Python, and data structures.', icon: 'Code', color: 'indigo' },
      { name: 'Mathematics', slug: 'mathematics', description: 'Algebra, calculus, geometry, trigonometry, and statistical analysis.', icon: 'Calculator', color: 'blue' },
      { name: 'Science', slug: 'science', description: 'Physics, chemistry, biology, and environmental science principles.', icon: 'FlaskConical', color: 'green' },
      { name: 'Aptitude', slug: 'aptitude', description: 'Quantitative problem solving, logical reasoning, data interpretation, and analytical thinking.', icon: 'Target', color: 'orange' },
      { name: 'General Knowledge', slug: 'general-knowledge', description: 'Current affairs, world history, physical geography, and Indian constitution.', icon: 'Globe', color: 'amber' },
      { name: 'English', slug: 'english', description: 'Grammar, vocabulary builder, reading comprehension, and business English.', icon: 'BookA', color: 'red' },
      { name: 'Quantum Computing', slug: 'quantum-computing', description: 'Quantum gates, superposition, entanglement, Qiskit, and quantum algorithms.', icon: 'Cpu', color: 'purple' }
    ];

    const categoryMap = {};
    for (const cat of categoryDefs) {
      let doc = await Category.findOne({ slug: cat.slug });
      if (!doc) {
        doc = await Category.create({ ...cat, status: 'Active' });
      }
      categoryMap[cat.name] = doc._id;
    }

    // 2. Ensure User (Admin/Teacher) Exists
    let teacher = await User.findOne({ role: 'teacher' }) || await User.findOne({ role: 'admin' });
    if (!teacher) {
      teacher = await User.create({
        name: 'Dr. Sarah Johnson',
        email: 'teacher@exam.com',
        password: '$2a$10$YourHashedPasswordHereOrBcryptDummy',
        role: 'teacher',
        college: 'Tech University',
        course: 'Computer Science'
      });
    }

    console.log('⚙️ Preparing 25 Complete Exams and 500 Unique Questions...');

    // Utility helper to construct MCQ object
    const mcq = (question, optA, optB, optC, optD, correctIndex, explanation, topic = 'General', difficulty = 'medium') => {
      const options = [`A. ${optA}`, `B. ${optB}`, `C. ${optC}`, `D. ${optD}`];
      return {
        question,
        type: 'mcq',
        options,
        correctAnswer: options[correctIndex],
        marks: 5,
        difficulty,
        topic,
        explanation
      };
    };

    // ─── DEFINITION OF ALL 25 EXAMS AND 500 MCQS ──────────────────────────────

    const examSpecs = [
      // 1. Advanced Quantum Computing & Algorithms
      {
        title: 'Advanced Quantum Computing & Algorithms',
        category: 'Advanced',
        subject: 'Quantum Computing',
        difficulty: 'hard',
        duration: 60,
        questions: [
          mcq('Which quantum gate creates an equal superposition from the state |0⟩?', 'Pauli-X', 'Hadamard', 'Phase', 'CNOT', 1, 'Hadamard transforms |0⟩ to (|0⟩+|1⟩)/√2.', 'Gates', 'hard'),
          mcq('What is the primary purpose of the CNOT gate?', 'Measure a qubit', 'Rotate a qubit', 'Create entanglement', 'Reset a qubit', 2, 'CNOT flips target qubit when control is |1⟩, entangling qubits.', 'Gates', 'hard'),
          mcq('Shor\'s Algorithm provides an exponential speedup for which problem?', 'Database searching', 'Matrix multiplication', 'Integer factorization', 'Sorting', 2, 'Shor\'s algorithm factors large integers in polynomial time.', 'Algorithms', 'hard'),
          mcq('Grover\'s Algorithm provides approximately what speedup for unstructured search?', 'Exponential', 'Logarithmic', 'Quadratic', 'Linear', 2, 'Grover\'s reduces search complexity from O(N) to O(√N).', 'Algorithms', 'hard'),
          mcq('Which Qiskit component is primarily used to build quantum circuits?', 'QuantumCircuit', 'QuantumKernel', 'QuantumOptimizer', 'QuantumMemory', 0, 'QuantumCircuit defines gates applied to qubits.', 'Qiskit', 'medium'),
          mcq('What happens when a qubit is measured?', 'It duplicates itself', 'It enters another superposition', 'It collapses to a classical state', 'It disappears', 2, 'Measurement collapses state to 0 or 1.', 'Measurement', 'medium'),
          mcq('Which phenomenon enables correlations stronger than classical physics?', 'Interference', 'Entanglement', 'Decoherence', 'Tunneling', 1, 'Entanglement creates non-local correlations.', 'Physics', 'hard'),
          mcq('What is the purpose of QFT in Shor\'s Algorithm?', 'Encrypt data', 'Find periodicity', 'Generate random numbers', 'Reduce qubit count', 1, 'QFT identifies periodic patterns in Modular Exponentiation.', 'QFT', 'hard'),
          mcq('Which gate rotates a qubit around the Z-axis?', 'RX', 'RY', 'RZ', 'CNOT', 2, 'RZ performs rotation around Z-axis of Bloch Sphere.', 'Gates', 'medium'),
          mcq('In Qiskit, what does measure_all() accomplish?', 'Deletes qubits', 'Measures every qubit into classical bits', 'Applies Hadamard gates', 'Optimizes circuit', 1, 'measure_all() measures all quantum registers.', 'Qiskit', 'medium'),
          mcq('Which quantum cryptography protocol is most widely known for QKD?', 'RSA', 'AES', 'BB84', 'SHA-256', 2, 'BB84 uses quantum states to detect eavesdroppers.', 'Cryptography', 'hard'),
          mcq('Why is the no-cloning theorem important in quantum cryptography?', 'Speeds up encryption', 'Prevents copying unknown quantum states', 'Compresses data', 'Increases storage', 1, 'Unknown quantum states cannot be copied perfectly.', 'Theory', 'hard'),
          mcq('What is decoherence?', 'Faster computation', 'Loss of quantum state due to environment', 'Error correction', 'Teleportation', 1, 'Environmental noise causes loss of quantum phase.', 'Physics', 'hard'),
          mcq('Which IBM framework executes circuits on real quantum hardware?', 'TensorFlow', 'Qiskit Runtime', 'PyTorch', 'NumPy', 1, 'Qiskit Runtime manages execution on IBM Q hardware.', 'Hardware', 'medium'),
          mcq('Which gate swaps the states of two qubits?', 'CZ', 'SWAP', 'X', 'T', 1, 'SWAP exchanges qubit states.', 'Gates', 'easy'),
          mcq('What is the advantage of VQE (Variational Quantum Eigensolver)?', 'Eliminates measurement', 'Combines classical and quantum optimization', 'No quantum gates needed', 'Solves NP-hard problems', 1, 'VQE is a hybrid classical-quantum algorithm.', 'Algorithms', 'hard'),
          mcq('Which best describes quantum teleportation?', 'Physical matter movement', 'State copying', 'State transfer via entanglement & classical bits', 'Instant communication', 2, 'Teleportation transfers state without moving physical matter.', 'Teleportation', 'hard'),
          mcq('Which algorithm solves linear systems of equations (Ax=b)?', 'Grover', 'HHL', 'Shor', 'Simon', 1, 'HHL algorithm solves linear systems logarithmically.', 'Algorithms', 'hard'),
          mcq('What is the role of quantum error correction?', 'Increase CPU clock', 'Replace classical computers', 'Protect logical qubits from physical noise', 'Reduce memory', 2, 'Encodes one logical qubit into multiple physical qubits.', 'Error Correction', 'hard'),
          mcq('Why is Shor\'s algorithm a threat to RSA?', 'Weakens AES', 'Factors large composite numbers efficiently', 'Increases key length', 'Replaces public keys', 1, 'RSA relies on prime factorization difficulty.', 'Security', 'hard')
        ]
      },

      // 2. Advanced System Architecture & Distributed Systems
      {
        title: 'Advanced System Architecture & Distributed Systems',
        category: 'Advanced',
        subject: 'Advanced',
        difficulty: 'hard',
        duration: 60,
        questions: [
          mcq('Which CAP theorem property states every request receives a non-error response?', 'Consistency', 'Availability', 'Partition Tolerance', 'Durability', 1, 'Availability guarantees a response for every non-failing node.', 'CAP Theorem', 'hard'),
          mcq('Which communication pattern is best for decoupled asynchronous processing?', 'HTTP Polling', 'WebSocket', 'Message Queue', 'FTP', 2, 'Message queues decouple producers and consumers.', 'Microservices', 'hard'),
          mcq('What is the primary purpose of a load balancer?', 'Encrypt traffic', 'Compress responses', 'Distribute incoming requests across servers', 'Store sessions', 2, 'Load balancers distribute traffic to prevent overload.', 'Infrastructure', 'medium'),
          mcq('Which consistency model guarantees all replicas eventually reach the same state?', 'Strong Consistency', 'Linearizability', 'Eventual Consistency', 'Sequential Consistency', 2, 'Eventual consistency guarantees convergence over time.', 'Databases', 'hard'),
          mcq('Which consensus algorithm is used by Kubernetes etcd?', 'Dijkstra', 'Prim', 'Raft', 'Floyd-Warshall', 2, 'etcd uses Raft for distributed consensus.', 'Consensus', 'hard'),
          mcq('What problem does Two-Phase Commit (2PC) solve?', 'Load balancing', 'Distributed transaction coordination', 'Caching', 'Data compression', 1, '2PC coordinates atomic commit across nodes.', 'Transactions', 'hard'),
          mcq('Which pattern reduces failure blast radius in microservices?', 'Monolithic', 'Client-Server', 'Microservices', 'Peer-to-Peer', 2, 'Microservices isolate service failures.', 'Architecture', 'medium'),
          mcq('What is a split-brain scenario in clusters?', 'High CPU load', 'Network partition causing multiple active leaders', 'DB corruption', 'Memory leak', 1, 'Partitioning creates dual independent master nodes.', 'Clustering', 'hard'),
          mcq('Which technique stores frequently accessed data in RAM for fast reads?', 'Sharding', 'Replication', 'Caching', 'Checkpointing', 2, 'Caching reduces DB query latency.', 'Caching', 'easy'),
          mcq('What is the key advantage of horizontal scaling?', 'Faster CPU', 'More RAM per node', 'Adding more server nodes to cluster', 'Higher clock speed', 2, 'Horizontal scaling adds machines to distribute load.', 'Scaling', 'easy'),
          mcq('Which file system inspired Hadoop HDFS design?', 'MySQL', 'Google File System (GFS)', 'SQLite', 'PostgreSQL', 1, 'HDFS was modeled after Google GFS paper.', 'Distributed Systems', 'hard'),
          mcq('Which Kubernetes object manages pod replicas and rolling updates?', 'Service', 'ConfigMap', 'Deployment', 'Namespace', 2, 'Deployment controllers handle pod replicas.', 'Kubernetes', 'medium'),
          mcq('What is database sharding?', 'Encrypting tables', 'Partitioning data horizontally across multiple database instances', 'Zip compression', 'Backups', 1, 'Sharding divides dataset across nodes.', 'Databases', 'medium'),
          mcq('Which HTTP status code indicates a Gateway Timeout between services?', '200', '404', '500', '504', 3, '504 indicates upstream timeout.', 'HTTP', 'easy'),
          mcq('Which pattern prevents cascading failures when a downstream service dies?', 'Singleton', 'Factory', 'Circuit Breaker', 'Observer', 2, 'Circuit breaker trips to stop downstream calls.', 'Resilience', 'hard'),
          mcq('What is the purpose of service discovery?', 'Encrypt endpoints', 'Dynamically locate network addresses of service instances', 'Compress packets', 'Generate documentation', 1, 'Service discovery resolves IP addresses dynamically.', 'Networking', 'medium'),
          mcq('Which metric evaluates tail latency in distributed systems?', 'Average only', 'Median only', 'P99 Latency', 'Minimum latency', 2, 'P99 reflects the slowest 1% worst-case requests.', 'Metrics', 'hard'),
          mcq('What does idempotency mean in REST APIs?', 'Fast execution', 'Multiple identical requests produce the same server state', 'Encrypted payload', 'Parallel processing', 1, 'PUT/DELETE are idempotent operations.', 'API Design', 'medium'),
          mcq('Which tool is widely used for distributed tracing?', 'Redis', 'Jaeger', 'FTP', 'SMTP', 1, 'Jaeger tracks requests across microservice spans.', 'Observability', 'medium'),
          mcq('Why is observability essential in microservices?', 'Saves disk space', 'Understands system health via logs, metrics, and traces', 'Speeds up CPU', 'Replaces testing', 1, 'Observability provides deep system insight.', 'Observability', 'hard')
        ]
      },

      // 3. Full Stack Web Development Assessment
      {
        title: 'Full Stack Web Development Assessment',
        category: 'Programming',
        subject: 'Programming',
        difficulty: 'medium',
        duration: 60,
        questions: [
          mcq('What does the MERN stack stand for?', 'MongoDB, Express, React, Node.js', 'MySQL, Elixir, Ruby, Next.js', 'Mongo, Ember, Rails, Node', 'MariaDB, Express, Redux, Node', 0, 'MERN combines MongoDB, Express, React, and Node.js.', 'MERN', 'easy'),
          mcq('Which HTTP method is typically used to update an existing resource completely?', 'GET', 'POST', 'PUT', 'DELETE', 2, 'PUT replaces target resource representation.', 'REST API', 'easy'),
          mcq('In Express.js, what is the purpose of next() function in middleware?', 'Sends JSON response', 'Passes control to the next middleware handler', 'Restarts server', 'Terminates request', 1, 'next() invokes subsequent middleware.', 'Express', 'medium'),
          mcq('Which Hook is used to perform side effects in functional React components?', 'useState', 'useEffect', 'useContext', 'useReducer', 1, 'useEffect handles side effects like fetching.', 'React', 'easy'),
          mcq('What is CORS in web security?', 'Cross-Origin Resource Sharing', 'Central Online Remote Storage', 'Core Object Rendering System', 'Client Oriented Response Protocol', 0, 'CORS permits restricted resources on a domain to be requested from another domain.', 'Security', 'medium'),
          mcq('Which MongoDB command creates an index on a field?', 'db.collection.createIndex()', 'db.collection.addKey()', 'db.collection.makeIndex()', 'db.collection.search()', 0, 'createIndex() builds MongoDB indexes.', 'MongoDB', 'medium'),
          mcq('What does JWT stand for?', 'Java Web Technology', 'JSON Web Token', 'JavaScript Working Tool', 'Joint Wireless Transport', 1, 'JWT is JSON Web Token for auth claims.', 'Auth', 'easy'),
          mcq('In Node.js, what is the Event Loop responsible for?', 'Compiling C++ code', 'Handling asynchronous non-blocking I/O callbacks', 'Rendering HTML', 'Styling elements', 1, 'Event loop enables async single-thread I/O.', 'Node.js', 'hard'),
          mcq('Which HTTP status code signifies "201 Created"?', 'Request Successful', 'New Resource Successfully Created', 'Bad Request', 'Unauthorized', 1, '201 indicates resource creation.', 'HTTP', 'easy'),
          mcq('What is the Virtual DOM in React?', 'A direct copy of browser DOM', 'In-memory lightweight representation of the real DOM', 'HTML string template', 'Database schema', 1, 'Virtual DOM optimizes UI rendering diffs.', 'React', 'medium'),
          mcq('Which tool packages frontend JavaScript modules into single bundles?', 'Nginx', 'Webpack / Vite', 'PM2', 'Docker', 1, 'Bundlers package code for browser delivery.', 'Tooling', 'medium'),
          mcq('How do you pass data down to child components in React?', 'Via State', 'Via Props', 'Via Redux only', 'Via URL queries', 1, 'Props pass data down component tree.', 'React', 'easy'),
          mcq('What is the purpose of body-parser / express.json() middleware?', 'Compresses images', 'Parses incoming JSON request payload into req.body', 'Encrypts cookies', 'Routes endpoints', 1, 'express.json() populates req.body.', 'Express', 'easy'),
          mcq('Which status code represents 401 Unauthorized?', 'Forbidden', 'Authentication required or invalid credentials', 'Not Found', 'Internal Error', 1, '401 means authentication is missing or invalid.', 'Security', 'easy'),
          mcq('What is Git commit used for?', 'Uploading to GitHub', 'Saving snapshot of staged changes in local repository', 'Creating a branch', 'Merging pull requests', 1, 'Commit records changes in local repo.', 'Git', 'easy'),
          mcq('Which CSS layout module is best for 1D row/column alignment?', 'CSS Grid', 'Flexbox', 'Float', 'Absolute Positioning', 1, 'Flexbox handles 1D layout distribution.', 'CSS', 'easy'),
          mcq('What is a Higher-Order Component (HOC) in React?', 'A component rendering HTML tags', 'A function taking a component and returning a new component', 'A stateful hook', 'A class method', 1, 'HOC wraps components to share logic.', 'React', 'hard'),
          mcq('Which header passes JWT tokens in REST API requests?', 'Content-Type', 'Authorization: Bearer <token>', 'Accept-Language', 'Host', 1, 'Bearer tokens use Authorization header.', 'Auth', 'medium'),
          mcq('What is the difference between SQL and NoSQL databases?', 'SQL is relational/table-based; NoSQL is non-relational/document-based', 'SQL has no schemas', 'NoSQL cannot scale', 'SQL uses JSON', 0, 'SQL uses structured tables; NoSQL uses flexible documents/kv.', 'Databases', 'medium'),
          mcq('Which command builds a React Vite app for production?', 'npm start', 'npm run dev', 'npm run build', 'npm test', 2, 'npm run build compiles optimized production assets.', 'Tooling', 'easy')
        ]
      },

      // 4. React Fundamentals
      {
        title: 'React Fundamentals',
        category: 'Programming',
        subject: 'Programming',
        difficulty: 'medium',
        duration: 45,
        questions: [
          mcq('Who developed and maintains React?', 'Google', 'Meta (Facebook)', 'Microsoft', 'Twitter', 1, 'React was created by Meta in 2013.', 'Basics', 'easy'),
          mcq('What syntax extension allows writing HTML-like code inside JavaScript?', 'TSX', 'JSX', 'JSX-CSS', 'EJS', 1, 'JSX stands for JavaScript XML.', 'JSX', 'easy'),
          mcq('Which hook manages local component state in functional components?', 'useEffect', 'useMemo', 'useState', 'useRef', 2, 'useState returns state value and updater function.', 'Hooks', 'easy'),
          mcq('What is the rule regarding Hook invocation in React?', 'Call inside loops', 'Call at top level of functional components only', 'Call in event listeners', 'Call inside nested functions', 1, 'Hooks must be called at top level.', 'Hooks', 'medium'),
          mcq('Why is the `key` prop required when rendering list elements in React?', 'Styles elements', 'Helps React identify which items changed, added, or removed', 'Binds click events', 'Generates unique IDs', 1, 'Keys assist Virtual DOM reconciliation.', 'Reconciliation', 'medium'),
          mcq('What does `useRef` return?', 'A state tuple', 'A mutable object with a `.current` property', 'A dispatch method', 'A memoized value', 1, 'useRef returns persistent mutable ref object.', 'Hooks', 'medium'),
          mcq('How can you avoid props drilling across deeply nested components?', 'useState', 'React Context API', 'useRef', 'useEffect', 1, 'Context API shares values globally without props drilling.', 'State Management', 'medium'),
          mcq('What happens when component state changes?', 'Component unmounts', 'React re-renders the component', 'Page reloads', 'Browser crashes', 1, 'State mutation schedules a re-render.', 'Lifecycle', 'easy'),
          mcq('Which hook memoizes expensive calculation results across re-renders?', 'useCallback', 'useMemo', 'useEffect', 'useImperativeHandle', 1, 'useMemo caches computation output.', 'Hooks', 'hard'),
          mcq('What is the difference between `useMemo` and `useCallback`?', 'useMemo caches value; useCallback caches function reference', 'They are identical', 'useCallback is for state', 'useMemo is for side effects', 0, 'useMemo memoizes return value; useCallback memoizes function instance.', 'Hooks', 'hard'),
          mcq('What does `useEffect(() => {}, [])` with an empty dependency array do?', 'Runs on every render', 'Runs once after initial component mount', 'Never runs', 'Runs on unmount only', 1, 'Empty array runs effect once on mount.', 'Hooks', 'medium'),
          mcq('How do you return multiple elements without adding extra nodes to the DOM?', '<div>', 'React.Fragment or <> </>', '<span>', '<section>', 1, 'Fragments group elements without wrapping DOM nodes.', 'JSX', 'easy'),
          mcq('What method in class components is equivalent to `useEffect(() => {}, [])`?', 'componentDidMount', 'render', 'componentDidUpdate', 'componentWillUnmount', 0, 'componentDidMount handles initial mount logic.', 'Lifecycle', 'medium'),
          mcq('How do you handle controlled form inputs in React?', 'Direct DOM manipulation', 'Binding input value to state and updating via onChange', 'Using window.prompt', 'Using ref only', 1, 'Controlled inputs derive value from React state.', 'Forms', 'easy'),
          mcq('What is StrictMode in React?', 'Prevents CSS styles', 'Tool for highlighting potential problems in application code during dev', 'Production minifier', 'Router wrapper', 1, 'StrictMode triggers double renders in dev to catch side effects.', 'Tooling', 'medium'),
          mcq('Which package handles client-side routing in React web apps?', 'React Native', 'React Router DOM', 'Redux Toolkit', 'Axios', 1, 'react-router-dom manages web routes.', 'Routing', 'easy'),
          mcq('What is lazy loading in React?', 'Delaying network calls', 'Code splitting components using React.lazy() and Suspense', 'Caching images', 'Async state', 1, 'React.lazy delays rendering until component is needed.', 'Performance', 'hard'),
          mcq('What is the cleanup function in `useEffect` used for?', 'Resetting state', 'Unsubscribing listeners or clearing timers before unmount', 'Updating props', 'Logging errors', 1, 'Returned function cleans up side effects on unmount.', 'Hooks', 'medium'),
          mcq('What is Redux Toolkit?', 'CSS library', 'Official opinionated toolset for efficient Redux development', 'HTML parser', 'Database driver', 1, 'Redux Toolkit simplifies global store management.', 'State Management', 'medium'),
          mcq('What is custom hook naming convention in React?', 'Must start with "use"', 'Must start with "get"', 'Must end with "Hook"', 'Must be uppercase', 0, 'Custom hooks must begin with "use" prefix.', 'Hooks', 'easy')
        ]
      },

      // 5. JavaScript Essentials
      {
        title: 'JavaScript Essentials',
        category: 'Programming',
        subject: 'Programming',
        difficulty: 'easy',
        duration: 30,
        questions: [
          mcq('Which keyword declares a block-scoped variable in ES6?', 'var', 'let', 'def', 'string', 1, 'let creates block-scoped variables.', 'Variables', 'easy'),
          mcq('What will `typeof null` evaluate to in JavaScript?', 'null', 'undefined', 'object', 'number', 2, 'typeof null returning "object" is a historic JS quirk.', 'Types', 'easy'),
          mcq('Which comparison operator checks both value and type equality?', '==', '===', '=', '!=', 1, '=== performs strict equality check.', 'Operators', 'easy'),
          mcq('What is the result of `console.log(1 + "2")`?', '3', '12', 'NaN', 'Error', 1, 'Number 1 is coerced into string "1", resulting in "12".', 'Coercion', 'easy'),
          mcq('Which array method adds an element to the end of an array?', 'pop()', 'push()', 'shift()', 'unshift()', 1, 'push() appends elements to end.', 'Arrays', 'easy'),
          mcq('Which array method removes the last element of an array?', 'pop()', 'push()', 'shift()', 'unshift()', 0, 'pop() removes and returns last element.', 'Arrays', 'easy'),
          mcq('What is the purpose of `Array.prototype.map()`?', 'Filters items', 'Creates new array populated with results of calling a function on every element', 'Sorts array', 'Finds single item', 1, 'map() transforms every element.', 'Arrays', 'easy'),
          mcq('How do you write an arrow function in JS?', 'function() => {}', 'const f = () => {}', 'def f():', 'func f = {}', 1, '() => {} syntax defines arrow function.', 'Functions', 'easy'),
          mcq('What does `isNaN("hello")` return?', 'false', 'true', 'null', 'undefined', 1, '"hello" converted to Number is NaN, so isNaN returns true.', 'Globals', 'easy'),
          mcq('Which statement terminates a loop immediately?', 'continue', 'break', 'return', 'exit', 1, 'break statement exits loop body.', 'Control Flow', 'easy'),
          mcq('What is a Closure in JavaScript?', 'A scope block', 'A function having access to its parent lexical scope after parent returned', 'An object method', 'A promise rejection', 1, 'Closure retains access to enclosing lexical scope.', 'Functions', 'medium'),
          mcq('What is the default value of an uninitialized variable in JS?', 'null', '0', 'undefined', 'false', 2, 'Unassigned variables have value undefined.', 'Variables', 'easy'),
          mcq('Which method converts a JSON string into a JS object?', 'JSON.stringify()', 'JSON.parse()', 'JSON.object()', 'JSON.toJS()', 1, 'JSON.parse converts string to object.', 'JSON', 'easy'),
          mcq('Which method converts a JS object into a JSON string?', 'JSON.stringify()', 'JSON.parse()', 'JSON.encode()', 'JSON.serialize()', 0, 'JSON.stringify converts object to string.', 'JSON', 'easy'),
          mcq('What does the rest operator `...` do in function parameters?', 'Multiplies args', 'Gathers remaining parameters into an array', 'Destroys object', 'Splits array', 1, 'Rest parameter collects arguments into array.', 'ES6', 'easy'),
          mcq('Which keyword is used to declare a constant value that cannot be reassigned?', 'var', 'let', 'const', 'final', 2, 'const prevents re-assignment.', 'Variables', 'easy'),
          mcq('What is the result of `Boolean("")`?', 'true', 'false', 'undefined', 'null', 1, 'Empty string is falsy in JavaScript.', 'Booleans', 'easy'),
          mcq('What method removes the first element from an array?', 'pop()', 'push()', 'shift()', 'unshift()', 2, 'shift() removes first item.', 'Arrays', 'easy'),
          mcq('Which object represents an eventual completion of an asynchronous operation?', 'Callback', 'Promise', 'Event', 'Proxy', 1, 'Promise represents async outcome.', 'Async', 'medium'),
          mcq('What is `async/await` built on top of?', 'Generators', 'Promises', 'Callbacks', 'Events', 1, 'async/await is syntactic sugar over Promises.', 'Async', 'medium')
        ]
      },

      // 6. Python Programming
      {
        title: 'Python Programming',
        category: 'Programming',
        subject: 'Programming',
        difficulty: 'medium',
        duration: 60,
        questions: [
          mcq('Which data structure in Python is immutable?', 'List', 'Dictionary', 'Set', 'Tuple', 3, 'Tuples cannot be modified after creation.', 'Data Structures', 'easy'),
          mcq('How do you define a function in Python?', 'function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():', 1, 'def keyword defines Python functions.', 'Syntax', 'easy'),
          mcq('What will `print(type([]))` output in Python 3?', '<class \'list\'>', '<class \'tuple\'>', '<class \'array\'>', '<class \'dict\'>', 0, '[] denotes list data type.', 'Types', 'easy'),
          mcq('Which method adds an item to the end of a Python list?', 'add()', 'append()', 'push()', 'insert()', 1, 'append() adds element to end of list.', 'Lists', 'easy'),
          mcq('What does list comprehension `[x**2 for x in range(3)]` output?', '[1, 4, 9]', '[0, 1, 4]', '[0, 1, 2]', '[1, 2, 3]', 1, 'range(3) is 0, 1, 2. Squares are 0, 1, 4.', 'List Comprehension', 'medium'),
          mcq('Which keyword handles exceptions in Python try blocks?', 'catch', 'except', 'error', 'finally', 1, 'except block catches exceptions.', 'Exceptions', 'easy'),
          mcq('What does `len({"a": 1, "b": 2})` return?', '1', '2', '4', 'Error', 1, 'len() returns number of key-value pairs in dictionary.', 'Dictionaries', 'easy'),
          mcq('Which special method is constructor of a Python class?', '__create__', '__init__', '__new__', '__construct__', 1, '__init__ initializes class instance.', 'OOP', 'easy'),
          mcq('What is GIL in CPython implementation?', 'Global Interface Layer', 'Global Interpreter Lock', 'General Index Log', 'Graphics Integrated Logic', 1, 'GIL restricts execution to single thread at a time in CPython.', 'Advanced', 'hard'),
          mcq('Which built-in function returns an iterator of tuples pairing elements from multiple iterables?', 'combine()', 'pair()', 'zip()', 'enumerate()', 2, 'zip() aggregates elements from iterables.', 'Functions', 'medium'),
          mcq('What is output of `bool("False")` in Python?', 'False', 'True', 'None', 'Error', 1, 'Non-empty string is truthy in Python.', 'Booleans', 'medium'),
          mcq('Which keyword is used to yield values lazily from a generator function?', 'return', 'yield', 'emit', 'send', 1, 'yield turns function into a generator.', 'Generators', 'medium'),
          mcq('What is the difference between `is` and `==` in Python?', '`is` compares object identity (memory location); `==` compares values', 'They are identical', '`==` checks types', '`is` is faster assignment', 0, '`is` checks memory reference equality; `==` checks value equality.', 'Operators', 'medium'),
          mcq('Which module is standard for regular expressions in Python?', 'regex', 're', 'pyregex', 'string', 1, 're module provides regex matching.', 'Modules', 'easy'),
          mcq('What does `args` and `**kwargs` represent in function parameters?', 'Positional arguments list & Keyword arguments dictionary', 'Key values only', 'Type annotations', 'Global variables', 0, '*args handles positional tuple; **kwargs handles keyword dict.', 'Functions', 'medium'),
          mcq('How do you open a file securely ensuring it closes automatically in Python?', 'file = open()', 'with open("file.txt") as f:', 'f = read()', 'import file', 1, 'with context manager guarantees file closure.', 'File I/O', 'easy'),
          mcq('Which decorator converts a class method into a static method?', '@staticmethod', '@classmethod', '@property', '@decorator', 0, '@staticmethod defines self-less class methods.', 'OOP', 'medium'),
          mcq('What does `set([1, 2, 2, 3])` create?', '[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '{1: 2, 3: 3}', 1, 'set creates unordered collection of unique elements {1, 2, 3}.', 'Sets', 'easy'),
          mcq('What is virtualenv in Python?', 'A GUI framework', 'Tool to create isolated Python environment environments', 'Database plugin', 'Compiler', 1, 'virtualenv isolates dependency packages per project.', 'Tooling', 'easy'),
          mcq('Which PEP standard defines Python code style guidelines?', 'PEP 8', 'PEP 20', 'PEP 484', 'PEP 0', 0, 'PEP 8 is official Python style guide.', 'Standards', 'easy')
        ]
      },

      // 7. Algebra Mastery
      {
        title: 'Algebra Mastery',
        category: 'Mathematics',
        subject: 'Mathematics',
        difficulty: 'easy',
        duration: 30,
        questions: [
          mcq('Solve for x: 2x + 5 = 15', 'x = 3', 'x = 5', 'x = 10', 'x = 7', 1, '2x = 10 => x = 5.', 'Equations', 'easy'),
          mcq('What is the expansion of (a + b)²?', 'a² + b²', 'a² - b²', 'a² + 2ab + b²', 'a² - 2ab + b²', 2, '(a+b)² = a² + 2ab + b².', 'Formulas', 'easy'),
          mcq('Factorize: x² - 9', '(x-3)(x-3)', '(x+3)(x-3)', '(x+9)(x-1)', '(x+3)(x+3)', 1, 'Difference of squares: a² - b² = (a+b)(a-b).', 'Factorization', 'easy'),
          mcq('What is the slope of the line y = 4x - 7?', '4', '-7', '-4', '7', 0, 'In slope-intercept form y = mx + c, slope m = 4.', 'Lines', 'easy'),
          mcq('Solve: 3x - 4 = 2(x + 1)', 'x = 2', 'x = 6', 'x = 4', 'x = 8', 1, '3x - 4 = 2x + 2 => x = 6.', 'Equations', 'easy'),
          mcq('What is value of x in x/4 = 9?', 'x = 13', 'x = 36', 'x = 2.25', 'x = 32', 1, 'x = 9 * 4 = 36.', 'Equations', 'easy'),
          mcq('What is quadratic formula for roots of ax² + bx + c = 0?', '(-b ± √(b² - 4ac)) / 2a', '(-b ± √(b² + 4ac)) / 2a', '(b ± √(b² - 4ac)) / a', '(-b ± √b) / 2a', 0, 'Standard quadratic formula is (-b ± √(b² - 4ac)) / 2a.', 'Quadratics', 'medium'),
          mcq('If f(x) = 2x² - 3, what is f(3)?', '12', '15', '18', '21', 1, 'f(3) = 2(9) - 3 = 18 - 3 = 15.', 'Functions', 'easy'),
          mcq('What is the product of roots of quadratic equation ax² + bx + c = 0?', '-b/a', 'c/a', '-c/a', 'b/a', 1, 'Product of roots = c/a.', 'Quadratics', 'medium'),
          mcq('Simplify: (2x³)(3x²)', '5x⁵', '6x⁵', '6x⁶', '5x⁶', 1, '2*3 = 6, x^(3+2) = x⁵ => 6x⁵.', 'Exponents', 'easy'),
          mcq('What is value of any non-zero number to power 0 (x⁰)?', '0', '1', 'x', 'Undefined', 1, 'x⁰ = 1 for any x ≠ 0.', 'Exponents', 'easy'),
          mcq('Solve system: x + y = 10, x - y = 4', 'x=7, y=3', 'x=6, y=4', 'x=8, y=2', 'x=5, y=5', 0, '2x = 14 => x=7, y=3.', 'Systems', 'easy'),
          mcq('What is discriminant of quadratic equation ax² + bx + c = 0?', 'b² - 4ac', 'b² + 4ac', '4ac - b²', '√(b² - 4ac)', 0, 'Discriminant D = b² - 4ac.', 'Quadratics', 'easy'),
          mcq('If D > 0 for quadratic equation, roots are:', 'Real and distinct', 'Real and equal', 'Complex conjugate', 'Zero', 0, 'Positive discriminant implies two real distinct roots.', 'Quadratics', 'easy'),
          mcq('Simplify: (x⁴)³', 'x⁷', 'x¹²', 'x', 'x⁶', 1, '(x^a)^b = x^(a*b) => x¹².', 'Exponents', 'easy'),
          mcq('What is Y-intercept of line 2x + 3y = 6?', '(0, 2)', '(3, 0)', '(0, 6)', '(0, 3)', 0, 'Set x=0: 3y = 6 => y = 2. Y-intercept is (0,2).', 'Lines', 'easy'),
          mcq('Solve inequality: 2x - 3 > 7', 'x > 5', 'x < 5', 'x > 2', 'x < 2', 0, '2x > 10 => x > 5.', 'Inequalities', 'easy'),
          mcq('Evaluate: | -8 |', '-8', '8', '0', '64', 1, 'Absolute value of -8 is 8.', 'Absolute Value', 'easy'),
          mcq('What is degree of polynomial 4x³ + 2x⁵ - 7x + 1?', '3', '5', '1', '4', 1, 'Degree is highest exponent power, which is 5.', 'Polynomials', 'easy'),
          mcq('If log₁₀(x) = 2, what is x?', '20', '100', '10', '1000', 1, 'x = 10² = 100.', 'Logarithms', 'easy')
        ]
      },

      // 8. Calculus Challenge
      {
        title: 'Calculus Challenge',
        category: 'Mathematics',
        subject: 'Mathematics',
        difficulty: 'hard',
        duration: 45,
        questions: [
          mcq('What is derivative of f(x) = x³ - 4x + 7 with respect to x?', '3x² - 4', '3x² - 4x', 'x² - 4', '3x³ - 4', 0, 'd/dx(x³) = 3x², d/dx(-4x) = -4.', 'Derivatives', 'easy'),
          mcq('What is integral ∫ sin(x) dx?', 'cos(x) + C', '-cos(x) + C', 'tan(x) + C', '-sin(x) + C', 1, '∫ sin(x) dx = -cos(x) + C.', 'Integrals', 'easy'),
          mcq('What is limit lim(x->0) [sin(x)/x]?', '0', '1', 'Infinity', 'Undefined', 1, 'Standard limit result is 1.', 'Limits', 'medium'),
          mcq('What is derivative of e^(2x)?', 'e^(2x)', '2e^(2x)', '1/2 e^(2x)', '2x e^(2x)', 1, 'Chain rule: d/dx[e^(2x)] = 2e^(2x).', 'Derivatives', 'medium'),
          mcq('What is derivative of ln(x)?', '1/x', 'e^x', 'x', '1/x²', 0, 'd/dx[ln(x)] = 1/x for x > 0.', 'Derivatives', 'easy'),
          mcq('What does Fundamental Theorem of Calculus state?', 'Derivatives equal integrals', 'Integration and differentiation are inverse operations', 'Limits are infinite', 'Functions are continuous', 1, 'FTC connects integration and differentiation as inverses.', 'Theorems', 'medium'),
          mcq('What is derivative of product u(x)v(x)?', 'u\'v\'', 'u\'v + uv\'', 'u\'v - uv\'', '(u\'v + uv\')/v²', 1, 'Product rule: d/dx(uv) = u\'v + uv\'.', 'Rules', 'easy'),
          mcq('What is second derivative of f(x) = x⁴?', '4x³', '12x²', '12x', '24x', 1, 'f\'(x) = 4x³, f\'\'(x) = 12x².', 'Derivatives', 'easy'),
          mcq('Evaluate definite integral ∫₀² 3x² dx', '6', '8', '12', '4', 1, '[x³] from 0 to 2 = 2³ - 0 = 8.', 'Definite Integrals', 'medium'),
          mcq('When derivative f\'(x) = 0 and f\'\'(x) > 0 at a point, that point is a:', 'Local maximum', 'Local minimum', 'Inflection point', 'Saddle point', 1, 'Second derivative test: f\'\'(x) > 0 implies local minimum.', 'Extrema', 'hard'),
          mcq('What is derivative of tan(x)?', 'sec²(x)', 'csc²(x)', 'cot(x)', 'sec(x)tan(x)', 0, 'd/dx[tan(x)] = sec²(x).', 'Derivatives', 'medium'),
          mcq('What rule is used to evaluate limits of form 0/0 or ∞/∞?', 'Chain rule', 'L\'Hôpital\'s Rule', 'Quotient rule', 'Simpson\'s rule', 1, 'L\'Hôpital\'s rule differentiates numerator and denominator.', 'Limits', 'medium'),
          mcq('What is derivative of cos(x)?', 'sin(x)', '-sin(x)', 'tan(x)', '-cos(x)', 1, 'd/dx[cos(x)] = -sin(x).', 'Derivatives', 'easy'),
          mcq('What is integral ∫ 1/x dx for x > 0?', 'ln(x) + C', 'x² + C', '-1/x² + C', 'e^x + C', 0, '∫ (1/x) dx = ln|x| + C.', 'Integrals', 'easy'),
          mcq('What is Taylor series expansion centered at a = 0 called?', 'Fourier series', 'Maclaurin series', 'Binomial series', 'Laurent series', 1, 'Taylor series centered at 0 is Maclaurin series.', 'Series', 'hard'),
          mcq('Evaluate limit lim(x->∞) (3x² + 2)/(x² - 5)', '0', '3', 'Infinity', '1', 1, 'Ratio of highest power coefficients = 3/1 = 3.', 'Limits', 'medium'),
          mcq('What is integral ∫ e^x dx?', 'e^x + C', 'xe^x + C', 'e^(x+1)/(x+1) + C', 'ln(x) + C', 0, 'Derivative/integral of e^x is e^x + C.', 'Integrals', 'easy'),
          mcq('What is partial derivative ∂/∂x (x² y³)?', '2x y³', '3x² y²', '2x + 3y', 'x² y²', 0, 'Treat y as constant: d/dx(x²) * y³ = 2x y³.', 'Multivariable', 'hard'),
          mcq('Area under curve y = f(x) from a to b is calculated by:', 'd/dx f(x)', '∫ₐᵇ f(x) dx', 'f(b) - f(a)', 'f\'(b) * (b - a)', 1, 'Definite integral calculates area under curve.', 'Applications', 'medium'),
          mcq('What is derivative of inverse function arctan(x)?', '1/(1 + x²)', '1/√(1 - x²)', '-1/(1 + x²)', 'sec²(x)', 0, 'd/dx[arctan(x)] = 1/(1 + x²).', 'Derivatives', 'hard')
        ]
      },

      // 9. Geometry & Mensuration
      {
        title: 'Geometry & Mensuration',
        category: 'Mathematics',
        subject: 'Mathematics',
        difficulty: 'medium',
        duration: 35,
        questions: [
          mcq('What is the area of a circle with radius r?', 'πr', '2πr', 'πr²', '4πr²', 2, 'Area = πr².', 'Circles', 'easy'),
          mcq('What is the perimeter of a rectangle with length l and width w?', 'l * w', '2(l + w)', 'l + w', '2lw', 1, 'Perimeter = 2(length + width).', 'Polygons', 'easy'),
          mcq('What is the sum of interior angles of a triangle?', '90°', '180°', '360°', '270°', 1, 'Sum of interior angles of triangle is always 180°.', 'Triangles', 'easy'),
          mcq('What is formula for volume of a sphere of radius r?', '4/3 πr³', 'πr²h', '1/3 πr²h', '4πr²', 0, 'Volume of sphere = 4/3 πr³.', '3D Shapes', 'medium'),
          mcq('In a right-angled triangle, if legs are 3 and 4, hypotenuse is:', '5', '6', '7', '25', 0, 'Pythagorean theorem: √(3² + 4²) = √(9+16) = 5.', 'Triangles', 'easy'),
          mcq('What is formula for area of a triangle with base b and height h?', 'b * h', '1/2 * b * h', '2 * b * h', 'b² * h', 1, 'Area = 1/2 * base * height.', 'Triangles', 'easy'),
          mcq('What is the volume of a cylinder with radius r and height h?', 'πr²h', '2πrh', '1/3 πr²h', '4/3 πr³', 0, 'Volume of cylinder = πr²h.', '3D Shapes', 'medium'),
          mcq('What is sum of interior angles of an n-sided polygon?', '(n - 2) * 180°', '(n + 2) * 180°', 'n * 180°', '360° / n', 0, 'Sum = (n - 2) * 180°.', 'Polygons', 'medium'),
          mcq('What is total surface area of a cube of side length a?', 'a³', '4a²', '6a²', '12a', 2, 'Cube has 6 square faces, so area = 6a².', '3D Shapes', 'easy'),
          mcq('If circumference of a circle is 44 cm (π=22/7), radius is:', '7 cm', '14 cm', '21 cm', '3.5 cm', 0, '2 * 22/7 * r = 44 => r = 7 cm.', 'Circles', 'medium'),
          mcq('What is volume of a cone with radius r and height h?', 'πr²h', '1/3 πr²h', '2/3 πr²h', '4/3 πr³', 1, 'Cone volume is 1/3 volume of cylinder = 1/3 πr²h.', '3D Shapes', 'medium'),
          mcq('Two angles are supplementary if their sum is:', '90°', '180°', '360°', '45°', 1, 'Supplementary angles add up to 180°.', 'Angles', 'easy'),
          mcq('Two angles are complementary if their sum is:', '90°', '180°', '360°', '270°', 0, 'Complementary angles add up to 90°.', 'Angles', 'easy'),
          mcq('What is area of a rhombus with diagonals d₁ and d₂?', 'd₁ * d₂', '1/2 * d₁ * d₂', '2(d₁ + d₂)', 'd₁² + d₂²', 1, 'Area of rhombus = 1/2 * d₁ * d₂.', 'Polygons', 'medium'),
          mcq('What is length of diagonal of square of side a?', 'a√2', 'a√3', '2a', 'a²', 0, 'By Pythagoras: √(a² + a²) = a√2.', 'Squares', 'easy'),
          mcq('What is area of an equilateral triangle of side a?', '(√3/4) a²', '(1/2) a²', '(√3/2) a²', 'a²', 0, 'Equilateral triangle area = (√3/4) a².', 'Triangles', 'medium'),
          mcq('Curved surface area of a cylinder of radius r and height h is:', '2πrh', 'πr²h', '2πr(r + h)', 'πrh', 0, 'Curved surface area = 2πrh.', '3D Shapes', 'medium'),
          mcq('How many edges does a cube have?', '6', '8', '12', '16', 2, 'A cube has 6 faces, 8 vertices, and 12 edges.', '3D Shapes', 'easy'),
          mcq('If ratio of areas of two similar triangles is 16:25, ratio of corresponding sides is:', '4:5', '16:25', '2:3', '256:625', 0, 'Ratio of sides = √(16/25) = 4/5.', 'Triangles', 'medium'),
          mcq('What is measure of each interior angle of a regular hexagon (n=6)?', '108°', '120°', '135°', '144°', 1, '(6-2)*180 / 6 = 720 / 6 = 120°.', 'Polygons', 'medium')
        ]
      },

      // 10. Probability & Statistics
      {
        title: 'Probability & Statistics',
        category: 'Mathematics',
        subject: 'Mathematics',
        difficulty: 'medium',
        duration: 40,
        questions: [
          mcq('What is the probability of flipping a fair coin and getting Heads?', '0', '0.5', '1', '0.25', 1, 'P(Heads) = 1/2 = 0.5.', 'Probability', 'easy'),
          mcq('What is the mean of dataset [2, 4, 6, 8, 10]?', '5', '6', '7', '8', 1, 'Sum = 30, count = 5. Mean = 30/5 = 6.', 'Statistics', 'easy'),
          mcq('What is the median of dataset [3, 1, 7, 5, 9]?', '3', '5', '7', '9', 1, 'Sorted: [1, 3, 5, 7, 9]. Median (middle) is 5.', 'Statistics', 'easy'),
          mcq('What is the mode of dataset [1, 2, 2, 3, 4, 2, 5]?', '1', '2', '3', '5', 1, 'Mode is most frequent element, which is 2.', 'Statistics', 'easy'),
          mcq('If P(A) = 0.4, what is probability of complement P(A\')?', '0.4', '0.6', '1.0', '0.0', 1, 'P(A\') = 1 - P(A) = 1 - 0.4 = 0.6.', 'Probability', 'easy'),
          mcq('What is the variance if standard deviation σ = 4?', '2', '8', '16', '64', 2, 'Variance = σ² = 4² = 16.', 'Statistics', 'easy'),
          mcq('What is probability of rolling a 6 on a fair 6-sided die?', '1/2', '1/6', '1/3', '1/12', 1, 'P(6) = 1/6.', 'Probability', 'easy'),
          mcq('Which distribution models number of successes in n independent Bernoulli trials?', 'Poisson', 'Binomial', 'Normal', 'Uniform', 1, 'Binomial distribution models n independent trials.', 'Distributions', 'medium'),
          mcq('What is the total area under a standard normal probability curve?', '0.5', '1.0', '100', 'Infinity', 1, 'Total area under PDF curve is always 1.', 'Distributions', 'medium'),
          mcq('In a standard normal distribution (Z-score), mean and standard deviation are:', 'Mean=0, SD=1', 'Mean=1, SD=0', 'Mean=50, SD=10', 'Mean=0, SD=0', 0, 'Standard normal has μ = 0, σ = 1.', 'Distributions', 'easy'),
          mcq('What theorem states sum of independent random variables approaches normal distribution?', 'Bayes Theorem', 'Central Limit Theorem', 'Law of Large Numbers', 'Pythagorean Theorem', 1, 'CLT guarantees normality of sample means for large n.', 'Theorems', 'hard'),
          mcq('What is formula for Bayes Theorem P(A|B)?', 'P(B|A)P(A) / P(B)', 'P(A)P(B)', 'P(A∩B) / P(A)', 'P(A) + P(B)', 0, 'Bayes theorem formula: P(A|B) = P(B|A)P(A) / P(B).', 'Bayes', 'hard'),
          mcq('If events A and B are independent, P(A ∩ B) =', 'P(A) + P(B)', 'P(A) * P(B)', 'P(A) / P(B)', '0', 1, 'For independent events, joint probability is product of individual probabilities.', 'Probability', 'medium'),
          mcq('What does interquartile range (IQR) measure?', 'Q3 - Q1', 'Q4 - Q0', 'Mean - Median', 'Max - Min', 0, 'IQR = 75th percentile (Q3) - 25th percentile (Q1).', 'Statistics', 'medium'),
          mcq('What is range of dataset [12, 5, 22, 18, 9]?', '17', '22', '12', '13', 0, 'Range = Max - Min = 22 - 5 = 17.', 'Statistics', 'easy'),
          mcq('What is number of permutations of 4 objects taken all at a time (4!)?', '12', '24', '16', '8', 1, '4! = 4 * 3 * 2 * 1 = 24.', 'Combinatorics', 'easy'),
          mcq('What is number of combinations C(5, 2)?', '10', '20', '5', '60', 0, 'C(5,2) = 5! / (2! 3!) = (5*4)/2 = 10.', 'Combinatorics', 'medium'),
          mcq('A correlation coefficient of r = -0.95 indicates:', 'Weak positive correlation', 'Strong negative linear correlation', 'No correlation', 'Perfect positive correlation', 1, 'r near -1 implies strong negative linear relationship.', 'Correlation', 'medium'),
          mcq('What type of error occurs when null hypothesis is rejected when it is actually true?', 'Type I error', 'Type II error', 'Sampling error', 'Standard error', 0, 'Type I error is false positive (rejecting true H₀).', 'Hypothesis Testing', 'hard'),
          mcq('What type of error occurs when null hypothesis is NOT rejected when it is false?', 'Type I error', 'Type II error', 'Random error', 'Systematic error', 1, 'Type II error is false negative (failing to reject false H₀).', 'Hypothesis Testing', 'hard')
        ]
      },

      // 11. Physics Concepts
      {
        title: 'Physics Concepts',
        category: 'Science',
        subject: 'Science',
        difficulty: 'medium',
        duration: 40,
        questions: [
          mcq('What is Newton\'s Second Law of Motion formula?', 'F = m/a', 'F = m * a', 'F = m + a', 'F = m * v', 1, 'Force = mass * acceleration (F = ma).', 'Mechanics', 'easy'),
          mcq('What is the SI unit of Force?', 'Joule', 'Pascal', 'Newton', 'Watt', 2, 'Newton (N) is SI unit of force.', 'Units', 'easy'),
          mcq('What is acceleration due to gravity near Earth\'s surface?', '9.8 m/s²', '3.0 x 10⁸ m/s', '1.6 x 10⁻¹⁹ C', '6.67 x 10⁻¹¹ N', 0, 'g ≈ 9.8 m/s².', 'Mechanics', 'easy'),
          mcq('What is SI unit of Energy / Work?', 'Newton', 'Watt', 'Joule', 'Volt', 2, 'Joule (J) is SI unit of work and energy.', 'Units', 'easy'),
          mcq('What is Kinetic Energy formula?', 'mgh', '1/2 mv²', 'mv', '1/2 m²v', 1, 'KE = 1/2 m v².', 'Energy', 'easy'),
          mcq('What is Gravitational Potential Energy formula near Earth surface?', '1/2 mv²', 'mgh', 'Fd', 'P/t', 1, 'PE = m * g * h.', 'Energy', 'easy'),
          mcq('What is speed of light in vacuum (c)?', '3 x 10⁸ m/s', '3 x 10⁵ m/s', '9.8 m/s²', '340 m/s', 0, 'Speed of light c ≈ 3.0 x 10⁸ m/s.', 'Optics', 'easy'),
          mcq('Ohm\'s Law states relationship between Voltage (V), Current (I), and Resistance (R) as:', 'V = I / R', 'V = I * R', 'V = I + R', 'V = R / I', 1, 'V = IR.', 'Electricity', 'easy'),
          mcq('What is SI unit of Electrical Resistance?', 'Ampere', 'Volt', 'Ohm', 'Farad', 2, 'Ohm (Ω) is unit of resistance.', 'Units', 'easy'),
          mcq('What is frequency unit in SI system?', 'Hertz (Hz)', 'Decibel (dB)', 'Meter/second', 'Radian', 0, 'Hertz measures cycles per second.', 'Waves', 'easy'),
          mcq('First Law of Thermodynamics is a restatement of which principle?', 'Conservation of Mass', 'Conservation of Energy', 'Conservation of Momentum', 'Entropy increase', 1, 'First law states energy cannot be created or destroyed.', 'Thermodynamics', 'medium'),
          mcq('Which optical phenomenon causes rainbow formation when sunlight passes raindrops?', 'Diffraction', 'Refraction and Dispersion', 'Interference', 'Polarization', 1, 'Refraction and internal dispersion split white light.', 'Optics', 'medium'),
          mcq('What type of wave is sound in air?', 'Transverse wave', 'Longitudinal pressure wave', 'Electromagnetic wave', 'Surface wave', 1, 'Sound waves in air are longitudinal compression waves.', 'Waves', 'easy'),
          mcq('What is unit of Power?', 'Joule', 'Watt', 'Newton', 'Coulomb', 1, 'Watt (W) = 1 Joule/second.', 'Units', 'easy'),
          mcq('According to Einstein\'s mass-energy equivalence equation:', 'E = mc²', 'E = 1/2 mc', 'E = hf²', 'E = m/c²', 0, 'E = mc².', 'Modern Physics', 'easy'),
          mcq('What happens to frequency of light when it passes from air to water?', 'Increases', 'Decreases', 'Remains constant', 'Becomes zero', 2, 'Frequency remains constant across media; wavelength and speed change.', 'Optics', 'hard'),
          mcq('What is SI unit of Electric Charge?', 'Ampere', 'Coulomb', 'Farad', 'Tesla', 1, 'Coulomb (C) measures electric charge.', 'Units', 'easy'),
          mcq('Momentum is product of:', 'Mass and acceleration', 'Mass and velocity', 'Force and time', 'Work and distance', 1, 'Momentum p = m * v.', 'Mechanics', 'easy'),
          mcq('Bernoulli\'s principle relates fluid velocity to:', 'Temperature', 'Pressure', 'Mass', 'Density', 1, 'Higher fluid velocity results in lower fluid pressure.', 'Fluids', 'hard'),
          mcq('What device converts mechanical energy into electrical energy?', 'Motor', 'Generator', 'Transformer', 'Resistor', 1, 'Generators convert mechanical work to electricity via induction.', 'Electromagnetism', 'medium')
        ]
      },

      // 12. Chemistry Fundamentals
      {
        title: 'Chemistry Fundamentals',
        category: 'Science',
        subject: 'Science',
        difficulty: 'easy',
        duration: 35,
        questions: [
          mcq('What is chemical symbol for Gold?', 'Ag', 'Au', 'Fe', 'Go', 1, 'Au (Aurum) is chemical symbol for Gold.', 'Periodic Table', 'easy'),
          mcq('What is pH value of pure neutral water at 25°C?', '0', '7', '14', '1', 1, 'Neutral pH is 7.', 'Acids & Bases', 'easy'),
          mcq('What subatomic particle has negative charge?', 'Proton', 'Neutron', 'Electron', 'Positron', 2, 'Electrons carry negative charge.', 'Atomic Structure', 'easy'),
          mcq('Which gas makes up approximately 78% of Earth\'s atmosphere?', 'Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon', 2, 'Nitrogen accounts for ~78% of air.', 'Atmosphere', 'easy'),
          mcq('What type of chemical bond involves sharing electrons between atoms?', 'Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond', 1, 'Covalent bonds share electron pairs.', 'Bonding', 'easy'),
          mcq('What is atomic number of Carbon?', '6', '12', '14', '8', 0, 'Carbon has atomic number 6 (6 protons).', 'Periodic Table', 'easy'),
          mcq('Which element is lightest in periodic table?', 'Helium', 'Hydrogen', 'Lithium', 'Carbon', 1, 'Hydrogen has atomic number 1.', 'Periodic Table', 'easy'),
          mcq('What is chemical formula for Table Salt?', 'NaCl', 'KCl', 'NaOH', 'HCl', 0, 'Sodium Chloride is NaCl.', 'Formulas', 'easy'),
          mcq('Acidic solutions have pH values:', 'Greater than 7', 'Less than 7', 'Equal to 7', 'Equal to 14', 1, 'pH < 7 indicates acidity.', 'Acids & Bases', 'easy'),
          mcq('Avogadro\'s number is approximately equal to:', '6.022 x 10²³', '3.00 x 10⁸', '9.81 x 10⁵', '1.60 x 10⁻¹⁹', 0, '1 mole contains 6.022 x 10²³ particles.', 'Moles', 'medium'),
          mcq('Which state of matter has definite volume but indefinite shape?', 'Solid', 'Liquid', 'Gas', 'Plasma', 1, 'Liquids take shape of container while keeping volume.', 'States of Matter', 'easy'),
          mcq('What process involves a solid changing directly into a gas?', 'Evaporation', 'Sublimation', 'Condensation', 'Melting', 1, 'Sublimation is solid -> gas transition (e.g. dry ice).', 'Phase Changes', 'medium'),
          mcq('What is chemical formula for Carbon Dioxide?', 'CO', 'CO₂', 'C₂O', 'HCO₃', 1, 'Carbon Dioxide is CO₂.', 'Formulas', 'easy'),
          mcq('Which halogen is liquid at room temperature?', 'Fluorine', 'Chlorine', 'Bromine', 'Iodine', 2, 'Bromine is liquid non-metal at room temp.', 'Periodic Table', 'medium'),
          mcq('What is product of reaction between acid and base?', 'Salt and Water', 'Gas and Solid', 'Metal and Acid', 'Peroxide', 0, 'Neutralization yields salt and water.', 'Reactions', 'easy'),
          mcq('What is atomic mass of Oxygen atom (approx)?', '8 amu', '16 amu', '32 amu', '12 amu', 1, 'Oxygen atomic weight is ~16 amu.', 'Atomic Weight', 'easy'),
          mcq('Which gas is produced when active metal reacts with dilute acid?', 'Oxygen', 'Hydrogen', 'Nitrogen', 'Chlorine', 1, 'Metal + Acid -> Salt + Hydrogen gas.', 'Reactions', 'medium'),
          mcq('What is loss of electrons in chemical reaction called?', 'Reduction', 'Oxidation', 'Hydrolysis', 'Electrolysis', 1, 'OIL RIG: Oxidation Is Loss of electrons.', 'Redox', 'medium'),
          mcq('What is gain of electrons in chemical reaction called?', 'Reduction', 'Oxidation', 'Precipitation', 'Combustion', 0, 'OIL RIG: Reduction Is Gain of electrons.', 'Redox', 'medium'),
          mcq('Which element is primary constituent of organic compounds?', 'Silicon', 'Carbon', 'Nitrogen', 'Oxygen', 1, 'Organic chemistry is study of carbon compounds.', 'Organic', 'easy')
        ]
      },

      // 13. Biology Essentials
      {
        title: 'Biology Essentials',
        category: 'Science',
        subject: 'Science',
        difficulty: 'easy',
        duration: 30,
        questions: [
          mcq('What organelle is known as powerhouse of cell?', 'Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus', 1, 'Mitochondria generate ATP energy.', 'Cell Biology', 'easy'),
          mcq('What molecule carries genetic instructions in living organisms?', 'RNA', 'DNA', 'ATP', 'Protein', 1, 'Deoxyribonucleic Acid (DNA) holds genetic info.', 'Genetics', 'easy'),
          mcq('What process do plants use to convert sunlight into glucose?', 'Respiration', 'Photosynthesis', 'Fermentation', 'Transpiration', 1, 'Photosynthesis converts light into chemical energy.', 'Plant Biology', 'easy'),
          mcq('Which organ in human body filters blood and produces urine?', 'Liver', 'Kidneys', 'Heart', 'Lungs', 1, 'Kidneys perform excretion and renal filtration.', 'Anatomy', 'easy'),
          mcq('Which blood cells carry oxygen throughout human body?', 'White Blood Cells', 'Red Blood Cells', 'Platelets', 'Plasma', 1, 'Red Blood Cells (Erythrocytes) transport oxygen via hemoglobin.', 'Anatomy', 'easy'),
          mcq('What is basic structural and functional unit of life?', 'Tissue', 'Organ', 'Cell', 'Molecule', 2, 'Cell is fundamental unit of living organisms.', 'Cell Biology', 'easy'),
          mcq('Where does protein synthesis occur in cell?', 'Lysosomes', 'Ribosomes', 'Vacuoles', 'Centrosomes', 1, 'Ribosomes synthesize proteins from mRNA.', 'Cell Biology', 'easy'),
          mcq('What green pigment in plants absorbs light for photosynthesis?', 'Carotene', 'Xanthophyll', 'Chlorophyll', 'Anthocyanin', 2, 'Chlorophyll absorbs red and blue light.', 'Plant Biology', 'easy'),
          mcq('How many chromosomes do normal human body cells contain?', '23', '46', '92', '44', 1, 'Humans have 23 pairs (46 total) chromosomes.', 'Genetics', 'easy'),
          mcq('Which gas do plants absorb during photosynthesis?', 'Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Methane', 1, 'Plants consume CO₂ and release O₂.', 'Plant Biology', 'easy'),
          mcq('What is process of cell division producing two identical daughter cells?', 'Mitosis', 'Meiosis', 'Binary Fission', 'Budding', 0, 'Mitosis produces identical diploid cells.', 'Genetics', 'easy'),
          mcq('What process of cell division produces 4 haploid gametes (sex cells)?', 'Mitosis', 'Meiosis', 'Cytokinesis', 'Fission', 1, 'Meiosis produces 4 non-identical haploid gametes.', 'Genetics', 'medium'),
          mcq('Which human organ pumps blood through circulatory system?', 'Brain', 'Lungs', 'Heart', 'Liver', 2, 'Heart pumps oxygenated and deoxygenated blood.', 'Anatomy', 'easy'),
          mcq('What macromolecule is composed of amino acid chains?', 'Carbohydrates', 'Proteins', 'Lipids', 'Nucleic Acids', 1, 'Proteins are polymers of amino acids.', 'Biochemistry', 'easy'),
          mcq('What enzyme in saliva breaks down starches into simpler sugars?', 'Pepsin', 'Amylase', 'Lipase', 'Trypsin', 1, 'Salivary amylase digests complex carbohydrates.', 'Digestion', 'medium'),
          mcq('What is master gland of human endocrine system?', 'Thyroid', 'Pituitary Gland', 'Adrenal Gland', 'Pancreas', 1, 'Pituitary regulates other endocrine glands.', 'Anatomy', 'medium'),
          mcq('Which organism type produces its own food (e.g. plants)?', 'Heterotroph', 'Autotroph', 'Decomposer', 'Saprophytes', 1, 'Autotrophs synthesize organic matter from inorganic sources.', 'Ecology', 'easy'),
          mcq('What is universal energy currency of biological cells?', 'DNA', 'ATP', 'Glucose', 'NADP', 1, 'Adenosine Triphosphate (ATP) powers cellular processes.', 'Biochemistry', 'medium'),
          mcq('Which kingdom do mushrooms and molds belong to?', 'Plantae', 'Animalia', 'Fungi', 'Protista', 2, 'Fungi kingdom contains non-photosynthetic eukaryotic organisms.', 'Taxonomy', 'easy'),
          mcq('What is primary function of white blood cells (Leukocytes)?', 'Oxygen transport', 'Immune defense against infections', 'Blood clotting', 'Nutrient absorption', 1, 'White blood cells fight pathogens.', 'Anatomy', 'easy')
        ]
      },

      // 14. Environmental Science
      {
        title: 'Environmental Science',
        category: 'Science',
        subject: 'Science',
        difficulty: 'easy',
        duration: 25,
        questions: [
          mcq('What gas is primary driver of modern enhanced greenhouse effect?', 'Argon', 'Carbon Dioxide (CO2)', 'Helium', 'Nitrogen', 1, 'CO2 emissions from fossil fuels drive global warming.', 'Climate Change', 'easy'),
          mcq('What layer of Earth\'s atmosphere absorbs harmful solar UV radiation?', 'Troposphere', 'Ozone Layer (Stratosphere)', 'Mesosphere', 'Thermosphere', 1, 'Ozone (O3) in stratosphere shields UV rays.', 'Atmosphere', 'easy'),
          mcq('Which renewable energy source harnesses heat from beneath Earth\'s surface?', 'Solar', 'Wind', 'Geothermal', 'Hydroelectric', 2, 'Geothermal utilizes internal terrestrial thermal energy.', 'Energy', 'easy'),
          mcq('What is process where body of water becomes overly enriched with nutrients?', 'Eutrophication', 'Acidification', 'Salinization', 'Desertification', 0, 'Eutrophication causes algal blooms and hypoxia.', 'Ecology', 'medium'),
          mcq('Which chemical compounds depleted stratospheric ozone layer?', 'CFCs (Chlorofluorocarbons)', 'CO2', 'CH4', 'SO2', 0, 'CFCs release chlorine radicals that break O3.', 'Pollution', 'medium'),
          mcq('What term describes variety of species living within an ecosystem?', 'Bio-capacity', 'Biodiversity', 'Biomass', 'Biosphere', 1, 'Biodiversity measures species variety.', 'Ecology', 'easy'),
          mcq('What is main cause of ocean acidification?', 'Oil spills', 'Absorption of atmospheric CO2 by oceans', 'Plastic pollution', 'Sewage disposal', 1, 'Dissolved CO2 forms carbonic acid in seawater.', 'Oceans', 'medium'),
          mcq('Which international treaty regulates ozone-depleting substances?', 'Paris Agreement', 'Kyoto Protocol', 'Montreal Protocol', 'Ramsar Convention', 2, 'Montreal Protocol phased out CFCs.', 'Policy', 'medium'),
          mcq('What is non-point source pollution example?', 'Factory discharge pipe', 'Agricultural fertilizer runoff from farms', 'Power plant chimney', 'Oil tanker leak', 1, 'Runoff over broad areas is non-point source.', 'Pollution', 'medium'),
          mcq('What is primary component of natural gas?', 'Ethane', 'Methane (CH4)', 'Propane', 'Butane', 1, 'Methane constitutes 70-90% of natural gas.', 'Energy', 'easy'),
          mcq('What ecological level includes all abiotic and biotic factors interacting in an area?', 'Community', 'Population', 'Ecosystem', 'Organism', 2, 'Ecosystem combines living organisms and non-living environment.', 'Ecology', 'easy'),
          mcq('Which sector consumes largest percentage of global freshwater resources?', 'Industrial manufacturing', 'Domestic household use', 'Agriculture and Irrigation', 'Thermal power generation', 2, 'Agriculture consumes ~70% of global freshwater.', 'Resources', 'medium'),
          mcq('What is term for turning arid fertile land into desert due to deforestation and overgrazing?', 'Salinization', 'Desertification', 'Eutrophication', 'Urbanization', 1, 'Desertification degrades soil productivity.', 'Land Use', 'easy'),
          mcq('Which gas has global warming potential ~28x higher than CO2 over 100 years?', 'Nitrogen', 'Methane (CH4)', 'Water vapor', 'Argon', 1, 'Methane is potent greenhouse gas.', 'Climate Change', 'medium'),
          mcq('What is process of converting organic waste into nutrient-rich soil amendment?', 'Incineration', 'Composting', 'Landfilling', 'Recycling', 1, 'Composting decomposes organic waste.', 'Waste Management', 'easy'),
          mcq('Which energy source produces zero carbon emissions during operation?', 'Coal', 'Nuclear Power', 'Natural Gas', 'Diesel', 1, 'Nuclear produces carbon-free electricity during generation.', 'Energy', 'medium'),
          mcq('What type of species has disproportionately large impact on ecosystem structure relative to abundance?', 'Invasive species', 'Keystone species', 'Endemic species', 'Indicator species', 1, 'Keystone species maintain ecosystem balance (e.g. wolves).', 'Ecology', 'medium'),
          mcq('What global climate treaty was adopted in 2015 to limit warming below 2°C?', 'Montreal Protocol', 'Paris Climate Agreement', 'Geneva Convention', 'Rio Earth Summit', 1, 'Paris Agreement sets global emissions reduction targets.', 'Policy', 'easy'),
          mcq('Which particulate size (PM) poses greatest human respiratory health risk?', 'PM100', 'PM10', 'PM2.5', 'PM50', 2, 'PM2.5 particles penetrate deep into lung alveoli.', 'Health & Air', 'medium'),
          mcq('What term describes maximum population size an environment can sustain indefinitely?', 'Biotic potential', 'Carrying capacity', 'Trophic level', 'Niche', 1, 'Carrying capacity K is resource limit of habitat.', 'Population', 'medium')
        ]
      },

      // 15. Quantitative Aptitude
      {
        title: 'Quantitative Aptitude',
        category: 'Aptitude',
        subject: 'Aptitude',
        difficulty: 'medium',
        duration: 40,
        questions: [
          mcq('If a item cost price is $80 and selling price is $100, what is profit percentage?', '15%', '20%', '25%', '30%', 2, 'Profit = 20. Profit% = (20/80)*100 = 25%.', 'Profit & Loss', 'easy'),
          mcq('What is simple interest on $1000 at 5% per annum for 3 years?', '$150', '$100', '$300', '$50', 0, 'SI = P*R*T/100 = 1000*5*3/100 = $150.', 'Simple Interest', 'easy'),
          mcq('If a train travels 180 km in 3 hours, what is its speed in m/s?', '60 m/s', '16.67 m/s', '50 m/s', '20 m/s', 1, 'Speed = 60 km/h = 60 * 5/18 = 16.67 m/s.', 'Speed & Distance', 'medium'),
          mcq('A and B can complete a work in 10 and 15 days respectively. Working together, how many days do they take?', '5 days', '6 days', '7.5 days', '8 days', 1, 'Combined rate = 1/10 + 1/15 = 5/30 = 1/6. Days = 6.', 'Time & Work', 'easy'),
          mcq('What is the ratio 45 minutes to 2 hours in simplest form?', '45:2', '3:8', '1:4', '3:4', 1, '45 mins : 120 mins = 45/120 = 3/8.', 'Ratios', 'easy'),
          mcq('If 20% of a number is 50, what is 60% of that number?', '100', '150', '200', '250', 1, 'Number = 50/0.2 = 250. 60% of 250 = 150.', 'Percentages', 'easy'),
          mcq('Find average of numbers: 15, 25, 35, 45, 55', '30', '35', '40', '25', 1, 'Middle term of AP or (15+55)/2 = 35.', 'Averages', 'easy'),
          mcq('If compound interest on $5000 for 2 years at 10% per annum compounded annually is:', '$1000', '$1050', '$1100', '$5500', 1, 'Amount = 5000*(1.1)² = 6050. CI = 6050 - 5000 = $1050.', 'Compound Interest', 'medium'),
          mcq('Two numbers are in ratio 3:4. If their sum is 70, find larger number.', '30', '40', '50', '35', 1, '3x + 4x = 70 => 7x = 70 => x=10. Larger = 40.', 'Ratios', 'easy'),
          mcq('A car accelerates from rest at 2 m/s² for 5 seconds. What distance does it cover?', '10 m', '25 m', '50 m', '100 m', 1, 's = ut + 1/2 at² = 0 + 1/2(2)(25) = 25 m.', 'Physics Math', 'medium'),
          mcq('What is probability of drawing a red card from standard deck of 52 playing cards?', '1/4', '1/2', '1/13', '1/52', 1, '26 red cards / 52 = 1/2.', 'Probability Math', 'easy'),
          mcq('If 12 men can build a wall in 6 days, how many men build it in 4 days?', '18 men', '16 men', '14 men', '24 men', 0, 'M1 * D1 = M2 * D2 => 12*6 = M2*4 => M2 = 18.', 'Proportion', 'easy'),
          mcq('A shirt marked $50 is sold with 20% discount. What is final price?', '$40', '$30', '$45', '$35', 0, 'Discount = $10. Final price = $40.', 'Discounts', 'easy'),
          mcq('Find LCM of 12 and 18', '24', '36', '72', '6', 1, 'LCM(12, 18) = 36.', 'Number Theory', 'easy'),
          mcq('Find HCF (GCD) of 24 and 36', '6', '12', '18', '24', 1, 'HCF(24, 36) = 12.', 'Number Theory', 'easy'),
          mcq('Sum of ages of father and son is 50. In 5 years, sum will be:', '55', '60', '65', '70', 1, 'Each gains 5 years => 50 + 10 = 60.', 'Age Problems', 'easy'),
          mcq('Pipe A fills tank in 4 hours, Pipe B empties in 6 hours. Open together, time to fill empty tank:', '8 hours', '12 hours', '10 hours', '24 hours', 1, 'Net rate = 1/4 - 1/6 = 1/12. Time = 12 hours.', 'Pipes & Cisterns', 'medium'),
          mcq('If a number is increased by 10% then decreased by 10%, net percentage change is:', '0%', '1% increase', '1% decrease', '2% decrease', 2, 'Net change = 10 - 10 - (10*10)/100 = -1% (1% decrease).', 'Percentages', 'medium'),
          mcq('Find missing term in series: 2, 4, 8, 16, ?', '20', '24', '32', '64', 2, 'Geometric progression doubling every step => 32.', 'Series', 'easy'),
          mcq('What is surface area of cube of volume 27 cm³?', '27 cm²', '54 cm²', '36 cm²', '81 cm²', 1, 'Side a = 3. Surface area = 6a² = 6*9 = 54 cm².', 'Geometry Math', 'medium')
        ]
      },

      // 16. Logical Reasoning
      {
        title: 'Logical Reasoning',
        category: 'Aptitude',
        subject: 'Aptitude',
        difficulty: 'medium',
        duration: 30,
        questions: [
          mcq('Complete series: 3, 6, 11, 18, 27, ?', '36', '38', '35', '40', 1, 'Differences: +3, +5, +7, +9, +11 => 27 + 11 = 38.', 'Series', 'medium'),
          mcq('If CAT is coded as 3120 in a code, how is DOG coded?', '4157', '41520', '4127', '5168', 0, 'Letters positional values: D=4, O=15, G=7 => 4157.', 'Coding', 'easy'),
          mcq('Pointing to a photo, A says: "He is son of my mother\'s only daughter." Who is the person to A?', 'Brother', 'Son', 'Nephew', 'Father', 1, 'Mother\'s only daughter is A herself (if female). So he is her son.', 'Blood Relations', 'medium'),
          mcq('Which word does not belong with others: Apple, Orange, Banana, Potato?', 'Apple', 'Orange', 'Banana', 'Potato', 3, 'Potato is a vegetable/tuber; others are fruits.', 'Odd One Out', 'easy'),
          mcq('If SOUTH-EAST becomes NORTH, NORTHEAST becomes WEST, what does WEST become?', 'SOUTH-EAST', 'NORTH-EAST', 'SOUTH-WEST', 'NORTH', 0, '135° anti-clockwise rotation. WEST becomes SOUTH-EAST.', 'Directions', 'hard'),
          mcq('Statements: All cats are dogs. All dogs are birds. Conclusion: All cats are birds.', 'True / Valid', 'False / Invalid', 'Cannot be determined', 'None', 0, 'All A are B, All B are C => All A are C is valid syllogism.', 'Syllogism', 'easy'),
          mcq('Find missing number in matrix: [ [2, 3, 5], [4, 5, 9], [6, 7, ?] ]', '11', '13', '14', '12', 3, 'Column 1 + Column 2 = Column 3. 6 + 7 = 13.', 'Matrices', 'easy'),
          mcq('Arrange words logically: 1. Seed 2. Tree 3. Plant 4. Fruit', '1, 3, 2, 4', '1, 2, 3, 4', '4, 1, 3, 2', '3, 1, 2, 4', 0, 'Logical sequence: Seed -> Plant -> Tree -> Fruit.', 'Sequencing', 'easy'),
          mcq('If "+" means "x", "-" means "÷", "x" means "+", "÷" means "-", evaluate: 10 + 2 - 4 x 3', '8', '5', '8.5', '10', 0, '10 * 2 / 4 + 3 = 20 / 4 + 3 = 5 + 3 = 8.', 'Operator Code', 'medium'),
          mcq('Six people A, B, C, D, E, F sit in a row facing North. C is between A and E. B is right of E. F is at left end. Who is adjacent to F?', 'A', 'B', 'C', 'D', 0, 'Arrangement: F-A-C-E-B-D. A is adjacent to F.', 'Seating Arrangement', 'hard'),
          mcq('Clock shows 3:00. What is angle between hour and minute hands?', '45°', '90°', '120°', '180°', 1, 'At 3:00, hands are perpendicular (90°).', 'Clocks', 'easy'),
          mcq('If January 1st of a non-leap year is Monday, what day of week is Dec 31st same year?', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 1, '365 days = 52 weeks + 1 day. Year starts and ends on same day.', 'Calendars', 'medium'),
          mcq('Find odd pair: (4, 16), (5, 25), (6, 36), (7, 47)', '(4, 16)', '(5, 25)', '(6, 36)', '(7, 47)', 3, '7² = 49, not 47.', 'Odd One Out', 'easy'),
          mcq('Complete analogy: Doctor : Hospital :: Teacher : ?', 'Books', 'School', 'Student', 'Classroom', 1, 'Workplace analogy: Doctor works in hospital; Teacher works in school.', 'Analogies', 'easy'),
          mcq('In a class of 40, Rahul is 11th from top. What is his rank from bottom?', '29th', '30th', '31st', '28th', 1, 'Rank from bottom = Total - Top + 1 = 40 - 11 + 1 = 30th.', 'Ranking', 'easy'),
          mcq('If A is taller than B, B is taller than C, D is taller than A, who is shortest?', 'A', 'B', 'C', 'D', 2, 'D > A > B > C. C is shortest.', 'Comparisons', 'easy'),
          mcq('Complete series: Z, X, V, T, R, ?', 'P', 'Q', 'O', 'N', 0, 'Subtract 2 letters each step: R - 2 = P.', 'Series', 'easy'),
          mcq('How many triangles are in a square divided by both diagonals?', '4', '6', '8', '10', 2, '4 small triangles + 4 large composite triangles = 8 total.', 'Counting Figures', 'medium'),
          mcq('If Monday is 3rd of month, what date is 4th Tuesday of that month?', '22nd', '24th', '25th', '26th', 2, 'Tuesday is 4th, 11th, 18th, 25th. 4th Tuesday = 25th.', 'Calendars', 'medium'),
          mcq('Statements: Some books are pens. No pen is pencil. Conclusion: Some books are not pencils.', 'Valid', 'Invalid', 'Uncertain', 'None', 0, 'Books that are pens cannot be pencils, so some books are not pencils.', 'Syllogisms', 'hard')
        ]
      },

      // 17. Analytical Thinking
      {
        title: 'Analytical Thinking',
        category: 'Aptitude',
        subject: 'Aptitude',
        difficulty: 'hard',
        duration: 35,
        questions: [
          mcq('Evaluate premise: "All effective managers are good communicators. John is a good communicator. Therefore John is an effective manager."', 'Logically valid', 'Invalid (Affirming the consequent fallacy)', 'Sound argument', 'Factually false', 1, 'Affirming consequent is a formal fallacy.', 'Logic Fallacies', 'hard'),
          mcq('A container has 60L milk. 6L is drawn and replaced with water. Repeated once more. How much milk remains?', '48.6L', '48.0L', '50.0L', '45.2L', 0, 'Amount = 60 * (1 - 6/60)² = 60 * (0.9)² = 60 * 0.81 = 48.6L.', 'Mixtures', 'hard'),
          mcq('If statement "If it rains, ground gets wet" is true, which is contrapositive logically equivalent statement?', 'If ground is wet, it rained', 'If ground is not wet, it did not rain', 'If it does not rain, ground is dry', 'Ground is always wet', 1, 'Contrapositive of P -> Q is ~Q -> ~P.', 'Logic', 'hard'),
          mcq('Find false assertion among properties of prime numbers:', '2 is only even prime', '1 is smallest prime number', 'Every prime > 3 can be written as 6k±1', 'Infinite prime numbers exist', 1, '1 is NOT a prime number. 2 is smallest prime.', 'Number Theory', 'medium'),
          mcq('Determine next term: 2, 3, 5, 7, 11, 13, 17, ?', '19', '21', '23', '18', 0, 'Sequence of prime numbers. Next prime is 19.', 'Series', 'easy'),
          mcq('A liar lies on Mon/Tue/Wed. A truthteller speaks truth always. Person X says "Yesterday I lied" on Thursday. Is X the liar?', 'Yes, X is the liar', 'No, X is truthteller', 'Cannot be determined', 'X does not exist', 0, 'On Thursday (truth day for liar), saying "yesterday I lied" is true.', 'Logic Puzzles', 'hard'),
          mcq('If 5 workers build 5 tables in 5 days, how many days for 100 workers to build 100 tables?', '100 days', '5 days', '1 day', '25 days', 1, '1 worker builds 1 table in 5 days. 100 workers build 100 tables in 5 days.', 'Critical Thinking', 'medium'),
          mcq('What is minimum number of colors required to color any planar map such that adjacent regions have different colors?', '3', '4', '5', '6', 1, 'Four Color Theorem states 4 colors suffice for any planar map.', 'Graph Theory', 'hard'),
          mcq('Evaluate assumption: "Employees should take public transit to reduce city smog." Underlying assumption is:', 'Public transit emits less smog per passenger than cars', 'Public transit is free', 'Employees dislike cars', 'Smog cannot be reduced', 0, 'Unstated assumption relies on lower per-capita emission.', 'Critical Deduction', 'hard'),
          mcq('If 3 coins are tossed, what is probability of getting AT LEAST 2 heads?', '1/2', '3/8', '5/8', '7/8', 0, 'Outcomes with >=2 heads: HHH, HHT, HTH, THH (4 of 8 = 4/8 = 1/2).', 'Probability', 'medium'),
          mcq('A clock loses 5 minutes every hour. Set correct at 12:00 PM. What time does it show at 6:00 PM actual time?', '5:30 PM', '5:45 PM', '5:25 PM', '6:30 PM', 0, 'Loses 5 mins/hr * 6 hrs = 30 mins lost. Shows 5:30 PM.', 'Clocks', 'medium'),
          mcq('What is smallest number which when divided by 4, 6, 8 leaves remainder 3?', '27', '25', '15', '51', 0, 'LCM(4,6,8) = 24. Number = 24 + 3 = 27.', 'Number Theory', 'medium'),
          mcq('Determine fault in argument: "Heavy coffee drinkers have higher heart rates, so coffee causes heart attacks."', 'Correlation implies causation fallacy', 'Ad hominem', 'Circular reasoning', 'Red herring', 0, 'Correlation between variables does not prove direct causation.', 'Fallacies', 'hard'),
          mcq('If speed of boat in still water is 10 km/h and stream speed is 2 km/h, downstream speed is:', '8 km/h', '12 km/h', '20 km/h', '5 km/h', 1, 'Downstream speed = boat + stream = 10 + 2 = 12 km/h.', 'Boats & Streams', 'easy'),
          mcq('If speed of boat upstream is:', '10 - 2 = 8 km/h', '12 km/h', '10 km/h', '5 km/h', 0, 'Upstream speed = boat - stream = 10 - 2 = 8 km/h.', 'Boats & Streams', 'easy'),
          mcq('Find angle between clock hands at 4:20 PM', '10°', '0°', '20°', '15°', 0, 'Angle = |30H - 11/2 M| = |30(4) - 5.5(20)| = |120 - 110| = 10°.', 'Clocks Math', 'hard'),
          mcq('If cost price of 10 articles equals selling price of 8 articles, profit percentage is:', '20%', '25%', '15%', '30%', 1, 'Profit% = (10-8)/8 * 100 = 2/8 * 100 = 25%.', 'Profit & Loss', 'medium'),
          mcq('What is number of trailing zeros in 50! (50 factorial)?', '10', '12', '14', '8', 1, '[50/5] + [50/25] = 10 + 2 = 12 zeros.', 'Factorial Zeros', 'hard'),
          mcq('Evaluate series pattern: 1, 8, 27, 64, 125, ?', '144', '216', '256', '343', 1, 'Cubes of integers: 1³, 2³, 3³, 4³, 5³, 6³ = 216.', 'Series', 'easy'),
          mcq('Which condition guarantees an integer is divisible by 9?', 'Last digit is 9', 'Sum of its digits is divisible by 9', 'It is odd', 'Last two digits divisible by 9', 1, 'Divisibility rule for 9: digit sum must be divisible by 9.', 'Divisibility', 'easy')
        ]
      },

      // 18. Data Interpretation
      {
        title: 'Data Interpretation',
        category: 'Aptitude',
        subject: 'Aptitude',
        difficulty: 'medium',
        duration: 40,
        questions: [
          mcq('In a pie chart representing company expenses, if Rent accounts for 90° angle, what percentage of total expense is Rent?', '15%', '25%', '30%', '33.3%', 1, '(90 / 360) * 100 = 25%.', 'Pie Charts', 'easy'),
          mcq('Company sales increased from $40M in Year 1 to $50M in Year 2. What is percentage growth?', '10%', '20%', '25%', '30%', 2, 'Growth = (50-40)/40 * 100 = 10/40 * 100 = 25%.', 'Percentages', 'easy'),
          mcq('If sales dropped from $50M in Year 2 to $40M in Year 3, what is percentage drop?', '20%', '25%', '10%', '15%', 0, 'Drop = (50-40)/50 * 100 = 10/50 * 100 = 20%.', 'Percentages', 'easy'),
          mcq('If total company revenue is $1,200,000 and marketing budget is 15%, how much is spent on marketing?', '$150,000', '$180,000', '$120,000', '$200,000', 1, '1200000 * 0.15 = $180,000.', 'Tabular Data', 'easy'),
          mcq('In a bar graph showing production of 5 factories [A: 200, B: 300, C: 150, D: 400, E: 250], what is average factory production?', '260', '250', '280', '300', 0, 'Sum = 1300. Average = 1300 / 5 = 260.', 'Bar Graphs', 'easy'),
          mcq('Refer to above data: Factory D production is what percent of Factory A production?', '150%', '200%', '250%', '300%', 1, '(400 / 200) * 100 = 200%.', 'Bar Graphs', 'easy'),
          mcq('In a line graph, if product price was $10 in Jan, $12 in Feb, $15 in Mar, what is average monthly price?', '$12.33', '$12.00', '$13.00', '$12.50', 0, 'Sum = 37. Average = 37 / 3 = $12.33.', 'Line Graphs', 'easy'),
          mcq('If total enrollment in college is 2400 students and ratio of Boys to Girls is 5:3, number of Girls is:', '900', '1500', '800', '1000', 0, 'Girls = 3/8 * 2400 = 900.', 'Ratios', 'easy'),
          mcq('If Boys = 5/8 * 2400 = 1500, how many more Boys than Girls exist?', '400', '600', '500', '700', 1, '1500 - 900 = 600.', 'Ratios', 'easy'),
          mcq('In a table of monthly profits: [Jan: $5k, Feb: -$2k, Mar: $8k, Apr: $4k], total profit over 4 months is:', '$15k', '$17k', '$19k', '$13k', 0, '5 - 2 + 8 + 4 = $15k.', 'Tabular Data', 'easy'),
          mcq('If a sector in a pie chart is 54°, what fraction of total chart does it represent?', '3/20', '1/5', '1/6', '1/4', 0, '54 / 360 = 3 / 20.', 'Pie Charts', 'medium'),
          mcq('A graph shows company expenditure: Salary $50k, Raw Material $30k, Rent $10k, Others $10k. What % is Raw Material?', '30%', '50%', '20%', '10%', 0, 'Total = 100k. Raw Material = 30k => 30%.', 'Data Analysis', 'easy'),
          mcq('If company profit margin is 20% on net revenue of $500,000, what is total net profit?', '$50,000', '$100,000', '$150,000', '$200,000', 1, '20% of 500,000 = $100,000.', 'Business Metrics', 'easy'),
          mcq('If a production target of 500 units was exceeded by 12%, actual production was:', '550', '560', '512', '600', 1, '500 * 1.12 = 560 units.', 'Percentages', 'easy'),
          mcq('In a table showing student scores: Math=85, Science=90, English=75. What is weighted average if weights are 3, 2, 1?', '85', '84.17', '83.33', '86.50', 0, '(85*3 + 90*2 + 75*1) / (3+2+1) = (255 + 180 + 75)/6 = 510 / 6 = 85.', 'Weighted Averages', 'medium'),
          mcq('What graphical chart is best suited for showing continuous trends over time?', 'Pie chart', 'Line chart', 'Venn diagram', 'Donut chart', 1, 'Line charts best represent continuous time-series data.', 'Visualization', 'easy'),
          mcq('What chart type is best for showing proportional parts of a whole dataset?', 'Scatter plot', 'Pie chart', 'Histogram', 'Box plot', 1, 'Pie charts visualize proportional slices of whole.', 'Visualization', 'easy'),
          mcq('If a dataset has values [10, 20, 30, 40, 1000], which average metric is LEAST affected by outlier 1000?', 'Mean', 'Median', 'Standard Deviation', 'Variance', 1, 'Median is resistant to extreme outliers.', 'Statistics', 'medium'),
          mcq('In a histogram, the height of each bar represents:', 'Class width', 'Frequency of data values in class interval', 'Cumulative percent', 'Mean', 1, 'Bar height represents interval frequency.', 'Histograms', 'easy'),
          mcq('If ratio of expenditure to savings of a family is 4:1 and income is $5000, savings amount is:', '$1000', '$1250', '$4000', '$800', 0, 'Savings = 1/5 * 5000 = $1000.', 'Ratios', 'easy')
        ]
      },

      // 19. Current Affairs
      {
        title: 'Current Affairs',
        category: 'General Knowledge',
        subject: 'General Knowledge',
        difficulty: 'easy',
        duration: 20,
        questions: [
          mcq('Which space agency successfully landed ISRO\'s Chandrayaan-3 mission on Moon\'s South Pole in 2023?', 'NASA', 'ESA', 'ISRO (India)', 'JAXA', 2, 'ISRO landed Chandrayaan-3 on lunar south pole.', 'Space', 'easy'),
          mcq('Where is headquarters of the United Nations (UN) located?', 'Geneva', 'New York City', 'Paris', 'London', 1, 'UN HQ is located in NYC.', 'Organizations', 'easy'),
          mcq('Which country hosted G20 Leaders Summit in 2023?', 'India', 'Brazil', 'Indonesia', 'South Africa', 0, 'India hosted G20 summit under presidency theme Vasudhaiva Kutumbakam.', 'Global Summits', 'easy'),
          mcq('Who is currently serving as Managing Director of International Monetary Fund (IMF)?', 'Kristalina Georgieva', 'Ngozi Okonjo-Iweala', 'Ajay Banga', 'Ursula von der Leyen', 0, 'Kristalina Georgieva heads IMF.', 'Leaders', 'medium'),
          mcq('Which country officially joined NATO as its 31st member state in 2023?', 'Sweden', 'Finland', 'Ukraine', 'Georgia', 1, 'Finland joined NATO as 31st member in April 2023.', 'International', 'easy'),
          mcq('What is currency of Japan?', 'Yuan', 'Yen', 'Won', 'Ringgit', 1, 'Japanese currency is Yen (¥).', 'Currency', 'easy'),
          mcq('Which artificial intelligence company developed ChatGPT?', 'Google', 'OpenAI', 'Microsoft', 'Meta', 1, 'OpenAI developed ChatGPT.', 'Technology', 'easy'),
          mcq('Which country won ICC Men\'s Cricket World Cup 2023?', 'India', 'Australia', 'England', 'South Africa', 1, 'Australia won ICC CWC 2023.', 'Sports', 'easy'),
          mcq('What is capital city of Australia?', 'Sydney', 'Melbourne', 'Canberra', 'Brisbane', 2, 'Canberra is capital of Australia.', 'Geography', 'easy'),
          mcq('Where is headquarters of World Health Organization (WHO)?', 'Geneva, Switzerland', 'Washington D.C.', 'Rome, Italy', 'Vienna, Austria', 0, 'WHO HQ is in Geneva.', 'Organizations', 'easy'),
          mcq('Which country hosted Summer Olympics in 2024?', 'Tokyo', 'Paris', 'Los Angeles', 'Brisbane', 1, 'Paris hosted 2024 Summer Olympics.', 'Sports', 'easy'),
          mcq('Who is current President of World Bank Group (appointed 2023)?', 'David Malpass', 'Ajay Banga', 'Jim Yong Kim', 'Robert Zoellick', 1, 'Ajay Banga assumed World Bank presidency in 2023.', 'Leaders', 'medium'),
          mcq('What is national currency of United Kingdom?', 'Euro', 'Pound Sterling', 'Dollar', 'Franc', 1, 'UK currency is Pound Sterling (£).', 'Currency', 'easy'),
          mcq('Which Indian city is known as "Silicon Valley of India"?', 'Hyderabad', 'Bengaluru (Bangalore)', 'Pune', 'Chennai', 1, 'Bengaluru is India\'s IT hub.', 'Technology', 'easy'),
          mcq('Which international organization regulates global trade rules?', 'World Bank', 'WTO (World Trade Organization)', 'IMF', 'UNCTAD', 1, 'WTO handles global trade rules.', 'Trade', 'easy'),
          mcq('What is economic term for persistent increase in general price level of goods?', 'Deflation', 'Inflation', 'Stagflation', 'Devaluation', 1, 'Inflation measures price level increase.', 'Economy', 'easy'),
          mcq('Which company manufactures iPhone smartphones?', 'Samsung', 'Apple Inc.', 'Sony', 'Google', 1, 'Apple manufactures iPhones.', 'Technology', 'easy'),
          mcq('What is capital city of Canada?', 'Toronto', 'Vancouver', 'Ottawa', 'Montreal', 2, 'Ottawa is capital of Canada.', 'Geography', 'easy'),
          mcq('Which organ of United Nations is responsible for maintaining international peace and security?', 'General Assembly', 'Security Council (UNSC)', 'Secretariat', 'UNESCO', 1, 'UNSC maintains international peace.', 'Organizations', 'easy'),
          mcq('What is official currency of European Union eurozone nations?', 'Pound', 'Euro', 'Swiss Franc', 'Krona', 1, 'Euro (€) is currency of Eurozone.', 'Currency', 'easy')
        ]
      },

      // 20. World History
      {
        title: 'World History',
        category: 'General Knowledge',
        subject: 'General Knowledge',
        difficulty: 'medium',
        duration: 30,
        questions: [
          mcq('In which year did World War I begin?', '1912', '1914', '1918', '1939', 1, 'WWI started in 1914 following assassination of Archduke Franz Ferdinand.', 'Modern History', 'easy'),
          mcq('In which year did World War II end?', '1943', '1945', '1950', '1939', 1, 'WWII ended in 1945.', 'Modern History', 'easy'),
          mcq('Who was first President of United States?', 'Thomas Jefferson', 'George Washington', 'Abraham Lincoln', 'John Adams', 1, 'George Washington served 1789–1797.', 'American History', 'easy'),
          mcq('Which ancient civilization constructed Great Pyramids of Giza?', 'Mesopotamians', 'Ancient Egyptians', 'Romans', 'Greeks', 1, 'Ancient Egyptians built Giza pyramids during Old Kingdom.', 'Ancient History', 'easy'),
          mcq('What historic event occurred in France in 1789?', 'Industrial Revolution', 'French Revolution', 'Norman Conquest', 'Battle of Waterloo', 1, 'French Revolution began in 1789 with storming of Bastille.', 'European History', 'easy'),
          mcq('Who was leader of Nazi Germany during World War II?', 'Kaiser Wilhelm II', 'Adolf Hitler', 'Otto von Bismarck', 'Joseph Stalin', 1, 'Hitler ruled Nazi Germany 1933–1945.', 'Modern History', 'easy'),
          mcq('Which empire was ruled by Julius Caesar and Augustus?', 'Ottoman Empire', 'Roman Empire', 'Byzantine Empire', 'Mongol Empire', 1, 'Julius Caesar and Augustus led Roman state.', 'Ancient History', 'easy'),
          mcq('What document was signed in England in 1215 limiting power of King?', 'Declaration of Independence', 'Magna Carta', 'Bill of Rights', 'Treaty of Versailles', 1, 'Magna Carta was signed by King John in 1215.', 'Medieval History', 'medium'),
          mcq('Who was founder of Mongol Empire in 13th century?', 'Kublai Khan', 'Genghis Khan', 'Tamerlane', 'Attila the Hun', 1, 'Genghis Khan founded Mongol Empire in 1206.', 'Asian History', 'easy'),
          mcq('The Renaissance movement originated in which country?', 'England', 'Italy', 'France', 'Germany', 1, 'Renaissance began in Florence, Italy in 14th century.', 'European History', 'easy'),
          mcq('Which war was fought between Northern and Southern states of America (1861–1865)?', 'Revolutionary War', 'American Civil War', 'Spanish-American War', 'War of 1812', 1, 'American Civil War was fought over union and slavery 1861-1865.', 'American History', 'easy'),
          mcq('Which treaty officially brought an end to World War I in 1919?', 'Treaty of Paris', 'Treaty of Versailles', 'Treaty of Ghent', 'Congress of Vienna', 1, 'Treaty of Versailles ended WWI.', 'Modern History', 'easy'),
          mcq('Who painted the Mona Lisa during Italian Renaissance?', 'Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello', 1, 'Leonardo da Vinci painted Mona Lisa.', 'Art History', 'easy'),
          mcq('What wall built in 1961 became symbol of Cold War division in Germany?', 'Hadrian\'s Wall', 'Berlin Wall', 'Great Wall of China', 'Iron Wall', 1, 'Berlin Wall divided East and West Berlin until 1989.', 'Cold War', 'easy'),
          mcq('Who was British Prime Minister during most of World War II?', 'Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Harold Macmillan', 1, 'Winston Churchill led Britain during WWII.', 'Modern History', 'easy'),
          mcq('What revolutionary advancement began in Britain in mid-18th century transforming manufacturing?', 'Digital Revolution', 'Industrial Revolution', 'Agricultural Revolution', 'Scientific Revolution', 1, 'Industrial Revolution mechanized production.', 'Economic History', 'easy'),
          mcq('Which ancient trade route connected China with Mediterranean world?', 'Amber Road', 'Silk Road', 'Spice Route', 'Incense Route', 1, 'Silk Road linked Han Dynasty China to Rome.', 'Ancient History', 'easy'),
          mcq('In which year did Russian Revolution overthrow Tsarist autocracy?', '1905', '1917', '1923', '1939', 1, 'Bolshevik Revolution occurred in 1917.', 'Russian History', 'medium'),
          mcq('Who discovered sea route to India around Cape of Good Hope in 1498?', 'Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan', 'Marco Polo', 1, 'Vasco da Gama reached Calicut in 1498.', 'Exploration', 'medium'),
          mcq('Which empire conquered Constantinople in 1453 ending Byzantine Empire?', 'Persian Empire', 'Ottoman Empire', 'Arab Caliphate', 'Holy Roman Empire', 1, 'Ottoman Sultan Mehmed II conquered Constantinople in 1453.', 'Medieval History', 'medium')
        ]
      },

      // 21. Geography Explorer
      {
        title: 'Geography Explorer',
        category: 'General Knowledge',
        subject: 'General Knowledge',
        difficulty: 'easy',
        duration: 25,
        questions: [
          mcq('What is largest ocean on Earth by surface area?', 'Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean', 2, 'Pacific Ocean covers ~30% of Earth.', 'Oceans', 'easy'),
          mcq('What is longest river in the world?', 'Amazon River', 'Nile River', 'Mississippi River', 'Yangtze River', 1, 'Nile River (6,650 km) is longest.', 'Rivers', 'easy'),
          mcq('What is highest mountain peak in the world above sea level?', 'K2', 'Mount Everest', 'Kangchenjunga', 'Lhotse', 1, 'Mount Everest (8,848.86 m) is highest.', 'Mountains', 'easy'),
          mcq('Which continent is largest by land area?', 'Africa', 'North America', 'Asia', 'Europe', 2, 'Asia is largest continent (~44.5M km²).', 'Continents', 'easy'),
          mcq('What is smallest country in the world by land area?', 'Monaco', 'Vatican City', 'Nauru', 'San Marino', 1, 'Vatican City measures 0.49 km².', 'Countries', 'easy'),
          mcq('Which desert is largest hot desert in the world?', 'Gobi Desert', 'Kalahari Desert', 'Sahara Desert', 'Arabian Desert', 2, 'Sahara is largest hot desert (~9.2M km²).', 'Deserts', 'easy'),
          mcq('What line of latitude is designated at 0 degrees?', 'Tropic of Cancer', 'Equator', 'Prime Meridian', 'Arctic Circle', 1, 'Equator is 0° latitude.', 'Maps', 'easy'),
          mcq('What line of longitude is designated at 0 degrees?', 'Equator', 'Prime Meridian (Greenwich)', 'International Date Line', 'Tropic of Capricorn', 1, 'Prime Meridian passes through Greenwich, UK.', 'Maps', 'easy'),
          mcq('Which mountain range separates Europe from Asia?', 'Alps', 'Ural Mountains', 'Himalayas', 'Andes', 1, 'Ural Mountains form boundary between Europe and Asia.', 'Mountains', 'medium'),
          mcq('What is capital city of Japan?', 'Kyoto', 'Osaka', 'Tokyo', 'Hiroshima', 2, 'Tokyo is capital of Japan.', 'Capitals', 'easy'),
          mcq('Which country has longest coastline in the world?', 'Australia', 'Russia', 'Canada', 'Indonesia', 2, 'Canada has longest coastline (202,080 km).', 'Countries', 'medium'),
          mcq('In which continent is Amazon Rainforest primarily located?', 'Africa', 'South America', 'Asia', 'Australia', 1, 'Amazon basin is in South America.', 'Forests', 'easy'),
          mcq('What strait separates Africa from Europe at western Mediterranean?', 'Strait of Malacca', 'Strait of Gibraltar', 'Bering Strait', 'Bosphorus', 1, 'Strait of Gibraltar connects Atlantic and Mediterranean.', 'Straits', 'medium'),
          mcq('Which African country is known as "Horn of Africa" region?', 'Nigeria', 'Somalia', 'Kenya', 'Egypt', 1, 'Somalia, Ethiopia, Eritrea, Djibouti form Horn of Africa.', 'Regions', 'easy'),
          mcq('What is deepest ocean trench on Earth?', 'Java Trench', 'Mariana Trench (Challenger Deep)', 'Puerto Rico Trench', 'Sunda Trench', 1, 'Challenger Deep in Mariana Trench is ~11,000m deep.', 'Oceans', 'medium'),
          mcq('Which country is known as "Land of Rising Sun"?', 'China', 'Japan', 'Thailand', 'South Korea', 1, 'Japan is traditionally called Land of Rising Sun.', 'Countries', 'easy'),
          mcq('What body of water separates United Kingdom from France?', 'North Sea', 'English Channel', 'Irish Sea', 'Baltic Sea', 1, 'English Channel separates UK and France.', 'Water Bodies', 'easy'),
          mcq('Which country contains highest number of natural lakes?', 'United States', 'Russia', 'Canada', 'Brazil', 2, 'Canada contains over 60% of world\'s lakes.', 'Lakes', 'medium'),
          mcq('What is capital city of Brazil?', 'Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador', 2, 'Brasília has been capital since 1960.', 'Capitals', 'medium'),
          mcq('Which island is largest island in the world (excluding continents)?', 'Madagascar', 'Greenland', 'Borneo', 'New Guinea', 1, 'Greenland is largest island (~2.16M km²).', 'Islands', 'easy')
        ]
      },

      // 22. Indian Constitution
      {
        title: 'Indian Constitution',
        category: 'General Knowledge',
        subject: 'General Knowledge',
        difficulty: 'medium',
        duration: 35,
        questions: [
          mcq('Who is regarded as Chief Architect / Father of Indian Constitution?', 'Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel', 1, 'Dr. B.R. Ambedkar chaired Drafting Committee.', 'History', 'easy'),
          mcq('On which date was Constitution of India adopted by Constituent Assembly?', '26th January 1950', '26th November 1949', '15th August 1947', '2nd October 1948', 1, 'Adopted Nov 26, 1949; came into effect Jan 26, 1950.', 'History', 'medium'),
          mcq('On which date did Constitution of India come into full effect (Constitution Day / Republic Day)?', '26th November 1949', '26th January 1950', '15th August 1947', '30th January 1948', 1, 'Republic Day commemorates Jan 26, 1950 enactment.', 'History', 'easy'),
          mcq('Which Part of Indian Constitution guarantees Fundamental Rights (Articles 12-35)?', 'Part I', 'Part II', 'Part III', 'Part IV', 2, 'Part III guarantees Fundamental Rights.', 'Structure', 'easy'),
          mcq('Which Article of Indian Constitution is known as "Heart and Soul of Constitution" (Right to Constitutional Remedies)?', 'Article 14', 'Article 19', 'Article 21', 'Article 32', 3, 'Dr. Ambedkar called Article 32 Heart & Soul.', 'Articles', 'medium'),
          mcq('Fundamental Duties were incorporated into Indian Constitution by which Amendment in 1976?', '42nd Amendment', '44th Amendment', '86th Amendment', '73rd Amendment', 0, '42nd Amendment (1976) added Part IV-A Fundamental Duties.', 'Amendments', 'medium'),
          mcq('Who is Supreme Commander of Indian Armed Forces?', 'Prime Minister', 'Defense Minister', 'President of India', 'Chief of Defense Staff', 2, 'President is ex-officio Supreme Commander.', 'Executive', 'easy'),
          mcq('What is minimum age requirement to become President of India?', '25 years', '30 years', '35 years', '40 years', 2, 'Article 58 requires 35 years minimum age.', 'Qualifications', 'easy'),
          mcq('What is tenure of a member of Rajya Sabha (Upper House of Parliament)?', '5 years', '6 years', '4 years', 'Permanent (no fixed term)', 1, 'Rajya Sabha members serve 6-year terms; 1/3 retire every 2 years.', 'Parliament', 'medium'),
          mcq('Which Schedule of Indian Constitution contains 22 officially recognized languages?', '8th Schedule', '7th Schedule', '10th Schedule', '11th Schedule', 0, '8th Schedule lists 22 recognized languages.', 'Schedules', 'medium'),
          mcq('Which Constitutional Amendment lowered voting age from 21 to 18 years in 1988?', '44th Amendment', '61st Amendment', '73rd Amendment', '86th Amendment', 1, '61st Amendment (1988) reduced voting age to 18.', 'Amendments', 'medium'),
          mcq('What is total maximum sanctioned strength of Lok Sabha (Lower House)?', '543', '552', '250', '500', 1, 'Maximum strength is 552 members.', 'Parliament', 'medium'),
          mcq('Who appoints Chief Justice of India and Judges of Supreme Court?', 'Prime Minister', 'President of India', 'Law Minister', 'Parliament', 1, 'President appoints CJI and SC judges.', 'Judiciary', 'easy'),
          mcq('Directive Principles of State Policy (DPSP) in Part IV were borrowed from which country\'s constitution?', 'USA', 'Irish Constitution (Ireland)', 'Britain', 'Canada', 1, 'DPSP was inspired by Irish Constitution.', 'Sources', 'medium'),
          mcq('What is term length of Lok Sabha unless dissolved earlier?', '4 years', '5 years', '6 years', '3 years', 1, 'Lok Sabha term is 5 years from first meeting.', 'Parliament', 'easy'),
          mcq('Which Article guarantees Equality before Law (Right to Equality)?', 'Article 14', 'Article 19', 'Article 21', 'Article 370', 0, 'Article 14 mandates equality before law.', 'Articles', 'easy'),
          mcq('Which Article protects Right to Life and Personal Liberty?', 'Article 14', 'Article 19', 'Article 21', 'Article 32', 2, 'Article 21 guarantees protection of life & personal liberty.', 'Articles', 'easy'),
          mcq('Which Amendment introduced Panchayati Raj (Local Self-Government) in 1992?', '73rd Amendment', '74th Amendment', '42nd Amendment', '86th Amendment', 0, '73rd Amendment added 11th Schedule for Panchayats.', 'Amendments', 'medium'),
          mcq('Emergency provisions in Indian Constitution (Articles 352, 356, 360) are declared by:', 'Prime Minister', 'President of India', 'Supreme Court', 'Parliament', 1, 'President proclaims National/State/Financial Emergency.', 'Executive', 'medium'),
          mcq('Which Constitutional Body conducts free and fair elections for Parliament and State Assemblies?', 'UPSC', 'Election Commission of India (ECI)', 'NITI Aayog', 'Finance Commission', 1, 'ECI (Article 324) conducts elections in India.', 'Bodies', 'easy')
        ]
      },

      // 23. English Grammar
      {
        title: 'English Grammar',
        category: 'English',
        subject: 'English',
        difficulty: 'easy',
        duration: 25,
        questions: [
          mcq('Identify noun in sentence: "She runs very fast in the park."', 'runs', 'fast', 'park', 'very', 2, '"park" is a place noun.', 'Parts of Speech', 'easy'),
          mcq('Which word is an adverb in sentence: "He spoke very clearly during presentation."', 'spoke', 'clearly', 'presentation', 'during', 1, '"clearly" modifies verb spoke.', 'Parts of Speech', 'easy'),
          mcq('Choose correct article: "She wants to buy ___ umbrella."', 'a', 'an', 'the', 'no article', 1, 'Use "an" before vowel sound /u/.', 'Articles', 'easy'),
          mcq('Choose correct verb form: "Either John or his friends ___ attending the party."', 'is', 'are', 'was', 'be', 1, 'Verb agrees with subject closest to it ("friends are").', 'Subject-Verb Agreement', 'medium'),
          mcq('Identify passive voice version: "The chef cooked a delicious meal."', 'A delicious meal was cooked by the chef.', 'The chef was cooking meal.', 'Meal cooks chef.', 'Chef is cooking.', 0, 'Object becomes subject in passive voice.', 'Voice', 'easy'),
          mcq('Select plural form of "Analysis":', 'Analysises', 'Analyses', 'Analysae', 'Analys', 1, 'Plural of analysis is analyses.', 'Nouns', 'easy'),
          mcq('Choose correct option: "Neither of the boys ___ finished his homework."', 'have', 'has', 'were', 'are', 1, '"Neither" takes singular verb "has".', 'Subject-Verb Agreement', 'medium'),
          mcq('Which sentence uses correct punctuation?', 'Where are you going?', 'Where are you going.', 'Where are you going!', 'Where, are you going.', 0, 'Interrogative sentences require question mark.', 'Punctuation', 'easy'),
          mcq('Identify type of underlined clause: "I will call you [when I arrive]."', 'Noun clause', 'Adverbial clause of time', 'Adjective clause', 'Prepositional phrase', 1, 'Clause specifies time of action.', 'Clauses', 'medium'),
          mcq('Select synonym for "Meticulous":', 'Careless', 'Diligent / Precise', 'Lazy', 'Hasty', 1, 'Meticulous means showing great attention to detail.', 'Vocabulary', 'easy'),
          mcq('Select antonym for "Abundant":', 'Plentiful', 'Scarce', 'Copious', 'Huge', 1, 'Scarce means in short supply.', 'Vocabulary', 'easy'),
          mcq('Identify conjunction in sentence: "I wanted to go, but it rained."', 'wanted', 'go', 'but', 'it', 2, '"but" connects two independent clauses.', 'Parts of Speech', 'easy'),
          mcq('Which sentence is in Present Perfect Tense?', 'I eat lunch.', 'I have eaten lunch.', 'I ate lunch.', 'I will eat lunch.', 1, '"have eaten" indicates present perfect tense.', 'Tenses', 'easy'),
          mcq('Choose correct preposition: "He is proficient ___ mathematics."', 'at', 'in', 'on', 'with', 1, 'Idiomatic usage: proficient in a subject.', 'Prepositions', 'easy'),
          mcq('Identify comparative form of adjective "Good":', 'Gooder', 'Better', 'Best', 'More good', 1, 'Good -> Better -> Best.', 'Adjectives', 'easy'),
          mcq('Select superlative form of adjective "Bad":', 'Worse', 'Badder', 'Worst', 'Most bad', 2, 'Bad -> Worse -> Worst.', 'Adjectives', 'easy'),
          mcq('Which sentence demonstrates correct subject-verb agreement?', 'The team are winning.', 'The team is winning.', 'The team were winning.', 'Team win.', 1, 'Collective noun team takes singular verb is.', 'Subject-Verb Agreement', 'easy'),
          mcq('What is past participle of verb "Swim"?', 'Swam', 'Swum', 'Swimming', 'Swims', 1, 'Swim -> Swam -> Swum.', 'Verbs', 'medium'),
          mcq('Choose correct pronoun: "Between you and ___, this project is a success."', 'I', 'me', 'myself', 'mine', 1, 'Prepositions govern objective case pronouns ("between you and me").', 'Pronouns', 'medium'),
          mcq('Identify figure of speech: "The wind whispered through trees."', 'Simile', 'Metaphor', 'Personification', 'Hyperbole', 2, 'Giving human traits to non-human elements is personification.', 'Figures of Speech', 'easy')
        ]
      },

      // 24. Reading Comprehension
      {
        title: 'Reading Comprehension',
        category: 'English',
        subject: 'English',
        difficulty: 'medium',
        duration: 30,
        questions: [
          mcq('Passage: "Artificial intelligence systems are rapidly reshaping modern healthcare. By analyzing vast medical imaging datasets, machine learning models can detect anomalies with precision matching seasoned radiologists." Question: What is primary benefit of AI in healthcare mentioned?', 'Replacing doctors completely', 'Detecting anomalies in medical imaging with high precision', 'Reducing medicine costs', 'Manufacturing medical hardware', 1, 'Passage emphasizes detecting anomalies with high precision.', 'Passage Analysis', 'medium'),
          mcq('Passage: "Despite economic headwinds, renewable energy adoption surged by 25% globally last year. Falling battery storage costs and favorable government subsidies drove unprecedented solar capacity expansions." Question: What key factor drove solar expansion according to passage?', 'Higher oil prices', 'Falling battery storage costs and government subsidies', 'Nuclear energy reduction', 'Lower electricity demand', 1, 'Passage cites falling battery costs and subsidies.', 'Passage Analysis', 'medium'),
          mcq('What is central theme of a text about renewable energy surge?', 'Fossil fuel dominance', 'Rapid adoption and growth of clean energy', 'Economic recession', 'Environmental degradation', 1, 'Central theme is growth of clean energy.', 'Main Idea', 'easy'),
          mcq('What does word "Surged" mean in context of passage?', 'Decreased', 'Increased rapidly', 'Stagnated', 'Fluctuated', 1, 'Surged means increased rapidly.', 'Vocabulary in Context', 'easy'),
          mcq('Passage: "The Arctic ecosystem is uniquely vulnerable to temperature shifts. As sea ice throws earlier each spring, polar bears face shrinking hunting windows, forcing them to travel further inland for food." Question: Why are polar bears traveling inland?', 'Seeking warmer weather', 'Shrinking hunting windows due to melting sea ice', 'Escaping predators', 'Finding mates', 1, 'Early sea ice thaw shortens hunting windows on ice.', 'Passage Analysis', 'medium'),
          mcq('What can be inferred about Arctic polar bears from passage?', 'They prefer terrestrial food', 'Climate warming disrupts their natural hunting patterns', 'Their population is increasing', 'They hibernate all spring', 1, 'Shrinking ice disruption infers climate warming impact.', 'Inference', 'medium'),
          mcq('What does word "Vulnerable" mean in context?', 'Resilient', 'Susceptible to harm or damage', 'Indifferent', 'Strong', 1, 'Vulnerable means susceptible to harm.', 'Vocabulary in Context', 'easy'),
          mcq('Passage: "Quantum computing operates on qubits capable of existing in superposition. Unlike classical bits restricted to 0 or 1, qubits process complex parallel probabilities simultaneously." Question: How do qubits differ from classical bits?', 'Qubits are slower', 'Qubits can exist in superposition processing parallel probabilities', 'Classical bits use quantum mechanics', 'Qubits store text only', 1, 'Superposition allows parallel probabilistic state processing.', 'Passage Analysis', 'medium'),
          mcq('What tone does author adopt in technical passage describing quantum computing abilities?', 'Sarcastic', 'Informative / Objective', 'Pessimistic', 'Emotional', 1, 'Technical explanation uses informative objective tone.', 'Author Tone', 'medium'),
          mcq('Passage: "Urban reforestation projects not only mitigate local heat island effects but also enhance community mental well-being by increasing access to green spaces." Question: What dual benefit does urban reforestation offer?', 'Cooling city heat and improving mental well-being', 'Increasing traffic and noise', 'Building apartments and roads', 'Generating revenue', 0, 'Passage highlights heat mitigation and mental well-being.', 'Passage Analysis', 'easy'),
          mcq('What does word "Mitigate" mean in passage?', 'Exaggerate', 'Lessen or reduce severity', 'Ignore', 'Combine', 1, 'Mitigate means to lessen severity.', 'Vocabulary in Context', 'easy'),
          mcq('What is primary purpose of an expository essay?', 'Tell a fictional story', 'Explain or inform reader about a topic objectively', 'Persuade reader to buy product', 'Express poetic emotions', 1, 'Expository writing explains or informs objectively.', 'Text Types', 'easy'),
          mcq('Passage: "Remote work arrangements have blurred traditional boundaries between professional duties and personal life. While flexibility has increased employee autonomy, burnout from constant connectivity remains a pressing workplace challenge." Question: What is major drawback of remote work cited?', 'Lower pay', 'Burnout from constant connectivity', 'Lack of technology', 'Longer commutes', 1, 'Passage identifies burnout from constant connectivity.', 'Passage Analysis', 'medium'),
          mcq('What does word "Autonomy" mean in context of workplace flexibility?', 'Overtime work', 'Independence / self-governance', 'Strict supervision', 'Isolation', 1, 'Autonomy means independence and freedom of choice.', 'Vocabulary in Context', 'easy'),
          mcq('What authorial technique presents arguments by anticipating and refuting counterarguments?', 'Chronological order', 'Refutation / Rebuttal', 'Spatial description', 'Anecdotal storytelling', 1, 'Addressing counterarguments uses refutation/rebuttal.', 'Rhetoric', 'hard'),
          mcq('Passage: "Microplastics have invaded marine food webs from plankton to apex predators. Scientists warn that bioaccumulation of toxic additives in fish poses unquantified risks to human seafood consumers." Question: What process causes toxic accumulation up the food chain?', 'Photosynthesis', 'Bioaccumulation', 'Evaporation', 'Biodegradation', 1, 'Bioaccumulation accumulates toxins across trophic levels.', 'Passage Analysis', 'medium'),
          mcq('What does term "Apex Predators" refer to?', 'Organisms at bottom of food chain', 'Predators at top of food chain with no natural predators', 'Herbivores', 'Decomposers', 1, 'Apex predators sit at top of food chain.', 'Terminology', 'easy'),
          mcq('Passage: "Space exploration has yielded unexpected terrestrial innovations. From memory foam to satellite telecommunications, spinoff technologies continue to enrich everyday human life." Question: What is main point of passage?', 'Space travel is too expensive', 'Space exploration yields beneficial spinoff technologies for daily life', 'Satellites are unnecessary', 'Memory foam was invented for cars', 1, 'Passage emphasizes daily benefits of space spinoff tech.', 'Main Idea', 'easy'),
          mcq('What is a synonym for "Innovations"?', 'Traditions', 'Novel inventions / advancements', 'Obstacles', 'Failures', 1, 'Innovations means novel inventions or developments.', 'Vocabulary', 'easy'),
          mcq('Which statement best summarizes purpose of conclusions in analytical essays?', 'Introduce new evidence', 'Synthesize key arguments and restate thesis insightfully', 'Ask random questions', 'Repeat introduction word for word', 1, 'Conclusions synthesize arguments and restate thesis.', 'Essay Writing', 'medium')
        ]
      },

      // 25. Business English
      {
        title: 'Business English',
        category: 'English',
        subject: 'English',
        difficulty: 'medium',
        duration: 35,
        questions: [
          mcq('What does acronym "ROI" stand for in business finance?', 'Return on Investment', 'Rate of Inflation', 'Risk of Insolvency', 'Revenue on Income', 0, 'ROI measures profitability of investment.', 'Finance Terms', 'easy'),
          mcq('Which email salutation is most appropriate for a formal business letter when recipient name is unknown?', 'Hey there!', 'Dear Sir/Madam, or To Whom It May Concern,', 'Yo!', 'Good morning buddy,', 1, 'Formal business correspondence uses "Dear Sir/Madam" or "To Whom It May Concern".', 'Etiquette', 'easy'),
          mcq('What does business term "B2B" stand for?', 'Business-to-Buyer', 'Business-to-Business', 'Brand-to-Business', 'Buyer-to-Buyer', 1, 'B2B refers to transactions between businesses.', 'Terminology', 'easy'),
          mcq('Select professional phrase to express disagreement politely in a meeting:', 'You are totally wrong.', 'I understand your point, but I have a slightly different perspective.', 'That makes no sense.', 'Shut up and listen.', 1, 'Polite disagreement acknowledges speaker before presenting alternative.', 'Communication', 'easy'),
          mcq('What does acronym "KPI" stand for in performance management?', 'Key Performance Indicator', 'Key Process Integration', 'Knowledge Product Index', 'Known Price Increase', 0, 'KPI measures progress toward strategic goals.', 'Management', 'easy'),
          mcq('Choose correct word: "The new policy will have a positive ___ on employee morale."', 'affect', 'effect', 'effective', 'affection', 1, '"effect" is noun meaning result or impact.', 'Word Usage', 'easy'),
          mcq('Choose correct word: "Lowering prices will ___ customer demand."', 'affect', 'effect', 'effective', 'effectual', 0, '"affect" is verb meaning to influence.', 'Word Usage', 'medium'),
          mcq('What does idiom "Touch base" mean in business context?', 'Play baseball', 'Briefly make contact or check in with someone', 'Sign a contract', 'Fire an employee', 1, 'Touch base means to check in or talk briefly.', 'Idioms', 'easy'),
          mcq('What does idiom "Think outside the box" mean?', 'Build cardboard packaging', 'Think creatively from unconventional perspectives', 'Work overtime', 'Leave office building', 1, 'Thinking outside box means innovative creative thinking.', 'Idioms', 'easy'),
          mcq('Which document summarizes a candidate\'s work history, education, and skills for job applications?', 'Invoice', 'Resume / CV', 'Purchase Order', 'Balance Sheet', 1, 'Resume/CV outlines candidate qualifications.', 'Documents', 'easy'),
          mcq('What does acronym "SLA" stand for in vendor agreements?', 'Service Level Agreement', 'Standard License Authorization', 'System Maintenance Protocol', 'Software Logistics Area', 0, 'SLA defines commitment between provider and client.', 'Contracts', 'medium'),
          mcq('Select appropriate phrase to request information in a formal email:', 'Gimme the files now.', 'Could you please provide the requested information at your earliest convenience?', 'Send info fast.', 'I want data.', 1, 'Polite request uses "Could you please provide...".', 'Email Etiquette', 'easy'),
          mcq('What does business term "Synergy" refer to?', 'Separate independent operations', 'Combined effort producing greater outcome than sum of individual parts', 'Financial loss', 'Employee termination', 1, 'Synergy means combined effectiveness exceeding individual efforts.', 'Terminology', 'medium'),
          mcq('Which financial statement reports company revenues, expenses, and net profit over a period?', 'Balance Sheet', 'Income Statement (P&L)', 'Cash Flow Statement', 'Audit Report', 1, 'Income Statement shows profit and loss over time.', 'Finance', 'medium'),
          mcq('What does acronym "CEO" stand for?', 'Chief Executive Officer', 'Central Executive Operator', 'Chief Energy Officer', 'Corporate Executive Owner', 0, 'CEO is top corporate executive.', 'Leadership', 'easy'),
          mcq('Choose correct word: "Please ___ the attached report before tomorrow\'s meeting."', 'review', 'revise', 'reject', 'refund', 0, 'Review means to inspect or examine.', 'Vocabulary', 'easy'),
          mcq('What is purpose of an Executive Summary at beginning of a long report?', 'List all employee names', 'Provide concise overview of main points and recommendations for busy readers', 'State index page numbers', 'Disclaim legal liability', 1, 'Executive summary synthesizes key report findings concisely.', 'Reports', 'easy'),
          mcq('What does business phrase "Bottom line" refer to?', 'The first sentence', 'Net income / final financial result', 'Lowest employee tier', 'Footer of page', 1, 'Bottom line refers to net profit or primary outcome.', 'Idioms', 'easy'),
          mcq('Select appropriate closing for a formal business letter:', 'Cheers,', 'Sincerely, / Best regards,', 'Later,', 'XOXO,', 1, '"Sincerely" or "Best regards" are standard formal sign-offs.', 'Etiquette', 'easy'),
          mcq('What does "Benchmarking" mean in corporate strategy?', 'Sitting on bench', 'Comparing business processes and metrics against industry best practices', 'Setting product prices', 'Firing low performers', 1, 'Benchmarking measures performance against industry leaders.', 'Strategy', 'medium')
        ]
      }
    ];

    console.log(`📋 Total Exam Specifications to process: ${examSpecs.length}`);

    // ─── INSERT EXAMS & QUESTIONS INTO MONGODB ─────────────────────────────────

    let insertedExamsCount = 0;
    let insertedQuestionsCount = 0;

    for (let i = 0; i < examSpecs.length; i++) {
      const spec = examSpecs[i];
      const categoryId = categoryMap[spec.category] || categoryMap['Programming'];

      const examPayload = {
        title: spec.title,
        category: categoryId,
        subject: spec.subject,
        difficulty: spec.difficulty,
        duration: spec.duration,
        totalMarks: 100,
        passingMarks: 40,
        teacher: teacher._id,
        status: 'published',
        instructions: 'Answer all 20 multiple-choice questions within time limit. Each question carries 5 marks. Auto-graded upon completion.',
        selectionMode: 'manual',
        shuffleQuestions: false,
        shuffleOptions: false
      };

      // Check if exam exists
      let examDoc = await Exam.findOne({ title: spec.title });
      if (examDoc) {
        await Exam.updateOne({ _id: examDoc._id }, examPayload);
      } else {
        examDoc = await Exam.create(examPayload);
      }
      insertedExamsCount++;

      // Delete existing questions for this exam
      await Question.deleteMany({ exam: examDoc._id });

      // Prepare questions array linked to this exam
      const questionDocs = spec.questions.map(q => ({
        ...q,
        exam: examDoc._id,
        category: categoryId,
        status: 'active'
      }));

      await Question.insertMany(questionDocs);
      insertedQuestionsCount += questionDocs.length;

      console.log(`  [${i + 1}/25] Seeded: "${spec.title}" (${questionDocs.length} questions)`);
    }

    console.log('\n==================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log(`✓ Total Exams Seeded: ${insertedExamsCount}`);
    console.log(`✓ Total Questions Seeded: ${insertedQuestionsCount}`);
    console.log('==================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed with error:', err);
    process.exit(1);
  }
};

seedAllExams();
