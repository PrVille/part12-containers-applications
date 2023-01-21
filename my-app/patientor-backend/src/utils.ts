import {
  newPatientEntry,
  newBaseEntry,
  newEntry,
  Gender,
  Diagnose,
  HealthCheckRating,
  SickLeave,
  Discharge,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (string: unknown): string => {
  if (!string || !isString(string)) {
    throw new Error('Incorrect or missing field' + string);
  }

  return string;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

type Fields = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
};

const toNewPatientEntry = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: Fields): newPatientEntry => {
  const newPatEntry: newPatientEntry = {
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: [],
  };

  return newPatEntry;
};

const parseEntryType = (string: unknown): string => {
  if (
    !string ||
    !isString(string) ||
    (string !== 'HealthCheck' &&
      string !== 'OccupationalHealthcare' &&
      string !== 'Hospital')
  ) {
    throw new Error('Incorrect or missing field ' + string);
  }

  return string;
};

const parseCodes = (codes: unknown): Array<Diagnose['code']> | undefined => {
  if (!codes) return undefined;
  if (
    !(codes instanceof Array) ||
    !Array.isArray(codes) ||
    !codes.every((code) => isString(code))
  ) {
    throw new Error('Incorrect diagnosis codes');
  }

  return codes as Array<Diagnose['code']>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(rating)) { //!rating equals false if rating value is 0
    throw new Error('Incorrect or missing health check rating: ' + rating);
  }
  return rating;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (
    !sickLeave ||
    !(sickLeave as SickLeave).startDate ||
    !(sickLeave as SickLeave).endDate
  ) {
    throw new Error('Incorrect or missing sick leave: ' + sickLeave);
  }
  return {
    startDate: parseDate((sickLeave as SickLeave).startDate),
    endDate: parseDate((sickLeave as SickLeave).endDate),
  };
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (
    !discharge ||
    !(discharge as Discharge).date ||
    !(discharge as Discharge).criteria
  ) {
    throw new Error('Incorrect or missing sick leave: ' + discharge);
  }

  return {
    date: parseDate((discharge as Discharge).date),
    criteria: parseString((discharge as Discharge).criteria),
  };
};

const toNewEntry = ({
  type,
  description,
  date,
  specialist,
  diagnosisCodes,
  healthCheckRating,
  sickLeave,
  employerName,
  discharge,
}: {
  type: unknown;
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes?: unknown;
  healthCheckRating?: unknown;
  sickLeave?: unknown;
  employerName?: unknown;
  discharge?: unknown;
}): newEntry => {
  const entryType: string = parseEntryType(type);

  const newBaseEntry: newBaseEntry = {
    description: parseString(description),
    date: parseDate(date),
    specialist: parseString(specialist),
    diagnosisCodes: parseCodes(diagnosisCodes),
  };

  switch (entryType) {
    case 'HealthCheck': {
      return {
        type: entryType,
        healthCheckRating: parseHealthCheckRating(healthCheckRating),
        ...newBaseEntry,
      };
    }
    case 'OccupationalHealthcare': {
      return {
        type: entryType,
        employerName: parseString(employerName),
        sickLeave: parseSickLeave(sickLeave),
        ...newBaseEntry,
      };
    }
    case 'Hospital': {
      return {
        type: entryType,
        discharge: parseDischarge(discharge),
        ...newBaseEntry,
      };
    }
    default:
      throw new Error('Something went horribly wrong');
  }
};

export { toNewPatientEntry, toNewEntry };
