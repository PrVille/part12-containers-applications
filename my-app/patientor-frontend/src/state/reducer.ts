import { State } from './state';
import { Patient, Diagnosis, Entry } from '../types';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: Patient[];
    }
  | {
      type: 'SET_DIAGNOSIS_LIST';
      payload: Diagnosis[];
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    }
  | {
      type: 'UPDATE_PATIENT';
      payload: Patient;
    }
  | {
      type: 'ADD_ENTRY';
      payload: Entry;
      id: string;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PATIENT_LIST':
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case 'SET_DIAGNOSIS_LIST':
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses,
        },
      };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
      case 'ADD_ENTRY':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.id]: {
            ...state.patients[action.id],
            entries: [
              ...state.patients[action.id].entries,
              action.payload
            ]
          }
        },
      };

    default:
      return state;
  }
};

export const setPatientList = (patientListFromApi: Array<Patient>): Action => {
  return { type: 'SET_PATIENT_LIST', payload: patientListFromApi };
};

export const setDiagnosisList = (
  diagnosisListFromApi: Array<Diagnosis>
): Action => {
  return { type: 'SET_DIAGNOSIS_LIST', payload: diagnosisListFromApi };
};

export const addPatient = (newPatient: Patient): Action => {
  return { type: 'ADD_PATIENT', payload: newPatient };
};

export const updatePatient = (patientToUpdate: Patient): Action => {
  return { type: 'UPDATE_PATIENT', payload: patientToUpdate };
};

export const addEntry = (newEntry: Entry, id: string): Action => {
  return { type: 'ADD_ENTRY', payload: newEntry, id };
};
