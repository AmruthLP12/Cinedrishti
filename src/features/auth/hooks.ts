import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { register, login, logout, getUser, getSession } from "./api";

//
// ✅ REGISTER
//
export const useRegister = () => {
  return useMutation({
    mutationFn: ({ name,email, password }: {name: string, email: string; password: string}) =>
      register(name, email, password),
  });
};

//
// ✅ LOGIN
//
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),

    onSuccess: () => {
      // refetch user after login
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

//
// ✅ LOGOUT
//
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      // clear user data after logout
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });
};

//
// ✅ GET CURRENT USER
//
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false, // don't retry if not logged in
  });
};

//
// ✅ GET SESSION
//
export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    retry: false,
  });
};