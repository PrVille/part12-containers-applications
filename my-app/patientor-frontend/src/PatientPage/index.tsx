import { useParams } from 'react-router';
import React from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Entry, EntryFormValues, Patient } from '../types';
import { useStateValue, updatePatient, addEntry } from '../state';
import EntryDetails from './EntryDetails';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import { Button } from "@material-ui/core";
import AddEntryModal from '../addEntryModal';

const PatientPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  console.log(patients);
  const { id } = useParams<{ id: string }>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  React.useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const { data: patientById } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id as string}`
        );
        dispatch(updatePatient(patientById));
      } catch (e) {
        console.error(e);
      }
    };

    if (!patients[id as string].ssn) void fetchPatientList();
  }, [dispatch]);

  if (!patients[id as string].ssn) return null;

  const addEntryForPatient = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id as string}/entries`, 
        values
      );
      dispatch(addEntry(newEntry, id as string));  
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <h2>{patients[id as string].name} {patients[id as string].gender === 'male' ? <ManIcon /> : <WomanIcon />}</h2> 
      <p>Ssn: {patients[id as string].ssn}</p>
      <p>Date of Birth: {patients[id as string].dateOfBirth}</p>
      <p>Occupation: {patients[id as string].occupation}</p>
      <h3>Entries</h3>
      {patients[id as string].entries.map((entry) => {
        return (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        );
      })}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={addEntryForPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;
