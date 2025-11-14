export type Difficulty = "fácil" | "medio" | "difícil";
export type Language = "es" | "en";

export interface Question {
  id: number;
  question: { en: string; es: string };
  options: { en: [string, string, string, string]; es: [string, string, string, string] };
  correctIndex: number;
}

export interface QuizData {
  [key: string]: Question[];
}

// Función helper para obtener pregunta en el idioma correcto
export function getQuestionText(question: Question, language: Language): string {
  return question.question[language];
}

export function getQuestionOptions(question: Question, language: Language): [string, string, string, string] {
  return question.options[language];
}

// Función para aleatorizar el orden de las preguntas
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Genera un orden determinístico de opciones por pregunta y sala
export function getOptionOrder(questionId: number, roomCode: string): number[] {
  const order = [0, 1, 2, 3];
  let seed = roomCode
    .split("")
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
  seed += questionId * 31;

  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  return order;
}

export const quizData: QuizData = {
  fácil: [
    {
      id: 1,
      question: {
        en: "What is Cursor?",
        es: "¿Qué es Cursor?"
      },
      options: {
        en: [
          "A web browser",
          "An AI-powered code editor based on VS Code",
          "A database management tool",
          "A version control system"
        ],
        es: [
          "Un navegador web",
          "Un editor de código con IA basado en VS Code",
          "Una herramienta de gestión de bases de datos",
          "Un sistema de control de versiones"
        ]
      },
      correctIndex: 1
    },
    {
      id: 2,
      question: {
        en: "What is the main feature that makes Cursor different from other code editors?",
        es: "¿Cuál es la característica principal que diferencia a Cursor de otros editores de código?"
      },
      options: {
        en: [
          "Syntax highlighting",
          "AI-powered code completion and chat",
          "File explorer",
          "Terminal integration"
        ],
        es: [
          "Resaltado de sintaxis",
          "Autocompletado y chat con IA",
          "Explorador de archivos",
          "Integración de terminal"
        ]
      },
      correctIndex: 1
    },
    {
      id: 3,
      question: {
        en: "How do you open the AI chat in Cursor?",
        es: "¿Cómo abres el chat de IA en Cursor?"
      },
      options: {
        en: [
          "Press Ctrl+Shift+P",
          "Press Ctrl+L or Cmd+L",
          "Press Ctrl+K or Cmd+K",
          "Press Ctrl+J or Cmd+J"
        ],
        es: [
          "Presiona Ctrl+Shift+P",
          "Presiona Ctrl+L o Cmd+L",
          "Presiona Ctrl+K o Cmd+K",
          "Presiona Ctrl+J o Cmd+J"
        ]
      },
      correctIndex: 1
    },
    {
      id: 4,
      question: {
        en: "What does 'Composer' refer to in Cursor?",
        es: "¿A qué se refiere 'Composer' en Cursor?"
      },
      options: {
        en: [
          "A music player",
          "A feature for editing multiple files with AI",
          "A code formatter",
          "A theme editor"
        ],
        es: [
          "Un reproductor de música",
          "Una función para editar múltiples archivos con IA",
          "Un formateador de código",
          "Un editor de temas"
        ]
      },
      correctIndex: 1
    },
    {
      id: 5,
      question: {
        en: "What keyboard shortcut opens inline AI suggestions in Cursor?",
        es: "¿Qué atajo de teclado abre sugerencias de IA en línea en Cursor?"
      },
      options: {
        en: [
          "Ctrl+Space",
          "Ctrl+K or Cmd+K",
          "Ctrl+Enter",
          "Ctrl+Shift+K"
        ],
        es: [
          "Ctrl+Space",
          "Ctrl+K o Cmd+K",
          "Ctrl+Enter",
          "Ctrl+Shift+K"
        ]
      },
      correctIndex: 1
    }
  ],
  medio: [
    {
      id: 1,
      question: {
        en: "What is 'Tab' in Cursor?",
        es: "¿Qué es 'Tab' en Cursor?"
      },
      options: {
        en: [
          "A browser tab",
          "AI-powered autocomplete that suggests code as you type",
          "A file tab",
          "A keyboard key"
        ],
        es: [
          "Una pestaña del navegador",
          "Autocompletado con IA que sugiere código mientras escribes",
          "Una pestaña de archivo",
          "Una tecla del teclado"
        ]
      },
      correctIndex: 1
    },
    {
      id: 2,
      question: {
        en: "How can you use Cursor to refactor code across multiple files?",
        es: "¿Cómo puedes usar Cursor para refactorizar código en múltiples archivos?"
      },
      options: {
        en: [
          "Using the Find and Replace feature",
          "Using Composer with @-mentions to reference multiple files",
          "Manually editing each file",
          "Using Git commands"
        ],
        es: [
          "Usando la función Buscar y Reemplazar",
          "Usando Composer con @-menciones para referenciar múltiples archivos",
          "Editando manualmente cada archivo",
          "Usando comandos de Git"
        ]
      },
      correctIndex: 1
    },
    {
      id: 3,
      question: {
        en: "What does the '@' symbol do in Cursor's chat?",
        es: "¿Qué hace el símbolo '@' en el chat de Cursor?"
      },
      options: {
        en: [
          "Mentions a user",
          "References files, folders, or code selections in your workspace",
          "Creates a comment",
          "Opens the command palette"
        ],
        es: [
          "Menciona a un usuario",
          "Referencia archivos, carpetas o selecciones de código en tu workspace",
          "Crea un comentario",
          "Abre la paleta de comandos"
        ]
      },
      correctIndex: 1
    },
    {
      id: 4,
      question: {
        en: "What is 'Cmd+K' (or Ctrl+K) used for in Cursor?",
        es: "¿Para qué se usa 'Cmd+K' (o Ctrl+K) en Cursor?"
      },
      options: {
        en: [
          "Opening the terminal",
          "Triggering inline AI edits in the current file",
          "Saving the file",
          "Closing the editor"
        ],
        es: [
          "Abrir la terminal",
          "Activar ediciones de IA en línea en el archivo actual",
          "Guardar el archivo",
          "Cerrar el editor"
        ]
      },
      correctIndex: 1
    },
    {
      id: 5,
      question: {
        en: "How does Cursor's AI understand your codebase context?",
        es: "¿Cómo entiende la IA de Cursor el contexto de tu código?"
      },
      options: {
        en: [
          "By reading all files at once",
          "By using embeddings and semantic search to find relevant code",
          "By asking you questions",
          "By analyzing Git history only"
        ],
        es: [
          "Leyendo todos los archivos a la vez",
          "Usando embeddings y búsqueda semántica para encontrar código relevante",
          "Haciéndote preguntas",
          "Analizando solo el historial de Git"
        ]
      },
      correctIndex: 1
    }
  ],
  difícil: [
    {
      id: 1,
      question: {
        en: "What is the difference between Cursor's 'Chat' and 'Composer' features?",
        es: "¿Cuál es la diferencia entre las funciones 'Chat' y 'Composer' de Cursor?"
      },
      options: {
        en: [
          "Chat is for single files, Composer is for multiple files",
          "Chat provides conversational assistance, Composer allows multi-file editing with AI",
          "There is no difference",
          "Chat is free, Composer requires payment"
        ],
        es: [
          "Chat es para archivos individuales, Composer es para múltiples archivos",
          "Chat proporciona asistencia conversacional, Composer permite edición multi-archivo con IA",
          "No hay diferencia",
          "Chat es gratis, Composer requiere pago"
        ]
      },
      correctIndex: 1
    },
    {
      id: 2,
      question: {
        en: "How does Cursor's AI handle code context when you use @-mentions?",
        es: "¿Cómo maneja la IA de Cursor el contexto del código cuando usas @-menciones?"
      },
      options: {
        en: [
          "It reads the entire file",
          "It uses semantic search to find relevant code sections and includes them in the context",
          "It only reads the first 100 lines",
          "It requires manual code selection"
        ],
        es: [
          "Lee todo el archivo",
          "Usa búsqueda semántica para encontrar secciones de código relevantes e incluirlas en el contexto",
          "Solo lee las primeras 100 líneas",
          "Requiere selección manual de código"
        ]
      },
      correctIndex: 1
    },
    {
      id: 3,
      question: {
        en: "What is 'Agent Mode' in Cursor?",
        es: "¿Qué es el 'Modo Agente' en Cursor?"
      },
      options: {
        en: [
          "A debugging tool",
          "A feature where AI can autonomously make changes across your codebase",
          "A code formatter",
          "A terminal emulator"
        ],
        es: [
          "Una herramienta de depuración",
          "Una función donde la IA puede hacer cambios autónomamente en tu código",
          "Un formateador de código",
          "Un emulador de terminal"
        ]
      },
      correctIndex: 1
    },
    {
      id: 4,
      question: {
        en: "How can you prevent Cursor from accessing certain files or folders?",
        es: "¿Cómo puedes evitar que Cursor acceda a ciertos archivos o carpetas?"
      },
      options: {
        en: [
          "Using .cursorignore file",
          "Using .gitignore file",
          "Using .cursorignore or .gitignore file",
          "There is no way to exclude files"
        ],
        es: [
          "Usando el archivo .cursorignore",
          "Usando el archivo .gitignore",
          "Usando .cursorignore o .gitignore",
          "No hay forma de excluir archivos"
        ]
      },
      correctIndex: 2
    },
    {
      id: 5,
      question: {
        en: "What is the purpose of Cursor's 'Rules' feature?",
        es: "¿Cuál es el propósito de la función 'Rules' de Cursor?"
      },
      options: {
        en: [
          "To enforce code style",
          "To provide custom instructions and guidelines for the AI to follow",
          "To validate syntax",
          "To manage keyboard shortcuts"
        ],
        es: [
          "Para hacer cumplir el estilo de código",
          "Para proporcionar instrucciones y guías personalizadas para que la IA siga",
          "Para validar la sintaxis",
          "Para gestionar atajos de teclado"
        ]
      },
      correctIndex: 1
    }
  ]
};
