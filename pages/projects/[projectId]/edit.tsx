import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import TextInput from "@/components/formikFormControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GoBackButton from "@/components/buttons/GoBackButton";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { useRouter } from "next/router";
import useFetch, { isFetching } from "@/hooks/useFetch";
// Helpers
import { Formik, FormikHelpers } from "formik";
import { areAllEmptyValues } from "@/helpers/forms";
import { isNotUndefined } from "@/helpers/types";
// Types
import { GetProjectResponse, GetUsersResponse, HTTP_METHOD } from "@/types/api";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";

type EditProjectFormValues = Pick<
  Project,
  "name" | "achievement" | "proposalPdf"
> & { students: number[]; adviser: number; mentor: number };

const EditProject: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  const { data: projectResponse, status: getProjectStatus } =
    useFetch<GetProjectResponse>({
      endpoint: `/projects/${projectId}`,
      enabled: !!projectId,
    });
  const project = isNotUndefined(projectResponse)
    ? projectResponse.project
    : ({} as Project);

  const initialValues: EditProjectFormValues = {
    name: project.name ?? "",
    achievement: project.achievement ?? LEVELS_OF_ACHIEVEMENT.VOSTOK,
    proposalPdf: project.proposalPdf ?? "",
    students: project.students
      ? project.students.map((student) => student.studentId)
      : [],
    adviser: project.adviser?.adviserId ?? 0,
    mentor: project.mentor?.mentorId ?? 0,
  };

  /** Fetching student, adviser and mentor IDs and names for the dropdown select */
  const { data: studentsResponse, status: getStudentsStatus } =
    useFetch<GetUsersResponse>({
      endpoint: `/users?cohortYear=${project.cohortYear}&role=Student`,
      enabled: Boolean(!!project && project.cohortYear),
    });
  const { data: advisersResponse, status: getAdvisersStatus } =
    useFetch<GetUsersResponse>({
      endpoint: `/users?cohortYear=${project.cohortYear}&role=Adviser`,
      enabled: Boolean(!!project && project.cohortYear),
    });
  const { data: mentorsResponse, status: getMentorsStatus } =
    useFetch<GetUsersResponse>({
      endpoint: `/users?cohortYear=${project.cohortYear}&role=Mentor`,
      enabled: Boolean(!!project && project.cohortYear),
    });

  const EditProject = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/projects/${projectId}`,
  });

  const handleSubmit = async (
    values: EditProjectFormValues,
    actions: FormikHelpers<EditProjectFormValues>
  ) => {
    const processedValues = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== "")
    );

    try {
      await EditProject.call({ user: processedValues });
      setSuccess("You have successfully edited your profile");
      actions.resetForm();
    } catch (error) {
      setError(error);
    }

    actions.setSubmitting(false);
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Body
        flexColCenter
        isLoading={isFetching(
          getProjectStatus,
          getStudentsStatus,
          getAdvisersStatus,
          getMentorsStatus
        )}
      >
        <GoBackButton sx={{ alignSelf: "start" }} />
        <Container maxWidth="sm" sx={{ padding: 0 }}>
          <Typography variant="h5" fontWeight={600} mb="1rem">
            {`Edit ${project.name}'s Project`}
          </Typography>
          <Card>
            <CardContent>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {(formik) => {
                  return (
                    <form onSubmit={formik.handleSubmit}>
                      <Stack direction="column" spacing="1rem">
                        <Dropdown
                          name="achievement"
                          label="Level of Achivement"
                          formik={formik}
                          options={Object.values(LEVELS_OF_ACHIEVEMENT).map(
                            (option) => {
                              return { label: option, value: option };
                            }
                          )}
                        />
                        <TextInput
                          name="name"
                          label="Project Name"
                          formik={formik}
                        />
                        <Dropdown
                          name="achievement"
                          label="Level of Achievement"
                          formik={formik}
                          options={Object.values(LEVELS_OF_ACHIEVEMENT).map(
                            (option) => {
                              return { label: option, value: option };
                            }
                          )}
                        />
                        <MultiDropdown
                          name="students"
                          label="Student IDs"
                          formik={formik}
                          options={
                            studentsResponse && studentsResponse.users
                              ? studentsResponse.users.map((user) => {
                                  return {
                                    label: `${user?.student?.id}: ${user.name}`,
                                    value: user?.student?.id ?? 0,
                                  };
                                })
                              : []
                          }
                        />
                        <Dropdown
                          name="adviser"
                          label="Adviser ID"
                          formik={formik}
                          options={
                            advisersResponse && advisersResponse.users
                              ? advisersResponse.users.map((user) => {
                                  return {
                                    label: `${user?.adviser?.id}: ${user.name}`,
                                    value: user?.adviser?.id ?? 0,
                                  };
                                })
                              : []
                          }
                        />
                        <Dropdown
                          name="mentor"
                          label="Mentor ID"
                          formik={formik}
                          options={
                            mentorsResponse && mentorsResponse.users
                              ? mentorsResponse.users.map((user) => {
                                  return {
                                    label: `${user?.mentor?.id}: ${user.name}`,
                                    value: user?.mentor?.id ?? 0,
                                  };
                                })
                              : []
                          }
                        />
                        <TextInput
                          name="proposalPdf"
                          label="Proposal PDF"
                          formik={formik}
                        />

                        <Stack direction="row" justifyContent="end">
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            disabled={
                              areAllEmptyValues(formik.values) ||
                              snackbar.severity === "success"
                            }
                            loading={formik.isSubmitting}
                          >
                            Edit
                          </LoadingButton>
                        </Stack>
                      </Stack>
                    </form>
                  );
                }}
              </Formik>
            </CardContent>
          </Card>
        </Container>
      </Body>
    </>
  );
};
export default EditProject;
