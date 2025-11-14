export type Difficulty = "fácil" | "medio" | "difícil";

export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export interface QuizData {
  [key: string]: Question[];
}

export const quizData: QuizData = {
  fácil: [
    {
      id: 1,
      question: "¿Qué es TypeScript?",
      options: [
        "Un framework de JavaScript",
        "Un superset de JavaScript que añade tipos estáticos",
        "Una biblioteca de React",
        "Un gestor de paquetes"
      ],
      correctIndex: 1
    },
    {
      id: 2,
      question: "¿Qué significa CSS?",
      options: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style System",
        "Coded Style Syntax"
      ],
      correctIndex: 1
    },
    {
      id: 3,
      question: "¿Cuál es el método de array que crea un nuevo array con los elementos que pasan una prueba?",
      options: [
        "map()",
        "filter()",
        "reduce()",
        "forEach()"
      ],
      correctIndex: 1
    },
    {
      id: 4,
      question: "¿Qué hace el operador '===' en JavaScript?",
      options: [
        "Compara valores sin verificar tipos",
        "Compara valores y tipos (igualdad estricta)",
        "Asigna un valor a una variable",
        "Compara solo tipos"
      ],
      correctIndex: 1
    },
    {
      id: 5,
      question: "¿Qué es React?",
      options: [
        "Un lenguaje de programación",
        "Una biblioteca de JavaScript para construir interfaces de usuario",
        "Un servidor web",
        "Una base de datos"
      ],
      correctIndex: 1
    }
  ],
  medio: [
    {
      id: 1,
      question: "¿Qué es el Virtual DOM en React?",
      options: [
        "Un DOM real renderizado en el navegador",
        "Una representación en memoria del DOM que React usa para optimizar actualizaciones",
        "Un plugin de navegador",
        "Una herramienta de debugging"
      ],
      correctIndex: 1
    },
    {
      id: 2,
      question: "¿Qué hook de React se usa para manejar efectos secundarios?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useReducer"
      ],
      correctIndex: 1
    },
    {
      id: 3,
      question: "¿Qué es Server-Side Rendering (SSR)?",
      options: [
        "Renderizar componentes en el cliente",
        "Renderizar páginas en el servidor antes de enviarlas al cliente",
        "Un método de almacenamiento",
        "Una técnica de optimización de imágenes"
      ],
      correctIndex: 1
    },
    {
      id: 4,
      question: "¿Qué hace 'useMemo' en React?",
      options: [
        "Memoriza un valor calculado para evitar recálculos innecesarios",
        "Memoriza una función",
        "Crea un nuevo componente",
        "Actualiza el estado"
      ],
      correctIndex: 0
    },
    {
      id: 5,
      question: "¿Qué es el patrón de diseño 'Higher-Order Component' (HOC)?",
      options: [
        "Un componente que renderiza otros componentes",
        "Una función que toma un componente y devuelve un nuevo componente",
        "Un componente de orden superior en la jerarquía",
        "Un componente con múltiples props"
      ],
      correctIndex: 1
    }
  ],
  difícil: [
    {
      id: 1,
      question: "¿Qué es el 'hydration' en Next.js?",
      options: [
        "El proceso de convertir HTML estático en una aplicación React interactiva",
        "Un método de hidratación de datos",
        "Una técnica de optimización de imágenes",
        "Un proceso de autenticación"
      ],
      correctIndex: 0
    },
    {
      id: 2,
      question: "¿Qué diferencia hay entre 'useCallback' y 'useMemo'?",
      options: [
        "useCallback memoriza funciones, useMemo memoriza valores",
        "No hay diferencia",
        "useCallback es para valores, useMemo para funciones",
        "Ambos memorizan funciones"
      ],
      correctIndex: 0
    },
    {
      id: 3,
      question: "¿Qué es 'code splitting'?",
      options: [
        "Dividir código en múltiples archivos",
        "Dividir el código de la aplicación en chunks más pequeños que se cargan bajo demanda",
        "Separar código por lenguajes",
        "Una técnica de minificación"
      ],
      correctIndex: 1
    },
    {
      id: 4,
      question: "¿Qué es el 'Suspense' en React?",
      options: [
        "Un componente que permite mostrar un fallback mientras se carga contenido asíncrono",
        "Un método de manejo de errores",
        "Un hook para estados de carga",
        "Una técnica de optimización"
      ],
      correctIndex: 0
    },
    {
      id: 5,
      question: "¿Qué es 'Streaming SSR' en Next.js 13+?",
      options: [
        "Transmitir HTML en chunks mientras se renderiza en el servidor",
        "Un método de streaming de video",
        "Una técnica de caché",
        "Un protocolo de red"
      ],
      correctIndex: 0
    }
  ]
};

