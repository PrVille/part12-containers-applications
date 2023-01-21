import { Entry, Diagnosis, OccupationalHealthcareEntry, HealthCheckEntry, HospitalEntry, HealthCheckRating } from '../types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';

const HealthCheckEntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: { [code: string]: Diagnosis };
}) => {
  return (
    <div style={{ border: '3px solid black', margin: '5px' }}>
      <p>
        {entry.date} <LocalHospitalIcon />
      </p>
      <p style={{ fontStyle: 'italic' }}>{entry.description}</p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[code].name}
          </li>
        ))}
      </ul>
      <p>Health rating: {HealthCheckRating[entry.healthCheckRating]}</p>
      <p>Diagnosed by {entry.specialist}</p>
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: { [code: string]: Diagnosis };
}) => {
  return (
    <div style={{ border: '3px solid black', margin: '5px' }}>
      <p>
        {entry.date} <WorkIcon /> {entry.employerName}
      </p>
      <p style={{ fontStyle: 'italic' }}>{entry.description}</p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[code].name}
          </li>
        ))}
      </ul>
      {entry.sickLeave && <p>Sick leave from {entry.sickLeave?.startDate} until {entry.sickLeave?.endDate}</p>}
      <p>Diagnosed by {entry.specialist}</p>
    </div>
  );
}; 

const HospitalEntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: { [code: string]: Diagnosis };
}) => {
  return (
    <div style={{ border: '3px solid black', margin: '5px' }}>
      <p>
        {entry.date} <HealingOutlinedIcon />
      </p>
      <p style={{ fontStyle: 'italic' }}>{entry.description}</p>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[code].name}
          </li>
        ))}
      </ul> 
      <p style={{ fontStyle: 'italic' }}>{entry.discharge.criteria}</p>
      <p>Discharged: {entry.discharge.date}</p>
      <p>Diagnosed by {entry.specialist}</p>
    </div>
  );
};

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<{
  entry: Entry;
  diagnoses: { [code: string]: Diagnosis };
}> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case 'Hospital': {
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
    }
    case 'OccupationalHealthcare': {
      return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;
    }
    case 'HealthCheck': {
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
    }
    default: {
      return assertNever(entry);
    }
  }
};

export default EntryDetails;
