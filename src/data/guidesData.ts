import { GuideArticle } from '../types';

export const GUIDES_DATA: GuideArticle[] = [
  {
    id: 'how-to-calculate-gpa',
    title: 'How to Calculate GPA',
    summary: 'A step-by-step breakdown of credit hours, letter grade equivalents, and semester quality points.',
    readTime: '4 min read',
    category: 'Grading Systems',
    content: {
      overview: 'Your Grade Point Average (GPA) represents your average academic performance across all courses taken in a given semester or term. It is weighted by the credit value (or credit hours) of each subject.',
      formula: 'GPA = Σ (Grade Points × Course Credits) ÷ Σ Course Credits',
      formulaExplanation: 'Multiply each course’s numerical grade point by its credit hours to get "quality points". Sum up all quality points and divide by the total number of credits attempted.',
      stepByStep: [
        'List all courses completed in the semester alongside their credit hours.',
        'Convert each letter grade (e.g. A = 4.0, B = 3.0) to its grade point equivalent using your university scale.',
        'Multiply each grade point by the course credit hours to compute Quality Points.',
        'Add all quality points together.',
        'Add all credit hours together.',
        'Divide total quality points by total credit hours. Round to two decimal places.',
      ],
      exampleCase: {
        scenario: 'A student takes 4 courses: CS 101 (4 credits, Grade A = 4.0), Math 201 (3 credits, Grade B = 3.0), Physics (4 credits, Grade B+ = 3.3), and English (3 credits, Grade A- = 3.7).',
        calculation: '(4×4.0) + (3×3.0) + (4×3.3) + (3×3.7) = 16.0 + 9.0 + 13.2 + 11.1 = 49.3 quality points. Total credits = 4 + 3 + 4 + 3 = 14.',
        result: 'GPA = 49.3 ÷ 14 = 3.52 (Magna Cum Laude / Dean’s List standing).',
      },
      proTips: [
        'Higher-credit courses (4 or 5 credits) impact your GPA significantly more than 1 or 2 credit labs.',
        'Pass/Fail or Audit courses generally do not count toward your GPA denominator unless explicitly designated as failing credits.',
      ],
    },
  },
  {
    id: 'gpa-vs-cgpa',
    title: 'GPA vs CGPA: What’s the Difference?',
    summary: 'Understand the critical distinction between your term GPA and cumulative degree standing.',
    readTime: '3 min read',
    category: 'Academic Concepts',
    content: {
      overview: 'Students frequently confuse GPA and CGPA. While both measure academic achievement on the same numerical scale, they differ fundamentally in scope and duration.',
      formula: 'CGPA = Σ (All Quality Points across ALL terms) ÷ Σ (All Credits across ALL terms)',
      formulaExplanation: 'Unlike an arithmetic average of semester GPAs, CGPA is a weighted cumulative average taking into account terms with different credit loads.',
      stepByStep: [
        'GPA refers strictly to one academic term (semester, trimester, or quarter).',
        'CGPA (Cumulative Grade Point Average) encompasses your entire collegiate career up to the current date.',
        'Never simply add up semester GPAs and divide by the number of semesters, unless every semester had the exact same number of credits.',
        'Use our CGPA Calculator to properly weight semesters by their individual credit loads.',
      ],
      exampleCase: {
        scenario: 'Semester 1: 18 credits with 3.8 GPA (68.4 points). Semester 2: 12 credits with 3.2 GPA (38.4 points).',
        calculation: 'Total quality points = 68.4 + 38.4 = 106.8. Total credits = 18 + 12 = 30 credits.',
        result: 'Weighted CGPA = 106.8 ÷ 30 = 3.56. (A simple average would incorrectly show 3.50).',
      },
      proTips: [
        'Employers and graduate schools look primarily at your final CGPA on your transcript.',
        'If you have a difficult early semester, earning high GPAs in later semesters with heavy credit loads can substantially boost your overall CGPA.',
      ],
    },
  },
  {
    id: 'how-to-calculate-percentage',
    title: 'How to Calculate Percentage',
    summary: 'Simple formulas for marks percentages, conversions to 4.0/10.0 GPA scales, and term improvements.',
    readTime: '3 min read',
    category: 'Calculations',
    content: {
      overview: 'Percentage is the most universally understood metric for expressing examination marks out of a total possible score. Many international institutions require conversion between percentage and GPA.',
      formula: 'Percentage (%) = (Marks Obtained ÷ Total Maximum Marks) × 100',
      formulaExplanation: 'Divide the sum of marks you earned across all exams by the maximum achievable marks, then multiply by 100.',
      stepByStep: [
        'Gather marks received in each paper or subject.',
        'Sum all obtained marks to find total score.',
        'Sum the maximum possible marks for all subjects (e.g. 5 subjects × 100 = 500).',
        'Divide total score by maximum marks and multiply by 100.',
        'For 10-point scales (CBSE/AICTE), convert CGPA to percentage using Percentage = CGPA × 9.5.',
      ],
      exampleCase: {
        scenario: 'A student scores 88 in Math, 92 in CS, 79 in Chemistry, 85 in English, and 94 in Physics (each out of 100).',
        calculation: 'Obtained marks = 88 + 92 + 79 + 85 + 94 = 438. Total maximum marks = 500. (438 ÷ 500) × 100.',
        result: 'Percentage = 87.60% (Equivalent to 3.3 to 3.7 GPA on US 4.0 scale).',
      },
      proTips: [
        'When converting GPA to percentage for Indian competitive exams or university admissions, always confirm whether the university uses the 9.5 multiplier or 10.0 multiplier.',
      ],
    },
  },
  {
    id: 'how-to-calculate-attendance',
    title: 'How to Calculate Attendance',
    summary: 'The mathematical formula to determine safe bunks and consecutive classes needed for 75% or 80%.',
    readTime: '4 min read',
    category: 'Attendance & Rules',
    content: {
      overview: 'Most colleges mandate a minimum 75% or 80% attendance to sit for semester examinations. Knowing the exact math lets you manage sick leaves and appointments without detention risks.',
      formula: 'Current % = (Attended Classes ÷ Total Classes Held) × 100',
      formulaExplanation: 'To reach target T%: Needed Classes = ceil((T × Total - 100 × Attended) ÷ (100 - T)). To find safe bunks: Can Miss = floor((100 × Attended - T × Total) ÷ T).',
      stepByStep: [
        'Count total lectures and labs conducted in the subject to date.',
        'Count how many of those you were marked present for.',
        'Divide attended by total and multiply by 100 to get current percentage.',
        'If below requirement: use our attendance calculator to find the exact number of consecutive classes you cannot afford to miss.',
        'If above requirement: see how many cushion classes you have before dipping into the warning zone.',
      ],
      exampleCase: {
        scenario: 'Total classes held = 50. Attended = 34 (Current attendance: 68%). Target is 75%.',
        calculation: 'Needed = ceil((0.75 × 50 - 34) ÷ (1 - 0.75)) = ceil((37.5 - 34) ÷ 0.25) = ceil(3.5 ÷ 0.25) = 14.',
        result: 'The student must attend the next 14 consecutive classes without absence to reach 75%.',
      },
      proTips: [
        'Medical certificates often have a cap (e.g. at most 5% or 10% relaxation). Do not rely solely on medical waivers.',
        'Practical/lab attendance is often evaluated separately from lecture attendance at many universities.',
      ],
    },
  },
  {
    id: 'understanding-university-grades',
    title: 'Understanding University Grades',
    summary: 'Explore the 4.0, 4.33, 5.0, and 10.0 grading systems and honors classifications.',
    readTime: '5 min read',
    category: 'Grading Systems',
    content: {
      overview: 'Universities worldwide utilize different grading scales. Understanding how your letter grades map to numerical points is essential when applying for graduate programs or cross-border credits.',
      formula: 'Scale Normalization = (Local GPA ÷ Maximum Local Scale) × Target Scale',
      formulaExplanation: 'While exact conversions depend on official evaluation services (like WES or ECE), scale ratios give a reliable baseline.',
      stepByStep: [
        'Standard 4.0 Scale: Used widely in the United States and Canada (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0).',
        '4.33 Scale: Used by universities that reward exceptional mastery with an A+ representing 4.33 points.',
        '5.0 Scale: Common in Singapore, MIT, and Nigerian federal universities.',
        '10.0 Scale: Standard in India and several European technical universities.',
      ],
      exampleCase: {
        scenario: 'A student with an 8.6 CGPA on a 10-point scale applying to an American university.',
        calculation: 'Standard AICTE conversion: Percentage = 8.6 × 9.5 = 81.7%. On US 4.0 scale, this translates to approximately 3.3 to 3.5 GPA.',
        result: 'Qualifies comfortably for competitive Master’s degree entry standards.',
      },
      proTips: [
        'Always check your target institution’s specific international credential evaluation guidelines before converting your official transcripts.',
      ],
    },
  },
];
