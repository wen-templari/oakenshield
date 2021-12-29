import axiosApi from "@/axios/AxiosConfig";

const Account = {
  async login(account) {
    return await axiosApi("/user/login", account, "post");
  },
  async register(account) {
    return await axiosApi("/user", account, "post");
  },
  async get(id) {
    return await axiosApi("/user?id=" + id, null, "get");
  },
  async updateAvatar(id, e) {
    return await axiosApi("/user/" + id + "/avatar", e, "post");
  },
};

const File = {
  async upload(e) {
    return await axiosApi("/file", e, "post");
  },
};

export { Account, File };
