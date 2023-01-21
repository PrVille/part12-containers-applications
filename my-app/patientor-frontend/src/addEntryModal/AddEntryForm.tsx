import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { Field, Formik, Form } from 'formik';

import {
  TextField,
  SelectField,
  DiagnosisSelection,
  EntryTypeOption,
  HealthCheckOption,
} from '../AddPatientModal/FormField';
import { EntryFormValues, HealthCheckRating } from '../types';
import { useStateValue } from '../state';

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryTypeOptions: EntryTypeOption[] = [
  { value: 'HealthCheck', label: 'HealthCheck' },
  { value: 'OccupationalHealthcare', label: 'OccupationalHealthcare' },
  { value: 'Hospital', label: 'Hospital' },
];

const healthCheckOptions: HealthCheckOption[] = [
  { value: HealthCheckRating.Healthy, label: 'Healthy' },
  { value: HealthCheckRating.LowRisk, label: 'LowRisk' },
  { value: HealthCheckRating.HighRisk, label: 'HighRisk' },
  { value: HealthCheckRating.CriticalRisk, label: 'CriticalRisk' },
];

const HealthCheckEntryFields = () => {
  return (
    <>
      <br />
      <SelectField
        label="Healthcheck Rating"
        name="healthCheckRating"
        options={healthCheckOptions}
      />
    </>
  );
};

const OccupationalEntryFields = () => {
  return (
    <>
      <Field
        label="Employer Name"
        placeholder="Employer Name"
        name="employerName"
        component={TextField}
      />
      <Field
        label="Sickleave start"
        placeholder="YYYY-MM-DD"
        name="sickLeave.startDate"
        component={TextField}
      />
      <Field
        label="Sickleave end"
        placeholder="YYYY-MM-DD"
        name="sickLeave.endDate"
        component={TextField}
      />
    </>
  );
};

const HospitalEntryFields = () => {
  return (
    <>
      <Field
        label="Discharge date"
        placeholder="YYYY-MM-DD"
        name="discharge.date"
        component={TextField}
      />
      <Field
        label="Discharge criteria"
        placeholder="Discharge criteria"
        name="discharge.criteria"
        component={TextField}
      />
    </>
  );
};

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Formik
      initialValues={{
        description: '',
        date: '',
        specialist: '',
        type: '',
        healthCheckRating: HealthCheckRating.Healthy,
        employerName: '',
        sickLeave: {
          startDate: '',
          endDate: '',
        },
        discharge: {
          date: '',
          criteria: '',
        },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string | any } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type || values.type === '') {
          errors.type = requiredError;
        }
        if (values.type === 'OccupationalHealthcare' && !values.employerName) {
          errors.employerName = requiredError;
        }
        if (
          (values.type === 'OccupationalHealthcare' &&
            !values.sickLeave?.startDate) ||
          (values.type === 'OccupationalHealthcare' &&
            !values.sickLeave?.endDate)
        ) {
          errors.sickLeave = requiredError;
        }
        if (
          (values.type === 'Hospital' && !values.discharge?.date) ||
          (values.type === 'Hospital' && !values.discharge?.criteria)
        ) {
          errors.discharge = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        //console.log(values);
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <SelectField label="Type" name="type" options={entryTypeOptions} />
            <br />
            <div>
              {values.type === 'HealthCheck'
                ? HealthCheckEntryFields()
                : values.type === 'OccupationalHealthcare'
                ? OccupationalEntryFields()
                : values.type === 'Hospital'
                ? HospitalEntryFields()
                : null}
            </div>
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: 'left' }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: 'right',
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
