export interface StudyDocument {
  id: string;
  name: string;
  label: string;
  description: string;
  required: boolean;
  accept: string;
  maxSizeMB: number;
}

export interface UploadedFile {
  file: File;
  preview?: string;
  name: string;
  size: number;
}

export const studyDocuments: StudyDocument[] = [
  {
    id: "recommendation1",
    name: "recommendation1",
    label: "Recommendation Letter 1",
    description: "Academic or professional recommendation letter",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 10,
  },
  {
    id: "recommendation2",
    name: "recommendation2",
    label: "Recommendation Letter 2",
    description: "Second recommendation letter",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 10,
  },
  {
    id: "englishProficiency",
    name: "englishProficiency",
    label: "English Proficiency Letter",
    description: "IELTS, TOEFL, or other English proficiency certificate",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 10,
  },
  {
    id: "transcript",
    name: "transcript",
    label: "Academic Transcript",
    description: "All education transcripts",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 20,
  },
  {
    id: "certificate",
    name: "certificate",
    label: "Degree Certificate",
    description: "Educational degree certificate",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 10,
  },
  {
    id: "nonCriminal",
    name: "nonCriminal",
    label: "Non-Criminal Record",
    description: "Police clearance certificate",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 10,
  },
  {
    id: "medicalForm",
    name: "medicalForm",
    label: "Physical Examination Form",
    description: "Medical examination report",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 10,
  },
  {
    id: "studyPlan",
    name: "studyPlan",
    label: "Study Plan",
    description: "Your study plan or statement of purpose",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 10,
  },
  {
    id: "passportPhoto",
    name: "passportPhoto",
    label: "Passport Photo",
    description: "White background, passport size",
    required: true,
    accept: "image/*",
    maxSizeMB: 5,
  },
  {
    id: "internationalPassport",
    name: "internationalPassport",
    label: "International Passport Data Page",
    description:
      "Upload a clear copy of the information page of your international passport.",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 10,
  },
  {
    id: "bankStatement",
    name: "bankStatement",
    label: "Bank Statement",
    description:
      "Upload a recent bank statement showing funds of not less than ₦10,000,000.",
    required: true,
    accept: "image/*,.pdf",
    maxSizeMB: 20,
  },
  {
    id: "introductionVideo",
    name: "introductionVideo",
    label: "Introduction Video",
    description: "Self-introduction video (max 100MB)",
    required: true,
    accept: "video/*",
    maxSizeMB: 100,
  },
];
