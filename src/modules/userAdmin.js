import axios from "axios";

// const userPath = "https://127.0.0.1:5000/api/response_users";
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
        console.error("Error creating user:", error);
        return { error: error };
    }
}

async function validateUser(user, password) {
    try {
        const data = { user, password };
        const response = await axios.post(`${userPath}/validate`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.data;
    } catch (error) {
        console.error("Error validating user:", error);
        return { error: error };
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

        if (password === "") {
            delete data.password;
        }
        if (newUser === "") {
            delete data.newUser;
        }
        if (newPassword === "") {
            delete data.newPassword;
        }
        if (code === "") {
            delete data.code;
        }

        console.log("updateUser data:", data);

        const response = await axios.put(`${userPath}/new-data`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.data;
    } catch (error) {
        return await error.response.data;
    }
}

async function requestRecovery(user, email) {
    try {
        const data = { user, email };
        console.log("requestRecovery data:", data);
        const response = await axios.post(`${userPath}/recovery-code`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.data;
    } catch (error) {
        return await error.response.data;
    }
}

export { insertUser, validateUser, deleteUser, updateUser, requestRecovery };
