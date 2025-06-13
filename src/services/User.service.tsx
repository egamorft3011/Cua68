import { authInstance, contentInstance } from "@/configs/CustomizeAxios";

// đăng nhập
const loginUser = (username: string, password: string) => {
  return contentInstance.post("/api/auth/login", {
    username,
    password,
    captcha: "123",
  });
};

// Đăng ký
const signupUser = (
  name: string,
  username: string,
  password: string,
  email: string,
  phone: string,
  refcode: string
) => {
  return contentInstance.post("/api/auth/register", {
    name,
    username,
    phone,
    email,
    password,
    refcode
  });
};
const getMessage = () => {
  return contentInstance.get("/api/message");
};
const getMe = () => {
  return contentInstance.get("/api/auth/me");
};

// Cập nhập mật khẩu tài khoản
const updatePassword = (
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm: string
) => {
  return contentInstance.post(`/api/auth/change-password`, {
    oldPassword,
    newPassword,
    newPasswordConfirm,
  });
};

// Cập nhập mật khẩu bảo mật game
const updatePasswordWithdrawals = (
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm: string
) => {
  return contentInstance.post(`/api/auth/change-password-security`, {
    oldPassword,
    newPassword,
    newPasswordConfirm,
  });
};

export {
  loginUser,
  signupUser,
  updatePassword,
  getMe,
  getMessage,
  updatePasswordWithdrawals,
};
