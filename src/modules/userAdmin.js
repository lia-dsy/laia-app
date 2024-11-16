import axios from "axios";

const userPath = "http://127.0.0.1:5000/api/response_users";

async function insertUser(user, password) {
    try {
        const data = {
            user: user,
            password: password,
        };
        const response = await axios.post(userPath, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.data;
    } catch (error) {
        console.error("Error al enviar la petición:", error);
        return false;
    }
}

async function validateUser(user, password) {
    try {
        const data = { user, password };
        const response = await axios.get(userPath, data);
        return response.data;
    } catch (error) {
        console.error("Error al enviar la petición:", error);
        return false;
    }
}

async function deleteUser(user) {
    try {
        const data = { user };
        await axios.delete(userPath, data);
        return true;
    } catch (error) {
        console.error("Error al enviar la petición:", error);
        return false;
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

        await axios.put(userPath, data);
        return true;
    } catch (error) {
        console.error("Error al enviar la petición:", error);
        return false;
    }
}

export { insertUser, validateUser, deleteUser, updateUser };
