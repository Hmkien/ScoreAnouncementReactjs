import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import StudentList from "./StudentList";

const ConfigExam = () => {
  const { examId } = useParams();
  const [students, setStudents] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [examName, setExamName] = useState("");
  const [examStatus, setExamStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  const fetchExamData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5180/api/Exam/${examId}`
      );
      setStudents(response.data.students || []);
      setExamName(response.data.examName || "");
      setExamStatus(response.data.status || "");
    } catch (error) {
      console.error("Failed to fetch exam data", error);
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Vui lòng lựa chọn file để upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:5180/api/Exam/upload/${examId}`,
        formData
      );
      setShowUploadModal(false);
      await fetchExamData();
      alert(response.data);
    } catch (error) {
      const errorMessage = error.response?.data || "Đã xảy ra lỗi";
      alert(errorMessage);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5180/api/FileDownload?examId=${examId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Template_${examId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Tải xuống thất bại", error);
    }
  };

  const handleCloseModal = () => setShowUploadModal(false);

  const handleShowModal = () => setShowUploadModal(true);

  return (
    <div className="m-3">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="flex-grow-1 text-center">{examName}</h1>
            <div className="d-flex gap-4">
              {examStatus !== "Đã hoàn thành" && (
                <>
                  <Button variant="primary" onClick={handleShowModal}>
                    Upload
                  </Button>
                  <Button variant="success" onClick={handleDownloadTemplate}>
                    Tải xuống file mẫu
                  </Button>
                </>
              )}
            </div>
          </div>

          <StudentList examId={examId} />
        </>
      )}

      <Modal show={showUploadModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận tải lên điểm sinh viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile">
            <Form.Label>Lựa chọn file upload</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConfigExam;
