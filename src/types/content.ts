export interface StudentInfo {
  fullName: string;
  gradeClass: string;
  studentNo: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  topicId: number;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TopicContent {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  image: string;
  narratorText: string;
  sections: {
    heading: string;
    description: string;
    details: string[];
    readText?: string;
  }[];
  keyTakeaway: string;
}
