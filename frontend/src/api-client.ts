import { RegisterFormData } from "./pages/Register";
import { ExpenseFormData } from "./components/NewEntryForm"
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addExpense = async (formData: ExpenseFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/expense/add`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};


export type QueryParameters = {
  page? : string;
  startDate? : string;
  endDate? : string;
}


export const Search = async (queryParameters:QueryParameters) => {
  console.log(queryParameters)
  const queryParams = new URLSearchParams();

  queryParams.append("page", queryParameters.page || "")
  queryParams.append("startDate", queryParameters.startDate || "")
  queryParams.append("endDate", queryParameters.endDate || "")

  const response = await fetch(`${API_BASE_URL}/api/expense/search?${queryParams}`,{
    credentials: "include",
    method:"GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (!response.ok){
    throw new Error(responseBody.message)
  }
  
  return responseBody;
};