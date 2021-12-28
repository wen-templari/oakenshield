import axiosApi from "@/axios/AxiosConfig";

const Account = {
  async login(account) {
    return await axiosApi("/login", account, "post");
  },
  async register(account) {
    return await axiosApi("/register", account, "post");
  },
  async search(id) {
    return await axiosApi("/search?id=" + id, null, "get");
  },
};

export { Account };
