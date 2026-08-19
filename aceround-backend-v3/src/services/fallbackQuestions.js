// Static fallback question bank.
// Ported from the original frontend's src/data/questions.js so the app keeps
// working even when no AI provider is configured or the AI call fails.
// This is intentionally checked into source control (no secrets here).

const FALLBACK_QUESTIONS = {
  "Frontend Developer": [
    {
      "question": "What is the virtual DOM in React?",
      "options": [
        "A direct copy of the HTML DOM",
        "A browser plugin for React",
        "A lightweight JavaScript representation of the DOM",
        "A CSS framework"
      ],
      "correctAnswer": 1,
      "explanation": "The virtual DOM is a lightweight JavaScript object that represents the real DOM. React uses it to optimize updates by comparing the virtual DOM with its previous state and only updating changed elements."
    },
    {
      "question": "What is the difference between let and var in JavaScript?",
      "options": [
        "No difference",
        "var is block-scoped, let is function-scoped",
        "let is block-scoped, var is function-scoped",
        "let can be redeclared, var cannot"
      ],
      "correctAnswer": 1,
      "explanation": "let is block-scoped (only accessible within the block it's defined) while var is function-scoped (accessible throughout the function). let also cannot be redeclared in the same scope."
    },
    {
      "question": "What is CSS Flexbox?",
      "options": [
        "A one-dimensional layout method",
        "A CSS grid system",
        "A JavaScript library",
        "A CSS preprocessor"
      ],
      "correctAnswer": 1,
      "explanation": "Flexbox is a one-dimensional layout method that arranges items in rows or columns. It provides efficient ways to align, distribute space, and handle responsive layouts."
    },
    {
      "question": "What are React Hooks?",
      "options": [
        "Functions that let you use state in functional components",
        "External libraries for React",
        "CSS styling tools",
        "Testing utilities"
      ],
      "correctAnswer": 1,
      "explanation": "React Hooks like useState, useEffect, useContext allow you to use state and other React features in functional components without writing classes."
    },
    {
      "question": "What is the purpose of the 'key' prop in React lists?",
      "options": [
        "To style list items",
        "To add keyboard shortcuts",
        "To uniquely identify each item for efficient re-rendering",
        "To lock list items"
      ],
      "correctAnswer": 1,
      "explanation": "The key prop helps React identify which items have changed, are added, or are removed. Keys should be unique and stable for optimal performance."
    },
    {
      "question": "What does CSS stand for?",
      "options": [
        "Computer Style Sheets",
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      "correctAnswer": 1,
      "explanation": "CSS stands for Cascading Style Sheets. It describes how HTML elements should be displayed on screen, controlling layout, colors, fonts, and responsive design."
    },
    {
      "question": "What is the difference between == and === in JavaScript?",
      "options": [
        "No difference",
        "== compares values, === compares values and types",
        "=== compares values, == compares values and types",
        "== is faster than ==="
      ],
      "correctAnswer": 1,
      "explanation": "== is loose equality and performs type coercion before comparison. === is strict equality and compares both value and type without coercion. === is generally preferred."
    },
    {
      "question": "What is Tailwind CSS?",
      "options": [
        "A CSS framework with predefined components",
        "A utility-first CSS framework",
        "A CSS preprocessor like Sass",
        "A JavaScript CSS-in-JS library"
      ],
      "correctAnswer": 1,
      "explanation": "Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without leaving your HTML."
    },
    {
      "question": "What is JSX in React?",
      "options": [
        "A database query language",
        "A syntax extension for JavaScript that looks like HTML",
        "A testing framework",
        "A build tool"
      ],
      "correctAnswer": 1,
      "explanation": "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It gets compiled to regular JavaScript function calls."
    },
    {
      "question": "What is the purpose of useEffect hook?",
      "options": [
        "To create state variables",
        "To style components",
        "To handle side effects in functional components",
        "To validate props"
      ],
      "correctAnswer": 1,
      "explanation": "useEffect is used to handle side effects like data fetching, subscriptions, or manually changing the DOM in functional components. It serves a similar purpose to lifecycle methods in class components."
    },
    {
      "question": "What is the box model in CSS?",
      "options": [
        "A JavaScript design pattern",
        "A layout system for databases",
        "The structure of margins, borders, padding, and content",
        "A React component structure"
      ],
      "correctAnswer": 2,
      "explanation": "The CSS box model describes how elements are rendered as rectangular boxes. Each box consists of content, padding, border, and margin."
    },
    {
      "question": "What is the purpose of useState hook?",
      "options": [
        "To fetch data from APIs",
        "To manage state in functional components",
        "To handle routing",
        "To validate forms"
      ],
      "correctAnswer": 1,
      "explanation": "useState is a Hook that lets you add React state to functional components. It returns the current state value and a function to update it."
    },
    {
      "question": "What is event bubbling in JavaScript?",
      "options": [
        "When events stop propagating",
        "When events propagate from child to parent elements",
        "When events propagate from parent to child elements",
        "When events are cancelled"
      ],
      "correctAnswer": 1,
      "explanation": "Event bubbling is when an event triggered on a child element propagates up through its parent elements in the DOM tree."
    },
    {
      "question": "What is a React component?",
      "options": [
        "A database table",
        "A reusable piece of UI code",
        "A CSS class",
        "A JavaScript library"
      ],
      "correctAnswer": 1,
      "explanation": "A React component is a reusable, independent piece of code that returns JSX (HTML-like syntax) to be rendered on the page."
    },
    {
      "question": "What is the purpose of CSS Grid?",
      "options": [
        "To create one-dimensional layouts",
        "To create two-dimensional grid-based layouts",
        "To animate elements",
        "To validate forms"
      ],
      "correctAnswer": 1,
      "explanation": "CSS Grid is a two-dimensional layout system that allows you to create complex grid-based layouts with rows and columns."
    },
    {
      "question": "What is prop drilling in React?",
      "options": [
        "Creating new props",
        "Passing data through multiple component levels",
        "Deleting props from components",
        "Validating props"
      ],
      "correctAnswer": 1,
      "explanation": "Prop drilling is when data is passed from a parent component down through multiple levels of child components, even when intermediate components don't need the data."
    },
    {
      "question": "What is the purpose of the alt attribute in img tags?",
      "options": [
        "To add a title to the image",
        "To provide alternative text for accessibility",
        "To style the image",
        "To link the image"
      ],
      "correctAnswer": 1,
      "explanation": "The alt attribute provides alternative text that describes the image content. It's crucial for accessibility (screen readers) and SEO."
    },
    {
      "question": "What is a closure in JavaScript?",
      "options": [
        "A way to close browser windows",
        "A function that has access to variables from its outer scope",
        "A method to end loops",
        "A type of error handling"
      ],
      "correctAnswer": 1,
      "explanation": "A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned."
    },
    {
      "question": "What is the purpose of the preventDefault() method?",
      "options": [
        "To stop event bubbling",
        "To prevent the default browser behavior",
        "To prevent form submission",
        "To prevent page reload"
      ],
      "correctAnswer": 1,
      "explanation": "preventDefault() prevents the default browser behavior that normally occurs when an event is triggered, such as form submission or link navigation."
    },
    {
      "question": "What is the difference between null and undefined?",
      "options": [
        "They are the same",
        "null is assigned, undefined means not assigned",
        "undefined is assigned, null means not assigned",
        "null is for objects, undefined is for primitives"
      ],
      "correctAnswer": 1,
      "explanation": "undefined means a variable has been declared but not assigned a value. null is an assignment value that represents no value or no object."
    }
  ],
  "Backend Developer": [
    {
      "question": "What is REST API?",
      "options": [
        "A database query language",
        "An architectural style for designing networked applications",
        "A programming language",
        "A web server software"
      ],
      "correctAnswer": 1,
      "explanation": "REST (Representational State Transfer) is an architectural style for designing networked applications using HTTP requests to perform CRUD operations on resources."
    },
    {
      "question": "What is the difference between SQL and NoSQL databases?",
      "options": [
        "No difference",
        "SQL is relational, NoSQL is non-relational",
        "SQL is non-relational, NoSQL is relational",
        "SQL is faster than NoSQL"
      ],
      "correctAnswer": 1,
      "explanation": "SQL databases are relational and table-based with structured schemas. NoSQL databases are document, key-value, graph, or column-based and more flexible for unstructured data."
    },
    {
      "question": "What is JWT?",
      "options": [
        "Java Web Token",
        "JSON Web Token",
        "JavaScript Work Tool",
        "Joint Web Transfer"
      ],
      "correctAnswer": 1,
      "explanation": "JWT (JSON Web Token) is a compact, URL-safe token used for securely transmitting information between parties. It consists of header, payload, and signature."
    },
    {
      "question": "What is middleware in Express.js?",
      "options": [
        "A database connector",
        "Functions that have access to request and response objects",
        "A templating engine",
        "A testing framework"
      ],
      "correctAnswer": 1,
      "explanation": "Middleware functions in Express.js have access to request and response objects and the next function. They can execute code, modify requests/responses, or call the next middleware."
    },
    {
      "question": "What does ACID stand for in databases?",
      "options": [
        "A type of database",
        "Atomicity, Consistency, Isolation, Durability",
        "A query language",
        "A database management system"
      ],
      "correctAnswer": 1,
      "explanation": "ACID stands for Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions don't interfere), and Durability (committed changes persist)."
    },
    {
      "question": "What is CORS?",
      "options": [
        "Cross-Origin Resource Sharing",
        "Computer Oriented Resource System",
        "Centralized Object Request System",
        "Code Organized Resource Sharing"
      ],
      "correctAnswer": 0,
      "explanation": "CORS (Cross-Origin Resource Sharing) is a security mechanism that allows a server to indicate which origins can access resources from a different domain."
    },
    {
      "question": "What is the purpose of HTTP status code 404?",
      "options": [
        "Server error",
        "Unauthorized access",
        "Resource not found",
        "Bad request"
      ],
      "correctAnswer": 2,
      "explanation": "HTTP 404 Not Found indicates that the server cannot find the requested resource. It's one of the most well-known HTTP status codes."
    },
    {
      "question": "What is database indexing?",
      "options": [
        "Creating database backups",
        "A technique to optimize data retrieval operations",
        "Deleting old data",
        "Encrypting database"
      ],
      "correctAnswer": 1,
      "explanation": "Database indexing is a technique to optimize data retrieval. An index is a data structure that improves the speed of data retrieval at the cost of additional writes and storage."
    },
    {
      "question": "What is the difference between PUT and PATCH?",
      "options": [
        "No difference",
        "PUT updates entire resource, PATCH updates partial",
        "PUT is for creation, PATCH is for update",
        "PUT is secure, PATCH is not"
      ],
      "correctAnswer": 1,
      "explanation": "PUT replaces the entire resource with new data, while PATCH applies partial modifications. Use PUT when you have the complete object, PATCH for specific fields."
    },
    {
      "question": "What is a microservice architecture?",
      "options": [
        "A small database",
        "An architecture with loosely coupled, independently deployable services",
        "A type of API",
        "A testing methodology"
      ],
      "correctAnswer": 1,
      "explanation": "Microservices architecture structures an application as a collection of loosely coupled services. Each service handles a specific business capability and can be deployed independently."
    },
    {
      "question": "What is the purpose of a primary key in a database?",
      "options": [
        "To encrypt data",
        "To uniquely identify each record in a table",
        "To create relationships",
        "To sort data"
      ],
      "correctAnswer": 1,
      "explanation": "A primary key uniquely identifies each record in a database table. It must contain unique values and cannot contain NULL values."
    },
    {
      "question": "What is an API endpoint?",
      "options": [
        "A database table",
        "A specific URL where an API can be accessed",
        "A programming language",
        "A server configuration"
      ],
      "correctAnswer": 1,
      "explanation": "An API endpoint is a specific URL where an API can be accessed by a client to perform operations like GET, POST, PUT, or DELETE."
    },
    {
      "question": "What is the purpose of environment variables?",
      "options": [
        "To style applications",
        "To store configuration values and secrets outside code",
        "To debug applications",
        "To create user interfaces"
      ],
      "correctAnswer": 1,
      "explanation": "Environment variables store configuration values and secrets (like API keys, database URLs) outside the codebase for security and flexibility across environments."
    },
    {
      "question": "What is GraphQL?",
      "options": [
        "A database",
        "A query language and runtime for APIs",
        "A CSS framework",
        "A testing tool"
      ],
      "correctAnswer": 1,
      "explanation": "GraphQL is a query language for APIs that allows clients to request exactly the data they need. Unlike REST, it uses a single endpoint and prevents over-fetching."
    },
    {
      "question": "What is the purpose of package.json in Node.js?",
      "options": [
        "To store user data",
        "To manage project metadata and dependencies",
        "To configure the database",
        "To style the application"
      ],
      "correctAnswer": 1,
      "explanation": "package.json holds metadata about the project, lists dependencies, defines scripts for building/testing/running the app, and more."
    },
    {
      "question": "What is Docker?",
      "options": [
        "A programming language",
        "A platform for developing applications in containers",
        "A database system",
        "A web framework"
      ],
      "correctAnswer": 1,
      "explanation": "Docker is a platform that uses OS-level virtualization to deliver software in packages called containers. Containers are isolated but share the OS kernel."
    },
    {
      "question": "What is CI/CD?",
      "options": [
        "A programming language",
        "Continuous Integration and Continuous Deployment",
        "A database concept",
        "A testing framework"
      ],
      "correctAnswer": 1,
      "explanation": "CI/CD stands for Continuous Integration (automatically building and testing code) and Continuous Deployment (automatically deploying tested code to production)."
    },
    {
      "question": "What is the purpose of HTTP status code 500?",
      "options": [
        "Success",
        "Resource not found",
        "Internal server error",
        "Unauthorized"
      ],
      "correctAnswer": 2,
      "explanation": "HTTP 500 Internal Server Error indicates that the server encountered an unexpected condition that prevented it from fulfilling the request."
    },
    {
      "question": "What is a foreign key in a database?",
      "options": [
        "A key from another country",
        "A field that creates a relationship between two tables",
        "An encrypted key",
        "A backup key"
      ],
      "correctAnswer": 1,
      "explanation": "A foreign key is a field in one table that refers to the primary key in another table, creating a relationship between the two tables."
    },
    {
      "question": "What is the purpose of the npm command?",
      "options": [
        "To run Python scripts",
        "To manage JavaScript packages",
        "To compile Java code",
        "To design databases"
      ],
      "correctAnswer": 1,
      "explanation": "npm (Node Package Manager) is used to install, update, and manage JavaScript packages and dependencies in Node.js projects."
    }
  ],
  "Full Stack Developer": [
    {
      "question": "What is the MERN stack?",
      "options": [
        "MySQL, Express, React, Node",
        "MongoDB, Express, React, Node",
        "MongoDB, Elasticsearch, React, Node",
        "MongoDB, Express, Ruby, Node"
      ],
      "correctAnswer": 1,
      "explanation": "MERN stands for MongoDB, Express.js, React, and Node.js. It's a popular JavaScript stack for building full-stack web applications."
    },
    {
      "question": "What is the difference between authentication and authorization?",
      "options": [
        "They are the same",
        "Authentication verifies identity, authorization verifies permissions",
        "Authorization verifies identity, authentication verifies permissions",
        "Authentication is for users, authorization is for APIs"
      ],
      "correctAnswer": 1,
      "explanation": "Authentication verifies WHO you are (login). Authorization determines WHAT you're allowed to do (permissions). Authentication comes first, then authorization."
    },
    {
      "question": "What is a Single Page Application (SPA)?",
      "options": [
        "A website with only one page",
        "An app that loads a single HTML document and updates dynamically",
        "A mobile application",
        "A static website"
      ],
      "correctAnswer": 1,
      "explanation": "An SPA loads a single HTML page and dynamically updates content as the user interacts with the app, providing a smoother user experience."
    },
    {
      "question": "What is server-side rendering (SSR)?",
      "options": [
        "Rendering on the client",
        "Generating HTML on the server for each request",
        "Static HTML generation",
        "Database rendering"
      ],
      "correctAnswer": 1,
      "explanation": "SSR is when a web server generates the full HTML for a page on each request. It improves initial load time, SEO, and social media sharing."
    },
    {
      "question": "What is the purpose of environment variables in full-stack apps?",
      "options": [
        "To style applications",
        "To store configuration values and secrets outside code",
        "To debug applications",
        "To create user interfaces"
      ],
      "correctAnswer": 1,
      "explanation": "Environment variables store configuration values and secrets (like API keys, database URLs) outside the codebase for security and flexibility."
    },
    {
      "question": "What is the difference between SQL and NoSQL?",
      "options": [
        "No difference",
        "SQL is relational, NoSQL is non-relational",
        "SQL is non-relational, NoSQL is relational",
        "SQL is faster"
      ],
      "correctAnswer": 1,
      "explanation": "SQL databases are relational and table-based. NoSQL databases are document, key-value, graph, or column-based and more flexible."
    },
    {
      "question": "What is CORS and why is it needed?",
      "options": [
        "A styling framework",
        "Cross-Origin Resource Sharing for security",
        "A database concept",
        "A testing tool"
      ],
      "correctAnswer": 1,
      "explanation": "CORS (Cross-Origin Resource Sharing) is a security feature that controls how resources on a web page can be requested from another domain."
    },
    {
      "question": "What is the purpose of package.json?",
      "options": [
        "To store user data",
        "To manage project metadata and dependencies",
        "To configure the database",
        "To style the application"
      ],
      "correctAnswer": 1,
      "explanation": "package.json holds metadata about the project, lists dependencies, defines scripts, and more. It's the heart of any Node.js project."
    },
    {
      "question": "What is Docker used for?",
      "options": [
        "A programming language",
        "Containerizing applications for consistent deployment",
        "A database system",
        "A web framework"
      ],
      "correctAnswer": 1,
      "explanation": "Docker uses OS-level virtualization to deliver software in containers. Containers are isolated but share the OS kernel, making apps portable."
    },
    {
      "question": "What is CI/CD?",
      "options": [
        "A programming language",
        "Continuous Integration and Continuous Deployment",
        "A database concept",
        "A testing framework"
      ],
      "correctAnswer": 1,
      "explanation": "CI/CD automates building, testing, and deploying code. CI builds and tests code on changes, CD deploys tested code to production."
    },
    {
      "question": "What is a RESTful API?",
      "options": [
        "A database",
        "An API following REST architectural principles",
        "A programming language",
        "A testing tool"
      ],
      "correctAnswer": 1,
      "explanation": "A RESTful API follows REST (Representational State Transfer) principles, using HTTP methods (GET, POST, PUT, DELETE) to operate on resources."
    },
    {
      "question": "What is the purpose of a .env file?",
      "options": [
        "To store CSS styles",
        "To store environment variables locally",
        "To configure routing",
        "To manage dependencies"
      ],
      "correctAnswer": 1,
      "explanation": "A .env file stores environment variables locally during development. It's used to keep sensitive data like API keys out of the codebase."
    },
    {
      "question": "What is the difference between GET and POST?",
      "options": [
        "No difference",
        "GET retrieves data, POST submits data",
        "POST retrieves data, GET submits data",
        "GET is secure, POST is not"
      ],
      "correctAnswer": 1,
      "explanation": "GET is used to retrieve data from a server and parameters are visible in the URL. POST is used to submit data to be processed and data is in the request body."
    },
    {
      "question": "What is MongoDB?",
      "options": [
        "A SQL database",
        "A NoSQL document database",
        "A web framework",
        "A programming language"
      ],
      "correctAnswer": 1,
      "explanation": "MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents. It's schema-less and highly scalable."
    },
    {
      "question": "What is Express.js?",
      "options": [
        "A database",
        "A Node.js web application framework",
        "A React library",
        "A testing tool"
      ],
      "correctAnswer": 1,
      "explanation": "Express.js is a minimal and flexible Node.js web application framework that provides robust features for building web and mobile applications."
    },
    {
      "question": "What is the purpose of npm?",
      "options": [
        "To run Python scripts",
        "To manage JavaScript packages",
        "To compile Java code",
        "To design databases"
      ],
      "correctAnswer": 1,
      "explanation": "npm (Node Package Manager) is used to install, update, and manage JavaScript packages and dependencies in Node.js projects."
    },
    {
      "question": "What is a webhook?",
      "options": [
        "A type of database",
        "A way for apps to send real-time data to other apps",
        "A CSS framework",
        "A testing methodology"
      ],
      "correctAnswer": 1,
      "explanation": "A webhook is a way for an app to provide other applications with real-time information. It's a 'reverse API' where the server pushes data to clients."
    },
    {
      "question": "What is the purpose of a load balancer?",
      "options": [
        "To balance database records",
        "To distribute network traffic across multiple servers",
        "To balance CSS styles",
        "To manage user sessions"
      ],
      "correctAnswer": 1,
      "explanation": "A load balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much demand."
    },
    {
      "question": "What is the difference between HTTP and HTTPS?",
      "options": [
        "No difference",
        "HTTPS is HTTP with SSL/TLS encryption",
        "HTTP is faster",
        "HTTPS is only for APIs"
      ],
      "correctAnswer": 1,
      "explanation": "HTTPS is HTTP with SSL/TLS encryption, providing secure communication over a computer network. It protects data integrity and confidentiality."
    },
    {
      "question": "What is version control?",
      "options": [
        "A database concept",
        "A system to track changes in source code",
        "A testing methodology",
        "A deployment strategy"
      ],
      "correctAnswer": 1,
      "explanation": "Version control systems (like Git) track changes in source code over time, allowing multiple developers to collaborate and maintain code history."
    }
  ],
  "React Developer": [
    {
      "question": "What is React?",
      "options": [
        "A database",
        "A JavaScript library for building user interfaces",
        "A CSS framework",
        "A backend framework"
      ],
      "correctAnswer": 1,
      "explanation": "React is a JavaScript library for building user interfaces, maintained by Meta. It uses a component-based architecture and virtual DOM for efficient rendering."
    },
    {
      "question": "What is the virtual DOM?",
      "options": [
        "A direct copy of the HTML DOM",
        "A lightweight JavaScript representation of the DOM",
        "A browser plugin",
        "A CSS framework"
      ],
      "correctAnswer": 1,
      "explanation": "The virtual DOM is a lightweight JavaScript object that represents the real DOM. React uses it to optimize updates by comparing changes before updating the real DOM."
    },
    {
      "question": "What is JSX?",
      "options": [
        "A database query language",
        "A syntax extension for JavaScript that looks like HTML",
        "A testing framework",
        "A build tool"
      ],
      "correctAnswer": 1,
      "explanation": "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It gets compiled to React.createElement() calls."
    },
    {
      "question": "What is the useState hook?",
      "options": [
        "To fetch data from APIs",
        "To manage state in functional components",
        "To handle routing",
        "To validate forms"
      ],
      "correctAnswer": 1,
      "explanation": "useState is a Hook that lets you add React state to functional components. It returns the current state value and a function to update it."
    },
    {
      "question": "What is the useEffect hook?",
      "options": [
        "To create state variables",
        "To handle side effects in functional components",
        "To style components",
        "To validate props"
      ],
      "correctAnswer": 1,
      "explanation": "useEffect handles side effects like data fetching, subscriptions, or DOM manipulation in functional components. It's similar to lifecycle methods in class components."
    },
    {
      "question": "What is the purpose of the key prop in React lists?",
      "options": [
        "To style list items",
        "To uniquely identify each item for efficient re-rendering",
        "To add keyboard shortcuts",
        "To lock list items"
      ],
      "correctAnswer": 1,
      "explanation": "The key prop helps React identify which items have changed, are added, or are removed. Keys should be unique and stable for optimal performance."
    },
    {
      "question": "What is prop drilling?",
      "options": [
        "Creating new props",
        "Passing data through multiple component levels",
        "Deleting props from components",
        "Validating props"
      ],
      "correctAnswer": 1,
      "explanation": "Prop drilling is when data is passed from a parent component down through multiple levels of child components, even when intermediate components don't need the data."
    },
    {
      "question": "What is the useContext hook?",
      "options": [
        "To create state",
        "To subscribe to React context",
        "To handle side effects",
        "To memoize components"
      ],
      "correctAnswer": 1,
      "explanation": "useContext is a Hook that allows you to subscribe to React context, providing a way to pass data through the component tree without prop drilling."
    },
    {
      "question": "What is the useRef hook?",
      "options": [
        "To create state variables",
        "To create a mutable reference that persists across renders",
        "To handle side effects",
        "To memoize values"
      ],
      "correctAnswer": 1,
      "explanation": "useRef returns a mutable ref object that persists across renders. It's commonly used to access DOM elements directly or store mutable values."
    },
    {
      "question": "What is the useMemo hook?",
      "options": [
        "To create state",
        "To memoize expensive calculations",
        "To handle side effects",
        "To create references"
      ],
      "correctAnswer": 1,
      "explanation": "useMemo memoizes the result of an expensive calculation, only recalculating when dependencies change. It helps optimize performance."
    },
    {
      "question": "What is the useCallback hook?",
      "options": [
        "To create state",
        "To memoize functions",
        "To handle side effects",
        "To create references"
      ],
      "correctAnswer": 1,
      "explanation": "useCallback returns a memoized version of a callback function, useful for preventing unnecessary re-renders of child components."
    },
    {
      "question": "What is React.memo()?",
      "options": [
        "A Hook for state management",
        "A higher-order component for memoization",
        "A lifecycle method",
        "A routing library"
      ],
      "correctAnswer": 1,
      "explanation": "React.memo() is a higher-order component that memoizes a component, preventing re-renders when props haven't changed."
    },
    {
      "question": "What are React Fragments?",
      "options": [
        "Broken components",
        "A way to group elements without adding extra nodes",
        "A type of hook",
        "A styling technique"
      ],
      "correctAnswer": 1,
      "explanation": "React Fragments let you group a list of children without adding extra nodes to the DOM. Use <></> or <React.Fragment>."
    },
    {
      "question": "What is the purpose of the children prop?",
      "options": [
        "To pass data to child components",
        "To pass JSX elements as content to a component",
        "To create child state",
        "To validate props"
      ],
      "correctAnswer": 1,
      "explanation": "The children prop allows you to pass JSX elements as content to a component, enabling composition patterns."
    },
    {
      "question": "What is a controlled component?",
      "options": [
        "A component with no state",
        "A form element whose value is controlled by React state",
        "A component that can't be modified",
        "A read-only component"
      ],
      "correctAnswer": 1,
      "explanation": "A controlled component is a form element whose value is controlled by React state. The component receives its value via props and updates via callbacks."
    },
    {
      "question": "What is the purpose of the useCallback dependency array?",
      "options": [
        "To store state",
        "To specify when the callback should be recreated",
        "To validate props",
        "To handle errors"
      ],
      "correctAnswer": 1,
      "explanation": "The dependency array in useCallback specifies which values the memoized function depends on. The callback is only recreated when these values change."
    },
    {
      "question": "What is React.lazy()?",
      "options": [
        "A hook for lazy state",
        "A function for code splitting and lazy loading",
        "A styling technique",
        "A testing utility"
      ],
      "correctAnswer": 1,
      "explanation": "React.lazy() allows you to dynamically import components for code splitting. It's used with Suspense for lazy loading components."
    },
    {
      "question": "What is the purpose of Suspense in React?",
      "options": [
        "To handle errors",
        "To display fallback content while waiting for lazy components",
        "To create suspense effects",
        "To validate forms"
      ],
      "correctAnswer": 1,
      "explanation": "Suspense lets components 'wait' for something before rendering. It's commonly used with React.lazy() to show fallback content while loading."
    },
    {
      "question": "What is the difference between state and props?",
      "options": [
        "No difference",
        "State is internal and mutable, props are external and immutable",
        "Props are internal and mutable, state is external and immutable",
        "State is for functions, props are for classes"
      ],
      "correctAnswer": 1,
      "explanation": "State is internal to a component and can be changed by the component itself. Props are passed from parent components and should not be modified by the receiving component."
    },
    {
      "question": "What is the purpose of the useEffect cleanup function?",
      "options": [
        "To clean up state",
        "To clean up side effects when component unmounts",
        "To validate props",
        "To reset the component"
      ],
      "correctAnswer": 1,
      "explanation": "The cleanup function returned from useEffect runs before the component unmounts or before the effect runs again. It's used to clean up subscriptions, timers, etc."
    }
  ],
  "HR Interview": [
    {
      "question": "What is the best way to answer 'Tell me about yourself'?",
      "options": [
        "Recite your entire resume",
        "Give a brief professional summary relevant to the role",
        "Talk about your hobbies only",
        "Say you don't know what to say"
      ],
      "correctAnswer": 1,
      "explanation": "Focus on your professional background, key skills, and relevant experiences. Keep it concise (2-3 minutes) and tailored to the role you're applying for."
    },
    {
      "question": "How should you respond to 'What are your weaknesses?'",
      "options": [
        "Say you have no weaknesses",
        "Mention a real weakness and how you're improving it",
        "Say you work too hard",
        "Make up a fake weakness"
      ],
      "correctAnswer": 1,
      "explanation": "Choose a genuine area for improvement that's not critical to the role. More importantly, explain the steps you're taking to improve. This shows self-awareness."
    },
    {
      "question": "What should you do if you don't know the answer to a question?",
      "options": [
        "Make up an answer",
        "Be honest and explain how you would find the answer",
        "Say it's not important",
        "Change the topic"
      ],
      "correctAnswer": 1,
      "explanation": "Be honest about not knowing, but demonstrate your problem-solving approach. Explain how you would research or approach finding the answer."
    },
    {
      "question": "How should you dress for a video interview?",
      "options": [
        "Casual clothes since it's virtual",
        "Professional attire as you would for in-person",
        "Pajamas are fine",
        "Whatever is comfortable"
      ],
      "correctAnswer": 1,
      "explanation": "Dress professionally as you would for an in-person interview. It shows respect and helps you get into the right mindset."
    },
    {
      "question": "What is the STAR method?",
      "options": [
        "A coding technique",
        "Situation, Task, Action, Result - for answering behavioral questions",
        "A time management method",
        "A project management framework"
      ],
      "correctAnswer": 1,
      "explanation": "STAR stands for Situation, Task, Action, Result. It's a structured way to answer behavioral questions by describing a specific situation and your actions."
    },
    {
      "question": "How should you handle a question about salary expectations?",
      "options": [
        "Give a specific number immediately",
        "Research market rates and give a range",
        "Say you don't care about salary",
        "Refuse to answer"
      ],
      "correctAnswer": 1,
      "explanation": "Research market rates for the role and location. Provide a reasonable range based on your experience and the company's size, showing flexibility."
    },
    {
      "question": "What should you do before an interview?",
      "options": [
        "Nothing, just show up",
        "Research the company and prepare questions",
        "Memorize your resume",
        "Practice lying"
      ],
      "correctAnswer": 1,
      "explanation": "Research the company's mission, values, products, and recent news. Prepare thoughtful questions to ask the interviewer."
    },
    {
      "question": "How should you answer 'Why do you want to work here?'",
      "options": [
        "Say you need a job",
        "Connect your values and goals with the company's mission",
        "Say the salary is good",
        "Say it's close to home"
      ],
      "correctAnswer": 1,
      "explanation": "Show you've researched the company and explain how your values, skills, and career goals align with their mission and culture."
    },
    {
      "question": "What is the best way to end an interview?",
      "options": [
        "Just leave",
        "Thank the interviewer and ask about next steps",
        "Ask about salary immediately",
        "Start negotiating"
      ],
      "correctAnswer": 1,
      "explanation": "Thank the interviewer for their time, reiterate your interest in the role, and ask about the next steps in the hiring process."
    },
    {
      "question": "How should you handle a stressful interview question?",
      "options": [
        "Get defensive",
        "Take a moment to think, then respond calmly",
        "Walk out",
        "Argue with the interviewer"
      ],
      "correctAnswer": 1,
      "explanation": "It's okay to take a moment to collect your thoughts. Stay calm, breathe, and respond thoughtfully rather than reactively."
    },
    {
      "question": "What should you include in a thank-you email after an interview?",
      "options": [
        "Nothing, it's not necessary",
        "Thank them, reiterate interest, and mention something specific from the interview",
        "Just say thanks",
        "Ask about salary again"
      ],
      "correctAnswer": 1,
      "explanation": "Send a thank-you email within 24 hours. Thank them for their time, reiterate your interest, and reference something specific from your conversation."
    },
    {
      "question": "How should you answer 'Where do you see yourself in 5 years?'",
      "options": [
        "Say you don't know",
        "Show ambition aligned with the company's growth",
        "Say you want their job",
        "Say you'll be retired"
      ],
      "correctAnswer": 1,
      "explanation": "Show ambition that aligns with the company. Discuss skill development, taking on more responsibility, and contributing to the organization's goals."
    },
    {
      "question": "What is the best way to discuss your strengths?",
      "options": [
        "List all your qualities",
        "Mention 2-3 relevant strengths with specific examples",
        "Say you have no weaknesses",
        "Talk about hobbies"
      ],
      "correctAnswer": 1,
      "explanation": "Choose 2-3 strengths relevant to the job and provide specific examples of how you've demonstrated them. This shows self-awareness and gives evidence."
    },
    {
      "question": "How should you handle questions about employment gaps?",
      "options": [
        "Lie about them",
        "Be honest and focus on what you learned or did during that time",
        "Say it's none of their business",
        "Get angry"
      ],
      "correctAnswer": 1,
      "explanation": "Be honest about gaps and focus on productive activities during that time - learning new skills, freelance work, personal projects, or family responsibilities."
    },
    {
      "question": "What should you do if you're running late for an interview?",
      "options": [
        "Just show up late",
        "Call or email as soon as possible to inform them",
        "Skip the interview",
        "Make up an excuse"
      ],
      "correctAnswer": 1,
      "explanation": "Contact the interviewer immediately, apologize, explain the situation briefly, and give an estimated arrival time. Offer to reschedule if necessary."
    },
    {
      "question": "How should you answer 'Why are you leaving your current job?'",
      "options": [
        "Badmouth your current employer",
        "Focus on seeking new opportunities and growth",
        "Say you hate your boss",
        "Say you're bored"
      ],
      "correctAnswer": 1,
      "explanation": "Stay positive and focus on what you're looking for in your next role - growth opportunities, new challenges, or alignment with your career goals."
    },
    {
      "question": "What is the best way to prepare for a behavioral interview?",
      "options": [
        "Don't prepare",
        "Prepare specific examples using the STAR method",
        "Memorize generic answers",
        "Read a book"
      ],
      "correctAnswer": 1,
      "explanation": "Prepare 5-7 specific examples from your experience that demonstrate different competencies. Use the STAR method to structure your answers."
    },
    {
      "question": "How should you handle a question you didn't understand?",
      "options": [
        "Pretend you understood",
        "Politely ask for clarification",
        "Give a random answer",
        "Say the question is wrong"
      ],
      "correctAnswer": 1,
      "explanation": "It's better to ask for clarification than to give an irrelevant answer. Say something like 'Could you please rephrase that question?'"
    },
    {
      "question": "What should you do after receiving a job offer?",
      "options": [
        "Accept immediately",
        "Thank them, ask for time to consider, and review the offer carefully",
        "Reject it immediately",
        "Start negotiating aggressively"
      ],
      "correctAnswer": 1,
      "explanation": "Thank them for the offer, express enthusiasm, and ask for a reasonable time to review the details. Consider salary, benefits, growth opportunities, and culture fit."
    },
    {
      "question": "How should you answer 'What motivates you?'",
      "options": [
        "Say money only",
        "Be authentic and mention professional growth, impact, or teamwork",
        "Say nothing motivates you",
        "Give a generic answer"
      ],
      "correctAnswer": 1,
      "explanation": "Be authentic but professional. Mention things like solving challenging problems, learning new skills, making an impact, or working with a great team."
    }
  ],
  "Node.js Developer": [
    {
      "question": "What is the best approach to solve a complex problem?",
      "options": [
        "Jump straight into coding",
        "Break it down into smaller parts and plan",
        "Ask someone else to do it",
        "Ignore it and hope it goes away"
      ],
      "correctAnswer": 1,
      "explanation": "Breaking complex problems into smaller, manageable parts makes them easier to solve. Planning before coding helps identify potential issues early."
    },
    {
      "question": "How do you handle working under pressure?",
      "options": [
        "Panic and rush",
        "Stay calm, prioritize tasks, and focus",
        "Give up",
        "Complain to colleagues"
      ],
      "correctAnswer": 1,
      "explanation": "Staying calm under pressure allows you to think clearly. Prioritizing tasks helps you focus on what's most important and manage your time effectively."
    },
    {
      "question": "What is the importance of code documentation?",
      "options": [
        "It's not important",
        "It helps others understand and maintain your code",
        "It slows down development",
        "Only managers need it"
      ],
      "correctAnswer": 1,
      "explanation": "Good documentation helps team members understand your code, makes maintenance easier, and serves as a reference for future development."
    },
    {
      "question": "How do you stay updated with technology trends?",
      "options": [
        "Ignore new technologies",
        "Read blogs, take courses, and practice new skills",
        "Wait for your company to train you",
        "Only learn when forced to"
      ],
      "correctAnswer": 1,
      "explanation": "Continuous learning is essential in tech. Reading blogs, taking online courses, attending meetups, and practicing new skills keeps you current."
    },
    {
      "question": "What is the best way to handle a disagreement with a teammate?",
      "options": [
        "Argue until you win",
        "Listen to their perspective and find a compromise",
        "Ignore them",
        "Tell the manager immediately"
      ],
      "correctAnswer": 1,
      "explanation": "Professional disagreements are normal. Listen actively to understand their perspective, explain your viewpoint clearly, and work together to find the best solution."
    },
    {
      "question": "What is agile methodology?",
      "options": [
        "A programming language",
        "An iterative approach to project management",
        "A type of database",
        "A testing framework"
      ],
      "correctAnswer": 1,
      "explanation": "Agile is an iterative approach to project management that focuses on delivering small, incremental improvements through collaboration and flexibility."
    },
    {
      "question": "How do you prioritize multiple tasks?",
      "options": [
        "Do whatever is easiest first",
        "Use a system like Eisenhower Matrix or prioritize by deadline and impact",
        "Ask your manager for every decision",
        "Work on random tasks"
      ],
      "correctAnswer": 1,
      "explanation": "Effective prioritization considers deadlines, impact, and dependencies. Methods like the Eisenhower Matrix help categorize tasks by urgency and importance."
    },
    {
      "question": "What is the importance of testing in software development?",
      "options": [
        "It's not important",
        "It ensures code quality and catches bugs early",
        "It slows down development",
        "Only QA should test"
      ],
      "correctAnswer": 1,
      "explanation": "Testing is crucial for catching bugs early, ensuring code quality, and preventing regressions. It saves time and money in the long run."
    },
    {
      "question": "How do you handle feedback on your work?",
      "options": [
        "Get defensive",
        "Listen openly and use it as a learning opportunity",
        "Ignore it",
        "Argue about it"
      ],
      "correctAnswer": 1,
      "explanation": "Constructive feedback is valuable for growth. Listen openly, ask clarifying questions, and use feedback to improve your skills and work quality."
    },
    {
      "question": "What is the best way to learn a new technology?",
      "options": [
        "Read the documentation only",
        "Combine theory with hands-on practice and projects",
        "Watch videos passively",
        "Wait for formal training"
      ],
      "correctAnswer": 1,
      "explanation": "The best learning combines understanding concepts (through documentation, courses) with hands-on practice. Building projects reinforces learning and builds confidence."
    },
    {
      "question": "What is version control used for?",
      "options": [
        "Controlling software versions",
        "Tracking changes in code and collaborating with teams",
        "Managing user access",
        "Deploying applications"
      ],
      "correctAnswer": 1,
      "explanation": "Version control systems like Git track changes in source code, enable collaboration, maintain history, and allow reverting to previous versions if needed."
    },
    {
      "question": "How do you ensure code quality?",
      "options": [
        "Write code quickly",
        "Follow best practices, write tests, and do code reviews",
        "Let QA find all bugs",
        "Copy code from the internet"
      ],
      "correctAnswer": 1,
      "explanation": "Code quality comes from following best practices, writing clean and readable code, conducting code reviews, and maintaining good test coverage."
    },
    {
      "question": "What is the purpose of a standup meeting?",
      "options": [
        "To stand while talking",
        "To quickly sync with the team on progress and blockers",
        "To have long discussions",
        "To assign all tasks for the day"
      ],
      "correctAnswer": 1,
      "explanation": "Standup meetings are short daily syncs where team members share what they did, what they'll do, and any blockers. They keep everyone aligned."
    },
    {
      "question": "How do you handle a bug in production?",
      "options": [
        "Ignore it",
        "Assess impact, communicate, fix, and prevent recurrence",
        "Blame someone else",
        "Panic"
      ],
      "correctAnswer": 1,
      "explanation": "Production bugs require a systematic approach: assess the impact, communicate with stakeholders, fix the issue, and implement measures to prevent recurrence."
    },
    {
      "question": "What is technical debt?",
      "options": [
        "Money owed for technology",
        "The cost of choosing easy solutions now over better approaches later",
        "Debt from buying computers",
        "A type of loan"
      ],
      "correctAnswer": 1,
      "explanation": "Technical debt is the implied cost of future rework when choosing an easy solution now instead of a better approach that would take longer. Some debt is acceptable but must be managed."
    },
    {
      "question": "How do you collaborate with non-technical team members?",
      "options": [
        "Use technical jargon",
        "Communicate clearly, avoid jargon, and focus on business value",
        "Ignore them",
        "Let them figure it out"
      ],
      "correctAnswer": 1,
      "explanation": "Effective collaboration with non-technical colleagues requires clear communication, avoiding jargon, and focusing on business outcomes rather than technical details."
    },
    {
      "question": "What is the importance of soft skills in tech?",
      "options": [
        "Not important at all",
        "Essential for teamwork, communication, and career growth",
        "Only needed for managers",
        "Technical skills are all that matter"
      ],
      "correctAnswer": 1,
      "explanation": "Soft skills like communication, teamwork, and problem-solving are crucial in tech. They enable effective collaboration and are often the differentiator for career advancement."
    },
    {
      "question": "How do you approach debugging?",
      "options": [
        "Randomly change code",
        "Systematically isolate the issue and test hypotheses",
        "Ask someone else immediately",
        "Rewrite everything"
      ],
      "correctAnswer": 1,
      "explanation": "Effective debugging involves understanding the expected behavior, reproducing the issue, isolating the cause systematically, and testing potential fixes."
    },
    {
      "question": "What is the role of a retrospective in agile?",
      "options": [
        "To assign blame",
        "To reflect on what went well and what can be improved",
        "To plan the next sprint",
        "To demo the product"
      ],
      "correctAnswer": 1,
      "explanation": "Retrospectives are meetings where the team reflects on the past sprint, discusses what went well, what didn't, and identifies improvements for the future."
    },
    {
      "question": "How do you handle competing priorities?",
      "options": [
        "Work on everything at once",
        "Communicate with stakeholders and negotiate realistic timelines",
        "Pick one and ignore the rest",
        "Work overtime on everything"
      ],
      "correctAnswer": 1,
      "explanation": "When facing competing priorities, communicate openly with stakeholders about capacity, negotiate realistic timelines, and focus on delivering the most valuable work first."
    }
  ],
  "Python Developer": [
    {
      "question": "What is the best approach to solve a complex problem?",
      "options": [
        "Jump straight into coding",
        "Break it down into smaller parts and plan",
        "Ask someone else to do it",
        "Ignore it and hope it goes away"
      ],
      "correctAnswer": 1,
      "explanation": "Breaking complex problems into smaller, manageable parts makes them easier to solve. Planning before coding helps identify potential issues early."
    },
    {
      "question": "How do you handle working under pressure?",
      "options": [
        "Panic and rush",
        "Stay calm, prioritize tasks, and focus",
        "Give up",
        "Complain to colleagues"
      ],
      "correctAnswer": 1,
      "explanation": "Staying calm under pressure allows you to think clearly. Prioritizing tasks helps you focus on what's most important and manage your time effectively."
    },
    {
      "question": "What is the importance of code documentation?",
      "options": [
        "It's not important",
        "It helps others understand and maintain your code",
        "It slows down development",
        "Only managers need it"
      ],
      "correctAnswer": 1,
      "explanation": "Good documentation helps team members understand your code, makes maintenance easier, and serves as a reference for future development."
    },
    {
      "question": "How do you stay updated with technology trends?",
      "options": [
        "Ignore new technologies",
        "Read blogs, take courses, and practice new skills",
        "Wait for your company to train you",
        "Only learn when forced to"
      ],
      "correctAnswer": 1,
      "explanation": "Continuous learning is essential in tech. Reading blogs, taking online courses, attending meetups, and practicing new skills keeps you current."
    },
    {
      "question": "What is the best way to handle a disagreement with a teammate?",
      "options": [
        "Argue until you win",
        "Listen to their perspective and find a compromise",
        "Ignore them",
        "Tell the manager immediately"
      ],
      "correctAnswer": 1,
      "explanation": "Professional disagreements are normal. Listen actively to understand their perspective, explain your viewpoint clearly, and work together to find the best solution."
    },
    {
      "question": "What is agile methodology?",
      "options": [
        "A programming language",
        "An iterative approach to project management",
        "A type of database",
        "A testing framework"
      ],
      "correctAnswer": 1,
      "explanation": "Agile is an iterative approach to project management that focuses on delivering small, incremental improvements through collaboration and flexibility."
    },
    {
      "question": "How do you prioritize multiple tasks?",
      "options": [
        "Do whatever is easiest first",
        "Use a system like Eisenhower Matrix or prioritize by deadline and impact",
        "Ask your manager for every decision",
        "Work on random tasks"
      ],
      "correctAnswer": 1,
      "explanation": "Effective prioritization considers deadlines, impact, and dependencies. Methods like the Eisenhower Matrix help categorize tasks by urgency and importance."
    },
    {
      "question": "What is the importance of testing in software development?",
      "options": [
        "It's not important",
        "It ensures code quality and catches bugs early",
        "It slows down development",
        "Only QA should test"
      ],
      "correctAnswer": 1,
      "explanation": "Testing is crucial for catching bugs early, ensuring code quality, and preventing regressions. It saves time and money in the long run."
    },
    {
      "question": "How do you handle feedback on your work?",
      "options": [
        "Get defensive",
        "Listen openly and use it as a learning opportunity",
        "Ignore it",
        "Argue about it"
      ],
      "correctAnswer": 1,
      "explanation": "Constructive feedback is valuable for growth. Listen openly, ask clarifying questions, and use feedback to improve your skills and work quality."
    },
    {
      "question": "What is the best way to learn a new technology?",
      "options": [
        "Read the documentation only",
        "Combine theory with hands-on practice and projects",
        "Watch videos passively",
        "Wait for formal training"
      ],
      "correctAnswer": 1,
      "explanation": "The best learning combines understanding concepts (through documentation, courses) with hands-on practice. Building projects reinforces learning and builds confidence."
    },
    {
      "question": "What is version control used for?",
      "options": [
        "Controlling software versions",
        "Tracking changes in code and collaborating with teams",
        "Managing user access",
        "Deploying applications"
      ],
      "correctAnswer": 1,
      "explanation": "Version control systems like Git track changes in source code, enable collaboration, maintain history, and allow reverting to previous versions if needed."
    },
    {
      "question": "How do you ensure code quality?",
      "options": [
        "Write code quickly",
        "Follow best practices, write tests, and do code reviews",
        "Let QA find all bugs",
        "Copy code from the internet"
      ],
      "correctAnswer": 1,
      "explanation": "Code quality comes from following best practices, writing clean and readable code, conducting code reviews, and maintaining good test coverage."
    },
    {
      "question": "What is the purpose of a standup meeting?",
      "options": [
        "To stand while talking",
        "To quickly sync with the team on progress and blockers",
        "To have long discussions",
        "To assign all tasks for the day"
      ],
      "correctAnswer": 1,
      "explanation": "Standup meetings are short daily syncs where team members share what they did, what they'll do, and any blockers. They keep everyone aligned."
    },
    {
      "question": "How do you handle a bug in production?",
      "options": [
        "Ignore it",
        "Assess impact, communicate, fix, and prevent recurrence",
        "Blame someone else",
        "Panic"
      ],
      "correctAnswer": 1,
      "explanation": "Production bugs require a systematic approach: assess the impact, communicate with stakeholders, fix the issue, and implement measures to prevent recurrence."
    },
    {
      "question": "What is technical debt?",
      "options": [
        "Money owed for technology",
        "The cost of choosing easy solutions now over better approaches later",
        "Debt from buying computers",
        "A type of loan"
      ],
      "correctAnswer": 1,
      "explanation": "Technical debt is the implied cost of future rework when choosing an easy solution now instead of a better approach that would take longer. Some debt is acceptable but must be managed."
    },
    {
      "question": "How do you collaborate with non-technical team members?",
      "options": [
        "Use technical jargon",
        "Communicate clearly, avoid jargon, and focus on business value",
        "Ignore them",
        "Let them figure it out"
      ],
      "correctAnswer": 1,
      "explanation": "Effective collaboration with non-technical colleagues requires clear communication, avoiding jargon, and focusing on business outcomes rather than technical details."
    },
    {
      "question": "What is the importance of soft skills in tech?",
      "options": [
        "Not important at all",
        "Essential for teamwork, communication, and career growth",
        "Only needed for managers",
        "Technical skills are all that matter"
      ],
      "correctAnswer": 1,
      "explanation": "Soft skills like communication, teamwork, and problem-solving are crucial in tech. They enable effective collaboration and are often the differentiator for career advancement."
    },
    {
      "question": "How do you approach debugging?",
      "options": [
        "Randomly change code",
        "Systematically isolate the issue and test hypotheses",
        "Ask someone else immediately",
        "Rewrite everything"
      ],
      "correctAnswer": 1,
      "explanation": "Effective debugging involves understanding the expected behavior, reproducing the issue, isolating the cause systematically, and testing potential fixes."
    },
    {
      "question": "What is the role of a retrospective in agile?",
      "options": [
        "To assign blame",
        "To reflect on what went well and what can be improved",
        "To plan the next sprint",
        "To demo the product"
      ],
      "correctAnswer": 1,
      "explanation": "Retrospectives are meetings where the team reflects on the past sprint, discusses what went well, what didn't, and identifies improvements for the future."
    },
    {
      "question": "How do you handle competing priorities?",
      "options": [
        "Work on everything at once",
        "Communicate with stakeholders and negotiate realistic timelines",
        "Pick one and ignore the rest",
        "Work overtime on everything"
      ],
      "correctAnswer": 1,
      "explanation": "When facing competing priorities, communicate openly with stakeholders about capacity, negotiate realistic timelines, and focus on delivering the most valuable work first."
    }
  ],
  "Java Developer": [
    {
      "question": "What is the best approach to solve a complex problem?",
      "options": [
        "Jump straight into coding",
        "Break it down into smaller parts and plan",
        "Ask someone else to do it",
        "Ignore it and hope it goes away"
      ],
      "correctAnswer": 1,
      "explanation": "Breaking complex problems into smaller, manageable parts makes them easier to solve. Planning before coding helps identify potential issues early."
    },
    {
      "question": "How do you handle working under pressure?",
      "options": [
        "Panic and rush",
        "Stay calm, prioritize tasks, and focus",
        "Give up",
        "Complain to colleagues"
      ],
      "correctAnswer": 1,
      "explanation": "Staying calm under pressure allows you to think clearly. Prioritizing tasks helps you focus on what's most important and manage your time effectively."
    },
    {
      "question": "What is the importance of code documentation?",
      "options": [
        "It's not important",
        "It helps others understand and maintain your code",
        "It slows down development",
        "Only managers need it"
      ],
      "correctAnswer": 1,
      "explanation": "Good documentation helps team members understand your code, makes maintenance easier, and serves as a reference for future development."
    },
    {
      "question": "How do you stay updated with technology trends?",
      "options": [
        "Ignore new technologies",
        "Read blogs, take courses, and practice new skills",
        "Wait for your company to train you",
        "Only learn when forced to"
      ],
      "correctAnswer": 1,
      "explanation": "Continuous learning is essential in tech. Reading blogs, taking online courses, attending meetups, and practicing new skills keeps you current."
    },
    {
      "question": "What is the best way to handle a disagreement with a teammate?",
      "options": [
        "Argue until you win",
        "Listen to their perspective and find a compromise",
        "Ignore them",
        "Tell the manager immediately"
      ],
      "correctAnswer": 1,
      "explanation": "Professional disagreements are normal. Listen actively to understand their perspective, explain your viewpoint clearly, and work together to find the best solution."
    },
    {
      "question": "What is agile methodology?",
      "options": [
        "A programming language",
        "An iterative approach to project management",
        "A type of database",
        "A testing framework"
      ],
      "correctAnswer": 1,
      "explanation": "Agile is an iterative approach to project management that focuses on delivering small, incremental improvements through collaboration and flexibility."
    },
    {
      "question": "How do you prioritize multiple tasks?",
      "options": [
        "Do whatever is easiest first",
        "Use a system like Eisenhower Matrix or prioritize by deadline and impact",
        "Ask your manager for every decision",
        "Work on random tasks"
      ],
      "correctAnswer": 1,
      "explanation": "Effective prioritization considers deadlines, impact, and dependencies. Methods like the Eisenhower Matrix help categorize tasks by urgency and importance."
    },
    {
      "question": "What is the importance of testing in software development?",
      "options": [
        "It's not important",
        "It ensures code quality and catches bugs early",
        "It slows down development",
        "Only QA should test"
      ],
      "correctAnswer": 1,
      "explanation": "Testing is crucial for catching bugs early, ensuring code quality, and preventing regressions. It saves time and money in the long run."
    },
    {
      "question": "How do you handle feedback on your work?",
      "options": [
        "Get defensive",
        "Listen openly and use it as a learning opportunity",
        "Ignore it",
        "Argue about it"
      ],
      "correctAnswer": 1,
      "explanation": "Constructive feedback is valuable for growth. Listen openly, ask clarifying questions, and use feedback to improve your skills and work quality."
    },
    {
      "question": "What is the best way to learn a new technology?",
      "options": [
        "Read the documentation only",
        "Combine theory with hands-on practice and projects",
        "Watch videos passively",
        "Wait for formal training"
      ],
      "correctAnswer": 1,
      "explanation": "The best learning combines understanding concepts (through documentation, courses) with hands-on practice. Building projects reinforces learning and builds confidence."
    },
    {
      "question": "What is version control used for?",
      "options": [
        "Controlling software versions",
        "Tracking changes in code and collaborating with teams",
        "Managing user access",
        "Deploying applications"
      ],
      "correctAnswer": 1,
      "explanation": "Version control systems like Git track changes in source code, enable collaboration, maintain history, and allow reverting to previous versions if needed."
    },
    {
      "question": "How do you ensure code quality?",
      "options": [
        "Write code quickly",
        "Follow best practices, write tests, and do code reviews",
        "Let QA find all bugs",
        "Copy code from the internet"
      ],
      "correctAnswer": 1,
      "explanation": "Code quality comes from following best practices, writing clean and readable code, conducting code reviews, and maintaining good test coverage."
    },
    {
      "question": "What is the purpose of a standup meeting?",
      "options": [
        "To stand while talking",
        "To quickly sync with the team on progress and blockers",
        "To have long discussions",
        "To assign all tasks for the day"
      ],
      "correctAnswer": 1,
      "explanation": "Standup meetings are short daily syncs where team members share what they did, what they'll do, and any blockers. They keep everyone aligned."
    },
    {
      "question": "How do you handle a bug in production?",
      "options": [
        "Ignore it",
        "Assess impact, communicate, fix, and prevent recurrence",
        "Blame someone else",
        "Panic"
      ],
      "correctAnswer": 1,
      "explanation": "Production bugs require a systematic approach: assess the impact, communicate with stakeholders, fix the issue, and implement measures to prevent recurrence."
    },
    {
      "question": "What is technical debt?",
      "options": [
        "Money owed for technology",
        "The cost of choosing easy solutions now over better approaches later",
        "Debt from buying computers",
        "A type of loan"
      ],
      "correctAnswer": 1,
      "explanation": "Technical debt is the implied cost of future rework when choosing an easy solution now instead of a better approach that would take longer. Some debt is acceptable but must be managed."
    },
    {
      "question": "How do you collaborate with non-technical team members?",
      "options": [
        "Use technical jargon",
        "Communicate clearly, avoid jargon, and focus on business value",
        "Ignore them",
        "Let them figure it out"
      ],
      "correctAnswer": 1,
      "explanation": "Effective collaboration with non-technical colleagues requires clear communication, avoiding jargon, and focusing on business outcomes rather than technical details."
    },
    {
      "question": "What is the importance of soft skills in tech?",
      "options": [
        "Not important at all",
        "Essential for teamwork, communication, and career growth",
        "Only needed for managers",
        "Technical skills are all that matter"
      ],
      "correctAnswer": 1,
      "explanation": "Soft skills like communication, teamwork, and problem-solving are crucial in tech. They enable effective collaboration and are often the differentiator for career advancement."
    },
    {
      "question": "How do you approach debugging?",
      "options": [
        "Randomly change code",
        "Systematically isolate the issue and test hypotheses",
        "Ask someone else immediately",
        "Rewrite everything"
      ],
      "correctAnswer": 1,
      "explanation": "Effective debugging involves understanding the expected behavior, reproducing the issue, isolating the cause systematically, and testing potential fixes."
    },
    {
      "question": "What is the role of a retrospective in agile?",
      "options": [
        "To assign blame",
        "To reflect on what went well and what can be improved",
        "To plan the next sprint",
        "To demo the product"
      ],
      "correctAnswer": 1,
      "explanation": "Retrospectives are meetings where the team reflects on the past sprint, discusses what went well, what didn't, and identifies improvements for the future."
    },
    {
      "question": "How do you handle competing priorities?",
      "options": [
        "Work on everything at once",
        "Communicate with stakeholders and negotiate realistic timelines",
        "Pick one and ignore the rest",
        "Work overtime on everything"
      ],
      "correctAnswer": 1,
      "explanation": "When facing competing priorities, communicate openly with stakeholders about capacity, negotiate realistic timelines, and focus on delivering the most valuable work first."
    }
  ],
  "DevOps Engineer": [
    {
      "question": "What is the best approach to solve a complex problem?",
      "options": [
        "Jump straight into coding",
        "Break it down into smaller parts and plan",
        "Ask someone else to do it",
        "Ignore it and hope it goes away"
      ],
      "correctAnswer": 1,
      "explanation": "Breaking complex problems into smaller, manageable parts makes them easier to solve. Planning before coding helps identify potential issues early."
    },
    {
      "question": "How do you handle working under pressure?",
      "options": [
        "Panic and rush",
        "Stay calm, prioritize tasks, and focus",
        "Give up",
        "Complain to colleagues"
      ],
      "correctAnswer": 1,
      "explanation": "Staying calm under pressure allows you to think clearly. Prioritizing tasks helps you focus on what's most important and manage your time effectively."
    },
    {
      "question": "What is the importance of code documentation?",
      "options": [
        "It's not important",
        "It helps others understand and maintain your code",
        "It slows down development",
        "Only managers need it"
      ],
      "correctAnswer": 1,
      "explanation": "Good documentation helps team members understand your code, makes maintenance easier, and serves as a reference for future development."
    },
    {
      "question": "How do you stay updated with technology trends?",
      "options": [
        "Ignore new technologies",
        "Read blogs, take courses, and practice new skills",
        "Wait for your company to train you",
        "Only learn when forced to"
      ],
      "correctAnswer": 1,
      "explanation": "Continuous learning is essential in tech. Reading blogs, taking online courses, attending meetups, and practicing new skills keeps you current."
    },
    {
      "question": "What is the best way to handle a disagreement with a teammate?",
      "options": [
        "Argue until you win",
        "Listen to their perspective and find a compromise",
        "Ignore them",
        "Tell the manager immediately"
      ],
      "correctAnswer": 1,
      "explanation": "Professional disagreements are normal. Listen actively to understand their perspective, explain your viewpoint clearly, and work together to find the best solution."
    },
    {
      "question": "What is agile methodology?",
      "options": [
        "A programming language",
        "An iterative approach to project management",
        "A type of database",
        "A testing framework"
      ],
      "correctAnswer": 1,
      "explanation": "Agile is an iterative approach to project management that focuses on delivering small, incremental improvements through collaboration and flexibility."
    },
    {
      "question": "How do you prioritize multiple tasks?",
      "options": [
        "Do whatever is easiest first",
        "Use a system like Eisenhower Matrix or prioritize by deadline and impact",
        "Ask your manager for every decision",
        "Work on random tasks"
      ],
      "correctAnswer": 1,
      "explanation": "Effective prioritization considers deadlines, impact, and dependencies. Methods like the Eisenhower Matrix help categorize tasks by urgency and importance."
    },
    {
      "question": "What is the importance of testing in software development?",
      "options": [
        "It's not important",
        "It ensures code quality and catches bugs early",
        "It slows down development",
        "Only QA should test"
      ],
      "correctAnswer": 1,
      "explanation": "Testing is crucial for catching bugs early, ensuring code quality, and preventing regressions. It saves time and money in the long run."
    },
    {
      "question": "How do you handle feedback on your work?",
      "options": [
        "Get defensive",
        "Listen openly and use it as a learning opportunity",
        "Ignore it",
        "Argue about it"
      ],
      "correctAnswer": 1,
      "explanation": "Constructive feedback is valuable for growth. Listen openly, ask clarifying questions, and use feedback to improve your skills and work quality."
    },
    {
      "question": "What is the best way to learn a new technology?",
      "options": [
        "Read the documentation only",
        "Combine theory with hands-on practice and projects",
        "Watch videos passively",
        "Wait for formal training"
      ],
      "correctAnswer": 1,
      "explanation": "The best learning combines understanding concepts (through documentation, courses) with hands-on practice. Building projects reinforces learning and builds confidence."
    },
    {
      "question": "What is version control used for?",
      "options": [
        "Controlling software versions",
        "Tracking changes in code and collaborating with teams",
        "Managing user access",
        "Deploying applications"
      ],
      "correctAnswer": 1,
      "explanation": "Version control systems like Git track changes in source code, enable collaboration, maintain history, and allow reverting to previous versions if needed."
    },
    {
      "question": "How do you ensure code quality?",
      "options": [
        "Write code quickly",
        "Follow best practices, write tests, and do code reviews",
        "Let QA find all bugs",
        "Copy code from the internet"
      ],
      "correctAnswer": 1,
      "explanation": "Code quality comes from following best practices, writing clean and readable code, conducting code reviews, and maintaining good test coverage."
    },
    {
      "question": "What is the purpose of a standup meeting?",
      "options": [
        "To stand while talking",
        "To quickly sync with the team on progress and blockers",
        "To have long discussions",
        "To assign all tasks for the day"
      ],
      "correctAnswer": 1,
      "explanation": "Standup meetings are short daily syncs where team members share what they did, what they'll do, and any blockers. They keep everyone aligned."
    },
    {
      "question": "How do you handle a bug in production?",
      "options": [
        "Ignore it",
        "Assess impact, communicate, fix, and prevent recurrence",
        "Blame someone else",
        "Panic"
      ],
      "correctAnswer": 1,
      "explanation": "Production bugs require a systematic approach: assess the impact, communicate with stakeholders, fix the issue, and implement measures to prevent recurrence."
    },
    {
      "question": "What is technical debt?",
      "options": [
        "Money owed for technology",
        "The cost of choosing easy solutions now over better approaches later",
        "Debt from buying computers",
        "A type of loan"
      ],
      "correctAnswer": 1,
      "explanation": "Technical debt is the implied cost of future rework when choosing an easy solution now instead of a better approach that would take longer. Some debt is acceptable but must be managed."
    },
    {
      "question": "How do you collaborate with non-technical team members?",
      "options": [
        "Use technical jargon",
        "Communicate clearly, avoid jargon, and focus on business value",
        "Ignore them",
        "Let them figure it out"
      ],
      "correctAnswer": 1,
      "explanation": "Effective collaboration with non-technical colleagues requires clear communication, avoiding jargon, and focusing on business outcomes rather than technical details."
    },
    {
      "question": "What is the importance of soft skills in tech?",
      "options": [
        "Not important at all",
        "Essential for teamwork, communication, and career growth",
        "Only needed for managers",
        "Technical skills are all that matter"
      ],
      "correctAnswer": 1,
      "explanation": "Soft skills like communication, teamwork, and problem-solving are crucial in tech. They enable effective collaboration and are often the differentiator for career advancement."
    },
    {
      "question": "How do you approach debugging?",
      "options": [
        "Randomly change code",
        "Systematically isolate the issue and test hypotheses",
        "Ask someone else immediately",
        "Rewrite everything"
      ],
      "correctAnswer": 1,
      "explanation": "Effective debugging involves understanding the expected behavior, reproducing the issue, isolating the cause systematically, and testing potential fixes."
    },
    {
      "question": "What is the role of a retrospective in agile?",
      "options": [
        "To assign blame",
        "To reflect on what went well and what can be improved",
        "To plan the next sprint",
        "To demo the product"
      ],
      "correctAnswer": 1,
      "explanation": "Retrospectives are meetings where the team reflects on the past sprint, discusses what went well, what didn't, and identifies improvements for the future."
    },
    {
      "question": "How do you handle competing priorities?",
      "options": [
        "Work on everything at once",
        "Communicate with stakeholders and negotiate realistic timelines",
        "Pick one and ignore the rest",
        "Work overtime on everything"
      ],
      "correctAnswer": 1,
      "explanation": "When facing competing priorities, communicate openly with stakeholders about capacity, negotiate realistic timelines, and focus on delivering the most valuable work first."
    }
  ],
  "Data Analyst": [
    {
      "question": "What is the best approach to solve a complex problem?",
      "options": [
        "Jump straight into coding",
        "Break it down into smaller parts and plan",
        "Ask someone else to do it",
        "Ignore it and hope it goes away"
      ],
      "correctAnswer": 1,
      "explanation": "Breaking complex problems into smaller, manageable parts makes them easier to solve. Planning before coding helps identify potential issues early."
    },
    {
      "question": "How do you handle working under pressure?",
      "options": [
        "Panic and rush",
        "Stay calm, prioritize tasks, and focus",
        "Give up",
        "Complain to colleagues"
      ],
      "correctAnswer": 1,
      "explanation": "Staying calm under pressure allows you to think clearly. Prioritizing tasks helps you focus on what's most important and manage your time effectively."
    },
    {
      "question": "What is the importance of code documentation?",
      "options": [
        "It's not important",
        "It helps others understand and maintain your code",
        "It slows down development",
        "Only managers need it"
      ],
      "correctAnswer": 1,
      "explanation": "Good documentation helps team members understand your code, makes maintenance easier, and serves as a reference for future development."
    },
    {
      "question": "How do you stay updated with technology trends?",
      "options": [
        "Ignore new technologies",
        "Read blogs, take courses, and practice new skills",
        "Wait for your company to train you",
        "Only learn when forced to"
      ],
      "correctAnswer": 1,
      "explanation": "Continuous learning is essential in tech. Reading blogs, taking online courses, attending meetups, and practicing new skills keeps you current."
    },
    {
      "question": "What is the best way to handle a disagreement with a teammate?",
      "options": [
        "Argue until you win",
        "Listen to their perspective and find a compromise",
        "Ignore them",
        "Tell the manager immediately"
      ],
      "correctAnswer": 1,
      "explanation": "Professional disagreements are normal. Listen actively to understand their perspective, explain your viewpoint clearly, and work together to find the best solution."
    },
    {
      "question": "What is agile methodology?",
      "options": [
        "A programming language",
        "An iterative approach to project management",
        "A type of database",
        "A testing framework"
      ],
      "correctAnswer": 1,
      "explanation": "Agile is an iterative approach to project management that focuses on delivering small, incremental improvements through collaboration and flexibility."
    },
    {
      "question": "How do you prioritize multiple tasks?",
      "options": [
        "Do whatever is easiest first",
        "Use a system like Eisenhower Matrix or prioritize by deadline and impact",
        "Ask your manager for every decision",
        "Work on random tasks"
      ],
      "correctAnswer": 1,
      "explanation": "Effective prioritization considers deadlines, impact, and dependencies. Methods like the Eisenhower Matrix help categorize tasks by urgency and importance."
    },
    {
      "question": "What is the importance of testing in software development?",
      "options": [
        "It's not important",
        "It ensures code quality and catches bugs early",
        "It slows down development",
        "Only QA should test"
      ],
      "correctAnswer": 1,
      "explanation": "Testing is crucial for catching bugs early, ensuring code quality, and preventing regressions. It saves time and money in the long run."
    },
    {
      "question": "How do you handle feedback on your work?",
      "options": [
        "Get defensive",
        "Listen openly and use it as a learning opportunity",
        "Ignore it",
        "Argue about it"
      ],
      "correctAnswer": 1,
      "explanation": "Constructive feedback is valuable for growth. Listen openly, ask clarifying questions, and use feedback to improve your skills and work quality."
    },
    {
      "question": "What is the best way to learn a new technology?",
      "options": [
        "Read the documentation only",
        "Combine theory with hands-on practice and projects",
        "Watch videos passively",
        "Wait for formal training"
      ],
      "correctAnswer": 1,
      "explanation": "The best learning combines understanding concepts (through documentation, courses) with hands-on practice. Building projects reinforces learning and builds confidence."
    },
    {
      "question": "What is version control used for?",
      "options": [
        "Controlling software versions",
        "Tracking changes in code and collaborating with teams",
        "Managing user access",
        "Deploying applications"
      ],
      "correctAnswer": 1,
      "explanation": "Version control systems like Git track changes in source code, enable collaboration, maintain history, and allow reverting to previous versions if needed."
    },
    {
      "question": "How do you ensure code quality?",
      "options": [
        "Write code quickly",
        "Follow best practices, write tests, and do code reviews",
        "Let QA find all bugs",
        "Copy code from the internet"
      ],
      "correctAnswer": 1,
      "explanation": "Code quality comes from following best practices, writing clean and readable code, conducting code reviews, and maintaining good test coverage."
    },
    {
      "question": "What is the purpose of a standup meeting?",
      "options": [
        "To stand while talking",
        "To quickly sync with the team on progress and blockers",
        "To have long discussions",
        "To assign all tasks for the day"
      ],
      "correctAnswer": 1,
      "explanation": "Standup meetings are short daily syncs where team members share what they did, what they'll do, and any blockers. They keep everyone aligned."
    },
    {
      "question": "How do you handle a bug in production?",
      "options": [
        "Ignore it",
        "Assess impact, communicate, fix, and prevent recurrence",
        "Blame someone else",
        "Panic"
      ],
      "correctAnswer": 1,
      "explanation": "Production bugs require a systematic approach: assess the impact, communicate with stakeholders, fix the issue, and implement measures to prevent recurrence."
    },
    {
      "question": "What is technical debt?",
      "options": [
        "Money owed for technology",
        "The cost of choosing easy solutions now over better approaches later",
        "Debt from buying computers",
        "A type of loan"
      ],
      "correctAnswer": 1,
      "explanation": "Technical debt is the implied cost of future rework when choosing an easy solution now instead of a better approach that would take longer. Some debt is acceptable but must be managed."
    },
    {
      "question": "How do you collaborate with non-technical team members?",
      "options": [
        "Use technical jargon",
        "Communicate clearly, avoid jargon, and focus on business value",
        "Ignore them",
        "Let them figure it out"
      ],
      "correctAnswer": 1,
      "explanation": "Effective collaboration with non-technical colleagues requires clear communication, avoiding jargon, and focusing on business outcomes rather than technical details."
    },
    {
      "question": "What is the importance of soft skills in tech?",
      "options": [
        "Not important at all",
        "Essential for teamwork, communication, and career growth",
        "Only needed for managers",
        "Technical skills are all that matter"
      ],
      "correctAnswer": 1,
      "explanation": "Soft skills like communication, teamwork, and problem-solving are crucial in tech. They enable effective collaboration and are often the differentiator for career advancement."
    },
    {
      "question": "How do you approach debugging?",
      "options": [
        "Randomly change code",
        "Systematically isolate the issue and test hypotheses",
        "Ask someone else immediately",
        "Rewrite everything"
      ],
      "correctAnswer": 1,
      "explanation": "Effective debugging involves understanding the expected behavior, reproducing the issue, isolating the cause systematically, and testing potential fixes."
    },
    {
      "question": "What is the role of a retrospective in agile?",
      "options": [
        "To assign blame",
        "To reflect on what went well and what can be improved",
        "To plan the next sprint",
        "To demo the product"
      ],
      "correctAnswer": 1,
      "explanation": "Retrospectives are meetings where the team reflects on the past sprint, discusses what went well, what didn't, and identifies improvements for the future."
    },
    {
      "question": "How do you handle competing priorities?",
      "options": [
        "Work on everything at once",
        "Communicate with stakeholders and negotiate realistic timelines",
        "Pick one and ignore the rest",
        "Work overtime on everything"
      ],
      "correctAnswer": 1,
      "explanation": "When facing competing priorities, communicate openly with stakeholders about capacity, negotiate realistic timelines, and focus on delivering the most valuable work first."
    }
  ]
};

const ROLES = Object.keys(FALLBACK_QUESTIONS);

function getFallbackQuestions(role) {
  return FALLBACK_QUESTIONS[role] || null;
}

module.exports = { FALLBACK_QUESTIONS, ROLES, getFallbackQuestions };
