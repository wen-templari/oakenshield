import axiosApi from "@/axios/AxiosConfig"

const Account={
  async login(account) {
    return await axiosApi("/login", account, "post");
  },
}

export { Account }