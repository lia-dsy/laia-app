import axios from "axios";

const userPath = "http://127.0.0.1:5000/api/response_users";

async function insertUser(user, password) {
    try {
        const data = { user, password };
        const response = await axios.post(`${userPath}/new`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.data;
    } catch (error) {
        return await error.response.data;
    }
}

async function validateUser(user, password) {
    try {
        const data = { user, password };
        console.log("Validating user:", data);
        const response = await axios.post(`${userPath}/validate`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.data;
    } catch (error) {
        return await error.response.data;
    }
}

async function deleteUser(user) {
    try {
        const data = { user };
        const response = await axios.delete(userPath, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.data;
    } catch (error) {
        return await error.response.data;
    }
}

async function updateUser(user, password, newUser, newPassword, code) {
    try {
        const data = { user, password, newUser, newPassword, code };

        if (newUser === "") {
            delete data.newUser;
        }
        if (newPassword === "") {
            delete data.newPassword;
        }
        if (code === "") {
            delete data.code;
        }

        const response = await axios.put(userPath, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.data;
    } catch (error) {
        return await error.response.data;
    }
}

export { insertUser, validateUser, deleteUser, updateUser };
