import axios from "axios";

export const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:8080/users");
    return response.data.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
