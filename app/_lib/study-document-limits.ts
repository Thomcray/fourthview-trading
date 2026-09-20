export const STUDY_DOCUMENT_LIMITS: Record<string, number> = {
  recommendation1: 10,
  recommendation2: 10,
  englishProficiency: 10,
  transcript: 20,
  certificate: 10,
  nonCriminal: 10,
  medicalForm: 10,
  studyPlan: 10,
  passportPhoto: 5,
  internationalPassport: 10,
  bankStatement: 20,
  introductionVideo: 100,
};

export function getStudyDocumentMaxSize(docType: string) {
  return STUDY_DOCUMENT_LIMITS[docType];
}
