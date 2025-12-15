import axios from "axios";
import { API_BASE_URL } from "../config/env";

// Upload ảnh → tạo job
export async function createWeldJob(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API_BASE_URL}/api/process`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data; // { job_id, status }
}

// Lấy kết quả job
export async function getWeldResult(jobId) {
  const res = await axios.get(
    `${API_BASE_URL}/api/result/${jobId}`
  );

  return res.data;
}
