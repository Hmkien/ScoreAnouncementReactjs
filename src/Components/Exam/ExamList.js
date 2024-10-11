import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Modal,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { format } from "date-fns";
import AddExam from "./AddExam";
import EditExam from "./EditExam";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { GrConfigure } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const ExamList = () => {
  const apiURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5180";
  const [exams, setExams] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/exam`);
      setExams(response.data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    }
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleShowEditModal = (exam) => {
    setSelectedExam(exam);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedExam(null);
    setShowEditModal(false);
  };

  const handleShowDeleteModal = (exam) => {
    setSelectedExam(exam);
    setDeleteID(exam.examId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteID(null);
    setSelectedExam(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${apiURL}/api/exam/${deleteID}`);
      fetchData();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete exam:", error);
    }
  };

  const handleConfigClick = (examId) => {
    navigate(`/config-exam/${examId}`);
  };

  return (
    <div className="m-3">
      <div className="d-flex justify-content-end mb-2">
        <Button variant="primary" onClick={handleShowAddModal}>
          Tạo mới
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="col-auto">STT</th>
            <th>Mã kỳ thi</th>
            <th>Tên kỳ thi</th>
            <th>Ngày tạo</th>
            <th>Người tạo</th>
            <th>Ghi chú</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, index) => (
            <tr key={exam.examId}>
              <td>{index + 1}</td>
              <td>{exam.examCode}</td>
              <td>{exam.examName}</td>
              <td>{format(new Date(exam.createDate), "dd/MM/yyyy")}</td>
              <td>{exam.createPerson}</td>
              <td>{exam.note}</td>
              <td>{exam.status}</td>
              <td>
                <InputGroup className="mb-3">
                  {exam.status === "Đã hoàn thành" ? (
                    <Button
                      variant="info"
                      onClick={() => handleConfigClick(exam.examId)}
                    >
                      Xem chi tiết
                    </Button>
                  ) : (
                    <DropdownButton
                      variant="info"
                      title="Thao tác"
                      id="input-group-dropdown-1"
                    >
                      <Dropdown.Item onClick={() => handleShowEditModal(exam)}>
                        <FaRegEdit className="text-success mb-1 mx-1" /> Chỉnh
                        sửa
                      </Dropdown.Item>
                      <Dropdown.Item
                        variant="danger"
                        onClick={() => handleShowDeleteModal(exam)}
                      >
                        <MdDeleteForever
                          size={20}
                          className="text-danger mb-1 mx-0"
                        />{" "}
                        Xóa
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleConfigClick(exam.examId)}
                      >
                        <GrConfigure className="text-primary mb-1 mx-1" /> Cấu
                        hình
                      </Dropdown.Item>
                    </DropdownButton>
                  )}
                </InputGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AddExam
        show={showAddModal}
        handleClose={handleCloseAddModal}
        fetchData={fetchData}
      />
      {selectedExam && (
        <EditExam
          show={showEditModal}
          handleClose={handleCloseEditModal}
          fetchData={fetchData}
          exam={selectedExam}
        />
      )}
      {selectedExam && (
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Bạn có muốn xóa bản ghi này không?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedExam.examName}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ExamList;
