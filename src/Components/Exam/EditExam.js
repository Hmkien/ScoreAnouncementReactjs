import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const EditExam = ({ show, handleClose, fetchData, exam }) => {
  const apiURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5180";
  const [editedExam, setEditedExam] = useState({
    examId: exam.examId,
    examCode: exam.examCode,
    examName: exam.examName,
    createDate: exam.createDate,
    createPerson: exam.createPerson,
    note: exam.note,
    isDelete: exam.isDelete || false,
    status: exam.status || "Đang diễn ra",
    examTypeId: exam.examTypeId || "",
  });

  useEffect(() => {
    if (exam) {
      setEditedExam({
        examId: exam.examId,
        examCode: exam.examCode,
        examName: exam.examName,
        createDate: exam.createDate,
        createPerson: exam.createPerson,
        note: exam.note,
        isDelete: exam.isDelete || false,
        status: exam.status || "Đang diễn ra",
        examTypeId: exam.examTypeId || "",
      });
    }
  }, [exam]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedExam({ ...editedExam, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setEditedExam({ ...editedExam, [name]: checked });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiURL}/api/exam/${editedExam.examId}`,
        editedExam
      );
      console.log("Edit response:", response.data);
      handleClose();
      fetchData();
    } catch (error) {
      console.error("Error editing exam:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Sửa thông tin kỳ thi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEdit}>
          <Form.Group className="mb-3">
            <Form.Label>Mã kỳ thi:</Form.Label>
            <Form.Control
              type="text"
              name="examCode"
              value={editedExam.examCode}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tên kỳ thi:</Form.Label>
            <Form.Control
              type="text"
              name="examName"
              value={editedExam.examName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày tạo:</Form.Label>
            <Form.Control
              type="date"
              name="createDate"
              value={
                new Date(editedExam.createDate).toISOString().split("T")[0]
              }
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Người tạo:</Form.Label>
            <Form.Control
              type="text"
              name="createPerson"
              value={editedExam.createPerson}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú:</Form.Label>
            <Form.Control
              type="text"
              name="note"
              value={editedExam.note}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label as={Col} sm={8}>
              Đã xóa:
            </Form.Label>
            <Col sm={4}>
              <Form.Check
                type="switch"
                name="isDelete"
                checked={editedExam.isDelete}
                onChange={handleCheckboxChange}
              />
            </Col>
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditExam;
