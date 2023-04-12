// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title
} from "solid-start";
import "./root.css";
import { ContractDataProvider, UserDataProvider } from "./store";



export default function Root() {



  return (
    <Html lang="en">
      <Head>
        <Title>Project WEB3</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <UserDataProvider>
              <ContractDataProvider>
                <Routes>
                  <FileRoutes />
                </Routes>
              </ContractDataProvider>
            </UserDataProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
