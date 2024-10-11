import React from "react";
import logo from "../../Image/logo.png";

const Navigation = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-sm navbar-light bg-white border-bottom box-shadow mb-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse d-sm-inline-flex">
            <ul
              className="navbar-nav w-100 justify-content-start gap-5"
              style={{ marginLeft: "10em" }}
            >
              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  style={{ fontWeight: 700, fontSize: "1.15em" }}
                  href="/"
                >
                  Trang chủ
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  style={{ fontWeight: 700, fontSize: "1.15em" }}
                  href="/news"
                >
                  Tin tức
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  style={{ fontWeight: 700, fontSize: "1.15em" }}
                  href="/convert"
                >
                  Xét chuyển đổi chuẩn đầu ra
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  style={{ fontWeight: 700, fontSize: "1.15em" }}
                  href="/register"
                >
                  Đăng kí chứng nhận
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
