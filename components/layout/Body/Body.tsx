import { FC } from "react";
import { Box, SxProps } from "@mui/system";
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";
import LoadingWrapper from "../../wrappers/LoadingWrapper";
import { Container } from "@mui/material";
import ErrorWrapper from "../../wrappers/ErrorWrapper";

type Props = {
  flexColCenter?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isError?: boolean;
};

const Body: FC<Props> = ({
  children,
  flexColCenter,
  isLoading,
  loadingText,
  isError,
}) => {
  const boxSx: SxProps = {
    minHeight: "100vh",
    height: "100%",
    paddingTop: NAVBAR_HEIGHT_REM,
  };

  if (flexColCenter) {
    boxSx.display = "flex";
    boxSx.flexDirection = "column";
    boxSx.justifyContent = "center";
    boxSx.alignItems = "center";
  }

  return (
    <>
      <Box sx={boxSx}>
        <Container maxWidth="xl">
          <LoadingWrapper
            isLoading={!!isLoading}
            loadingText={loadingText}
            fullScreen
          >
            <ErrorWrapper isError={!!isError}>{children}</ErrorWrapper>
          </LoadingWrapper>
        </Container>
      </Box>
    </>
  );
};
export default Body;
