import style from "./Navbar.module.css";
//import { NavLink } from "react-router-dom";

const Navbar = () => {
  const logoUrl =
    "https://res.cdn.office.net/assets/mail/illustrations/noMailSelected/v2/light.svg";

  return (
    <header className={style.navbarContainer}>
      <nav>
        <div className={style.imgContainer}>
          <a href="/">
            <img src={logoUrl} alt="Email logo" />
          </a>
        </div>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a
              href="https://github.com/bejo-geshdo/temporary-email-service"
              target="_blank"
            >
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
