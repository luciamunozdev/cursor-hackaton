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
      question: "What is Cursor?",
      options: [
        "A web browser",
        "An AI-powered code editor based on VS Code",
        "A database management tool",
        "A version control system"
      ],
      correctIndex: 1
    },
    {
      id: 2,
      question: "What is the main feature that makes Cursor different from other code editors?",
      options: [
        "Syntax highlighting",
        "AI-powered code completion and chat",
        "File explorer",
        "Terminal integration"
      ],
      correctIndex: 1
    },
    {
      id: 3,
      question: "How do you open the AI chat in Cursor?",
      options: [
        "Press Ctrl+Shift+P",
        "Press Ctrl+L or Cmd+L",
        "Press Ctrl+K or Cmd+K",
        "Press Ctrl+J or Cmd+J"
      ],
      correctIndex: 1
    },
    {
      id: 4,
      question: "What does 'Composer' refer to in Cursor?",
      options: [
        "A music player",
        "A feature for editing multiple files with AI",
        "A code formatter",
        "A theme editor"
      ],
      correctIndex: 1
    },
    {
      id: 5,
      question: "What keyboard shortcut opens inline AI suggestions in Cursor?",
      options: [
        "Ctrl+Space",
        "Ctrl+K or Cmd+K",
        "Ctrl+Enter",
        "Ctrl+Shift+K"
      ],
      correctIndex: 1
    }
  ],
  medio: [
    {
      id: 1,
      question: "What is 'Tab' in Cursor?",
      options: [
        "A browser tab",
        "AI-powered autocomplete that suggests code as you type",
        "A file tab",
        "A keyboard key"
      ],
      correctIndex: 1
    },
    {
      id: 2,
      question: "How can you use Cursor to refactor code across multiple files?",
      options: [
        "Using the Find and Replace feature",
        "Using Composer with @-mentions to reference multiple files",
        "Manually editing each file",
        "Using Git commands"
      ],
      correctIndex: 1
    },
    {
      id: 3,
      question: "What does the '@' symbol do in Cursor's chat?",
      options: [
        "Mentions a user",
        "References files, folders, or code selections in your workspace",
        "Creates a comment",
        "Opens the command palette"
      ],
      correctIndex: 1
    },
    {
      id: 4,
      question: "What is 'Cmd+K' (or Ctrl+K) used for in Cursor?",
      options: [
        "Opening the terminal",
        "Triggering inline AI edits in the current file",
        "Saving the file",
        "Closing the editor"
      ],
      correctIndex: 1
    },
    {
      id: 5,
      question: "How does Cursor's AI understand your codebase context?",
      options: [
        "By reading all files at once",
        "By using embeddings and semantic search to find relevant code",
        "By asking you questions",
        "By analyzing Git history only"
      ],
      correctIndex: 1
    }
  ],
  difícil: [
    {
      id: 1,
      question: "What is the difference between Cursor's 'Chat' and 'Composer' features?",
      options: [
        "Chat is for single files, Composer is for multiple files",
        "Chat provides conversational assistance, Composer allows multi-file editing with AI",
        "There is no difference",
        "Chat is free, Composer requires payment"
      ],
      correctIndex: 1
    },
    {
      id: 2,
      question: "How does Cursor's AI handle code context when you use @-mentions?",
      options: [
        "It reads the entire file",
        "It uses semantic search to find relevant code sections and includes them in the context",
        "It only reads the first 100 lines",
        "It requires manual code selection"
      ],
      correctIndex: 1
    },
    {
      id: 3,
      question: "What is 'Agent Mode' in Cursor?",
      options: [
        "A debugging tool",
        "A feature where AI can autonomously make changes across your codebase",
        "A code formatter",
        "A terminal emulator"
      ],
      correctIndex: 1
    },
    {
      id: 4,
      question: "How can you prevent Cursor from accessing certain files or folders?",
      options: [
        "Using .cursorignore file",
        "Using .gitignore file",
        "Using .cursorignore or .gitignore file",
        "There is no way to exclude files"
      ],
      correctIndex: 2
    },
    {
      id: 5,
      question: "What is the purpose of Cursor's 'Rules' feature?",
      options: [
        "To enforce code style",
        "To provide custom instructions and guidelines for the AI to follow",
        "To validate syntax",
        "To manage keyboard shortcuts"
      ],
      correctIndex: 1
    }
  ]
};

