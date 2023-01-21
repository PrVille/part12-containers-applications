import patients from "../../data/patients";
import { v1 as uuid } from 'uuid';

import { NonSensitivePatient, Patient, newPatientEntry, newEntry, Entry } from "../types";

const getPatientById = (id: string): Patient | undefined => {
  const res = patients.find(patient => patient.id === id);
  return res;
};

const getNonSensitivePatients = (): Array<NonSensitivePatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (entry: newPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntryForPatient = ({ entry, id }: { entry: newEntry, id: string }): Entry => {
  const newEntry = {
    id: uuid(),
    ...entry
  };

  patients.find(patient => patient.id === id)?.entries.push(newEntry);
  return newEntry;
};


export default {
  getNonSensitivePatients,
  addPatient,
  getPatientById,
  addEntryForPatient
};
