const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Category = require('../models/Category');

// Question bank data by topic/title
const QUESTION_BANK = {
  'React Fundamentals': [
    {
      q: 'Which React hook is used to handle side effects such as API calls or DOM manipulation?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      answer: 'useEffect',
      explanation: 'useEffect handles side effects including data fetching, subscriptions, and DOM updates in functional components.',
      diff: 'easy'
    },
    {
      q: 'What is the primary purpose of the Virtual DOM in React?',
      options: ['Directly modify HTML elements', 'Minimize actual DOM updates by batching changes', 'Replace CSS styles dynamically', 'Provide backend database storage'],
      answer: 'Minimize actual DOM updates by batching changes',
      explanation: 'Virtual DOM enables efficient updates by comparing changes in memory (diffing algorithm) before re-rendering the real DOM.',
      diff: 'medium'
    },
    {
      q: 'Which property in React components must be unique when rendering lists of elements?',
      options: ['id', 'key', 'index', 'ref'],
      answer: 'key',
      explanation: 'The key prop helps React identify which items have changed, added, or removed in a list efficiently.',
      diff: 'easy'
    },
    {
      q: 'How do you pass data from a parent component to a child component in React?',
      options: ['Via State', 'Via Props', 'Via Reducers', 'Via Event Emitters'],
      answer: 'Via Props',
      explanation: 'Props (properties) are passed down from parent to child components in a uni-directional data flow.',
      diff: 'easy'
    },
    {
      q: 'Which hook should be used to memoize expensive calculation results across re-renders?',
      options: ['useCallback', 'useMemo', 'useRef', 'useLayoutEffect'],
      answer: 'useMemo',
      explanation: 'useMemo returns a memoized value that only recalculates when one of the specified dependencies changes.',
      diff: 'medium'
    },
    {
      q: 'What does React.memo() accomplish when wrapping a functional component?',
      options: ['Prevents component rendering if props have not changed', 'Encodes component props into base64', 'Stores component state in localStorage', 'Enables server-side rendering'],
      answer: 'Prevents component rendering if props have not changed',
      explanation: 'React.memo is a higher-order component that skips re-rendering if props are shallowly equal.',
      diff: 'medium'
    },
    {
      q: 'Which hook provides a mutable reference object whose .current property persists across re-renders without causing a re-render?',
      options: ['useState', 'useRef', 'useMemo', 'useContext'],
      answer: 'useRef',
      explanation: 'useRef returns a ref object whose .current property can hold any mutable value without triggering component re-renders.',
      diff: 'medium'
    },
    {
      q: 'In React Context API, which component is responsible for making context available to nested children?',
      options: ['Context.Consumer', 'Context.Provider', 'Context.Dispatcher', 'Context.Store'],
      answer: 'Context.Provider',
      explanation: 'Context.Provider accepts a value prop to be passed to consuming components down the tree.',
      diff: 'easy'
    },
    {
      q: 'What is the main advantage of custom hooks in React?',
      options: ['Extract and share stateful logic between components', 'Automatically create Redux stores', 'Replace HTML tags with native elements', 'Speed up bundle compilation'],
      answer: 'Extract and share stateful logic between components',
      explanation: 'Custom hooks allow you to reuse stateful logic without duplicating code across functional components.',
      diff: 'hard'
    },
    {
      q: 'Which hook is preferred when managing complex state logic involving multiple sub-values?',
      options: ['useState', 'useReducer', 'useRef', 'useEffect'],
      answer: 'useReducer',
      explanation: 'useReducer is usually preferable to useState when state logic is complex or involves multiple sub-values or actions.',
      diff: 'hard'
    }
  ],

  'JavaScript Essentials': [
    {
      q: 'What will be the output of `typeof null` in JavaScript?',
      options: ['"null"', '"undefined"', '"object"', '"number"'],
      answer: '"object"',
      explanation: 'In JavaScript, `typeof null` returns "object" due to a historical bug in the language design.',
      diff: 'easy'
    },
    {
      q: 'Which ES6 feature creates a shallow copy of an array or object?',
      options: ['Rest Operator (...)', 'Spread Operator (...)', 'Object.freeze()', 'Array.prototype.slice()'],
      answer: 'Spread Operator (...)',
      explanation: 'The spread operator (...) allows an iterable or object to be expanded into single elements or properties.',
      diff: 'easy'
    },
    {
      q: 'What is a Closure in JavaScript?',
      options: ['A function bundled with references to its surrounding lexical environment', 'A method to terminate event loops', 'A syntax for closing HTML tags', 'A private class method'],
      answer: 'A function bundled with references to its surrounding lexical environment',
      explanation: 'A closure gives a inner function access to an outer function scope even after the outer function has returned.',
      diff: 'medium'
    },
    {
      q: 'Which keyword creates a block-scoped variable that cannot be reassigned?',
      options: ['var', 'let', 'const', 'global'],
      answer: 'const',
      explanation: '`const` variables are block-scoped and cannot be reassigned after declaration.',
      diff: 'easy'
    },
    {
      q: 'What is the purpose of `Promise.all()` in JavaScript?',
      options: ['Executes promises sequentially', 'Resolves when all input promises have resolved, or rejects when any promise rejects', 'Cancels running HTTP requests', 'Ignores rejected promises'],
      answer: 'Resolves when all input promises have resolved, or rejects when any promise rejects',
      explanation: 'Promise.all takes an iterable of promises and returns a single Promise that resolves to an array of results.',
      diff: 'medium'
    },
    {
      q: 'What is Hoisting in JavaScript?',
      options: ['Moving variable and function declarations to the top of their scope before execution', 'Pushing items into an array', 'Uploading files to a remote server', 'Compressing JavaScript source code'],
      answer: 'Moving variable and function declarations to the top of their scope before execution',
      explanation: 'JavaScript engine moves declarations to the top of the current scope during the compilation phase.',
      diff: 'medium'
    },
    {
      q: 'Which method converts a JSON string into a JavaScript object?',
      options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'Object.parse()'],
      answer: 'JSON.parse()',
      explanation: 'JSON.parse() parses a JSON string, constructing the JavaScript value or object described by the string.',
      diff: 'easy'
    },
    {
      q: 'How does `==` differ from `===` in JavaScript?',
      options: ['`==` performs type coercion before comparing, while `===` checks both value and type', '`===` performs type coercion', 'There is no difference', '`==` is for numbers only'],
      answer: '`==` performs type coercion before comparing, while `===` checks both value and type',
      explanation: 'Strict equality `===` evaluates to true only if operands have identical types and equal values.',
      diff: 'easy'
    },
    {
      q: 'What is the Event Loop in Node.js/JavaScript?',
      options: ['A mechanism that handles asynchronous callbacks in a single-threaded architecture', 'A loop that runs infinitely without ending', 'A CSS animation trigger', 'A database transaction logger'],
      answer: 'A mechanism that handles asynchronous callbacks in a single-threaded architecture',
      explanation: 'The Event Loop monitors the Call Stack and Task Queue to execute async code without blocking execution.',
      diff: 'hard'
    },
    {
      q: 'Which Array method returns a new array with all elements that pass the test implemented by the provided function?',
      options: ['map()', 'filter()', 'reduce()', 'forEach()'],
      answer: 'filter()',
      explanation: 'The filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test.',
      diff: 'medium'
    }
  ],

  'Python Programming': [
    {
      q: 'Which data structure in Python is mutable, ordered, and allows duplicate elements?',
      options: ['Tuple', 'List', 'Set', 'Dictionary'],
      answer: 'List',
      explanation: 'Lists in Python are ordered, mutable, and allow duplicate members.',
      diff: 'easy'
    },
    {
      q: 'What keyword is used to define a function in Python?',
      options: ['func', 'def', 'function', 'define'],
      answer: 'def',
      explanation: 'The `def` keyword is used to declare a function in Python.',
      diff: 'easy'
    },
    {
      q: 'What is a Decorator in Python?',
      options: ['A function that takes another function as an argument and extends its behavior without modifying it', 'A GUI styling widget', 'A class attribute validator', 'A database ORM tool'],
      answer: 'A function that takes another function as an argument and extends its behavior without modifying it',
      explanation: 'Decorators wrap another function to extend its behavior using `@decorator_name` syntax.',
      diff: 'medium'
    },
    {
      q: 'What does the Global Interpreter Lock (GIL) do in CPython?',
      options: ['Prevents multiple native threads from executing Python bytecodes simultaneously', 'Locks the database connection', 'Enforces strict type safety', 'Encrypts Python files'],
      answer: 'Prevents multiple native threads from executing Python bytecodes simultaneously',
      explanation: 'GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once.',
      diff: 'hard'
    },
    {
      q: 'Which built-in module in Python is used for handling regular expressions?',
      options: ['regex', 're', 'string', 'pyregex'],
      answer: 're',
      explanation: 'The `re` module provides regular expression matching operations in Python.',
      diff: 'easy'
    },
    {
      q: 'What is the output of `print(2 ** 3)` in Python?',
      options: ['6', '8', '9', '5'],
      answer: '8',
      explanation: 'The `**` operator in Python performs exponentiation (2 raised to power 3 is 8).',
      diff: 'easy'
    },
    {
      q: 'What does a Generator function return when called?',
      options: ['A complete list of items', 'A generator iterator object', 'A single integer', 'A boolean status'],
      answer: 'A generator iterator object',
      explanation: 'Generator functions use `yield` and return a generator object that produces values lazily.',
      diff: 'medium'
    },
    {
      q: 'Which method is used to remove whitespace from both beginning and end of a Python string?',
      options: ['trim()', 'strip()', 'clean()', 'cut()'],
      answer: 'strip()',
      explanation: 'The `strip()` method removes leading and trailing characters (spaces by default).',
      diff: 'easy'
    },
    {
      q: 'How do you define a tuple with a single element in Python?',
      options: ['(5)', '(5,)', '[5]', 'tuple(5)'],
      answer: '(5,)',
      explanation: 'A single-element tuple requires a trailing comma, e.g., `(5,)`, otherwise Python interprets it as an integer in parentheses.',
      diff: 'medium'
    },
    {
      q: 'What is List Comprehension in Python?',
      options: ['A concise syntax to create lists based on existing iterables', 'A list sorting algorithm', 'A memory compression tool', 'A type checking function'],
      answer: 'A concise syntax to create lists based on existing iterables',
      explanation: 'List comprehension offers a shorter syntax when you want to create a new list from an existing list or iterable.',
      diff: 'medium'
    }
  ],

  'Full Stack Web Development Assessment': [
    {
      q: 'What does the CORS acronym stand for in Web Development?',
      options: ['Cross-Origin Resource Sharing', 'Central Server Routing Protocol', 'Client Object Response System', 'Cross-Site Retrieval Security'],
      answer: 'Cross-Origin Resource Sharing',
      explanation: 'CORS is an HTTP-header based mechanism that allows a server to indicate any origins other than its own from which a browser should permit loading resources.',
      diff: 'medium'
    },
    {
      q: 'Which HTTP method is idempotent and used to replace an existing resource completely?',
      options: ['POST', 'PUT', 'PATCH', 'GET'],
      answer: 'PUT',
      explanation: 'PUT replaces the entire target resource with the request payload and is idempotent.',
      diff: 'medium'
    },
    {
      q: 'In Express.js, what is the role of middleware functions?',
      options: ['Functions that have access to the request object (req), response object (res), and the next function', 'Database table schemas', 'Frontend CSS preprocessors', 'Compiler optimizers'],
      answer: 'Functions that have access to the request object (req), response object (res), and the next function',
      explanation: 'Middleware functions can execute code, modify req/res objects, end request-response cycles, and invoke next middleware.',
      diff: 'medium'
    },
    {
      q: 'What is JWT (JSON Web Token) primarily used for in web applications?',
      options: ['Stateless authentication and secure information exchange', 'Storing large image files', 'Database index optimization', 'Formatting HTML pages'],
      answer: 'Stateless authentication and secure information exchange',
      explanation: 'JWTs are compact, URL-safe tokens used for verifying user identity statelessly across client-server interactions.',
      diff: 'easy'
    },
    {
      q: 'Which MongoDB operator is used to perform aggregation pipeline grouping?',
      options: ['$group', '$match', '$project', '$lookup'],
      answer: '$group',
      explanation: '$group stage groups input documents by a specified identifier expression and outputs a document for each distinct group.',
      diff: 'hard'
    }
  ]
};

// Generic topic fallbacks for categories without exact custom question arrays
const CATEGORY_TOPICS = {
  'Mathematics': [
    {
      q: 'What is the solution to the quadratic equation $x^2 - 5x + 6 = 0$?',
      options: ['x = 2, x = 3', 'x = -2, x = -3', 'x = 1, x = 6', 'x = 0, x = 5'],
      answer: 'x = 2, x = 3',
      explanation: 'Factoring $(x-2)(x-3) = 0$ gives roots $x = 2$ and $x = 3$.',
      diff: 'easy'
    },
    {
      q: 'What is the derivative of $\\sin(x)$ with respect to $x$?',
      options: ['$-\\cos(x)$', '$\\cos(x)$', '$\\tan(x)$', '$-\\sin(x)$'],
      answer: '$\\cos(x)$',
      explanation: 'The derivative of $\\sin(x)$ is $\\cos(x)$.',
      diff: 'easy'
    },
    {
      q: 'What is the area of a circle with radius $r = 7$ units? (Use $\\pi \\approx 22/7$)',
      options: ['154 sq units', '44 sq units', '49 sq units', '308 sq units'],
      answer: '154 sq units',
      explanation: 'Area = $\\pi r^2 = (22/7) \\times 7 \\times 7 = 154$ sq units.',
      diff: 'easy'
    },
    {
      q: 'If a fair die is rolled, what is the probability of getting an even prime number?',
      options: ['1/6', '1/2', '1/3', '2/3'],
      answer: '1/6',
      explanation: 'The only even prime number on a 6-sided die is 2. Probability = 1/6.',
      diff: 'medium'
    },
    {
      q: 'What is the value of $\\log_{10}(1000)$?',
      options: ['2', '3', '10', '100'],
      answer: '3',
      explanation: '$10^3 = 1000$, so $\\log_{10}(1000) = 3$.',
      diff: 'easy'
    },
    {
      q: 'What is the hypotenuse of a right-angled triangle with sides 6 cm and 8 cm?',
      options: ['10 cm', '14 cm', '12 cm', '15 cm'],
      answer: '10 cm',
      explanation: 'By Pythagorean theorem: $h = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$ cm.',
      diff: 'easy'
    },
    {
      q: 'What is the integral of $2x\\, dx$?',
      options: ['$x^2 + C$', '$2x^2 + C$', '$x + C$', '$x^3/3 + C$'],
      answer: '$x^2 + C$',
      explanation: '$\\int 2x\\, dx = 2 \\cdot (x^2/2) + C = x^2 + C$.',
      diff: 'medium'
    },
    {
      q: 'What is the mean of the numbers: 4, 8, 12, 16, 20?',
      options: ['10', '12', '14', '16'],
      answer: '12',
      explanation: 'Sum = 60. Count = 5. Mean = 60 / 5 = 12.',
      diff: 'easy'
    },
    {
      q: 'In how many ways can 5 distinct books be arranged on a shelf?',
      options: ['120', '25', '60', '720'],
      answer: '120',
      explanation: 'Arrangements = $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.',
      diff: 'medium'
    },
    {
      q: 'What is the value of $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$?',
      options: ['0', '1', 'Infinity', 'Undefined'],
      answer: '1',
      explanation: 'Standard calculus limit: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$.',
      diff: 'hard'
    }
  ],

  'Science': [
    {
      q: 'What is Newton’s First Law of Motion also known as?',
      options: ['Law of Inertia', 'Law of Acceleration', 'Law of Action and Reaction', 'Law of Gravitation'],
      answer: 'Law of Inertia',
      explanation: 'Newton’s First Law states an object remains at rest or in uniform motion unless acted upon by a net external force (Inertia).',
      diff: 'easy'
    },
    {
      q: 'What is the chemical symbol for Gold?',
      options: ['Ag', 'Au', 'Fe', 'Gd'],
      answer: 'Au',
      explanation: 'The chemical symbol for Gold is Au, derived from the Latin word "Aurum".',
      diff: 'easy'
    },
    {
      q: 'Which organelle is known as the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
      answer: 'Mitochondria',
      explanation: 'Mitochondria generate most of the cell’s chemical energy in the form of ATP.',
      diff: 'easy'
    },
    {
      q: 'What gas do plants absorb from the atmosphere during photosynthesis?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
      answer: 'Carbon Dioxide',
      explanation: 'Plants convert Carbon Dioxide and water into glucose and oxygen using light energy.',
      diff: 'easy'
    },
    {
      q: 'What is the SI unit of electrical resistance?',
      options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
      answer: 'Ohm',
      explanation: 'The Ohm ($\\Omega$) is the SI unit of electrical resistance.',
      diff: 'easy'
    },
    {
      q: 'Which layer of the atmosphere contains the protective Ozone layer?',
      options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
      answer: 'Stratosphere',
      explanation: 'The Stratosphere contains the ozone layer which absorbs harmful ultraviolet solar radiation.',
      diff: 'medium'
    },
    {
      q: 'What is the pH value of pure water at 25°C?',
      options: ['5.0', '7.0', '8.5', '14.0'],
      answer: '7.0',
      explanation: 'Pure water is neutral and has a pH of 7.0 at 25°C.',
      diff: 'easy'
    },
    {
      q: 'Which blood cells are responsible for carrying oxygen throughout the human body?',
      options: ['Red Blood Cells (Erythrocytes)', 'White Blood Cells (Leukocytes)', 'Platelets', 'Plasma'],
      answer: 'Red Blood Cells (Erythrocytes)',
      explanation: 'Red blood cells contain hemoglobin, which binds to oxygen and transports it to body tissues.',
      diff: 'easy'
    },
    {
      q: 'What is the speed of light in a vacuum?',
      options: ['$3 \\times 10^8$ m/s', '$3 \\times 10^6$ m/s', '$1.5 \\times 10^8$ m/s', '$300,000$ m/s'],
      answer: '$3 \\times 10^8$ m/s',
      explanation: 'The speed of light in vacuum $c \\approx 300,000$ km/s or $3 \\times 10^8$ meters per second.',
      diff: 'medium'
    },
    {
      q: 'What process converts glucose into pyruvate under anaerobic or aerobic cellular conditions?',
      options: ['Krebs Cycle', 'Glycolysis', 'Electron Transport Chain', 'Calvin Cycle'],
      answer: 'Glycolysis',
      explanation: 'Glycolysis is the metabolic pathway that breaks down glucose into pyruvate in the cytoplasm.',
      diff: 'hard'
    }
  ],

  'English': [
    {
      q: 'Identify the correct passive voice sentence for: "She wrote a brilliant novel."',
      options: ['A brilliant novel was written by her.', 'A brilliant novel is written by her.', 'A brilliant novel had written by her.', 'She was writing a brilliant novel.'],
      answer: 'A brilliant novel was written by her.',
      explanation: 'Past simple active ("wrote") changes to past simple passive ("was written").',
      diff: 'easy'
    },
    {
      q: 'What is the synonym of the word "EPHEMERAL"?',
      options: ['Eternal', 'Transient', 'Substantial', 'Continuous'],
      answer: 'Transient',
      explanation: 'Ephemeral means lasting for a very short time; transient is its direct synonym.',
      diff: 'medium'
    },
    {
      q: 'Choose the correct preposition: "He is proficient ___ mathematical reasoning."',
      options: ['on', 'in', 'at', 'with'],
      answer: 'in',
      explanation: 'The adjective "proficient" is followed by the preposition "in".',
      diff: 'easy'
    },
    {
      q: 'What does the idiom "Burn the midnight oil" mean?',
      options: ['Waste fuel unnecessarily', 'Work or study late into the night', 'Cause an accidental fire', 'Sleep early'],
      answer: 'Work or study late into the night',
      explanation: '"Burn the midnight oil" means to stay up late working or studying.',
      diff: 'easy'
    },
    {
      q: 'Which sentence demonstrates correct subject-verb agreement?',
      options: ['Neither the manager nor the employees were present.', 'Neither the manager nor the employees was present.', 'Either the student or teacher are wrong.', 'Each of the girls have a book.'],
      answer: 'Neither the manager nor the employees were present.',
      explanation: 'When using "neither...nor", the verb agrees with the subject closest to it ("employees" -> "were").',
      diff: 'medium'
    },
    {
      q: 'What is the antonym of the word "CANDID"?',
      options: ['Frank', 'Honest', 'Deceitful', 'Outspoken'],
      answer: 'Deceitful',
      explanation: 'Candid means truthful and straightforward; deceitful is its antonym.',
      diff: 'easy'
    },
    {
      q: 'Which term refers to an executive summary in formal business report writing?',
      options: ['A brief overview summarizing the entire report key findings and conclusions', 'The detailed appendix tables', 'The bibliography list', 'The legal disclaimer footer'],
      answer: 'A brief overview summarizing the entire report key findings and conclusions',
      explanation: 'An executive summary provides a high-level summary of the entire document for busy decision-makers.',
      diff: 'easy'
    },
    {
      q: 'Which word contains the root meaning "Earth"?',
      options: ['Biology', 'Geography', 'Astrology', 'Typography'],
      answer: 'Geography',
      explanation: 'The root "Geo" comes from Greek meaning Earth.',
      diff: 'easy'
    },
    {
      q: 'Choose the correctly spelled word:',
      options: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'],
      answer: 'Accommodate',
      explanation: 'Accommodate is spelled with double "c" and double "m".',
      diff: 'medium'
    },
    {
      q: 'What figure of speech is used in: "The stars danced playfully in the moonlit sky"?',
      options: ['Metaphor', 'Personification', 'Hyperbole', 'Simile'],
      answer: 'Personification',
      explanation: 'Personification gives human qualities (dancing playfully) to non-human elements (stars).',
      diff: 'medium'
    }
  ],

  'Aptitude': [
    {
      q: 'If a product is bought for $80 and sold for $100, what is the profit percentage?',
      options: ['20%', '25%', '15%', '30%'],
      answer: '25%',
      explanation: 'Profit = $100 - $80 = $20. Profit % = (20/80) * 100 = 25%.',
      diff: 'easy'
    },
    {
      q: 'Complete the series: 2, 6, 12, 20, 30, ?',
      options: ['36', '40', '42', '48'],
      answer: '42',
      explanation: 'Differences increase by +2: (+4, +6, +8, +10, +12). 30 + 12 = 42.',
      diff: 'easy'
    },
    {
      q: 'A train 150m long travels at 54 km/h. How many seconds will it take to pass a pole?',
      options: ['10 seconds', '12 seconds', '8 seconds', '15 seconds'],
      answer: '10 seconds',
      explanation: 'Speed = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.',
      diff: 'medium'
    },
    {
      q: 'If A is the brother of B, B is the sister of C, and C is the father of D, how is A related to D?',
      options: ['Uncle', 'Father', 'Brother', 'Grandfather'],
      answer: 'Uncle',
      explanation: 'A and B and C are siblings. Since C is D’s father, A is D’s paternal uncle.',
      diff: 'medium'
    },
    {
      q: 'If 6 men can complete a project in 12 days, how many days will 9 men take to complete the same work at the same rate?',
      options: ['6 days', '8 days', '9 days', '10 days'],
      answer: '8 days',
      explanation: 'Man-days = 6 * 12 = 72. Days for 9 men = 72 / 9 = 8 days.',
      diff: 'easy'
    },
    {
      q: 'In a pie chart representing budget allocation, what angle corresponds to 25% of the total budget?',
      options: ['90 degrees', '45 degrees', '180 degrees', '60 degrees'],
      answer: '90 degrees',
      explanation: 'Total pie chart angle = 360°. 25% of 360° = (0.25) * 360° = 90°.',
      diff: 'easy'
    },
    {
      q: 'What is the simple interest on $5,000 at an annual interest rate of 6% for 3 years?',
      options: ['$900', '$800', '$1,000', '$750'],
      answer: '$900',
      explanation: 'Simple Interest = (P * R * T)/100 = (5000 * 6 * 3)/100 = $900.',
      diff: 'easy'
    },
    {
      q: 'If "CODING" is written as "DPEJOH" in a certain code, how is "EXAM" written in that same code?',
      options: ['FYBN', 'FWZL', 'EZBN', 'FYAM'],
      answer: 'FYBN',
      explanation: 'Each letter is shifted by +1: E->F, X->Y, A->B, M->N.',
      diff: 'easy'
    },
    {
      q: 'Two pipes A and B can fill a tank in 20 mins and 30 mins respectively. If both pipes are opened together, how long will it take to fill the tank?',
      options: ['12 mins', '15 mins', '10 mins', '25 mins'],
      answer: '12 mins',
      explanation: 'Combined rate = (1/20 + 1/30) = 5/60 = 1/12. Time = 12 minutes.',
      diff: 'medium'
    },
    {
      q: 'Evaluate the logical statement: "All squares are rectangles. All rectangles are polygons." Therefore:',
      options: ['All squares are polygons', 'Some polygons are not rectangles', 'No squares are polygons', 'All polygons are squares'],
      answer: 'All squares are polygons',
      explanation: 'By transitive property of categorical syllogisms, if A ⊆ B and B ⊆ C, then A ⊆ C.',
      diff: 'medium'
    }
  ],

  'General Knowledge': [
    {
      q: 'Which country hosted the G20 Leaders’ Summit in September 2023?',
      options: ['India', 'Brazil', 'Indonesia', 'South Africa'],
      answer: 'India',
      explanation: 'India held the G20 Presidency and hosted the 18th G20 Summit in New Delhi in September 2023.',
      diff: 'easy'
    },
    {
      q: 'Which is the longest river in the world?',
      options: ['Nile River', 'Amazon River', 'Yangtze River', 'Mississippi River'],
      answer: 'Nile River',
      explanation: 'The Nile River in Africa is generally recognized as the world’s longest river (~6,650 km).',
      diff: 'easy'
    },
    {
      q: 'Who was the Chairman of the Drafting Committee of the Indian Constitution?',
      options: ['Dr. B.R. Ambedkar', 'Dr. Rajendra Prasad', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'],
      answer: 'Dr. B.R. Ambedkar',
      explanation: 'Dr. B.R. Ambedkar served as the Chairman of the Drafting Committee established in 1947.',
      diff: 'easy'
    },
    {
      q: 'In which year did World War II officially end?',
      options: ['1945', '1944', '1948', '1939'],
      answer: '1945',
      explanation: 'World War II concluded in September 1945 following the surrender of Axis powers.',
      diff: 'easy'
    },
    {
      q: 'Which planet in our solar system is known as the "Red Planet"?',
      options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      answer: 'Mars',
      explanation: 'Mars is referred to as the Red Planet due to the prevalence of iron oxide on its surface.',
      diff: 'easy'
    },
    {
      q: 'What is the capital city of Australia?',
      options: ['Canberra', 'Sydney', 'Melbourne', 'Brisbane'],
      answer: 'Canberra',
      explanation: 'Canberra was selected as the capital city of Australia in 1908.',
      diff: 'easy'
    },
    {
      q: 'Which Article of the Indian Constitution guarantees the Right to Equality?',
      options: ['Article 14 to 18', 'Article 19 to 22', 'Article 25 to 28', 'Article 32'],
      answer: 'Article 14 to 18',
      explanation: 'Articles 14 through 18 of the Constitution of India cover Fundamental Rights related to Equality.',
      diff: 'medium'
    },
    {
      q: 'What is the name of India’s lunar exploration mission that successfully landed near the Moon’s South Pole in 2023?',
      options: ['Chandrayaan-3', 'Chandrayaan-2', 'Mangalyaan', 'Aditya-L1'],
      answer: 'Chandrayaan-3',
      explanation: 'ISRO’s Chandrayaan-3 achieved a historic soft landing on the lunar south pole on August 23, 2023.',
      diff: 'easy'
    },
    {
      q: 'The Suez Canal connects which two bodies of water?',
      options: ['Mediterranean Sea and Red Sea', 'Atlantic Ocean and Pacific Ocean', 'Black Sea and Caspian Sea', 'Indian Ocean and Persian Gulf'],
      answer: 'Mediterranean Sea and Red Sea',
      explanation: 'The Suez Canal is an artificial sea-level waterway connecting the Mediterranean Sea to the Red Sea.',
      diff: 'medium'
    },
    {
      q: 'Which international organization is headquartered in Geneva, Switzerland and oversees global public health?',
      options: ['World Health Organization (WHO)', 'UNESCO', 'UNICEF', 'World Bank'],
      answer: 'World Health Organization (WHO)',
      explanation: 'The World Health Organization (WHO) is a specialized agency of the UN responsible for international public health, headquartered in Geneva.',
      diff: 'easy'
    }
  ],

  'Advanced': [
    {
      q: 'In CAP Theorem for distributed systems, what does the "P" stand for?',
      options: ['Partition Tolerance', 'Performance', 'Parallelism', 'Persistence'],
      answer: 'Partition Tolerance',
      explanation: 'CAP theorem states a distributed system can deliver at most two of three guarantees: Consistency, Availability, and Partition Tolerance.',
      diff: 'medium'
    },
    {
      q: 'Which consensus algorithm is designed to be understandable and is widely used in systems like etcd and Kubernetes?',
      options: ['Raft', 'Paxos', 'Byzantine Fault Tolerance', 'Proof of Work'],
      answer: 'Raft',
      explanation: 'Raft is a consensus algorithm designed to be easy to understand, achieving consensus via leader election and log replication.',
      diff: 'hard'
    },
    {
      q: 'What is the main principle of Quantum Superposition?',
      options: ['A quantum system can exist in a linear combination of multiple physical states simultaneously until measured', 'Qubits can move faster than light', 'Quantum data cannot be duplicated', 'Electrons stop moving at absolute zero'],
      answer: 'A quantum system can exist in a linear combination of multiple physical states simultaneously until measured',
      explanation: 'Superposition allows qubits to represent 0, 1, or any linear combination of both until a measurement collapses the state.',
      diff: 'hard'
    },
    {
      q: 'Which architectural design pattern decouples read and write operations into separate models?',
      options: ['CQRS (Command Query Responsibility Segregation)', 'Event Sourcing', 'Saga Pattern', 'Balking Pattern'],
      answer: 'CQRS (Command Query Responsibility Segregation)',
      explanation: 'CQRS separates read and update operations for a data store, enabling independent scaling and optimization.',
      diff: 'hard'
    },
    {
      q: 'Which quantum algorithm provides polynomial speedup for searching an unsorted database of N items in O(√N) time?',
      options: ['Grover’s Search Algorithm', 'Shor’s Algorithm', 'Deutsch-Jozsa Algorithm', 'Quantum Phase Estimation'],
      answer: 'Grover’s Search Algorithm',
      explanation: 'Grover’s algorithm finds a target item in an unsorted list of N items using quadratic/polynomial speedup O(√N).',
      diff: 'hard'
    }
  ]
};

const seedQuestions = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/onlineexam';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    const exams = await Exam.find({});
    console.log(`Found ${exams.length} exams in database.`);

    let totalInserted = 0;
    let totalSkipped = 0;
    const categoryStats = {};

    for (const exam of exams) {
      const examTitle = exam.title;
      const examSubject = exam.subject || 'Programming';
      
      // Determine question bank to pull from
      let bank = QUESTION_BANK[examTitle];
      if (!bank) {
        // Fallback to category bank or default programming
        bank = CATEGORY_TOPICS[examSubject] || QUESTION_BANK['React Fundamentals'];
      }

      // Check existing questions for this exam
      const existingQuestions = await Question.find({ exam: exam._id });
      const existingTexts = new Set(existingQuestions.map(q => q.question.toLowerCase().trim()));

      let insertedForThisExam = 0;
      let skippedForThisExam = 0;

      // We want to ensure the exam has at least 10 to 20 questions
      const targetCount = exam.totalMarks ? Math.min(exam.totalMarks, 20) : 10;
      
      // Calculate mark per question so total equals 100
      const marksPerQ = Math.round(100 / Math.max(targetCount, bank.length)) || 5;

      let orderIdx = existingQuestions.length + 1;

      // Generate items repeatedly from bank until targetCount is met
      let qIndex = 0;
      while (insertedForThisExam + existingQuestions.length < targetCount && qIndex < 30) {
        const item = bank[qIndex % bank.length];
        qIndex++;

        const questionText = qIndex > bank.length 
          ? `[Variation ${Math.floor(qIndex / bank.length)}] ${item.q}`
          : item.q;

        if (existingTexts.has(questionText.toLowerCase().trim())) {
          skippedForThisExam++;
          continue;
        }

        await Question.create({
          exam: exam._id,
          question: questionText,
          type: 'mcq',
          options: item.options,
          correctAnswer: item.answer,
          explanation: item.explanation,
          marks: marksPerQ,
          difficulty: item.diff || exam.difficulty || 'medium',
          status: 'active'
        });

        existingTexts.add(questionText.toLowerCase().trim());
        insertedForThisExam++;
        orderIdx++;
      }

      totalInserted += insertedForThisExam;
      totalSkipped += skippedForThisExam;

      if (!categoryStats[examSubject]) {
        categoryStats[examSubject] = { examsCount: 0, questionsCount: 0 };
      }
      categoryStats[examSubject].examsCount++;
      const finalCount = await Question.countDocuments({ exam: exam._id });
      categoryStats[examSubject].questionsCount += finalCount;

      console.log(`- ${examTitle} [${examSubject}]: ${insertedForThisExam} inserted, ${finalCount} total questions.`);
    }

    const totalQuestionsInDb = await Question.countDocuments({});

    console.log('\n======================================================');
    console.log('       QEZMORA QUESTION SEEDING SUMMARY');
    console.log('======================================================');
    console.log(`Total New Questions Inserted : ${totalInserted}`);
    console.log(`Total Duplicates Skipped    : ${totalSkipped}`);
    console.log('------------------------------------------------------');
    console.log('Category Summary:');
    console.log(`  ${'Category'.padEnd(20)} | ${'Exams'.padStart(6)} | ${'Questions'.padStart(10)}`);
    console.log('  --------------------------------------------------');
    for (const [cat, stats] of Object.entries(categoryStats)) {
      console.log(`  ${cat.padEnd(20)} | ${String(stats.examsCount).padStart(6)} | ${String(stats.questionsCount).padStart(10)}`);
    }
    console.log('------------------------------------------------------');
    console.log(`Total Questions in MongoDB: ${totalQuestionsInDb}`);
    console.log('======================================================\n');
    console.log('Question seeding completed successfully.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Question seeding failed with error:', err);
    process.exit(1);
  }
};

seedQuestions();
