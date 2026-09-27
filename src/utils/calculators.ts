import { CourseRow, GradingScale, SemesterRow, GradeComponentRow } from '../types';

export const GRADE_SCALES: Record<GradingScale, { label: string; max: number; grades: { letter: string; points: number; percentRange: string }[] }> = {
  '4.0': {
    label: 'Standard 4.0 Scale (US/Canada)',
    max: 4.0,
    grades: [
      { letter: 'A+', points: 4.0, percentRange: '97-100%' },
      { letter: 'A', points: 4.0, percentRange: '93-96%' },
      { letter: 'A-', points: 3.7, percentRange: '90-92%' },
      { letter: 'B+', points: 3.3, percentRange: '87-89%' },
      { letter: 'B', points: 3.0, percentRange: '83-86%' },
      { letter: 'B-', points: 2.7, percentRange: '80-82%' },
      { letter: 'C+', points: 2.3, percentRange: '77-79%' },
      { letter: 'C', points: 2.0, percentRange: '73-76%' },
      { letter: 'C-', points: 1.7, percentRange: '70-72%' },
      { letter: 'D+', points: 1.3, percentRange: '67-69%' },
      { letter: 'D', points: 1.0, percentRange: '65-66%' },
      { letter: 'F', points: 0.0, percentRange: '0-64%' },
    ],
  },
  '4.33': {
    label: '4.33 Scale with A+ distinction',
    max: 4.33,
    grades: [
      { letter: 'A+', points: 4.33, percentRange: '95-100%' },
      { letter: 'A', points: 4.0, percentRange: '90-94%' },
      { letter: 'A-', points: 3.67, percentRange: '85-89%' },
      { letter: 'B+', points: 3.33, percentRange: '80-84%' },
      { letter: 'B', points: 3.0, percentRange: '75-79%' },
      { letter: 'B-', points: 2.67, percentRange: '70-74%' },
      { letter: 'C+', points: 2.33, percentRange: '65-69%' },
      { letter: 'C', points: 2.0, percentRange: '60-64%' },
      { letter: 'C-', points: 1.67, percentRange: '55-59%' },
      { letter: 'D', points: 1.0, percentRange: '50-54%' },
      { letter: 'F', points: 0.0, percentRange: '0-49%' },
    ],
  },
  '5.0': {
    label: '5.0 Scale (e.g. MIT/Singapore/Nigeria)',
    max: 5.0,
    grades: [
      { letter: 'A', points: 5.0, percentRange: '70-100%' },
      { letter: 'B', points: 4.0, percentRange: '60-69%' },
      { letter: 'C', points: 3.0, percentRange: '50-59%' },
      { letter: 'D', points: 2.0, percentRange: '45-49%' },
      { letter: 'E', points: 1.0, percentRange: '40-44%' },
      { letter: 'F', points: 0.0, percentRange: '0-39%' },
    ],
  },
  '10.0': {
    label: '10.0 Scale (India / Global Engineering)',
    max: 10.0,
    grades: [
      { letter: 'O (Outstanding)', points: 10.0, percentRange: '90-100%' },
      { letter: 'A+ (Excellent)', points: 9.0, percentRange: '80-89%' },
      { letter: 'A (Very Good)', points: 8.0, percentRange: '70-79%' },
      { letter: 'B+ (Good)', points: 7.0, percentRange: '60-69%' },
      { letter: 'B (Above Avg)', points: 6.0, percentRange: '55-59%' },
      { letter: 'C (Average)', points: 5.0, percentRange: '50-54%' },
      { letter: 'P (Pass)', points: 4.0, percentRange: '40-49%' },
      { letter: 'F (Fail)', points: 0.0, percentRange: '0-39%' },
    ],
  },
};

export interface GPAResult {
  gpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  academicStanding: string;
  standingColor: string;
  standingDescription: string;
}

export function calculateGPA(courses: CourseRow[], scale: GradingScale = '4.0'): GPAResult {
  const maxScale = GRADE_SCALES[scale].max;
  let totalCredits = 0;
  let totalQualityPoints = 0;

  for (const course of courses) {
    if (course.credits > 0 && course.gradePoint >= 0) {
      totalCredits += course.credits;
      totalQualityPoints += course.gradePoint * course.credits;
    }
  }

  const rawGpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
  const gpa = Math.round(rawGpa * 100) / 100;

  // Normalized to 4.0 scale equivalent for standing evaluation
  const ratio = maxScale > 0 ? gpa / maxScale : 0;

  let academicStanding = 'Good Standing';
  let standingColor = 'text-cyan-400';
  let standingDescription = 'Solid academic progress. You are meeting requirements comfortably.';

  if (ratio >= 0.95) {
    academicStanding = "Summa Cum Laude / Dean's High Honors";
    standingColor = 'text-emerald-400';
    standingDescription = 'Exceptional academic excellence. Top tier honors designation.';
  } else if (ratio >= 0.875) {
    academicStanding = "Magna Cum Laude / Dean's List";
    standingColor = 'text-teal-400';
    standingDescription = 'Distinguished academic achievement. Eligible for faculty honors.';
  } else if (ratio >= 0.75) {
    academicStanding = 'Cum Laude / Above Average';
    standingColor = 'text-sky-400';
    standingDescription = 'Strong academic performance across your curriculum.';
  } else if (ratio >= 0.5) {
    academicStanding = 'Satisfactory Academic Progress';
    standingColor = 'text-amber-400';
    standingDescription = 'Acceptable standing, but targeting higher grades will open graduate/internship opportunities.';
  } else if (totalCredits > 0) {
    academicStanding = 'Academic Warning / Probation Risk';
    standingColor = 'text-rose-400';
    standingDescription = 'Below minimum threshold. Reach out to academic advising to discuss recovery plans.';
  } else {
    academicStanding = 'No courses evaluated';
    standingColor = 'text-slate-400';
    standingDescription = 'Add your course credits and expected grades to compute GPA.';
  }

  return {
    gpa,
    totalCredits,
    totalQualityPoints: Math.round(totalQualityPoints * 100) / 100,
    academicStanding,
    standingColor,
    standingDescription,
  };
}

export interface CGPAResult {
  cgpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  previousCredits: number;
  previousGPA: number;
  newCredits: number;
  newGPA: number;
}

export function calculateCGPAQuick(
  currentCGPA: number,
  currentCredits: number,
  newGPA: number,
  newCredits: number
): CGPAResult {
  const prevPoints = (currentCGPA || 0) * (currentCredits || 0);
  const newPoints = (newGPA || 0) * (newCredits || 0);
  const totalCredits = (currentCredits || 0) + (newCredits || 0);
  const totalQualityPoints = prevPoints + newPoints;
  const rawCGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    cgpa: Math.round(rawCGPA * 100) / 100,
    totalCredits,
    totalQualityPoints: Math.round(totalQualityPoints * 100) / 100,
    previousCredits: currentCredits,
    previousGPA: currentCGPA,
    newCredits,
    newGPA,
  };
}

export function calculateCGPASemesters(semesters: SemesterRow[]): { cgpa: number; totalCredits: number; totalQualityPoints: number } {
  let totalCredits = 0;
  let totalQualityPoints = 0;

  for (const sem of semesters) {
    if (sem.credits > 0 && sem.gpa >= 0) {
      totalCredits += sem.credits;
      totalQualityPoints += sem.gpa * sem.credits;
    }
  }

  const rawCGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
  return {
    cgpa: Math.round(rawCGPA * 100) / 100,
    totalCredits,
    totalQualityPoints: Math.round(totalQualityPoints * 100) / 100,
  };
}

export function calculateRequiredGPA(
  targetCGPA: number,
  currentCGPA: number,
  currentCredits: number,
  upcomingCredits: number,
  maxScale: number = 4.0
): { requiredGPA: number; isPossible: boolean; statusMessage: string } {
  if (upcomingCredits <= 0) {
    return { requiredGPA: 0, isPossible: false, statusMessage: 'Enter upcoming semester credit hours.' };
  }

  const totalCreditsAfter = currentCredits + upcomingCredits;
  const targetTotalPoints = targetCGPA * totalCreditsAfter;
  const currentTotalPoints = currentCGPA * currentCredits;
  const neededPoints = targetTotalPoints - currentTotalPoints;
  const reqGPA = neededPoints / upcomingCredits;
  const rounded = Math.round(reqGPA * 100) / 100;

  if (rounded <= 0) {
    return {
      requiredGPA: 0,
      isPossible: true,
      statusMessage: `Your target of ${targetCGPA.toFixed(2)} is already secured even with minimum passing marks!`,
    };
  }

  if (rounded > maxScale) {
    return {
      requiredGPA: rounded,
      isPossible: false,
      statusMessage: `Requires a ${rounded.toFixed(2)} GPA, which exceeds the maximum scale of ${maxScale.toFixed(2)}. Consider taking more credits or adjusting target.`,
    };
  }

  return {
    requiredGPA: rounded,
    isPossible: true,
    statusMessage: `You need an average of ${rounded.toFixed(2)} across your next ${upcomingCredits} credits to reach ${targetCGPA.toFixed(2)}.`,
  };
}

export interface AttendanceResult {
  currentPercentage: number;
  isMeetingTarget: boolean;
  status: 'safe' | 'critical' | 'exact' | 'insufficient_data';
  actionMessage: string;
  classesDifference: number;
  attended: number;
  total: number;
  targetPercent: number;
}

export function calculateAttendance(attended: number, total: number, targetPercent: number = 75): AttendanceResult {
  if (total <= 0) {
    return {
      currentPercentage: 0,
      isMeetingTarget: false,
      status: 'insufficient_data',
      actionMessage: 'Please enter total number of classes held so far.',
      classesDifference: 0,
      attended: 0,
      total: 0,
      targetPercent,
    };
  }

  if (attended > total) {
    return {
      currentPercentage: 100,
      isMeetingTarget: true,
      status: 'safe',
      actionMessage: 'Attended classes cannot exceed total classes conducted.',
      classesDifference: 0,
      attended,
      total,
      targetPercent,
    };
  }

  const rawPercent = (attended / total) * 100;
  const currentPercentage = Math.round(rawPercent * 10) / 10;
  const targetFraction = targetPercent / 100;

  if (Math.abs(currentPercentage - targetPercent) < 0.05) {
    return {
      currentPercentage,
      isMeetingTarget: true,
      status: 'exact',
      actionMessage: `You are exactly at your target of ${targetPercent}%. Do not miss your next class.`,
      classesDifference: 0,
      attended,
      total,
      targetPercent,
    };
  }

  if (rawPercent < targetPercent) {
    // Need to attend consecutive classes: (attended + x) / (total + x) >= targetFraction
    // attended + x >= targetFraction * total + targetFraction * x
    // x * (1 - targetFraction) >= targetFraction * total - attended
    // x = ceil((targetFraction * total - attended) / (1 - targetFraction))
    const denominator = 1 - targetFraction;
    const numerator = targetFraction * total - attended;
    const needed = Math.max(1, Math.ceil(numerator / denominator));

    return {
      currentPercentage,
      isMeetingTarget: false,
      status: 'critical',
      actionMessage: `You need to attend the next ${needed} consecutive ${needed === 1 ? 'class' : 'classes'} to reach ${targetPercent}%.`,
      classesDifference: needed,
      attended,
      total,
      targetPercent,
    };
  } else {
    // Can miss classes: attended / (total + y) >= targetFraction
    // attended >= targetFraction * total + targetFraction * y
    // y <= (attended - targetFraction * total) / targetFraction
    const canMiss = Math.max(0, Math.floor((attended - targetFraction * total) / targetFraction));

    return {
      currentPercentage,
      isMeetingTarget: true,
      status: 'safe',
      actionMessage: canMiss > 0
        ? `You can safely miss ${canMiss} upcoming ${canMiss === 1 ? 'class' : 'classes'} and still stay above ${targetPercent}%.`
        : `You are currently above ${targetPercent}%, but missing even 1 class will drop your attendance below the target threshold.`,
      classesDifference: canMiss,
      attended,
      total,
      targetPercent,
    };
  }
}

export function calculateMarksPercentage(obtained: number, total: number): {
  percentage: number;
  equivalentGPA4: number;
  equivalentGPA10: number;
  letterGrade: string;
} {
  if (total <= 0 || obtained < 0) {
    return { percentage: 0, equivalentGPA4: 0, equivalentGPA10: 0, letterGrade: 'N/A' };
  }
  const pct = Math.round((obtained / total) * 10000) / 100;
  
  // Standard conversion
  let gpa4 = 0;
  let letter = 'F';
  if (pct >= 93) { gpa4 = 4.0; letter = 'A'; }
  else if (pct >= 90) { gpa4 = 3.7; letter = 'A-'; }
  else if (pct >= 87) { gpa4 = 3.3; letter = 'B+'; }
  else if (pct >= 83) { gpa4 = 3.0; letter = 'B'; }
  else if (pct >= 80) { gpa4 = 2.7; letter = 'B-'; }
  else if (pct >= 77) { gpa4 = 2.3; letter = 'C+'; }
  else if (pct >= 73) { gpa4 = 2.0; letter = 'C'; }
  else if (pct >= 70) { gpa4 = 1.7; letter = 'C-'; }
  else if (pct >= 65) { gpa4 = 1.0; letter = 'D'; }
  else { gpa4 = 0.0; letter = 'F'; }

  // 10-point scale equivalent (CBSE / Indian Universities: Percentage / 9.5)
  const gpa10 = Math.min(10, Math.round((pct / 9.5) * 100) / 100);

  return {
    percentage: pct,
    equivalentGPA4: gpa4,
    equivalentGPA10: gpa10,
    letterGrade: letter,
  };
}

export function convertGPAToPercentage(gpa: number, scale: GradingScale = '4.0', formula: 'us_standard' | 'wes' | 'cbse_9_5' = 'us_standard'): number {
  if (gpa <= 0) return 0;
  if (scale === '10.0' || formula === 'cbse_9_5') {
    // CBSE standard: Percentage = GPA * 9.5
    return Math.min(100, Math.round(gpa * 9.5 * 100) / 100);
  }
  if (scale === '4.0') {
    // US College Board standard mapping: 4.0 = ~95%, 3.7 = ~91%, 3.0 = ~85%, 2.0 = ~75%
    // Linear approximation with bounds
    const approx = Math.min(100, Math.max(0, 55 + (gpa * 10)));
    return Math.round(approx * 10) / 10;
  }
  const max = GRADE_SCALES[scale].max;
  return Math.min(100, Math.round((gpa / max) * 1000) / 10);
}

export interface FinalGradeResult {
  currentWeightedScore: number;
  currentCompletedWeight: number;
  currentLetter: string;
  finalTargetResults: {
    targetName: string;
    targetPercent: number;
    requiredScore: number;
    status: 'secured' | 'achievable' | 'impossible';
  }[];
}

export function calculateGradeTargets(
  components: GradeComponentRow[],
  finalExamWeight: number
): FinalGradeResult {
  let completedWeight = 0;
  let earnedScore = 0;

  for (const c of components) {
    if (c.weight > 0) {
      completedWeight += c.weight;
      earnedScore += (c.score * c.weight) / 100;
    }
  }

  const currentWeighted = completedWeight > 0 ? (earnedScore / completedWeight) * 100 : 0;

  let currentLetter = 'F';
  if (currentWeighted >= 93) currentLetter = 'A';
  else if (currentWeighted >= 90) currentLetter = 'A-';
  else if (currentWeighted >= 87) currentLetter = 'B+';
  else if (currentWeighted >= 83) currentLetter = 'B';
  else if (currentWeighted >= 80) currentLetter = 'B-';
  else if (currentWeighted >= 75) currentLetter = 'C+';
  else if (currentWeighted >= 70) currentLetter = 'C';
  else if (currentWeighted >= 60) currentLetter = 'D';

  const targets = [
    { targetName: 'A (93%)', targetPercent: 93 },
    { targetName: 'A- (90%)', targetPercent: 90 },
    { targetName: 'B+ (87%)', targetPercent: 87 },
    { targetName: 'B (83%)', targetPercent: 83 },
    { targetName: 'C (73%)', targetPercent: 73 },
    { targetName: 'Pass (60%)', targetPercent: 60 },
  ];

  const finalTargetResults = targets.map((t) => {
    if (finalExamWeight <= 0) {
      return {
        targetName: t.targetName,
        targetPercent: t.targetPercent,
        requiredScore: 0,
        status: earnedScore >= t.targetPercent ? ('secured' as const) : ('impossible' as const),
      };
    }

    // Overall grade = earnedScore + (finalScore * finalExamWeight / 100)
    // t.targetPercent <= earnedScore + (finalScore * finalExamWeight / 100)
    // finalScore >= (t.targetPercent - earnedScore) * 100 / finalExamWeight
    const required = Math.round(((t.targetPercent - earnedScore) * 100 / finalExamWeight) * 10) / 10;

    let status: 'secured' | 'achievable' | 'impossible' = 'achievable';
    if (required <= 0) {
      status = 'secured';
    } else if (required > 100) {
      status = 'impossible';
    }

    return {
      targetName: t.targetName,
      targetPercent: t.targetPercent,
      requiredScore: Math.max(0, required),
      status,
    };
  });

  return {
    currentWeightedScore: Math.round(currentWeighted * 10) / 10,
    currentCompletedWeight: completedWeight,
    currentLetter,
    finalTargetResults,
  };
}
