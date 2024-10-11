import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import axios from "axios";
import { FaBars } from "react-icons/fa";
import "../../Style/Style.css";

const StudentList = ({ examId }) => {
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5180/api/Student/StudentList?examId=${examId}&page=${currentPage}&pageSize=${pageSize}`
        );
        setStudents(response.data.students || []);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error("Failed to fetch students data", error);
      }
    };

    fetchStudents();
  }, [examId, currentPage, pageSize]);

  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderStudentTable = () => {
    if (!students || students.length === 0) {
      return (
        <Table striped bordered hover className="mt-5">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã sinh viên</th>
              <th>Họ</th>
              <th>Tên</th>
              <th>Kết quả</th>
              <th style={{ width: "40px" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="text-center">
                Không có thông tin sinh viên.
              </td>
            </tr>
          </tbody>
        </Table>
      );
    }

    const examTypeId = students[0].examTypeId;

    return (
      <Table striped bordered hover className="mt-5">
        <thead>
          <tr>
            <th className="col-auto">STT</th>
            <th>Mã sinh viên</th>
            <th>Họ</th>
            <th>Tên</th>
            {examTypeId === "0" || examTypeId === "1" ? (
              <>
                <th>Listening</th>
                <th>Speaking</th>
                <th>Writing</th>
                <th>Reading</th>
                <th>Tổng điểm</th>
              </>
            ) : examTypeId === "4" ? (
              <>
                <th>Điểm thực hành</th>
                <th>Điểm lý thuyết</th>
                <th>Tổng điểm</th>
              </>
            ) : (
              <>
                <th>Số báo danh</th>
                <th>Số CMND/CCCD</th>
                <th>Điểm thực hành</th>
                <th>Điểm lý thuyết</th>
                <th>Tổng điểm</th>
              </>
            )}
            <th>Kết quả</th>
            <th style={{ width: "3em" }}></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.studentCode}>
              <td>{(currentPage - 1) * pageSize + index + 1}</td>
              <td>{student.studentCode}</td>
              <td>{student.lastName.trim()}</td>
              <td>{student.firstName.trim()}</td>
              {examTypeId === "0" || examTypeId === "1" ? (
                <>
                  <td>{student.listeningScore}</td>
                  <td>{student.speakingScore}</td>
                  <td>{student.writingScore}</td>
                  <td>{student.readingScore}</td>
                  <td>{student.totalScore}</td>
                </>
              ) : examTypeId === "4" ? (
                <>
                  <td>{student.practicalScore}</td>
                  <td>{student.theoryScore}</td>
                  <td>{student.totalScore}</td>
                </>
              ) : (
                <>
                  <td>{student.identificationCode}</td>
                  <td>{student.identityNumber}</td>
                  <td>{student.practicalScore}</td>
                  <td>{student.theoryScore}</td>
                  <td>{student.totalScore}</td>
                </>
              )}
              <td>{student.result}</td>
              <td>
                <button
                  className="btn "
                  onClick={() => handleShowModal(student)}
                >
                  <FaBars />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
          className={`btn mx-1 ${
            i === currentPage ? "btn-primary" : "btn-outline-primary"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="d-flex justify-content-center mt-3">
        {currentPage > 1 && (
          <button
            className="btn btn-light mx-1"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Trước
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button
            className="btn btn-light mx-1"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau
          </button>
        )}
      </div>
    );
  };
  return (
    <div>
      {renderStudentTable()}
      {renderPagination()}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin sinh viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div className="student-info-grid">
              {selectedStudent.examTypeId === "0" ||
              selectedStudent.examTypeId === "1" ? (
                <>
                  <p>
                    <strong>Mã sinh viên:</strong> {selectedStudent.studentCode}
                  </p>
                  <p>
                    <strong>Họ và tên:</strong>{" "}
                    {selectedStudent.lastName.trim() +
                      " " +
                      selectedStudent.firstName.trim()}
                  </p>

                  <p>
                    <strong>Listening:</strong> {selectedStudent.listeningScore}
                  </p>
                  <p>
                    <strong>Speaking:</strong> {selectedStudent.speakingScore}
                  </p>
                  <p>
                    <strong>Writing:</strong> {selectedStudent.writingScore}
                  </p>
                  <p>
                    <strong>Reading:</strong> {selectedStudent.readingScore}
                  </p>
                  <p>
                    <strong>Tổng điểm:</strong> {selectedStudent.totalScore}
                  </p>
                  <p>
                    <strong>Kết quả:</strong> {selectedStudent.result}
                  </p>
                  <p>
                    <strong>Khóa:</strong> {selectedStudent.course}
                  </p>
                  <p>
                    <strong>Khoa:</strong> {selectedStudent.faculty}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedStudent.email}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {selectedStudent.phoneNumber}
                  </p>
                </>
              ) : selectedStudent.examTypeId === "4" ? (
                <>
                  <p>
                    <strong>Mã sinh viên:</strong> {selectedStudent.studentCode}
                  </p>
                  <p>
                    <strong>Họ và Tên:</strong>{" "}
                    {selectedStudent.lastName.trim() +
                      " " +
                      selectedStudent.firstName.trim()}
                  </p>
                  <p>
                    <strong>Khóa:</strong> {selectedStudent.course}
                  </p>
                  <p>
                    <strong>Khoa:</strong> {selectedStudent.faculty}
                  </p>
                  <p>
                    <strong>Word:</strong> {selectedStudent.wordScore || "0"}
                  </p>
                  <p>
                    <strong>Excel:</strong> {selectedStudent.excelScore || "0"}
                  </p>
                  <p>
                    <strong>PowerPoint:</strong>{" "}
                    {selectedStudent.powerPointScore || "0"}
                  </p>
                  <p>
                    <strong>Điểm thực hành:</strong>{" "}
                    {selectedStudent.practicalScore || "0"}
                  </p>
                  <p>
                    <strong>Điểm lý thuyết:</strong>{" "}
                    {selectedStudent.theoryScore || "0"}
                  </p>
                  <p>
                    <strong>Tổng điểm:</strong> {selectedStudent.totalScore}
                  </p>
                  <p>
                    <strong>Kết quả:</strong> {selectedStudent.result}
                  </p>
                  <p>
                    <strong>Ghi chú:</strong> {selectedStudent.note}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Họ và Tên:</strong>{" "}
                    {selectedStudent.lastName.trim() +
                      " " +
                      selectedStudent.firstName.trim()}
                  </p>

                  <p>
                    <strong>Số báo danh:</strong>{" "}
                    {selectedStudent.identificationCode}
                  </p>
                  <p>
                    <strong>CMND/CCCD :</strong>{" "}
                    {selectedStudent.identityNumber}
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong> {selectedStudent.birthDay}
                  </p>
                  <p>
                    <strong>Giới tính:</strong> {selectedStudent.gender}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {selectedStudent.address}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedStudent.email}
                  </p>
                  <p>
                    <strong>Dân tộc:</strong> {selectedStudent.national || "0"}
                  </p>
                  <p>
                    <strong>Word:</strong> {selectedStudent.wordScore || "0"}
                  </p>
                  <p>
                    <strong>Excel:</strong> {selectedStudent.excelScore || "0"}
                  </p>
                  <p>
                    <strong>PowerPoint:</strong>{" "}
                    {selectedStudent.powerPointScore || "0"}
                  </p>
                  <p>
                    <strong>Điểm thực hành:</strong>{" "}
                    {selectedStudent.practicalScore || "0"}
                  </p>
                  <p>
                    <strong>Điểm lý thuyết:</strong>{" "}
                    {selectedStudent.theoryScore || "0"}
                  </p>
                  <p>
                    <strong>Tổng điểm:</strong>{" "}
                    {(
                      Number(selectedStudent.practicalScore) +
                      Number(selectedStudent.theoryScore)
                    ).toFixed(2) || ""}
                  </p>
                  <p>
                    <strong>Kết quả:</strong> {selectedStudent.result}
                  </p>
                  <p>
                    <strong>Ghi chú:</strong> {selectedStudent.note}
                  </p>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentList;
