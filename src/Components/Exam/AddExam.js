import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const AddExam = ({ show, handleClose, fetchData }) => {
  const apiURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5180";
  const [newExam, setNewExam] = useState({
    ExamCode: "",
    ExamName: "",
    CreateDate: new Date().toISOString(),
    CreatePerson: "Admin",
    Note: "",
    Status: "Đang diễn ra",
    ExamTypeId: "",
  });

  const [examTypes, setExamTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/ExamType`);
        setExamTypes(response.data);
      } catch (error) {
        console.error("Failed to fetch exam types:", error);
      }
    };

    fetchExamTypes();
  }, [apiURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExam({
      ...newExam,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newExam.ExamCode) newErrors.ExamCode = "Không được để trống";
    if (!newExam.ExamName) newErrors.ExamName = "Không được để trống";
    if (!newExam.ExamTypeId)
      newErrors.ExamTypeId = "Loại kỳ thi không được để trống";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await axios.post(`${apiURL}/api/exam`, newExam);
      handleClose();
      fetchData();
      setNewExam({
        ExamCode: "",
        ExamName: "",
        CreateDate: new Date().toISOString(),
        CreatePerson: "Admin",
        Note: "",
        Status: "Đang diễn ra",
        ExamTypeId: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo mới Kỳ thi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Mã kỳ thi:</Form.Label>
            <Form.Control
              type="text"
              name="ExamCode"
              value={newExam.ExamCode}
              onChange={handleInputChange}
              isInvalid={!!errors.ExamCode}
              disabled={isChecking}
            />
            {errors.ExamCode && (
              <Form.Control.Feedback type="invalid">
                {errors.ExamCode}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tên kỳ thi:</Form.Label>
            <Form.Control
              type="text"
              name="ExamName"
              value={newExam.ExamName}
              onChange={handleInputChange}
              isInvalid={!!errors.ExamName}
            />
            {errors.ExamName && (
              <Form.Control.Feedback type="invalid">
                {errors.ExamName}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Người tạo:</Form.Label>
            <Form.Control
              type="text"
              name="CreatePerson"
              value={newExam.CreatePerson}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú:</Form.Label>
            <Form.Control
              type="text"
              name="Note"
              value={newExam.Note}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Loại kỳ thi:</Form.Label>
            <Form.Select
              name="ExamTypeId"
              value={newExam.ExamTypeId}
              onChange={handleInputChange}
              isInvalid={!!errors.ExamTypeId}
            >
              <option value="">Chọn loại kỳ thi</option>
              {examTypes.map((type) => (
                <option key={type.examTypeId} value={type.examTypeId}>
                  {type.examTypeName}
                </option>
              ))}
            </Form.Select>
            {errors.ExamTypeId && (
              <Form.Control.Feedback type="invalid">
                {errors.ExamTypeId}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Thêm
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddExam;
