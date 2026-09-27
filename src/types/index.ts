export type CalculatorType = 'gpa' | 'cgpa' | 'percentage' | 'attendance' | 'grade' | null;

export interface CourseRow {
  id: string;
  name: string;
  gradePoint: number;
  gradeLetter: string;
  credits: number;
}

export type GradingScale = '4.0' | '4.33' | '5.0' | '10.0';

export interface SemesterRow {
  id: string;
  semesterName: string;
  gpa: number;
  credits: number;
}

export interface GradeComponentRow {
  id: string;
  name: string;
  score: number; // percentage out of 100
  weight: number; // percentage of total grade
}

export interface GuideArticle {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  category: string;
  content: {
    overview: string;
    formula?: string;
    formulaExplanation?: string;
    stepByStep: string[];
    exampleCase: {
      scenario: string;
      calculation: string;
      result: string;
    };
    proTips: string[];
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
